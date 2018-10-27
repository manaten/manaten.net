![](http://manaten.net/wp-content/uploads/2014/05/hatestrap.png)

最近このブログのテーマを一新しましたが、その際に [Bootstrap](http://getbootstrap.com/) を利用しました。
はてなブログで Bootstrap を利用するために、[sass](http://sass-lang.com/) によるセレクタの継承、[uncss](http://davidwalsh.name/uncss) による不必要なセレクタの除去と一手間かけたので、その方法を紹介します。


<!-- more -->

# はてなブログのテーマで Bootstrap を使うために sass の extend を使う
はてなブログのテーマは、基本的に用意された html に対して当てる css をカスタマイズすることが出来るだけです。
Bootstrap を利用する場合、通常だと Bootstrap で用意されたクラスを html の要素に振っていくこととなると思いますが、予め html が用意されているため、それが出来ません。

そこで、[bootstrap-sass](https://github.com/twbs/bootstrap-sass) を利用して [sass](http://sass-lang.com/) でテーマ css を作り、Bootstrap のクラスをはてなのデザインを当てたい要素に **extend** させるという方法を取りました。

## sass の extendについて
sass のサイトの例より。
```css
.message {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

.success {
  @extend .message;
  border-color: green;
}
```
上記のような記述があった場合、```.message```クラスは｢灰色のボーダー、10pxのパディング、暗灰色の文字色｣を持ちます。対して```.success```クラスは message クラスの｢灰色のボーダー、10pxのパディング、暗灰色の文字色｣を継承し、更にボーダーの色を緑色にしたクラスとなります。
このように、既存のセレクタを新しい別のセレクタに継承させ使いまわすことができるのが、sass の **extend** 機能です。

よりくわしくは、sass のサイトの [Extend/Inheritance](http://sass-lang.com/guide#topic-7) の項を参照してください。

この機能を利用し、はてなブログのクラスにデザインを適応したい Bootstrap のクラスを継承させることで、はてなブログで Bootstrap を利用します。

# はてなブログのテーマで Bootstrap を利用する

## グリッド
Bootstrap の **[グリッドシステム](http://getbootstrap.com/css/#grid)** を利用することで、手軽にテーマをレスポンシブなグリッドレイアウトにできます。利用するためには、グリッドの親要素に```.row```を、グリッドの子にサイズに応じた```.col-md-n```を当ててやればよいです。はてなブログの場合、親は```#content-inner```、子は```#main```と```#box2```が相当するため、以下のように継承させました。

```css
#content-inner {
  @extend .row;
}
#main {
  @extend .col-md-9;
}
#box2 {
  @extend .col-md-3;
}
```

## ボタンやテーブルなどのコンポーネント
特に自分でデザインするつもりのない **コンポーネント** は、Bootstrap のものを使うのが手軽です。
特に明示的にクラスを指定しなくても利用できるものもありますが、明示的にクラスを指定する必要があるものは継承してあげます。

```css
#container {
  @extend .container;
}
.entry-content {
  table {
    @extend .table;
  }
}
.entry-header-menu {
  position: absolute;
  bottom: 0px;
  left: -60px;
  a {
    @extend .btn;
    @extend .btn-default;
  }
}
```
テーブル、コンテナ、ボタンなどなど。

## 値の変更
[Less variables](http://getbootstrap.com/customize/#less-variables) の値を変更することで Bootstrap をカスタマイズすることが出来ます。主にリンク色、背景色などを変更しました。
```css
$brand-primary: #476;
$body-bg: #FEFEFE;
$screen-lg: 1500px;
$font-family-sans-serif: 'Helvetica Neue', 'Helvetica', 'Arial', 'Hiragino Kaku Gothic Pro', 'Meiryo', 'MS PGothic', sans-serif;
```

# uncss による利用していないセレクタの除去
以上で Bootstrap を利用したはてなブログテーマを作成できますが、完成した css は Bootstrap の内容をすべて含むため、 **100kb以上** もあります。はてなブログのデザインにそのまま適応しようとすると、 **64kb** を超えるぶんがカットされてしまうようです。

そこで、[uncss](http://davidwalsh.name/uncss) を利用し、利用していないセレクタを削除しました。

## uncssとは
[uncss](http://davidwalsh.name/uncss) はページの内容から利用されていないセレクタを判別し、利用しているセレクタのみの cssファイル を出力してくれるツールです。今回は [grunt](http://gruntjs.com/) から利用できる、[grunt-uncss](https://github.com/addyosmani/grunt-uncss) を利用します。

## 利用方法･設定など
上記のテーマを作る過程で、ローカルでのスタイル確認用に[利用する要素をだいたい記述したhtmlファイル](https://github.com/manaten/wp-theme/blob/master/city-witch/html/hatena.html)を用意したので、そのファイル中で利用していないセレクタを削除してもらいます。

ただし、それでも必要なセレクタが削除されてしまうため、そのぶんは **ignore** オプションでパターン指定し、セレクタが消えないようにしました。

以下のような設定になりました。

```javascript
uncss:
 dist:
  options:
    ignore: [/entry-content/, /page-archive/, /page-about/, /#zenback/]
    stylesheets: ['../style.css']
  files:
    'style.css': ['html/hatena.html']
```

ほかにも compass のコンパイル、cssmin による小型化なども grunt にやらせています。
Gruntfile は[こんな感じ](https://github.com/manaten/wp-theme/blob/master/city-witch/Gruntfile.coffee)になりました。

最終的に css のサイズは **35kb** 程度まで抑えることが出来、はてなブログで利用できるようになりました。

# 完成
以上で、はてなブログで Bootstrap を利用したテーマを使えるようになりました。

![](http://manaten.net/wp-content/uploads/2014/05/bootstrap-theme.png)

今回作成したテーマのリポジトリは[こちら](https://github.com/manaten/wp-theme/tree/master/city-witch)に有ります(wordpress テーマとの間の子なので見づらいですが)。

# 参考記事
- [はてなブログテーマ制作の手引き](http://help.hatenablog.com/entry/theme/custom-theme)
- [Bootstrap](http://getbootstrap.com/)
- [bootstrap-sass](https://github.com/twbs/bootstrap-sass)
- [sass](http://sass-lang.com/)
- [uncss](http://davidwalsh.name/uncss)
- [grunt-uncss](https://github.com/addyosmani/grunt-uncss)
