<!--
title: JavaScriptを使ったアニメーションgifの切り出しと拡大
date:  2023-10-01 22:00
categories: [JavaScript,ドット絵]
-->

自分の場合ドット絵のちびキャラを複数バリエーション書くとき、以下の画像のようにバリエーションを縦に並べて書いていく事が多いです(画像は[skeb](https://blog.manaten.net/entry/skeb)でリクエストを頂いた[ナマズさん](https://skeb.jp/@manaten/works/3)です)。

![namazu](https://manaten.net/wp-content/uploads/2023/10/namazu.gif)

このような形式で描き、画像をバリエーションずつに分割し更にSNSアイコンとして利用しやすいよう5倍サイズにしてから納品しています。
これをバリエーションが多い場合に手作業でやるのは面倒ですので、今回は簡単なNode.jsスクリプトで分割･拡大を自動化する方法を紹介します。

<!-- more -->

# ライブラリの候補

自分はJavaScript使いなのでnpmパッケージで提供されているものを選びます。その際にポイントとなるのは以下の点です。

- 簡単な画像加工をスクリプト的に記述する用途で利用したいため、高機能でインタフェースが複雑なものよりは、 **機能が簡単なAPIで提供されている** ものが望ましい
- **アニメーションGIFを簡単に扱える** ことが望ましい
- (できれば)ちゃんとメンテされていてほしい

条件を満たすライブラリとして以下の候補があります。

## Jimp

[jimp-dev/jimp: An image processing library written entirely in JavaScript for Node, with zero external or native dependencies.](https://github.com/jimp-dev/jimp)

npmで簡単にインストールでき、今回利用したいcrop、scaleなどの画像加工メソッドがシンプルなAPIで提供されています。また、メソッドチェーンで複数の修正を連続して適用することができます。
読み込んだ画像から1つ目のバリエーションを取り出して5倍にする場合、以下のようなコードで実現できます。

```javascript
import Jimp from "jimp";

const image = await Jimp.read("namazu.gif");
await image
  .crop(0, 0, 48, 48)
  .scale(5, Jimp.RESIZE_NEAREST_NEIGHBOR)
  .writeAsync("out/namazu_1x5.gif");
```

`scale` の第二引数で `Jimp.RESIZE_NEAREST_NEIGHBOR` を指定することで、nearest neighbor 法で拡大することができます。
ドット絵を拡大する場合はピクセルがボケてしまうため、nearest neighbor 法で拡大することが必須です。

ただし、デフォルトではアニメーションGIFに対応しておらず、上記コードの出力結果は静止画になってしまいます。

アニメーションGIFを利用したい場合は、 [issue](https://github.com/jimp-dev/jimp/issues/166#issuecomment-353149458) で提示されている [jimp-dev/gifwrap](https://github.com/jimp-dev/gifwrap/tree/master) を利用することになります。
gifwrapを利用してアニメーションGIFを切り出す場合は以下のようになります。

```javascript
import Jimp from "jimp";
import { BitmapImage, GifFrame, GifUtil } from "gifwrap";

const image = await GifUtil.read("namazu.gif");
await GifUtil.write(
  "out/namazu_1x5.gif",
  image.frames.map((frame) => {
    const j = GifUtil.copyAsJimp(Jimp, frame)
      .crop(0, 0, 48, 48)
      .scale(5, Jimp.RESIZE_NEAREST_NEIGHBOR);
    return new GifFrame(new BitmapImage(j.bitmap), { ...frame });
  }),
  image,
);
```

gitwrapの提供するGifUtilでファイルを読み込むと、アニメーションgifの各フレームを読み取れるので、それらをjimpで加工し、再度frameに書き戻してあげることでアニメーションgifを切り出すことができます。
少し冗長ですが、複数フレーム持つアニメーションgifを扱う都合上仕方ないような気もします。

## Sharp

実は今回、以上のような内容でJimpの紹介記事を書こうと思っていたのですが、記事を書くために改めてJimpについて調べていたところ、sharpというライブラリも見つけました。

[sharp - High performance Node.js image processing](https://sharp.pixelplumbing.com/)

こちらは公式のReadmeでのアピールポイントは｢高速であること｣なのですが、加えて｢ **アニメーションgifをデフォルトでサポートしている** ｣という今回のユースケースでとても大きな利点がありました。sharpを使って同様に画像を切り出す例は以下のようになります。

```javascript
import sharp from "sharp";

await sharp("namazu.gif", { animated: true })
  .extract({ left: 0, top: 0, width: 48, height: 48 })
  .resize({ width: 48 * 5, kernel: sharp.kernel.nearest })
  .toFile("out/namazu_1x5.gif");
```

アニメーションgif をデフォルトでサポートしているおかげで、 `{ animated: true }` を指定するだけでアニメーションgifを取り扱うことができました。ただし、APIはjimpと異なりやや冗長であり、特にjimpのような `scale` メソッドは存在しないため、自分でサイズ計算をする必要があります。
とはいえgifwrapを利用しないとアニメーションgifを取り扱えなかったjimpと比べてかなりシンプルに記述することができました。

# Sharpを使った画像の切り出し例

最後に、冒頭のアニメーションgifを等倍と5倍でそれぞれ切り出す例を紹介します。

```javascript
import sharp from "sharp";

const image = sharp("namazu.gif", { animated: true });

await image
  .clone()
  .extract({ left: 0, top: 0, width: 48, height: 48 })
  .toFile("out/namazu_1.gif");

await image
  .clone()
  .extract({ left: 0, top: 0, width: 48, height: 48 })
  .resize({ width: 48 * 5, kernel: sharp.kernel.nearest })
  .toFile("out/namazu_1x5.gif");

await image
  .clone()
  .extract({ left: 0, top: 48, width: 48, height: 48 })
  .toFile("out/namazu_2.gif");

await image
  .clone()
  .extract({ left: 0, top: 48, width: 48, height: 48 })
  .resize({ width: 48 * 5, kernel: sharp.kernel.nearest })
  .toFile("out/namazu_2x5.gif");
```

![namazu](https://manaten.net/wp-content/uploads/2023/10/extracted.gif)

それぞれ等倍と5倍で切り出すことができました。

# おまけ: なぜドット絵のバリエーションを縦に並べるのか

最後に自分がドット絵アニメーションを描くときのプチテクニックの紹介なのですが、複数バリエーションのアニメーションを描くときになぜ今回のように縦に並べて描くかについて説明します。

![namazu](https://manaten.net/wp-content/uploads/2023/10/namazu.gif)

アニメーションを描くときは自分は[EDGE2](https://takabosoft.com/edge2)を使っています。世間的には[Aseprite](https://www.aseprite.org/)も人気だと思います。これらのツールはアニメーションを描くための｢ページ機能｣があり、 **一枚の画像ファイルの中でアニメーションの各フレームをページとして描いていく** ことができます (レイヤに似た概念ですが、レイヤはレイヤで存在しているので、レイヤxページの2次元の画像を描いていくイメージ)。

人によってはこのページ機能を使ってバリエーションを組んでいくこともあるかと思いますが(かつては自分もそうしていました)、そうした場合以下のような欠点があります。

- 1つのバリエーションのアニメーションのフレームと、バリエーションの切り替えが複数ページにまたがって混在してしまう。
- 書き出しのときにも意図通りに並べるために一工夫が必要。
- ページ数がとても増えるため、管理が大変(特にそれぞれのページがレイヤを持っている場合、わけがわからなくなる)。また、奥の方のページにアクセスしづらくなる。

対して、上に挙げたように縦に並べると、バリエーションのアクセスは縦方法のスクロールで、アニメーションフレームの切り替えはページ切り替えでアクセスできます。そして、 **単にページを横に並べて書き出すだけで、縦方向にバリエーション、横方向にフレームが並んだアセット** を書き出すことができます(書き出すと以下のようになります)。

![namazu](https://manaten.net/wp-content/uploads/2023/10/namazu_sprite.png)

また、横ではなく縦に並べる利点として、 **｢左右反転で位置がずれない｣** という利点があります。
よくイラスト講座で｢バランスを確認するために左右反転せよ｣という教えがありますが、これをやったときに横に並べていると今見ていた箇所が画像の反対側に移動してしまいます。縦に並べると同じ位置のまま左右反転できるため反転画像の確認がしやすいのです。

# 参考リンク

- [sharp - High performance Node.js image processing](https://sharp.pixelplumbing.com/)
- [jimp-dev/jimp: An image processing library written entirely in JavaScript for Node, with zero external or native dependencies.](https://github.com/jimp-dev/jimp)
- [jimp-dev/gifwrap: A Jimp-compatible library for working with GIFs](https://github.com/jimp-dev/gifwrap)
- [SNSのアイコンとして... by manaten | Skeb](https://skeb.jp/@manaten/works/3)
- [Skeb活動の方針 - MANA-DOT](https://blog.manaten.net/entry/skeb)
