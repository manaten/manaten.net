<!--
title: シャニマスはPWA時代のGoogleMapなのかもしれないという話
date:  2018-04-26 12:00
categories: [Web,ポエム]
-->

※ この記事はポエムです。

先日、 [アイドルマスター シャイニーカラーズ](https://shinycolors.enza.fun/) がリリースされました。
僕自身はアイマスはちょっとアニメを見る程度で熱心なファンというわけではないのですが、こちらのゲームはゲーム内容だけではなく別の側面でも注目されていると思います。
それは、ブラウザ上で動くゲームであるというところです。ブラウザゲーム自体は古来から存在するものですが、このゲームが挑戦的なのは、「[PWA](https://developers.google.com/web/progressive-web-apps/)であるブラウザゲーム」であるところであると思います(PWAであるかどうかは後述します)。
少し触ってみて「これは昨今のソーシャルゲーム的ゲームをPWAとしてアプローチしたとても挑戦的なプロダクトだ」と自分の中で盛り上がっているので、なぜ盛り上がっているかを冷めないうちに書いてみようと思います。

<!-- more -->

# シャニマスはPWA？

## そもそもPWAとはなんであったか

[PWA](https://developers.google.com/web/progressive-web-apps/) という言葉はGoogleが提唱して以降よく耳にするようになりましたが厳格な定義なく、
乱暴に言ってしまうと「**スマートフォンのネイティブアプリの特性を備えたWebアプリ**」「**ネイティブアプリっぽいWebアプリ**」のことであると考えています。
「スマートフォンのネイティブアプリ」として挙げられる代表的な特性として、以下のものがあります。

- ネイティブアプリのようなUI・ブラウザ感がない
- オフライン状態でも起動できる
- push通知・ホーム画面追加など、OS/端末により親密な動作が可能である

そして、これらを満たすための新しめの技術として、 [Service Worker](https://developers.google.com/web/fundamentals/primers/service-workers/) 、 [Web App Manifest](https://developers.google.com/web/fundamentals/web-app-manifest/) などがあります。Service Workerを使えば、オフライン起動を可能にしたり、push通知をできたりします。Web App Manifestを適切に記述すれば、スマートフォンのホーム画面にWebアプリを追加し、ロケーションバーなどが省略されたブラウザっぽさのないUIで起動します。

## PWAとはプロダクトデザイン

PWAの条件とは大体以上のようですが、必ずしもService WorkerやWeb App Manifestのような技術スタックを利用すればPWAである、とは僕は思いません。「ネイティブアプリっぽいWebアプリ」として最も大事なのは、ユーザー視点で **「ネイティブアプリと変わりない」という体験** であると思います。そしてそのためには上記機能だけではなく、「ネイティブアプリのようなプロダクトデザイン」が必要です。例えば、「ネイティブアプリのようなUI」「ネイティブアプリのような利用形態」などです。


## シャニマスはPWAなのか

ではシャニマスはPWAなのかというと、ここは人によって意見が分かれそうですが、僕個人はPWAであると言ってしまって良いと思っています。少なくともPWAの特徴をいくつか満たしています。
UIはスマートフォンのネイティブゲームアプリとほとんどかわらず、またホーム画面に追加することでネイティブアプリのように起動することが可能です。

![ホーム画面に追加](https://manaten.net/wp-content/uploads/2018/04/shinymas_1.jpg)

![ネイティブアプリのように起動できる](https://manaten.net/wp-content/uploads/2018/04/shinymas_3.gif)

いまはまだオフラインで起動することはできませんが、2018/4/26現在Service Worker自体はコードは用意されており ([https://shinycolors.enza.fun/sw.js](https://shinycolors.enza.fun/sw.js)) 、実装中のようなコメントも見かけられ、いずれ対応するであろうことが察せます(おそらく、リリース時期を優先したのであろうと思われます)。

これらを鑑みて、僕はシャニマスはPWAであると考えます。
今はオフラインでの起動はできないものの、プロダクトデザインはWebアプリというよりネイティブアプリを意識しているように感じられます。UIはネイティブのゲームと比べて見劣らないと感じますし、上記gifのようにホーム画面に追加してしまえば、利用形態もほとんどネイティブアプリです。
ゲーム自体も「Webアプリだからネイティブアプリより劣っている」という点はないように思えます。


# シャニマスはPWA界に何をもたらすか

## PWAプロダクト制作の難しさ

PWAという言葉自体は出始めて2年前後経過していると思いますが、現状ザ・PWAと呼べるような代表的なプロダクトは少なくとも日本国内であまり思いつかず、大きな成功例も聞きません。
これについて僕は、PWAプロダクトを制作すること自体が難しく、正解がないからであると考えています。

PWA制作が難しい理由は上で述べたように、技術スタックだけでなく「**ネイティブアプリのようなプロダクトデザイン」が必要** だからです。これを達成するためにはネイティブアプリ・Webの両方の最新動向に精通したディレクターが必要であると考えています。その上で、プロダクトに求められているものをPWAとして再定義する必要があり、これがとても難易度の高く、明快な正解がないことです。また特に大きなプロダクトの場合、従来型のネイティブアプリとして実装せずPWAとして実装する決断をするのも大変です。

シャニマスは上は述べたとおり、ネイティブアプリと相違ないプロダクトデザインを達成できており、新しい技術スタックもプロダクトデザインの一部として利用できていることがとても画期的であると思います。

## シャニマスがPWAでのGoogleMapかもしれない

PWAの実装が難しいのは前節で述べたように、「ネイティブアプリのようなプロダクトデザイン」が難しいからです。しかし、「シャニマス」という一つのPWAゲームの正解が現れたことで、後続のゲームはある意味シャニマスを **お手本** としてプロダクトデザインをすることができます。ビジネスオーナーに対して「次のプロダクトはPWAで作りたいです」と言うのは難しいですが、「次のプロダクトはシャニマスのような、ネイティブアプリのように動作するWebアプリとして作りたいです」とは比較的説明しやすいと思います。

これは、ajaxの使い方がまだ確立しておらず、各々が自由に実装していた頃にGoogle Mapが登場し、一気にWebアプリという概念が浸透したのに似ていると感じます。「アイマス」という巨大IPが先駆者となったことも影響力という観点で大きく、シャニマスが成功すれば他にも後続でPWAゲームが増え、各々がより優れた正解を模索しながらPWAという概念が徐々に広がっていくのではないかと期待しています。今までPWAという言葉はあったがネイティブアプリの代替としてはなかなか成立していなかった中で(もちろん最近までiOSでService Workerが利用できなかったのも一つの要因ではあるとは思いますが)、大きな一歩が踏み出されたのではないでしょうか。

# その他雑感

## Service Workerへの期待

2018/4/26現在のシャニマスはService Workerを積極的に利用していないようですが、これは今後改善されていくのだろうと思います。
例えば、モバイルでの回線使用量はリソースの多いゲームアプリにおいてネックとなり得るため、ネイティブアプリでよくある「Wifi回線でのファイル一括ダウンロードボタン」のようなものは必要になるだろうし、実装されるのだろうと思います。これができると、より「ネイティブゲームアプリと変わらないPWAゲーム」として完成度が上がるため、個人的に今後のアップデートに期待しているところであります。

## プラットフォーム非依存ゲームの可能性

PWAとしてゲームを作るのことの最大の利点は、iTunes Storeのようなネイティブアプリ配信のプラットフォームへの依存をなくせることにあると考えます。これによりストアのルールに縛られず、自由なタイミングでのアプリ更新が可能になったり、他にもプラットフォームに禁止された手法を取ることができたりなども考えられます。
たとえばAppleは以前、ストア上のアプリでのシリアルコードの利用を禁止しました ( [参照](http://ascii.jp/elem/000/001/069/1069030/) ) が、PWAゲームであれば再びシリアルコードを利用したインセンティブも増えていくかもしれません。他にも、ストアでは配信できないタイプのアプリ(アダルトゲームなど)の可能性も広がっていくと思います。


## Androidのクソダサスプラッシュ問題

Web App Manifestを設定するとAndroidではホーム画面に追加し、ホーム画面からアプリのように起動することを可能にしますが、その際に独自のスプラッシュを表示します。

![Androidのスプラッシュ](https://manaten.net/wp-content/uploads/2018/04/shinymas_2.jpg)

これが画像のように、とてもダサいのです。特にゲームでは雰囲気を壊す要因になりえるので、シャニマスや後続のゲームが成功することで、今後Googleによって改善されていくのだろうなあと思います。

# 参考リンク
- [Progressive Web Apps  |  Web  |  Google Developers](https://developers.google.com/web/progressive-web-apps/)
- [アイドルマスター シャイニーカラーズ](https://shinycolors.enza.fun/)
- [ウェブアプリ マニフェスト  |  Web  |  Google Developers](https://developers.google.com/web/fundamentals/web-app-manifest/)
- [Service Worker の紹介  |  Web  |  Google Developers](https://developers.google.com/web/fundamentals/primers/service-workers/)
- [BXDによるスマホ向けブラウザゲームプラットフォーム“enza”の発表会が開催、『ドラゴンボール』、『アイマス』、『ファミスタ』のプレイリポートもお届け！(1/2) - ファミ通.com](https://www.famitsu.com/news/201802/21152268.html)
- [ASCII.jp：シリアルコードに代わるアプリ集客の3つの手法｜週刊デジタルマーケティング最前線 by D2Cスマイル](http://ascii.jp/elem/000/001/069/1069030/)