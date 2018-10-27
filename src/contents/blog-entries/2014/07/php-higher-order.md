<!--
title: PHPで利用できる配列操作系高階関数
date:  2014-07-28 12:00
categories: [PHP, プログラミング]
-->

![](http://manaten.net/wp-content/uploads/2014/07/higher-order_2.png)

PHP5.3からクロージャが利用可能であり、高階関数を積極的に利用して簡潔なコードを心がけたいのですが、一度調べておかないと意外な関数が利用可能であることに気づかなかったりするのでまとめ(個人的によく使う順)。

<!-- more -->

# array_map
- [PHP: array_map - Manual](http://php.net/manual/ja/function.array-map.php)

高階関数で最も代表的と思われるもの。map-reduceのmap。配列の各要素をクロージャを用いたマッピングを行い、別の配列を作ります。

```php
<?php
$prices = [100, 200, 300];
$taxInPrices = array_map(function($price) {
  return $price * 1.08;
}, $prices);
var_dump($taxInPrices);

// array(3) {
//   [0]=> float(108)
//   [1]=> float(216)
//   [2]=> float(324)
// }
```
他には、DB取得結果など、エンティティの配列みたいな形になっている時に、特定要素の配列がほしい場合などにも使います。

```php
<?php
$entities = [
  ['id' => 25, 'name' => 'ピカチュウ'],
  ['id' => 26, 'name' => 'ライチュウ'],
  ['id' => 27, 'name' => 'サンド']
];
$names = array_map(function($entity) {
  return $entity['name'];
}, $entities);
var_dump($names);

// array(3) {
//   [0]=> string(15) "ピカチュウ"
//   [1]=> string(15) "ライチュウ"
//   [2]=> string(9) "サンド"
// }
```


また、PHPの```array_map```の面白いところは、引数配列を複数指定することが可能であり、その場合はScalaで言うところの```zipWith```関数の動きになるところ。これはつい最近まで知りませんでした。

複数の配列の同じインデックスの要素それぞれを引数に取り、それらの要素を用いて値を返すクロージャを使うことで、複数配列を一つにまとめられます。

```php
<?php
$lastNames = ['高坂', '南', '園田'];
$firstNames = ['穂乃果', 'ことり', '海未'];

$fullNames = array_map(function($lastName, $firstName) {
  return "$lastName $firstName";
}, $lastNames, $firstNames);
var_dump($fullNames);

// array(3) {
//   [0]=> string(16) "高坂 穂乃果"
//   [1]=> string(13) "南 ことり"
//   [2]=> string(13) "園田 海未"
// }
```


# array_reduce
- [PHP: array_reduce - Manual](http://php.net/manual/ja/function.array-reduce.php)

これもよく使うやつ。map-reduceのreduce。配列の各要素を順番にクロージャに適用し、適用結果を返します。
Scalaでいうところの畳み込み(```fold```)。

```php
<?php
$nums = [1, 2, 3, 4, 5];
$prod = array_reduce($, function($c, $v) {
  return $c * $v;
}, 100);
var_dump($prod);
// int(12000)
```

応用例として、多重配列の平坦化の実装。
```php
<?php
function array_flatten(array $a) {
  return array_reduce($a, function($c, $v) {
    return array_merge($c, $v);
  }, []);
}
var_dump(array_flatten([ [1,2,3], [4,5,6], [1,2] ]));
// array(8) {
//   [0]=> int(1)
//   [1]=> int(2)
//   [2]=> int(3)
//   [3]=> int(4)
//   [4]=> int(5)
//   [5]=> int(6)
//   [6]=> int(1)
//   [7]=> int(2)
// }
```

reduceの引数になっているクロージャは実質何もしていないので、次のようにも書けます(文字列をcallableとして渡すのに是非があるけども。)。
```php
<?php
function array_flatten(array $a) {
  return array_reduce($a, 'array_merge', []);
}
```

### 第三引数の省略に関して注意

[マニュアル](http://php.net/manual/ja/function.array-reduce.php) を読むと第三引数を省略することでScalaの```reduce```の動きになりそうなことが書いてあるが(JavaScriptの[reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)では引数の有無でそうなる)、実際は最初の値として```null```が渡ってくるだけのようであるので注意。基本的に第三引数の省略は行わないほうがいいと思います。

```php
<?php
$nums = [1, 2, 3, 4, 5];
$prod = array_reduce($nums, function($c, $v) {
  var_dump($c);
  return $c * $v;
});
// NULL
// int(0)
// int(0)
// int(0)
// int(0)

var_dump($prod);
// int(0)
```

JavaScriptでは、省略時はScalaでいう```reduce```の動きになります。
```javascript
[1,2,3].reduce(function(a, b){ return a * b; })
>> 6
[1,2,3].reduce(function(a, b){ return a * b; }, 100)
>> 600
```

このことにこのエントリを書くことで気づけたのでよかったです。

# usort 系
- [PHP: usort - Manual](http://php.net/manual/ja/function.usort.php)
- [PHP: uasort - Manual](http://php.net/manual/ja/function.uasort.php)
- [PHP: uksort - Manual](http://php.net/manual/ja/function.uksort.php)

配列ソート時の比較方法をクロージャとして指定できるものです。
連想配列の場合にキーを保持するuasort、キーを用いてソートするuksortという亜種があります。

オリジナルの構造をソートしたい場合がよく使うシチュエーションかと思います。

```php
<?php
$entities = [
  ['id' => 26, 'name' => 'ライチュウ'],
  ['id' => 27, 'name' => 'サンド'],
  ['id' => 25, 'name' => 'ピカチュウ'],
];
usort($entities, function($a, $b) {
  return $a['id'] - $b['id'];
});
var_dump($entities);

// array(3) {
//   [0]=> array(2) {
//     ["id"]=> int(25)
//     ["name"]=> string(15) "ピカチュウ"
//   }
//   [1]=> array(2) {
//     ["id"]=> int(26)
//     ["name"]=> string(15) "ライチュウ"
//   }
//   [2]=> array(2) {
//     ["id"]=> int(27)
//     ["name"]=> string(9) "サンド"
//   }
// }
```


ユニークな応用例として、[東方キャラソート](http://mainyan.sakura.ne.jp/thsort.html)のようなユーザー選択によるキャラクターソートを、クロージャをユーザー入力にすることで実装できます。

```php
<?php
$charList = [
  '秋 静葉',
  '秋 穣子',
  '鍵山 雛',
  '河城 にとり',
  '犬走 椛',
  '東風谷 早苗',
  '八坂 神奈子',
  '洩矢 諏訪子'
];
usort($charList, function($a, $b) {
  echo "どちらが好き？ (a/b)\na. $a\nb. $b\n";
  while (!in_array($input = trim(fgets(STDIN)), ['a', 'b']));
  return $input === 'a' ? -1 : 1;
});
var_dump($charList);

// ...
// どちらが好き？ (a/b)
// a. 八坂 神奈子
// b. 秋 静葉
// b
// array(8) {
//   [0]=> string(10) "鍵山 雛"
//   [1]=> string(10) "秋 穣子"
//   [2]=> string(10) "犬走 椛"
//   [3]=> string(16) "河城 にとり"
//   [4]=> string(16) "洩矢 諏訪子"
//   [5]=> string(10) "秋 静葉"
//   [6]=> string(16) "八坂 神奈子"
//   [7]=> string(16) "東風谷 早苗"
// }
```

ソートがどう動いているのか体感できるので、意外と面白いです。

# array_filter
[PHP: array_filter - Manual](http://php.net/manual/ja/function.array-filter.php)

各要素に対して真偽値を返すクロージャをとり、配列をフィルタリングします。

```php
<?php
$nums = [1, 2, 3, 4, 5];
$filtered = array_filter($nums, function($v) {
  return $v % 2 === 0;
});
var_dump($filtered);
// array(2) {
//   [1]=> int(2)
//   [3]=> int(4)
// }
```
これもこのエントリのために動かして気づいたのですが、配列の添字がそのままになるみたいです。通常は気にする必要はなさそうですが、罠になることもありそうです。


# array_diff 系
- [PHP: array_udiff - Manual](http://php.net/manual/ja/function.array-udiff.php)
- [PHP: array_udiff_assoc - Manual](http://php.net/manual/ja/function.array-udiff-assoc.php)
- [PHP: array_udiff_uassoc - Manual](http://php.net/manual/ja/function.array-udiff-uassoc.php)
- [PHP: array_diff_uassoc - Manual](http://php.net/manual/ja/function.array-diff-uassoc.php)
- [PHP: array_diff_ukey - Manual](http://php.net/manual/ja/function.array-diff-ukey.php)

[array_diff](http://php.net/manual/ja/function.array-diff.php) の比較方法をクロージャで指定できる版([array_udiff](http://php.net/manual/ja/function.array-udiff.php)) と、その亜種。2つの配列の差分を計算します。

亜種は、比較対象を値ではなくキーにするだとか、なんとかでいろいろあるけど多すぎてよくわからない。ドキュメント読んでもイマイチイメージつきづらい。ので実行してみる。

```php
<?php
$as = [
  'A' => 'aaa',
  'B' => 'bbb',
  'C' => 'ccc',
];
$bs = [
  'B' => 'www',
  'C' => 'ccc',
  'D' => 'ddd',
];

echo "== array_udiff ==\n";
var_dump(array_udiff($as, $bs, function($a, $b) {
  echo "$a, $b\n";
  return strcmp($a, $b);
}));

echo "== array_udiff_assoc ==\n";
var_dump(array_udiff_assoc($as, $bs, function($a, $b) {
  echo "$a, $b\n";
  return strcmp($a, $b);
}));

echo "== array_udiff_uassoc ==\n";
var_dump(array_udiff_uassoc($as, $bs, function($a, $b) {
  echo "1: $a, $b\n";
  return strcmp($a, $b);
}, function($a, $b) {
  echo "2: $a, $b\n";
  return strcmp($a, $b);
}));

echo "== array_diff_ukey ==\n";
var_dump(array_diff_ukey($as, $bs, function($a, $b) {
  echo "$a, $b\n";
  return strcmp($a, $b);
}));

echo "== array_diff_uassoc ==\n";
var_dump(array_diff_uassoc($as, $bs, function($a, $b) {
  echo "$a, $b\n";
  return strcmp($a, $b);
}));
```

結果
```
== array_udiff ==
bbb, aaa
ccc, bbb
ccc, www
ddd, ccc
www, ccc
ddd, www
aaa, ccc
aaa, bbb
bbb, ccc
bbb, ccc
ccc, ccc
array(2) {
  ["A"]=>
  string(3) "aaa"
  ["B"]=>
  string(3) "bbb"
}
== array_udiff_assoc ==
bbb, www
ccc, ccc
array(2) {
  ["A"]=>
  string(3) "aaa"
  ["B"]=>
  string(3) "bbb"
}
== array_udiff_uassoc ==
2: B, A
2: C, B
2: C, B
2: D, C
2: A, B
2: A, C
2: A, D
2: B, B
1: bbb, www
2: C, B
2: C, C
1: ccc, ccc
array(2) {
  ["A"]=>
  string(3) "aaa"
  ["B"]=>
  string(3) "bbb"
}
== array_diff_ukey ==
B, A
C, B
C, B
D, C
A, B
A, C
A, D
B, B
C, B
C, C
array(1) {
  ["A"]=>
  string(3) "aaa"
}
== array_diff_uassoc ==
B, A
C, B
C, B
D, C
A, B
A, C
A, D
B, B
C, B
C, C
array(2) {
  ["A"]=>
  string(3) "aaa"
  ["B"]=>
  string(3) "bbb"
}

```

まず、実行するまで誤解していたのですが、array_diffでは2つの配列の差を計算しますが、この差というのは片方にしかないものという意味ではなく、 **第一引数にのみ存在するもの** という意味のようです。亜種のドキュメントには曖昧に書いてありますが、[array_diff](http://php.net/manual/ja/function.array-diff.php) のマニュアルにはしっかり書いてありました。

それぞれ実行結果を見てみると、

- array_udiffでは値を比較している
- array_udiff_assocでは、キーが一致するもののみコールバック関数を用いた値比較をしている
- array_udiff_uassocでは、キーを第四引数のコールバック関数で比較し、一致したものは次に値を第三引数のコールバック関数で比較している(第三引数が値比較、第四引数がキー比較用の関数)。
- array_diff_ukey では、キーを比較している
- array_diff_uassocでは、キーをコールバック関数で比較したのち、値を通常の方法で比較しているっぽい(結果値から判断)

また、もうひとつ重要な性質として、結果値の要素は第一引数の配列のものになるようです(第一引数にのみ存在する要素なので当然)。

正直、動作がちょっと紛らわしいため、これらを用いるよりはarray_mapなどで変換した配列を通常のarray_diffで比較するほうがわかりやすいコードが書けるのではと思います。


# array_intersect 系

- [PHP: array_uintersect - Manual](http://php.net/manual/ja/function.array-uintersect.php)
- [PHP: array_uintersect_assoc - Manual](http://php.net/manual/ja/function.array-uintersect-assoc.php)
- [PHP: array_uintersect_uassoc - Manual](http://php.net/manual/ja/function.array-uintersect-uassoc.php)
- [PHP: array_intersect_uassoc - Manual](http://php.net/manual/ja/function.array-intersect-uassoc.php)
- [PHP: array_intersect_ukey - Manual](http://php.net/manual/ja/function.array-intersect-ukey.php)

[array_intersect](http://php.net/manual/ja/function.array-intersect.php)の愉快な仲間たち。先述したarray_diffと同じ種類の亜種がいます(キーで比較するか、値で比較するか、両方で比較するか、比較にコールバックを使うか)。

第一引数の配列の要素をすべて持つ第二引数以降の配列を返すようです。あまり使い道が思いつかないため割愛。

# array_walk, array_walk_recursive
- [PHP: array_walk - Manual](http://php.net/manual/ja/function.array-walk.php)
- [PHP: array_walk_recursive - Manual](http://php.net/manual/ja/function.array-walk-recursive.php)

配列の要素すべてをコールバック関数に渡すarray_walkと、再帰的にそれを行うarray_walk_recursive。
値を返す関数ではないので、コールバック関数は副作用を伴う必要があります。
そういう意味で、array_walkはforeachやarray_mapを使わずにこちらを使う意味があまり見出せません。
再帰処理をするarray_walk_recursiveはまだ使える場面はありそうですが、やはり副作用を伴うというところで敬遠したいです。

# おわり
以上です。
後半どうでも良い関数が続いてしまったため、モチベーションが下がり、array_filterまでは一ヶ月前に書いていたのに投稿が遅れてしまった･･･。
