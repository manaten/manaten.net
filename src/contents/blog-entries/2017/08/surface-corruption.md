<!--
title: 海外版Surface Laptopで一部の日本語アプリケーションが文字化けする + おまけでSurface Laptopの感想
date:  2017-08-29 12:00
categories: []
-->


![surface-laptop](https://manaten.net/wp-content/uploads/2017/08/surface-laptop.jpg)

家電量販店で触っていい感じだったので、Surface Laptopを購入してしまいました(一か月くらい前に)。
英字キーボードが使いたかったこと、日本で未発売のcore i7+メモリ16GBモデルが欲しかったことから、海外版を米Amazonで購入しました。

[Amazon.com: Microsoft Surface Laptop (Intel Core i7, 16GB RAM, 512GB) - Platinum: Computers & Accessories](https://www.amazon.com/gp/product/B0713X4DKY/ref=oh_aui_detailpage_o00_s00?ie=UTF8&psc=1)

購入自体は発送に時間はかかったものの、きちんと手元に届き、ACアダプタなども問題なく利用できています。

海外版のWindowsを使うにあたって一部の日本語アプリケーションの日本語文字が文字化けてしまうという問題があったため、紹介します。

<!-- more -->

# 症状

画像のように、一部の日本語アプリケーションでメニューなどの文字が化けてしまいます(画像はドット絵エディタのEDGE2)。

![文字化け](https://manaten.net/wp-content/uploads/2017/08/foreign-windows.jpg)

日本語言語パックは届いて起動してすぐに入れWindowsのメニューなどは日本語で表示できていたため、最初原因がわかりませんでした。
別のWindows10機では正しく表示できていたのでOSの違いではなさそうだし、Insider preview(主にbash on windowsのために入れていた)のせいかな？
とも思ったりしました。

# 解決

[海外ＰＣの文字化け -海外在住で現地で購入したウィンドウズ７ＰＣを日- Windows 7 | 教えて!goo](https://oshiete.goo.ne.jp/qa/6565030.html)

教えてgooに答えが書いてありました。

> Control Panel のClock, Language and Region の
> Regional and Language Options の Aministrativeの
> non-Unicode programs は Japanese になっていますよね？


![システムロケールの変更](https://manaten.net/wp-content/uploads/2017/08/system-locale.png)


コントロールパネルの「時計、言語、および地域」 → 「地域」 → 「管理」と開いて、「Unicode対応ではないプログラムの言語」の「システムロケールの変更」で「日本語」
を選ぶことで直りました。

![直った](https://manaten.net/wp-content/uploads/2017/08/locale-fixed.png)

簡単な話でしたが、海外でPCを購入したのは初めてだったので気づくのに時間がかかりました。

# 余談 Surface Laptopについて

おまけでSurface Laptopの感想を箇条書きで書いておきます。

- 見た目がかっこいい
  - Windows ラップトップは天板にメーカーロゴがでかでか書いてあったりし、あまりかっこよくないPCが多いので、すごく大事
  - かっこいい = テンションが上がる = 作業効率が上がる なので、大事
- キーボードが押しやすい
  - キーが打ちやすいラップトップを求めていたので、この点はよい
- キーボード配列はおおむね良いが、ctrlとfnは逆であってほしかった
  - ctrl+Sをはじめとして、ctrl組み合わせのショートカットのほうが圧倒的に押すので。
  - fnはオン状態(F1-12が有効な状態)からめったに押すことはない。ボリューム切り替えくらい(それもそこまで必須ではない)
- キーボードの矢印キーの上下キーの間に、macbook proのように掘り込みが欲しかった
  - macはなんだかんだで考えられてるなあと思う
  - macは最下段だけ縦幅広くて、それもよい。Surface Laptopは他と同じ幅なので、上下キーが半分のサイズで少し押しづらい。
- ディスプレイがタッチパネルなのはなんだかんだで便利
  - 膝上でダラダラ動画見るときにタッチパッドでカーソルを操作するよりもずっと素早く操作できる
  - ただキーボードたたいてるときに指が触れちゃって誤操作することもある、慣れれば問題はない
- Displayportのコネクタが固い
  - 個体差かもしれない
  - 普段はディスプレイにつないでデスクトップスタイル、息抜きしたいときは外して膝上スタイルという使い分けをしたいので、外しづらいのは少しマイナス
- USBポートは一つしかないけど、そんなに問題ない
  - 現状普段使いの周辺機器は、ロジクールの高機能マウス(USB)と、Thinkpadキーボード(bluetooth)。
  - マウス調子が悪いので、買い替えるならbluetoothにする予定。
  - いろいろつなぐ人は困るかも？ハブがあれば問題ない気もする
- Windows Helloの顔認証ログインはすごく便利
  - フタ開いている間に認証が終わってPCを使い始められる
- マルチディスプレイでそれぞれの解像度が違う場合は少し苦手
  - 本体は高解像度ディスプレイだが、外付けでフルHD程度のディスプレイを利用すると、一部アプリケーション(IMEの変換窓など)のサイズが狂う
  - Surface Laptopというより、Windows10の問題。Macは解決できてるんだからWindowsもそのうちよくなるはず
- 海外Amazonでの購入なので、壊れた時が怖い
  - 大事に使うつもりではあるけど、基本つけっぱで使うし壊れるときは壊れるので...
  - 壊れたらネタ記事を書く

以上です。

# 参考
- [海外ＰＣの文字化け -海外在住で現地で購入したウィンドウズ７ＰＣを日- Windows 7 | 教えて!goo](https://oshiete.goo.ne.jp/qa/6565030.html)
- [Amazon.com: Microsoft Surface Laptop (Intel Core i7, 16GB RAM, 512GB) - Platinum: Computers & Accessories](https://www.amazon.com/gp/product/B0713X4DKY/ref=oh_aui_detailpage_o00_s00?ie=UTF8&psc=1)
