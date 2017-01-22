<a href="http://manaten.net/wp-content/uploads/2014/02/pixelsvg.png"><img src="http://manaten.net/wp-content/uploads/2014/02/pixelsvg.png" alt="pixelsvg" width="658" height="279" class="aligncenter size-full wp-image-903" /></a>
[前回](http://blog.manaten.net/entry/pixel-webfont)作った、ドット絵からsvgを作るプログラムでは、文字を1つずつsvgとして出力するため、[IcoMoonApp](http://icomoon.io/app/#/select)でWebフォントにする作業が大変でした。
なので、プログラムを回収してsvgフォントの形式でまとめた状態で出力するようにしてみました。([ソースコード](https://github.com/manaten/pixel-font/blob/master/index.coffee))


<!-- more -->

このプログラムを実行すると、8x8のフォントから以下のようなsvgフォント形式のsvgが出力されます。
```svg
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<svg xmlns="http://www.w3.org/2000/svg">
  <def>
    <font id="8x8" horiz-adv-x="1024">
      <font-face units-per-em="1024" ascent="1024" descent="0"/>
      <missing-glyph horiz-adv-x="1024"/>
      <glyph unicode="&#x20;" d="" horiz-adv-x="512"/>
      <glyph unicode="&#x30;" d="M512 896h256v-128h128v-512h-128v-128h-256v128h-128v512h128v128M640 768h-128v-512h256v512z"/>
      <glyph unicode="&#x31;" d="M512 896h128v-640h128v-128h-384v128h128v384h-128v128h128z"/>
      <glyph unicode="&#x32;" d="M512 896h256v-128h128v-256h-128v-128h-128v-128h256v-128h-512v128h128v128h128v128h128v256h-256v-128h-128v128h128z"/>
...
```

このsvgファイルはsvgフォントが利用可能なブラウザならそのまま利用可能ですし、[IcoMoonApp](http://icomoon.io/app/#/select)で他のwebフォントの形式に変換することも出来ます。

<a href="http://manaten.net/wp-content/uploads/2014/02/icomoon4.png"><img src="http://manaten.net/wp-content/uploads/2014/02/icomoon4.png" alt="icomoon4" width="620" height="372" class="aligncenter size-full wp-image-902" /></a>

svgフォントを直接読み込ませると、

<a href="http://manaten.net/wp-content/uploads/2014/02/icomoon3.png"><img src="http://manaten.net/wp-content/uploads/2014/02/icomoon3.png" alt="icomoon3" width="742" height="484" class="aligncenter size-full wp-image-901" /></a>

このようにすべての文字が読み込まれます。


<a href="http://manaten.net/wp-content/uploads/2014/02/icomoon5.png"><img src="http://manaten.net/wp-content/uploads/2014/02/icomoon5.png" alt="icomoon5" width="1108" height="422" class="aligncenter size-full wp-image-905" /></a>

文字コードも設定された状態なので、Downloadを押せばそのまま他の形式のフォントを取得できます。

前回作っていなかった伸ばし棒やカッコも利用できるようになりました。

<div>
<style>
@font-face {
	font-family: '8x8';
	src:url('http://manaten.net/wp-content/uploads/2014/02/8x8.woff') format('woff');
	font-weight: normal;
	font-style: normal;
}
</style>
<div style="
  font-family: '8x8';
  font-size: 24px;
  border: 3px solid #EEE;
  color: white;
  padding: 10px;
  background: #222;
  border-radius: 4px;">｢ぬわーっ｣</div>
</div>

# おまけ

また、次のようなJSONファイルを用意することで、任意のドット絵をsvgフォントとして出力できるようにしました。

```json
{
	"img": "8x8.png",
	"size": 8,
	"name": "8x8",
	"map": [
		"1234567890!?.,。、ゃゅょャュョ()｢｣",
		"abcdefghijklmnopqrstuvwxyz",
		"ABCDEFGHIJKLMNOPQRSTUVWXYZ",
		"あいうえおかきくけこさしすせそたちつてとなにぬねのっ",
		"はひふへほまみむめもやゆよらりるれろわをんぁぃぅぇぉ",
		"がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽー",
		"アイウエオカキクケコサシスセソタチツテトナニヌネノッ",
		"ハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォ",
		"ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ"
	]
}
```
ドット絵でフォントを作りたい奇特な方はどうぞご利用ください。[github](https://github.com/manaten/pixel-font)においてあります。
