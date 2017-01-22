![](http://manaten.net/wp-content/uploads/2014/07/responsive_2.png)

はてなブログのデザイン設定画面を久しぶりにいじってみたら、スマホのデザインをいじる機能と、PCのデザインをレスポンシブデザインとしてスマホでも利用できる機能が追加されていたので、このブログをレスポンシブデザインにしました。

<!-- more -->
![](http://manaten.net/wp-content/uploads/2014/07/hatena_responsive.png)

デザイン設定にスマホアイコンが追加されており、スマホのデザインのカスタマイズ及びレスポンシブデザインの利用が出来るようになっていました。


[スマートフォンで閲覧したときにも「PCのデザインを使用」するオプションを追加しました【追記あり】 - はてなブログ開発ブログ](http://staff.hatenablog.com/entry/2014/05/28/163627)

5月末から利用可能であったようです。

このブログのデザインは、[前回の記事](http://blog.manaten.net/entry/hatena-theme-bootstrap)で説明したとおり、[Bootstrap](http://getbootstrap.com/)で作られているので、レスポンシブデザインになっています。

また、[ここ](http://help.hatenablog.com/entry/theme/custom-theme#responsive)で説明されているとおり、デザインCSSに
```css
/*
  Responsive: yes
 */
```
というコメントを記述することで、
```html
<meta name="viewport" content="width=device-width"/ >
```
といったmetaタグが挿入され、Viewportの設定がされます。

以下のように、スマートフォンでも同じテーマを利用できるようになりました。
![](http://manaten.net/wp-content/uploads/2014/07/Evernote-Camera-Roll-20140705-221952.jpg)
