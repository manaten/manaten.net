<!--
title: husky + lint-stagedでgitのprecommit時にimageminを行い、minifyした画像のみコミットされるようにする
date:  2017-08-30 12:00
categories: [javascript,git]
-->

![imagemin-precommit](https://manaten.net/wp-content/uploads/2017/08/precommit-imagemin.png)

かなり昔に [こちらの記事](http://blog.manaten.net/entry/645)
でgitのpre-commitを紹介しました。今回は、pre-commitにまつわる便利なnpm package 
[typicode/husky](https://github.com/typicode/husky)、
[okonet/lint-staged](https://github.com/okonet/lint-staged)
を利用し、画像ファイルのコミット時に 
[imagemin/imagemin](https://github.com/imagemin/imagemin)
を使い自動で画像ファイルのminifyを行う方法を紹介します。

<!-- more -->

# 目的

[imagemin/imagemin](https://github.com/imagemin/imagemin) を利用すると、画像ファイルのminifyを行うことができます。
画像のminifyはいうまでもなくwebで重要であり、可能な限りこういったツールを利用したいです。

画像を作成するたびに都度imageminを実行するのは手間ですので、こうった作業はできるだけ自動化したいです。
ビルド時の自動minifyであれば、grunt、gulp、webpackのそれぞれで
[gruntjs/grunt-contrib-imagemin](https://github.com/gruntjs/grunt-contrib-imagemin)
、[sindresorhus/gulp-imagemin](https://github.com/sindresorhus/gulp-imagemin)
、[Klathmon/imagemin-webpack-plugin](https://github.com/Klathmon/imagemin-webpack-plugin)
といったプラグインがあります。

ですが、ビルド時のminifyですと、ビルドのたびに毎回すべての画像をminifyすることとなり、画像ファイルの数が増えてきたときに
時間がかかるようになってしまいます。また、オリジナルをコミットする意味のあるソースコードと違い、画像ファイルを
ビルドのたびに処理する必要性も薄いです。リポジトリに追加する時点でminifyしてしまえば十分に思えます。

そこで、今回はgitのpre-commit hookを利用し、コミット時に自動でminifyできるようにしたいと思います。

# ツールの紹介

今回利用するツールの紹介です。

## imagemin

- [imagemin/imagemin](https://github.com/imagemin/imagemin) 

png、jpeg、gif、svg の画像をminifyできるツールです。
今回はこのツールをコミット時にコミット対象の画像ファイルに対して実行することを目標にします。

## husky

- [typicode/husky](https://github.com/typicode/husky)

gitのpre-commit hookとnpmのpackage.jsonをうまく組み合わせてくれるツールです。
`npm install --save-dev huskey` でインストールすると、自動でgitのpre-commit hookを設定してくれ、
package.jsonに記述した `precommit` スクリプトの内容をコミット時に実行してくれるようになります。

```javascript
// package.json
{
  "scripts": {
    "precommit": "ここにpre-commit時に実行したい内容を記述する"
  }
}

```

npm install 時に自動でhookを登録してくれるのがなかなか便利で、面倒なhookスクリプトの記述・配置をさぼることができ、
複数人で作業する場合ではpre-commit hookの利用を半強制することもできます。

## lint-staged

- [okonet/lint-staged](https://github.com/okonet/lint-staged)

実行するとgitのステージに上がっているファイルだけに対して指定したスクリプトを実行できます。
上記のhuskyと組み合わせることで、pre-commit時の処理を簡単に記述できます。
通常は、eslintやstylelintなどのlintをコミット前に行い、lintを通らないファイルがある場合にコミットを中断する目的で利用します。

package.jsonに `lint-staged` セクションを追加することで、
コミットされるファイルのうち指定した拡張子に対してコマンドを実行してくれます。

```javascript
// package.json
{
  "scripts": {
    "precommit": "lint-staged"
  },
  "lint-staged": {
    "*.{css,less,scss,sss}": [
      "stylelint --fix",
      "git add"
    ]
  }
}
```

この例だと、css系のファイルに対して `stylelint --fix` を行い、修正できた場合に `git add` しそのままコミットします。
この例のようにlintだけでなくfixにも用いることができるため([README](https://github.com/okonet/lint-staged#automatically-fix-code-style-with---fix-and-add-to-commit)
でも触れられています)、今回は画像ファイルに対して imagemin を実行するようにします。


# 設定

lint-stagedを使い、 `*.{png,jpeg,jpg,gif}` に対してimageminを実行し、それぞれをminifyしたファイルで置き換えるようにします。
imageminには[imagemin/imagemin-cli](https://github.com/imagemin/imagemin-cli) というcliツールがあり、
このツールを実行するようにしたいところですが、このツールはオプションがあまり豊富ではなく、
残念ながら今回実行したい「複数の画像ファイルを指定してそれぞれを置き換え」といった用途には利用できません。

そこで、 imagemin-cliの内容を参考に、以下のようなスクリプトを記述しました。

```javascript
// scripts/imagemin.js
'use strict';
const imagemin = require('imagemin');
const fs = require('fs');

(async () => {
  const input = process.argv.filter(arg => /(png|jpe?g|gif|svg)/.test(arg));
  const plugins = [
    'gifsicle',
    'jpegtran',
    'optipng',
    'svgo'
  ].map(x => require(`imagemin-${x}`)());

  for (const inputPath of input) {
    const outputData = (await imagemin([inputPath], {plugins}))[0].data;
    console.log(`${inputPath}: ${fs.statSync(inputPath).size} byte -> ${outputData.length} byte.`);
    fs.writeFileSync(inputPath, outputData);
  }
})().catch(e => {
  console.log(e.message, e);
  process.exit(1);
});
```

lint-staged から引数でコミット対象のファイルのパス(とプログラム実行時についてくる関係ない文字列)が来るので、それぞれに対して
imageminを実行し、同じパスに `writeFileSync` で上書きしています
(async functionを利用しているのでnode7.6以降でないと動きませんが、async functionが利用できる環境ではこのようなスクリプトを
簡潔に記述できるため便利です)。
ファイルサイズの変化もわかるように `console.log` したのですが、lint-stagedが正常実行時の標準出力を捨ててしまうようで
見ることができませんでした(方法を知っている方がいたら教えてください)。

このスクリプトをlint-stagedから呼び出すようにします。

```javascript
// package.json
{
  "lint-staged": {
    "*.{png,jpeg,jpg,gif}": [
      "node ./scripts/imagemin.js",
      "git add"
    ]
  }
}
```

以上で、 `git commit` 時にスクリーンショットのように自動でimageminを実行してくれます。

![imagemin-precommit](https://manaten.net/wp-content/uploads/2017/08/precommit-imagemin-2.png)

コミット前後で画像のサイズが小さくなっていることがわかります(もちろん画像の見た目には変化はありません)。


このブログで利用している画像も、ここで紹介した方法でコミット時に最適化するようにしています。
[manaten.net/package.json](https://github.com/manaten/manaten.net/blob/1ee1f9cb8d1dabae56f0e3d9fe7cf0cb295535ab/package.json#L108-L110)
にて設定の最終系を閲覧できるので、よろしければ参考にしてください。

# 参考

- [imagemin/imagemin: Tense, nervous, minifying images?](https://github.com/imagemin/imagemin)
- [typicode/husky: Git hooks made easy](https://github.com/typicode/husky)
- [okonet/lint-staged: 🚫💩 — Run linters on git staged files](https://github.com/okonet/lint-staged)
- [gitのpre-commit hookを使って、綺麗なPHPファイルしかコミットできないようにする - MANA-DOT](http://blog.manaten.net/entry/645)
  - 以前書いたgitのpre-commitに関する記事
