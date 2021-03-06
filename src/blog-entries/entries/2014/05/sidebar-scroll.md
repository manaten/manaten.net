![](http://manaten.net/wp-content/uploads/2014/05/scroll3.gif)

まとめブログなど、メインコンテントとサイドバーの2カラム構成で、メインコンテントが非常に長いサイトでよく見るサイドバーの動きで、スクロールしてサイドバーをすべて表示したら、その箇所からサイドバーをスクロールに追尾させるというものが有ります。

しかし、個人的には見栄え･サイドバーコンテンツの効果の2つの観点であまりよい方法でないと思っています。

そこで、より良いと考えている方法として、画像のようにメインとサイドバーのスクロール速度を変更し、両者が同時に末尾までスクロールするようにする方法を紹介します。

<!-- more -->

# 何故追尾サイドバーが良くないか

![](http://manaten.net/wp-content/uploads/2014/05/scroll4.gif)

画像は[痛いニュース](http://blog.livedoor.jp/dqnplus/)より。

## 見栄え･印象
｢最初は普通にスクロールできていたが、途中からついてくる｣ということから、多くの人は｢ **鬱陶しい** ｣｢ **うざい** ｣といった負の印象を感じると思います。もっとも、これは僕の主観ですので人に依りそうでは有ります。

## サイドバーのコンテンツの効果
より主観に依らない理由として、追尾型の場合、長いサイドバーのうち、ほとんど最下部しかユーザーの目に入れてもらえないという問題が有ります。

最下部のコンテンツだけが重要であれば問題ありませんが、例えばまとめブログでありがちな広告をひたすら並べている形式の場合(つまり、並べられたすべてのコンテンツが **平等な意味** を持っている場合)、理由もなく最下部のコンテンツだけ注目させるデザインは良いデザインとはいえません。

とはいえ、メインコンテントより短いサイドバーに対して、なにもしないというのは少々考えものです。
何故ならば、サイドバーが末尾までスクロールした後、その場所は完全な空白地帯となります。
特にまとめブログのようにメインコンテントが長い場合、その空白地帯は結構な頻度でユーザーの目にとまるはずで、非常にもったいないと言えます。

# 提案手法･サイドバーのスクロール速度を変える
![](http://manaten.net/wp-content/uploads/2014/05/scroll5.gif)

そこで僕が提案するのは、画像の左サイドバーように、メインコンテンツとサイドバーのスクロール速度を変更し、メインコンテンツがスクロールし終わるのと同時にサイドバーもスクロールし終わるようにするという手法です。これだと、ユーザー目線では追尾型よりも鬱陶しさを感じないし、サイドバー中のコンテンツも均等に見せることが出来ます。

## デメリット
対してデメリットとして、サイドバーのスクロール速度が通常より遅くなるため、サイドバーに注目したいユーザーが戸惑うという可能性は考えられます。

この問題はブログの種類にもよりますが、多くのブログではユーザーがサイドバーの方に注目してスクロールしたいことは稀であると考えられますし、スクロールの利便性が著しく落ちているわけではないため、メリットのほうが大きいのではと考えます。

# 実装
はてなブログの場合、JavaScriptで以下の様にします。
```javascript
  $(function() {
    var $target = $('#box2');
    $target.css({position: 'relative'});
    var offsetTop = $target.offset().top;
    $(window).on('load scroll resize', function() {
      var scroll = $(window).scrollTop();
      var scrollHeight = $(document.body).height() - $(window).height();
      var boxScrollHeight = $target.parent().height() - $target.height();
      $target.css({ top: scroll * boxScrollHeight / scrollHeight});
    });
  });
```

スクロール速度を変えたいサイドバー(はてなブログでは```#box2```)のpositionをrelativeとし、windowのスクロール時に同時にサイドバーもスクロールしてあげます。
スクロールさせる距離は、windowのスクロール可動域```scrollHeight```とサイドバーのスクロール可動域```boxScrollHeight```の比率を計算し、現在のwindowのスクロール距離にかけてあげて求めます。

他のブログでも、```$target```に代入する要素を変更することで対応できると思います。

スクロールごとに毎回計算を行っているのは、動的なコンテンツロードや window のリサイズによってサイドバーのサイズが変更される可能性を考慮しているためです。
僕のPCではスムーズにスクロールしたのですが、古いマシンで動作に問題があれば、この辺りは高速化可能です。


# デモ
2014/5/12 現在のこのブログに適用していますので、試してみてください。


# まとめ
いかがでしたでしょうか。
個人的には多くのまとめブログでは追尾型のサイドバーよりも、このようなサイドバーにしたほうが効果的なのではと考えています。

なにかご意見･ご感想などあれば是非コメントお願いします。
