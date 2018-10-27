<a href="http://manaten.net/wp-content/uploads/2014/01/pixel-webfont.png"><img src="http://manaten.net/wp-content/uploads/2014/01/pixel-webfont.png" alt="pixel-webfont" width="479" height="243" class="aligncenter size-full wp-image-892" /></a>

なにやらWebフォントという言葉をよく聞くようになりました。
僕も試してみたかったので、ドット絵のWebフォントを作ってみました。


<!-- more -->

# デモ

<div>
<style>
@font-face {
	font-family: '8x8';
	src:url('http://manaten.net/wp-content/uploads/2014/02/8x8.woff') format('woff');
	font-weight: normal;
	font-style: normal;
}
</style>
<pre style="font-family: '8x8'; font-size: 16px;">
abcdefghijklmnopqrstuvwxyz
ABCDEFGHIJKLMNOPQRSTUVWXYZ
1234567890.,!?。、
あいうえおかきくけこさしすせそたちつてとなにぬねの
はひふへほまみむめもやゆよらりるれろわをんぁぃぅぇぉゃゅょっ
アイウエオカキクケコサシスセソタチツテトナニヌネノ
ハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォャュョッ
</pre>

<div style="
  font-family: '8x8';
  font-size: 24px;
  color: red;
  border: 3px solid #EEE;
  padding: 10px;
  background: #222;
  border-radius: 4px;">おきのどくですが ぼうけんのしょ 1 は きえてしまいました。</div>
</div>

IE9、Firefox、Chromeで表示できていることを確認しています。([今回作ったwoff形式のフォント](http://manaten.net/wp-content/uploads/2014/02/8x8.woff))

# 作り方

## ドット絵の文字セットを用意
<a href="http://manaten.net/wp-content/uploads/2014/01/8x8_font.png"><img src="http://manaten.net/wp-content/uploads/2014/01/8x8_font.png" alt="8x8_font" width="208" height="72" class="aligncenter size-full wp-image-893" /></a>

こんな画像を作りました。数字･アルファベット大文字小文字･ひらがな･カタカナで所要時間1.5時間程度。もし漢字も入れるなら地獄の作業が必要になるでしょう。

## ドット絵の文字それぞれをsvgに変換

上のラスタ画像のフォント部分それぞれを以下のようなsvgのベクタ画像に変換します。

<a href="http://manaten.net/wp-content/uploads/2014/02/0_0.svg"><img src="http://manaten.net/wp-content/uploads/2014/02/0_0.svg" alt="0_0" class="aligncenter size-full wp-image-894" /></a>

これを手でやるのは辛いので、プログラムを書きました。(詳しく見たい人は[github](https://github.com/manaten/pixel-font/blob/master/index.coffee)にあります)

8x8の部分画像それぞれに対して、ピクセルからパスを抽出し、svg形式のXMLを出力します。

ピクセルの取得には、[get-pixels](https://github.com/mikolalysenko/get-pixels)を、
XMLの出力には[xmlbuilder-js](https://github.com/oozcitak/xmlbuilder-js)を利用しました。
最近のnpmは探せば何でもあるので最強感あります。

また、SVGを自分で出力するのは初めてだったので、形式を調べるのに[こちらのドキュメント](http://www.hcn.zaq.ne.jp/___/SVG11-2nd/paths.html#PathData)と、
ピクセルをパスに変換する方法の参考に、[ドット絵svg化スクリプトver2](http://www.h2.dion.ne.jp/~defghi/dot2svg/dot2svg2.htm)を参考にさせていただきました。

調べて実装(特にパス変換のアルゴリズム)の所要時間1.5日程度。

## IcoMoon Appで複数のsvg画像をフォントファイルに変換
<a href="http://manaten.net/wp-content/uploads/2014/02/icomoonapp.png"><img src="http://manaten.net/wp-content/uploads/2014/02/icomoonapp.png" alt="icomoonapp" width="872" height="541" class="aligncenter size-full wp-image-895" /></a>

[IcoMoon App](http://icomoon.io/app) はWebフォントを生成してくれるWebアプリケーションで、複数のsvgファイルをWebフォントとして利用できる各種形式に変換し、利用方法のサンプルまで生成してくれます。

今回文字数が多いのでしんどいですが、すべての文字に対して文字コードを指定してやります。所要時間30分程度。

## 完成

<div style="font-family: '8x8'; font-size: 16px;">IcoMoon App が せいせいしたコードを てきとうにコピペするだけで、このようにブラウザで りようすることが できるようになりました。</div>

# 雑感
* ブラウザ上で動くドット絵ゲームを作る場合、こんなフォントをつくっておくと、ドット絵ドット絵した文字描写が楽そう。
  * Webデザインでも、使えることはありそう。
* Webフォントとすることで、CSSでテキスト装飾できるので、ロゴ画像を作るより取り回しが良いと思う([参考](http://weboook.blog22.fc2.com/blog-entry-230.html))

<div style="font-family: '8x8';
  padding: 30px 0 0 30px;
  background: #000;
  font-size: 64px; color: #fff;
  text-shadow: 0 0 10px #fefcc9,
   5px  -5px 15px #feec85,
 -10px -10px 20px #ffae34,
  10px -20px 25px #ec760c,
 -10px -30px 30px #cd4606,
   0px -40px 35px #973716,
   5px -45px 40px #451b0e;">まなドット</div>


* 今回作ったフォント生成プログラムが、svgを一個一個吐くようになっているので、それを手動で[IcoMoon App](http://icomoon.io/app)に食わせていくのは非常に面倒。特にフォントを修正する際がつらい。
  * Webフォントまでをプログラムで一発で吐けるようにしたい。
  * フォントの形式調べてそれをnode.jsで吐けるようにするのはつらそうなので、今回は見送り。
  * IcoMoonAppが吐いたフォントを眺めた感じ、svg形式のフォントなら手軽に吐けそうなので、とりあえずそれで吐けるようにしようかな。
  * 例えば伸ばし棒｢ー｣を作り忘れてしまっていたりするのだけど、こういった加筆･修正は簡単にやりたいよね。

# 参考リンク
* [IcoMoon App](http://icomoon.io/app)
* [ドット絵svg化スクリプトver2](http://www.h2.dion.ne.jp/~defghi/dot2svg/dot2svg2.htm)
* [パス – SVG 1.1 （第２版）](http://www.hcn.zaq.ne.jp/___/SVG11-2nd/paths.html#PathData)
* [mikolalysenko/get-pixels](https://github.com/mikolalysenko/get-pixels)
* [oozcitak/xmlbuilder-js](https://github.com/oozcitak/xmlbuilder-js)
* [自由自在！CSS3のtext-shadowを使ってをロゴ作ってみる｜Webpark](http://weboook.blog22.fc2.com/blog-entry-230.html)

