<!--
title: RPGツクールMVで作ったゲームをコマンドラインで動かしてみる
date:  2015-11-xx 12:00
categories: [RPGツクールMV,JavaScript]
-->


![RPGツクールMVで作ったゲームをコマンドラインで動かしてみる](http://manaten.net/wp-content/uploads/2015/11/rpgcli.gif)

会社のLT用のネタで、[RPGツクールMV](https://tkool.jp/mv/) で作ったゲームをCLI上で動かすということをやりました。
[ニコナレ](http://niconare.nicovideo.jp/watch/kn696) にLTで使ったスライドをアップしてあります。

<!-- more -->

# 実装

LT用のネタなのでそんなに真面目には実装していません。
スライドでも紹介していますが、

1. 各種Polyfillを用いて無理やりCLI上で起動する
2. 描画を担当する関数だけ書き換えて、 [chjj/blessed](https://github.com/chjj/blessed) によるCLI描画に置き換える

という風にしてCLI上で *動くように* しました。

diffは [こんなかんじ](https://github.com/manaten/rpgclitest/compare/initial...master?w=) です。

LTにあわせての突貫実装でいろいろ酷かったりしますが、ネタなので良しとします。


## 1. 各種Polyfillを用いて無理やりCLI上で起動する

RPGツクールMVはPIXI.jsを用いて描画を行います。
当初はこいつをまるまる置き換えてCLIに表示しようと思ったのですが、
RPGツクールのプレイヤーが用いるSpriteやTileMapといったクラスがPIXI.jsのDisplayObjectを継承している上に
ガッツリその性質を使ってたりでとても短い期間で切り離せる感じではなかったので(スプラトゥーンのやり過ぎで更に期間は短くなっていた)
PIXI.jsごとCLIで動かすことにしました。

RPGツクールMVのプレイヤーおよびPIXI.jsは大体ブラウザの以下のAPIに依存しているので、それぞれjs製のPolyfillを置いてあげます。

- DOM ･･･ [tmpvar/jsdom](https://github.com/tmpvar/jsdom)
- Canvas ･･･ [Automattic/node-canvas](https://github.com/Automattic/node-canvas)
- requestAnimationFrame ･･･ [chrisdickinson/raf](https://github.com/chrisdickinson/raf)
- localStorage ･･･ [coolaj86/node-localStorage](https://github.com/coolaj86/node-localStorage)

また、XmlHttpRequestを使ってる箇所が大きく分けて二種類あり、

1. json形式で吐かれるゲームデータファイルの読み込み
2. 画像ファイルの読み込み

2はCLIで関係ないので放置し、1をrequireした後に読み込んだオブジェクトを `onLoad` に渡すように書き換えました。

これでだいたい動く状態になり、あとは開始シーンをタイトルでなくマップに入れ替えたり、 canvasのstyleをいじってる箇所などの細かい行を消したりしてCLIでエラーを出さずに起動するようになりました。

一応、自動開始イベントに `console.log` だけさせて動作することも確認できました。

## 2. 描画を担当する関数を書き換えて、blessedによるCLI描画に置き換える

[blessed](https://github.com/chjj/blessed) は前々から気になってたんですが、CLIアプリケーションを作るときに強力なライブラリで、
GUIのパーツのようにリストやスクロールボックスが予め用意されています。
この内、box要素にゲームのタイルと同じ数の一文字のtext要素を詰め込み、ランタイムのPIXI.jsを使ったCanvasへの描画を行ってる箇所を書き換え、
このタイルへの描画に変えてやります。

実際はそんな単純に書き換えられなかったので、結構無理やりですが、マップとキャラクターを表すクラスのinitializeメソッドでblessedの要素を作り、
updateメソッドでその要素の情報を更新するように書き換えることでそれっぽく動くようにはできました。

また、blessedはCLIでのキー入力も扱うことができるので、ランタイムのDOM経由でキー入力をとってる箇所を書き換えて、blessed経由で入力を受け取るようにしました。

これらの改修で冒頭のスクリーンショットのように、RPGツクールで作ったゲームがCLIで動くようになりました。

![RPGツクールMVで作ったゲームをコマンドラインで動かしてみる](http://manaten.net/wp-content/uploads/2015/11/rpgcli.gif)


# 感想

RPGツクールがjsonエディタと化し、ランタイムがjs+htmlとなったことでやれることが一気に増えたと感じます。
時間が経てばきっとサードパーティのランタイムなども登場してきそう。
エディタ側も、テキストエディタを用いて高速に入力可能なものとか登場しそうな予感がします。

標準のランタイムは全てグローバルに撒く設計で、ゲーム内イベントからスクリプト実行命令で呼ぶぶんには便利なのだろうと思います。
反面、今回のように手を入れるとなるとやや複雑だったり、npmのモジュールを使いたい場合に親和性も気になります(きっと凝ったことをしたくなったら使いたくなるはず)。
(とはいえ多くのツクールユーザーには無縁だという気もしつつ)

今回はプレイヤー側をCLIで実装するというネタですが、ツクールのプレイヤーのコードをなんとなく読めたし、
気になってたblessedも軽く触れたのでネタにしては実入りのあるものだったと思います。
実は画面外に描画が残るとか、会話ウィンドウ出すと固まるとかのバグが有りますが、多分これ以上いじらないでしょう。(ゲーム作るならドット絵のゲームを作りたいので(笑))

ちなみにRPGツクールMVは海外版であれば [Steam](http://store.steampowered.com/app/363890/?l=japanese) からすでに購入可能です。


# 引用リンク

- [RPGツクールMV](https://tkool.jp/mv/)
- [Steam：RPG Maker MV](http://store.steampowered.com/app/363890/?l=japanese)
- [chjj/blessed](https://github.com/chjj/blessed)
- [tmpvar/jsdom](https://github.com/tmpvar/jsdom)
- [Automattic/node-canvas](https://github.com/Automattic/node-canvas)
- [chrisdickinson/raf](https://github.com/chrisdickinson/raf)
- [coolaj86/node-localStorage](https://github.com/coolaj86/node-localStorage)
