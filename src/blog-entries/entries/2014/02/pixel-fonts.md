<a href="http://manaten.net/wp-content/uploads/2014/02/pixel_fonts.png"><img src="http://manaten.net/wp-content/uploads/2014/02/pixel_fonts.png" alt="pixel_fonts" width="664" height="373" class="aligncenter size-full wp-image-906" /></a>

この記事は[前々回](http://blog.manaten.net/entry/pixel-webfont)と[前回](http://blog.manaten.net/entry/pixel-svgfont)の記事の続きです。

ドット絵から手軽にフォントを作れるようになったので、フォントを幾つか作ってみました。


<!-- more -->

<div>
<style>
@font-face {
	font-family: '6x6_fat';
	src:url('http://manaten.net/wp-content/uploads/2014/02/6x6_fat.eot?-rwlf8g');
	src:url('http://manaten.net/wp-content/uploads/2014/02/6x6_fat.eot?#iefix-rwlf8g') format('embedded-opentype'),
		url('http://manaten.net/wp-content/uploads/2014/02/6x6_fat.woff?-rwlf8g') format('woff'),
		url('http://manaten.net/wp-content/uploads/2014/02/6x6_fat.ttf?-rwlf8g') format('truetype'),
		url('http://manaten.net/wp-content/uploads/2014/02/6x6_fat.svg?-rwlf8g#6x6_fat') format('svg');
	font-weight: normal;
	font-style: normal;
}
@font-face {
	font-family: '8x8_bold';
	src:url('http://manaten.net/wp-content/uploads/2014/02/8x8_bold.eot?qerfg');
	src:url('http://manaten.net/wp-content/uploads/2014/02/8x8_bold.eot?#iefixqerfg') format('embedded-opentype'),
		url('http://manaten.net/wp-content/uploads/2014/02/8x8_bold.woff?qerfg') format('woff'),
		url('http://manaten.net/wp-content/uploads/2014/02/8x8_bold.ttf?qerfg') format('truetype'),
		url('http://manaten.net/wp-content/uploads/2014/02/8x8_bold.svg?qerfg#8x8_bold') format('svg');
	font-weight: normal;
	font-style: normal;
}
@font-face {
	font-family: '8x8_border';
	src:url('http://manaten.net/wp-content/uploads/2014/02/8x8_border.eot?-2qbost');
	src:url('http://manaten.net/wp-content/uploads/2014/02/8x8_border.eot?#iefix-2qbost') format('embedded-opentype'),
		url('http://manaten.net/wp-content/uploads/2014/02/8x8_border.woff?-2qbost') format('woff'),
		url('http://manaten.net/wp-content/uploads/2014/02/8x8_border.ttf?-2qbost') format('truetype'),
		url('http://manaten.net/wp-content/uploads/2014/02/8x8_border.svg?-2qbost#8x8_border') format('svg');
	font-weight: normal;
	font-style: normal;
}
pre {
	color: #EEE;
	font-size: 24px;
	border: 3px solid #EEE; padding: 10px; background: #222; border-radius: 4px;
}
._8x8 {
	font-family: '8x8';
}
._6x6_fat {
	font-family: '6x6_fat';
	letter-spacing: -6px;
}
._8x8_bold {
	font-family: '8x8_bold';
}
._8x8_border {
	font-family: '8x8_border';
}
.title-demo {
	font-family: '8x8_bold';
	font-size: 32px;
}
.subtitle-demo {
	font-family: '6x6_fat';
	font-size: 16px;
	letter-spacing: -4px;
	margin-top: -12px;

}
	</style>
</div>

# 8x8_bold

太いの。タイトルとかに使えそう。

<pre class="_8x8_bold">
1234567890!?.,()｢｣
ABCDEFGHIJKLMNOPQRSTUVWXYZ
</pre>


# 6x6_fat

上のヘッダのロゴの下部のちっこい文字と同じフォント。
そういうサブタイトルとかに向いてると思います。

<pre class="_6x6_fat">
1234567890!?.,()｢｣
ABCDEFGHIJKLMNOPQRSTUVWXYZ
</pre>

# 8x8_border

ボーダーで囲まれてる。これもサブタイトルとかに向いてそう。
<pre class="_8x8_border">
1234567890!?.,()｢｣
ABCDEFGHIJKLMNOPQRSTUVWXYZ
</pre>

# ロゴっぽく

<div class="title-demo">MANA-DOT</div>
<div class="subtitle-demo">PIXEL ART, PROGRAMING, ETC</div>

次にテーマ作るときはWebフォント使おう。


# 関連記事
* [ドット絵のWebフォントをつくってみたよ](http://blog.manaten.net/entry/pixel-webfont)
* [ドット絵からsvgフォントを作るプログラムを書いたよ](http://blog.manaten.net/entry/pixel-svgfont)
