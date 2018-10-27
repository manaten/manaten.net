![PixelTipをGruntやbrowserifyでリファクタリングしてみた](http://manaten.net/wp-content/uploads/2014/03/pixel-tip.png)

結構前に作った[ブラウザでドット絵のパレットその他を表示するライブラリ](http://blog.manaten.net/entry/355)を[Grunt](http://gruntjs.com/) / [CoffeeScript](http://coffeescript.org/) / [browserify](http://browserify.org/) / [compass](http://compass-style.org/) といったモダンなツールでビルドするように作りなおしてみました。また、新しくリポジトリを切り直して[公開](https://github.com/manaten/pixel-tip)しました。

<!-- more -->

# デモ

以下の画像にマウスを乗せると、Tipが出現します。

<div>
<link rel="stylesheet" type="text/css" media="all" href="http://manaten.net/repos/pixel-tip/dst/pixel-tip.css" />
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script type='text/javascript' src="http://manaten.net/repos/pixel-tip/dst/pixel-tip.js"></script>
<script type='text/javascript'>
$(function() {
  var tips = [];
  $('#demo-icons img').each(function(_, img) {
    var $img = $(img);
    var tip = new PixelTip($img.attr('src'));
    tips.push(tip);
    $img.hover(function() {
      var pos = $img.offset();
      $.each(tips, function(_, v) { v.hide(); });
      tip.show(pos.left-10, pos.top-10);
    }, null);
  });
});
</script>
</div>

<div id="demo-icons">
<img src="http://manaten.net/wp-content/uploads/2013/04/articuno_anim_.gif" alt="articuno_anim_" width="48" height="48" class="alignnone size-full wp-image-230" />

<img src="http://manaten.net/wp-content/uploads/2013/04/arcanine_anim_.gif" alt="arcanine_anim_" width="48" height="48" class="alignnone size-full wp-image-231" />

<img src="http://manaten.net/wp-content/uploads/2013/04/elfoon_anim_.gif" alt="elfoon_anim_" width="48" height="48" class="alignnone size-full wp-image-293" />

<img src="http://manaten.net/wp-content/uploads/2013/04/glaceon_anim_.gif" alt="glaceon_anim_" width="48" height="48" class="alignnone size-full wp-image-294" />

<img src="http://manaten.net/wp-content/uploads/2013/04/gastrodon_anim_.gif" alt="gastrodon_anim_" width="48" height="48" class="alignnone size-full wp-image-295" />

<img src="http://manaten.net/wp-content/uploads/2013/04/gardevoir_anim_.gif" alt="gardevoir_anim_" width="48" height="48" class="alignnone size-full wp-image-296" />

<img src="http://manaten.net/wp-content/uploads/2013/04/quilava_anim_.gif" alt="quilava_anim_" width="48" height="48" class="alignnone size-full wp-image-299" />

<img src="http://manaten.net/wp-content/uploads/2013/04/charlotte.gif" alt="charlotte" width="48" height="48" class="alignnone size-full wp-image-292" />

</div>

# 各部説明

![詳細](http://manaten.net/wp-content/uploads/2014/03/pixel-tip_detail.png)

# 使い方
動作には[jQuery](http://jquery.com/)が必要です。こんな感じのJSを書いて、画像に対してTipを表示するイベントハンドラを登録してやります。

```html
<link rel="stylesheet" type="text/css" media="all" href="http://manaten.net/repos/pixel-tip/dst/pixel-tip.css" />
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script type='text/javascript' src="http://manaten.net/repos/pixel-tip/dst/pixel-tip.js"></script>
<script type='text/javascript'>
$(function() {
  var tips = [];
  $('img').each(function(_, img) {
    var $img = $(img);
    var tip = new PixelTip($img.attr('src'));
    tips.push(tip);
    $img.hover(function() {
      var pos = $img.offset();
      $.each(tips, function(_, v) { v.hide(); });
      tip.show(pos.left-10, pos.top-10);
    }, null);
  });
});
</script>
```

# よくなったこと

## Tip中のアイコンのCSSへの埋め込み
[compass](http://compass-style.org/) を用いて、CSSで使っている虫眼鏡とかのアイコンはCSSにBase64で埋め込むようにしました。以前公開していたものは画像を表示してなかったので(自サイトのものは、別CSSでアイコン当てていた)、ちょっとかっこよくなりました。

[compass](http://compass-style.org)は```inline-image```を使うことで、CSSへの画像埋め込みをコンパイル時にやってくれます。

## JavaScriptのソースコード分割記述
[browserify](http://browserify.org/)を用いることで、JavaScriptを分割して記述できるようになりました([こんなかんじ](https://github.com/manaten/pixel-tip/tree/master/src/coffee))。

[browserify](http://browserify.org/)はnodejsのCommonJSスタイルで分割記述したJavaScriptのファイルをひとまとめにし、ブラウザで実行可能にしてくれるツールです。また、依存しているnpmのモジュールもブラウザで実行可能にしてくれたりします。

クライアントサイドJavaScriptをモジュール分割して記述方法として、他に[concat](https://github.com/gruntjs/grunt-contrib-concat)を使って単につなげて上げる方法や、[RequireJS](requirejs.org)による分割が有りますが、concatは当然構造を持っていないので、ある程度複雑なプロジェクトには不適ですし、RequireJSは非同期的にモジュールを読み込むのが主目的(全部ひとまとめにする方法もあるようですが)で、単に開発のしやすさのためにモジュール分割してる場合には微妙かなと思っていた次第で、個人的にはこれが一番しっくりきています。

## ソースコードをCoffeeScriptに
最近[CoffeeScript](http://coffeescript.org/)使いまくってますが、便利です。JavaScriptの良い所はそのままにシンタックスの改善がされているので、純粋にJavaScriptが好きな僕にとってはとても書きやすいです。ただ、短く書きすぎてしまいがちなので、あくまで個人開発のツールとして便利といった印象。

## これらいろいろをGruntで一括してビルド
結構色々させてますが、これらは[Grunt](http://gruntjs.com/)が全て自動でやってくれます。便利。
