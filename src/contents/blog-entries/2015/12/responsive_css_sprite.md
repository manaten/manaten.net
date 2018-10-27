<!--
title: レスポンシブなCSSスプライト
date:  2015-12-xx 12:00
categories: [CSS,stylus,spritesmith,メモ]
-->


![レスポンシブなCSSスプライト](http://manaten.net/wp-content/uploads/2014/07/responsive_2.png)

よく知られたCSSスプライトはボックスの幅･高さをスプライト画像と同じに指定し、background-position をずらすことで複数のスプライト画像を含むスプライトシートの中から対象画像だけを表示します。
この方法だと表示できる画像のサイズは固定なのですが、
background-sizeとbackground-positionを % で指定し、ボックスの幅によって可変サイズな
(レスポンシブ、あるいはフレキシブルな)CSSスプライトの表示法を紹介します。


<!-- more -->

# デモ

### 元画像

![レスポンシブなCSSスプライト](http://manaten.net/wp-content/uploads/2015/12/sprite.png)

[gulp-spritesmith](https://www.npmjs.com/package/gulp-spritesmith) で作成した適当なスプライトシートです。


### スプライトの利用例

このページの幅を変えてみると、以下のスプライト画像のサイズが画面幅によって可変であることがわかると思います。
上からwidthを `70%` 、 `50%`、 `100%` で指定しています。

<div>
<style>

.sprite-demo__button1 {
  margin-bottom: 10px;
  width: 70%;
  white-space: nowrap;
  text-indent: 100%;
  overflow: hidden;
  font-size: 0;
  background-image: url("http://manaten.net/wp-content/uploads/2015/12/sprite.png");
  background-size: 350% 387.5%;
  background-position: 0% 0%;
}
.sprite-demo__button1::after {
  content: '';
  display: block;
  padding-top: 40%;
}
.sprite-demo__button2 {
  margin-bottom: 10px;
  width: 50%;
  white-space: nowrap;
  text-indent: 100%;
  overflow: hidden;
  font-size: 0;
  background-image: url("http://manaten.net/wp-content/uploads/2015/12/sprite.png");
  background-size: 291.66666666666663% 310%;
  background-position: 44.565217391304344% 40.476190476190474%;
}
.sprite-demo__button2::after {
  content: '';
  display: block;
  padding-top: 41.66666666666667%;
}
.sprite-demo__button3 {
  margin-bottom: 10px;
  width: 100%;
  max-width: 500px;
  white-space: nowrap;
  text-indent: 100%;
  overflow: hidden;
  font-size: 0;
  background-image: url("http://manaten.net/wp-content/uploads/2015/12/sprite.png");
  background-size: 280% 258.33333333333337%;
  background-position: 100% 100%;
}
.sprite-demo__button3::after {
  content: '';
  display: block;
  padding-top: 48%;
}

</style>
<div class="sprite-demo__button1">ボタン1</div>
<div class="sprite-demo__button2">ボタン2</div>
<div class="sprite-demo__button3">ボタン3</div>
</div>

利用例を含めたコードの全体は、 [manaten/responsive-css-sprite-demo](https://github.com/manaten/responsive-css-sprite-demo) にあります。


# コーディング

[gulp-spritesmith](https://www.npmjs.com/package/gulp-spritesmith) と
[stylus](http://stylus-lang.com/) を用いて記述した上記サンプルのコードは以下のようになっています。

```stylus
// spritesmithのスプライトを引数に、レスポンシブなスプライトを表示する関数
sprite-responsive($sprite)
  $sheet_w = $sprite[6]  // スプライトシートの幅
  $sheet_h = $sprite[7]  // スプライトシートの高さ
  $sprite_w = $sprite[4] // スプライト画像の幅
  $sprite_h = $sprite[5] // スプライト画像の高さ
  $offset_x = $sprite[0] // スプライト画像のシート上のx位置
  $offset_y = $sprite[1] // スプライト画像のシート上のy位置

  // テキストを隠す
  white-space nowrap
  text-indent 100%
  overflow hidden
  font-size 0

  // 要素の幅によってスプライトの表示サイズを可変にする
  background-image url($sprite[8])
  background-size ($sheet_w / $sprite_w * 100)% ($sheet_h / $sprite_h * 100)%
  background-position ($offset_x / ($sheet_w - $sprite_w) * 100)% ($offset_y / ($sheet_h - $sprite_h) * 100)%

  // 画像のアスペクト比固定
  &::after
    content ''
    display block
    padding-top ($sprite_h / $sprite_w * 100)%

.button1
  margin-bottom 10px
  width 70%
  sprite-responsive($sprite_button1)

.button2
  margin-bottom 10px
  width 50%
  sprite-responsive($sprite_button2)

.button3
  margin-bottom 10px
  width 100%
  max-width 500px
  sprite-responsive($sprite_button3)
```

`sprite-responsive` がspritesmithで生成したスプライトの変数を受け取ってスタイルを設定する関数で、
button1～3はそれを適用し、さらにデモのために `width` を異なる値に設定しています。

`sprite-responsive` 関数は2つのテクニックの組み合わせになっていて、一つはcssスプライトを%で指定し、要素の幅によってサイズが可変になるようにするもの、
もう一つは要素の幅によって高さも可変にし、常に要素のアスペクト比が維持されるようにするものです。

例えばボタン1は 実際はスタイル指定になります。

```
.button1 {
  margin-bottom: 10px;
  width: 70%;
  white-space: nowrap;
  text-indent: 100%;
  overflow: hidden;
  font-size: 0;
  background-image: url("http://manaten.net/wp-content/uploads/2015/12/sprite.png");
  background-size: 350% 387.5%;
  background-position: 0% 0%;
}
.button1::after {
  content: '';
  display: block;
  padding-top: 40%;
}
```

以下で詳しく見ていきます。各指定について長い説明になってしまっているので、どうしてこういう指定になっているのか気にならない人は飛ばしてしまっても問題無いです。


# 要素のサイズによってスプライトの表示サイズを可変にする

```
background-image url($sprite[8])
background-size ($sheet_w / $sprite_w * 100)% ($sheet_h / $sprite_h * 100)%
background-position ($offset_x / ($sheet_w - $sprite_w) * 100)% ($offset_y / ($sheet_h - $sprite_h) * 100)%
```

この部分がスプライトのサイズを可変にするものです。
二行目の `background-size` 、 三行目の `background-position` ともに、要素の大きさに対して表示する背景画像の大きさを可変にするために、%指定をしています。


## backgroud-size の%指定

`backgroud-size` を%で指定した場合、要素の幅･高さに対してどのくらいの大きさで表示するかという指定になります。
100%の場合、要素の幅･高さいっぱいになるように画像が拡大縮小されます。

```css
background-size: 100% 100%;
```

<div>
<div style="border: solid 1px black; width: 160px; height: 100px; background-image: url('http://manaten.net/wp-content/uploads/2015/12/sprite.png'); background-size: 100% 100%;"></div>
</div>


要素の幅によって可変にスプライト画像を表示するためには、要素の幅がいくつであっても目的のスプライト画像がピッタリのサイズになるような倍率を考えてあげる必要があります。

例えば例のボタン1はスプライトの幅が80px、スプライトシートの画像全体の幅が280pxとなっています。
この時、要素に対してスプライトがピッタリ表示されるような%指定を考えます。
要素の幅が80pxのとき、100%指定で表示すると、画像は全体が80pxにピッタリ収まるように表示されるので、80/280倍のサイズで表示されます。
この逆数である `280 / 80 * 100%` 指定で表示すると、80pxの要素に対してピクセルが等倍で表示されることになり、要件が満たせます。

```css
width: 80px;
background-size: 350% /* 280/80*100 */ 100%;
```

<div>
<div style="border: solid 1px black; width: 80px; height: 100px; background-image: url('http://manaten.net/wp-content/uploads/2015/12/sprite.png'); background-size: 350% 100%;"></div>
</div>

これは要素の幅に対する割合指定なので、要素の幅が変わってもぴったりに表示されます。

```css
width: 160px;
background-size: 350% /* 280/80*100 */ 100%;
```

<div>
<div style="border: solid 1px black; width: 160px; height: 100px; background-image: url('http://manaten.net/wp-content/uploads/2015/12/sprite.png'); background-size: 350% 100%;"></div>
</div>

高さに対しても同じ考え方ができ、これをstylusの関数として一般化したのが

```
background-size ($sheet_w / $sprite_w * 100)% ($sheet_h / $sprite_h * 100)%
```

です。

```css
background-size: 350% /* 280/80*100 */ 387.5% /* 124/32*100 */;
```

<div>
<div style="border: solid 1px black; width: 160px; height: 100px; background-image: url('http://manaten.net/wp-content/uploads/2015/12/sprite.png'); background-size: 350% 387.5%;"></div>
</div>

このように、要素に対してスプライトがぴったりに引き伸ばされます。

## backgroud-position の%指定

`background-size` の指定で要素いっぱいに左上のスプライトを引き伸ばして表示することはできましたが、これでは左上のスプライトしか表示できません。
他のスプライトを表示するには、通常のCSSスプライトと同じく、 `background-position` の指定で表示位置をずらしてあげる必要があります。
可変にするためにこちらも%で指定してやる必要があります。

`background-position` を%で指定した場合、 `top left` の状態を0% 0%、 `right bottom` の状態を `100% 100%` として、割合で位置が決まります。

```css
background-position: 0% 0%;
```

<div>
<div style="border: solid 1px black; width: 160px; height: 100px; background-image: url('http://manaten.net/wp-content/uploads/2015/12/sprite.png'); background-position: 0% 0%; background-repeat: no-repeat;"></div>
</div>



```css
background-position: 100% 100%;
```

<div>
<div style="border: solid 1px black; width: 160px; height: 100px; background-image: url('http://manaten.net/wp-content/uploads/2015/12/sprite.png'); background-position: 100% 100%; background-repeat: no-repeat;"></div>
</div>

これをピクセル指定に換算すると、 `0% 0%` は `0px 0px` と同じ、
 `100% 100%` は `(要素の幅 - 画像の幅)px (要素の高さ - 画像の高さ)px` となります。
これは、 -画像の幅px -画像の高さpx を指定するとちょうど要素の左上に画像の右下が来るので(ちょうど画像が非表示になる状態)、そこからさらに要素の幅･高さの分だけずらしてやることで
画像の右下を要素の右下に合わせてやることができるからです。
`background-position` を0から100の%指定した場合、この区間を線形に動くことになるため、

```
ずらすpx数 = background-positionで指定する%/100 * (要素の幅or高さ - 画像の幅or高さ)px
```

が成り立ちます。


さて、真ん中の赤色のボタン2を要素ぴったりに表示することを考えます。
`background-size` はスプライトの幅が96px、高さが40pxでスプライトシート全体の幅が280px、高さが124pxなので、 280 / 96 * 100 = 291.66666666666663%,  124 / 40 * 100 = 310% と指定します。

```css
background-size: 291.66666666666663% 310%;
background-position: 0% 0%;
```

<div>
<div style="border: solid 1px black; width: 160px; height: 100px; background-image: url('http://manaten.net/wp-content/uploads/2015/12/sprite.png'); background-size: 291.66666666666663% 310%; background-position: 0% 0%;"></div>
</div>

スプライトシート上では、ボタン2は82px、34pxの位置にあるため、 `background-size` 等倍の通常のCSSスプライトでは、 `background-position: -82px -34px` を指定します。もちろんこれをそのまま指定しても、望み通りの表示にはなりません。

```css
background-size: 291.66666666666663% 310%;
background-position: -82px -34px
```

<div>
<div style="border: solid 1px black; width: 160px; height: 100px; background-image: url('http://manaten.net/wp-content/uploads/2015/12/sprite.png'); background-size: 291.66666666666663% 310%; background-position: -82px -34px;"></div>
</div>

これは、スプライトシートのサイズは今、要素にピッタリのサイズから更に幅は2.91倍、高さは3.1倍になっているからです。
つまり、幅は 要素の幅 / スプライトシートの幅 * 2.91倍、高さは 要素の高さ / スプライトシートの高さ * 3.1倍です。
今、要素の幅は160px、高さは100pxを指定しています。
なので、スプライトシートの幅は 160 / 280 * 2.91倍 = 1.66倍、 高さは 100 / 124 * 3.1=2.5倍 になっているはずです。
`background-position` も同じ倍率をかけてあげれば、正しい位置に表示されます。

```css
background-size: 291.66666666666663% 310%;
background-position: -136.12px /* -82*1.66 */ -85px /* -34*2.5 */
```

<div>
<div style="border: solid 1px black; width: 160px; height: 100px; background-image: url('http://manaten.net/wp-content/uploads/2015/12/sprite.png'); background-size: 291.66666666666663% 310%; background-position: -136.12px -85px;"></div>
</div>

ぴったりに表示されました。
ただし、これだと `bakchround-position` の計算に要素のサイズが関わってしまい、汎用的に用いることができませんので、%で指定できるようにする必要があります。

先ほどの等式
```
ずらすpx数 = background-positionで指定するxの%/100 * (要素の幅or高さ - 画像の幅or高さ)px
```

に、 `現在の画像の幅=要素の幅/スプライトシートの幅*画像の幅*(スプライトシートの幅/スプライトの幅)` と
 `ずらすpx数=要素の幅/スプライトシートの幅*スプライトシート上のx座標*(スプライトシートの幅/スプライトの幅)` を代入します。

```
要素の幅/スプライトシートの幅*スプライトシート上のx座標*(スプライトシートの幅/スプライトの幅)
 = background-positionで指定するxの% / 100
   * (要素の幅 - 要素の幅/スプライトシートの幅*画像の幅*(スプライトシートの幅/スプライトの幅))px
```

このままだと複雑ですが、式を整理すると、
```
background-positionで指定するxの% = 100 * スプライトシート上のx座標 / (スプライトの幅 - 画像の幅)
```
とすることができ、要素の幅を使わない%の値の計算方法を得ることができました。


高さも同じく、
```
background-positionで指定するyの% = 100 * スプライトシート上のy座標 / (スプライトの高さ - 画像の高さ)
```
です。ここから、 `background-position: 100 * 82 / (280 - 96) % 100 * 34 / (124 - 40) % ;` とします。

```css
background-size: 291.66666666666663% 310%;
background-position: 44.56% /* 100 * 82 / (280 - 96) % */ 40.47% /* 100 * 34 / (124 - 40) % */
```
<div>
<div style="border: solid 1px black; width: 160px; height: 100px; background-image: url('http://manaten.net/wp-content/uploads/2015/12/sprite.png'); background-size: 291.66666666666663% 310%; background-position: 44.56% 40.47%;"></div>
</div>

%指定でぴったりに表示できました。要素の幅や高さを変えてもぴったりに表示できます。

```css
width: 200px;
height 70px
background-size: 291.66666666666663% 310%;
background-position: 44.56% /* 100 * 82 / (280 - 96) % */ 40.47% /* 100 * 34 / (124 - 40) % */
```
<div>
<div style="border: solid 1px black; width: 200px; height: 70px; background-image: url('http://manaten.net/wp-content/uploads/2015/12/sprite.png'); background-size: 291.66666666666663% 310%; background-position: 44.56% 40.47%;"></div>
</div>

これをstylus関数として一般化すると、

```css
background-position ($offset_x / ($sheet_w - $sprite_w) * 100)% ($offset_y / ($sheet_h - $sprite_h) * 100)%
```

となります。

## 参考

- [css - responsive sprites / percentages - Stack Overflow](http://stackoverflow.com/questions/21810262/responsive-sprites-percentages)
- [CSS3 background-size property](http://www.w3schools.com/cssref/css3_pr_background-size.asp)
- [CSS background-position property](http://www.w3schools.com/cssref/pr_background-position.asp)


# 要素の幅によって要素の高さをアスペクト比を維持して可変にする

前節のスタイル指定で要素の幅高さにぴったりにスプライトを表示できるようになりました。
あとは、要素の幅が決まった時に要素の高さが元のスプライトとアスペクト比が同じになれば、レスポンシブなCSSスプライトが実現できます。
`sprite-responsive` 関数の以下の指定が要素の幅によって要素の高さが元のスプライトと同じアスペクト比になるようにしている箇所です。

```
  &::after
    content ''
    display block
    padding-top ($sprite_h / $sprite_w * 100)%
```

子要素の `padding-top` は%指定した時、親要素の `width` に比例した値になります。
ブロック要素のafterの `padding-top` を%指定することで、要素の高さを作ってあげます。
要素の高さは、 `要素の幅 * スプライトの高さ / スプライトの幅` となればアスペクト比が一緒になるので、 `padding-top ($sprite_h / $sprite_w * 100)%` を指定します。

先ほどのボタン2の場合は次のようになります。

```css
width: 30%;
background-size: 291.66666666666663% 310%;
background-position: 44.56% 40.47%;
.button2::after {
  content: '';
  display: block;
  padding-top: 41.66%; /* 100 * 40 / 96 */
}
```
<div>
<div style="border: solid 1px black; width: 30%;" class="sprite-demo__button2"></div>
</div>

幅指定だけでスプライト画像と同じアスペクト比になりました。

## 参考

- [html - Responsively change div size keeping aspect ratio - Stack Overflow](http://stackoverflow.com/questions/12121090/responsively-change-div-size-keeping-aspect-ratio)


# スプライトのパディングの指定

上記までのやり方で伸び縮みするスプライトは作れるのですが、これだけだと倍率によってはスプライトの隣のスプライトのピクセルが紛れ込んできてしまうことがあります。
これを防ぐために、gulp-spritesmithでのスプライト生成時にスプライト間のパディングを指定して透明ピクセルを挿入してあげています。

今回gulpfileでのspritesmithの指定を以下のようにしました。 `padding: 2` がパディングの挿入となっています。

```
gulp.task('build:sprite', () => {
  const spriteData = gulp.src(`${SRC_DIR}/sprites/**/*.png`)
    .pipe(spritesmith({
      imgName  : 'sprite.png',
      cssName  : 'sprite.styl',
      imgPath  : '/assets/sprite.png',
      cssFormat: 'stylus',
      algorithm: 'diagonal',
      padding  : 2,
      cssVarMap: sprite => {
        sprite.name = 'sprite-' + sprite.name;
      }
    }))
  return mergeStream(
    spriteData.img.pipe(gulp.dest(`${BUILD_DIR}/assets`)),
    spriteData.css.pipe(gulp.dest(`${TMP_DIR}/css`))
  );
});
```

gulpfileの全体は [github](https://github.com/manaten/responsive-css-sprite-demo) にあります。


# 雑感

CSSのキモとなる記述自体は参考リンクの内容を読めばすぐ求められるのですが、あとから自分で見て理解できるように詳しく説明を書いたら長くなってしまいました。
特に `backgroud-position` の説明を簡潔に書くことができず･･･

CSSスプライト自体http2の普及で必要性が薄くなりそうですし、レスポンシブな画像もこれからはSVGがどんどん利用されていきそうな気配ではあります。
とはいえ、ラスタ画像のスプライトも当分利用されそうですし、それをレスポンシブに利用したいケースは昨今のWeb事情だとそこそこあるのではと思います。
そんな時に本エントリのの内容が参考になれば幸いです。


# 参考リンク

- [manaten/responsive-css-sprite-demo](https://github.com/manaten/responsive-css-sprite-demo)
    - 今回の内容のデモ用レポジトリ。gulpfile、stylusファイルなど。
- [html - Responsively change div size keeping aspect ratio - Stack Overflow](http://stackoverflow.com/questions/12121090/responsively-change-div-size-keeping-aspect-ratio)
- [css - responsive sprites / percentages - Stack Overflow](http://stackoverflow.com/questions/21810262/responsive-sprites-percentages)
- [gulp-spritesmith](https://www.npmjs.com/package/gulp-spritesmith)
- [CSS3 background-size property](http://www.w3schools.com/cssref/css3_pr_background-size.asp)
- [CSS background-position property](http://www.w3schools.com/cssref/pr_background-position.asp)
