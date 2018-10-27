<!--
title: fitbitの文字盤を作ってみた話と、fitbitを買ってみてよかったこと
date:  2018-08-09 12:00
categories: []
-->

![fitbit](https://manaten.net/wp-content/uploads/2018/08/fitbit1.jpg)

[fitbit versa](https://www.fitbit.com/shop/versa) を購入したので、お試しでドット絵で文字盤を作ってみました。
出来が中途半端なのでfitbitアプリとしてリリースはしていませんが、githubにソースコードは公開してあります。

リポジトリ: [manaten/fitbit-pixelart-knight-clock](https://github.com/manaten/fitbit-pixelart-knight-clock)

![fitbit](https://manaten.net/wp-content/uploads/2018/08/fitbit2.gif)

このエントリでは、上記文字盤を作る際のメモと、fitbitを購入してよかったことについて書きます。

<!-- more -->

# 制作時のメモ

以下箇条書きです。

## Fitbit Studioについて
- [Fitbit Studio](https://studio.fitbit.com/projects) というWeb上のIDEを用いてコーディングから実機テストまで行える。
- 実機テストに関しては同一のfitbitアカウントで認証している端末が 「Developer Bridge」 でサーバー接続状態になっている場合に、IDEのプルダウンから選択して「Run」で動作確認できる
  - アプリのリリースが面倒なので開発終わってもそのまま文字盤として動かし続けている
- ファイルはD&Dでアップロードできる(複数でも可)、メニューからzipで一括ダウンロードもできる
  - 現状ローカルファイルとの同期手段はこれしかなさそう？
- ローカルのVSCodeで開発したかったので、空プロジェクトでダウンロードしたあとローカルでgitリポジトリ化した
  - 以後同期はローカル → fitbit studio の一方通行とした
  - テキストの同期はエディタで全選択コピペで同期した
  - テキスト以外は同期は頻繁ではないので、必要に応じてD&Dした
  - fitbit studioの出来は悪いわけではないけど、ローカルのvscodeには及ばないので、cliで同期する手段があれば便利なのにな、と思った

## Fitbitの文字盤開発について
- 動作をjs、見た目をsvg+cssで開発できる
  - 既存のWeb技術と同じ技術スタックなのは学習コストが低くて良い
  - jsはモジュールが使え、新し目の構文(object destructuring とか)も利用できる(正確にどのバージョン相当なのかは調べてない)
- svgはsvgの皮を被った別物で、例えばpathが利用できなかったり、利用できる要素も利用できる属性値が微妙に異なっていたりする
  - cssも同じく微妙にプロパティが違う
  - ちゃんと公式の [SVG Guide](https://dev.fitbit.com/build/guides/user-interface/svg/) を読んで、「そういうもの」だと思って書いたほうが良い

## 電池消費について
- Web開発のノリで自由にやると、恐ろしい勢いで電池消費する文字盤が爆誕してしまう
  - 一時間で電池15%暗い消費してしまったりする(デフォルトの文字盤だと一日で15%くらいの消費)
- HeartBeat(心拍数)を毎秒更新しない、画面がオフのときはアニメーションを行わない、などの工夫をすると消費量は減る

## スプライトについて
- ドット絵のアニメーション(数字含む)はimageタグのhrefをjsで置き換えることで実現している
  - 本当はcss sprite的なことをしたかったができなそう？
  - 先述の電池問題があり、imageタグのhrefを毎秒置き換えるのはパフォーマンスで不利では？と思っていたのだが、今のところは問題なさそう
- たくさんの画像を切り出すのが手間だったので、一枚の画像から複数のスプライトを切り出して保存する [manaten/sub-tiles-cropper](https://github.com/manaten/sub-tiles-cropper) というスクリプトを書いた
  - [oliver-moran/jimp](https://github.com/oliver-moran/jimp) を利用して書いた。今後も画像加工する小さなタスクで便利そうなので利用していきたい


# fitbitを購入してよかったこと
最初は「心拍数を常時計測して記録したい」というつもりで購入したのですが、使ってみると購入前にはわからなかった意外と便利なところが見えてきて、手放せなくなっています。
ちなみにfitbitはレビューを見ると、運動される方が消費カロリーなどのトラッキング目的で利用するケースが多いようですが、僕は運動をしない人です。

## やっぱり腕時計は便利
「スマートフォンがあるから腕時計はいらない」という人は一定数いると思っていますし僕自身もそうでした。
ですが腕時計をしてみると「スマートフォンをポケットから取り出し、画面を表示」よりも「左腕を見るだけ」のほうが楽であると気づきます。
もちろんそれだけだと「時刻はスマートフォンで確認できるのにわざわざ腕時計を購入して装着する」動機としては弱いのですが、後述する他のメリットもあります。

## 腕に来る通知が便利
bluetoothで連携しているスマートフォンの通知をfitbitでも受け取り閲覧することができます。
スマートフォンだと気づかなかったり、確認の手間も少ないのがメリットです(特に両手がふさがっているときなど)。

## アラームが便利
朝起きるときと、うっかり働きすぎないように帰る時間にアラームをかけています。
アラームと言ってもfitbit本体が振動するだけなのですが、通知と同じくスマホの振動よりも感知しやすく、
音も鳴らさないため朝や職場で便利です。

ちなみに、職場で帰るタイマーは今までslack botに行わせていたのですがそのとおりに帰れた試しはなく、
fitbitでアラームするようにしたらちゃんとその時間に帰れるようになったという小話があります。

## タイマーが便利
主に料理で時間を測るのに使っています。
これも一見スマートフォンでもいいのですが、料理中にスマホに手を伸ばしてタイマーを設定するよりコストが低いというのが大きいです。
スマートフォンほど色々なアプリが入っていないため(スペック都合、表示都合でもある)、タイマーアプリの起動がしやすいというのもあるかもしれません。

## 睡眠管理が便利
今までの紹介ははどっちかというと「スマートフォンでもできるけど、身についてるとより便利」な機能でしたが、これはfitbitならではの機能です(睡眠管理アプリはスマホアプリでもあるにはあるが)。

fitbitは睡眠時間を計測してスマートフォンで週単位での睡眠時間グラフや睡眠の内訳(レム睡眠など)を表示してくれます。
ただ計測して表示してくれるだけなのですが、「今週は睡眠時間が短めだから今日こそ早く寝よう」みたいな心理が働くため、夜更かしの防止に役立ってくれています。


## まとめ
こうして書き下してみると、「スマホでよくね？」という機能が多いのですが、というか僕自身も買っては見たものの「あっ、これスマホでよくね？ってなって数日で飽きるかも」と思っていたのですが、意外と身につけていると便利なことが多い印象です。
スマートフォンが何でもできる汎用型デバイスであるため、スマートウォッチのような特化型デバイスのほうが特化したシチュエーションで使いやすいのは当然の話なのかもしれません。

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=manaten-22&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=B07D36PY24&linkId=3a43d3bd8975b835e63e16ebd6f973f6"></iframe>

# 参照

- [Fitbit Studio](https://studio.fitbit.com/projects)
- [SVG Guide](https://dev.fitbit.com/build/guides/user-interface/svg/)
- [oliver-moran/jimp: An image processing library written entirely in JavaScript for Node, with zero external or native dependencies.](https://github.com/oliver-moran/jimp)
- [manaten/fitbit-pixelart-knight-clock: A fitbit clockface of pixelart knight.](https://github.com/manaten/fitbit-pixelart-knight-clock)
- [manaten/sub-tiles-cropper: An utility for crop sub-tiles from images.](https://github.com/manaten/sub-tiles-cropper)

