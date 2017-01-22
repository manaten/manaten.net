<a href="http://manaten.net/wp-content/uploads/2014/02/phalcon-22.png"><img src="http://manaten.net/wp-content/uploads/2014/02/phalcon-22.png" alt="phalcon-22" width="300" height="344" class="aligncenter size-full wp-image-928" /></a>

[先日書いたように](http://blog.manaten.net/entry/open-hack-day-2)、Yahooの[OpenHackDay](http://yhacks.jp/ohd2/)に参加し、そこでPHPのフレームワークとして[Phalcon](http://phalconphp.com/ja/)を利用したので、忘れないうちに使用感などを書いておきます。
(ちょっとしか触ってない上での感想なので、誤りなどあったら指摘お願いします。)

<!-- more -->

# Phalconとは

* サイト [Phalcon](http://phalconphp.com/ja/)
* PHPのモジュールとしてC言語で書かれたWebフレームワーク。そのため、フレームワーク部分は他のPHP製のPHP Webフレームワークよりも高速。という謳い。
  * それが事実かは、今回少ししか使ってないのでよくわからない。
* 専用のテンプレートエンジン｢Volt｣を内蔵している。
* コマンドラインからプロジェクト生成したりするための、[phalcon/devtools](https://github.com/phalcon/phalcon-devtools)というのがある。
* 名前とアイコンがかっこいい

個人的には最後のだけでもテンションが上ります。

今回のハッカソンで使ってみて、気になった点について幾つか紹介してみたいと思います。


# DI

Phalconでは、DB接続やセッション管理、View、ロガーなどはコンポーネントとして疎に提供されていて、DIオブジェクトを通してアクセスを行います。[くわしくはこのページに書いてあります](http://docs.phalconphp.com/en/latest/reference/di.html)。

DIオブジェクトへの設定は基本的に、アプリケーションのエントリポイントであるindex.phpで行います。
そして、最後にDIオブジェクトをApplicationに渡して、アプリケーションが実行されます。

```php
$di = new Phalcon\DI();

$di->set("db", function() {
    return new \Phalcon\Db\Adapter\Pdo\Mysql(array(
         "host"     => "localhost",
         "username" => "root",
         "password" => "secret",
         "dbname"   => "blog"
    ));
});

$application = new \Phalcon\Mvc\Application($di);
echo $application->handle()->getContent();
```

アプリケーション内で生成されるコントローラなどは、DIオブジェクトに注入したコンポーネントに同名のフィールドを通じてアクセスすることが出来ます。マジックメソッドで簡潔にアクセスできるのはクール。

```php
<?php

class HogeController extends \Phalcon\Mvc\Controller
{
    public function hogeAction()
    {
        $this->db->...;
    }
}
```
(コントローラでDBを直接触る、行儀の悪い例ですが例なので･･･)

個人的に、この設計には2つのメリットが有ると思います。

## エントリポイントでDIを全部出来てわかりやすい
アプリケーションの最初、index.phpを見れば利用しているコンポーネントがすべて把握できます。
外部依存をすべてDIの仕組みで注入してあげれば、ここを見るだけで外部依存をすべて把握できるため、長期的に見て保守性が優れていると思います。

## コンポーネントに対して疎な設計になるため、依存が弱く、テストもしやすい
各コンポーネントはDIオブジェクトでキー名を通してアクセスするのみです。
なので、DIオブジェクトに注入するオブジェクトを変えれば、簡単にあるコンポーネントへの依存を変更することが出来ます。
このことは、保守されなくなったコンポーネントを捨てて新しいものに乗り換えるときや、テストの時にモックに差し替えるときなどに力を発揮しそうです。

## デメリットなど
少し触っただけなのでなんともですが、依存が増えてくるとDIへの注入が長くなり、読みづらくなってしまいそうということ、外部依存を扱うためのコンポーネントが提供されていない場合に自分でコンポーネントを作ってあげないといけなそうな点の二点が気になりました。ですが、メリットと比べれば工夫次第で解決できる、些細な問題であると思います。


# view(Volt)
Viewには[Volt](http://docs.phalconphp.com/en/latest/reference/volt.html) というこれまたかっこいい名前のテンプレートエンジンが利用できます。こいつも、上記のDIオブジェクト経由でアクセスできます。

```php
class HogeController extends \Phalcon\Mvc\Controller
{
    public function indexAction()
    {
        $this->view->foo = 'FOO!';
    }
}
```

先述したDIの仕組みによって、コントローラ内では注入したviewにフィールドでアクセスでき、更にviewにアサインする変数もviewのフィールドとしてアサインできます。Phalconのこのようなマジックメソッドを利用した、コードが冗長にならないような仕組み(構文糖衣的な)は個人的に好きです。

テンプレート(Volt)側ではこんなふうに書きます。

```html
<html>
    <h1>{{ foo }}</h1>
</html>
```

Smartyなどと大体一緒ですね。ifやforなどの制御構文も利用可能です。

また、テンプレートの共通部分を実現する仕組みとして、継承の仕組みが有ります。
共通部分としたいテンプレートをbase.voltという名前で次のような内容で作ります。

```html
<!DOCTYPE html>
<html>
<div class="container" id="content">{% block content %}{% endblock %}</div>
</html>

```

この時、別のテンプレートで次のように書くことが出来ます。

```html
{% extends "base.volt" %}
{% block content %}
ほげほげほげ
{% endblock %}
```
このようにすることで、base.voltのblock content～endblockまでの中に、この場合は｢ほげほげほげ｣が展開されます。｢content｣の部分は任意の文字列です。

このようにして構造的なテンプレートの再利用が可能ですが、ひとつ躓いた点として、base.voltの方を更新しても、extendしているテンプレートのキャッシュがクリアされないという問題が有りました。ハッカソンの短い時間であったので解決方法は調べていませんが、ハマったのでメモとして残しておきます。



# devtool
また、[devtool](https://github.com/phalcon/phalcon-devtools)という[CakePHP](http://cakephp.jp/)のbake、[FuelPHP](http://fuelphp.com/)のoilに相当するツールが有ります。
標準では入っていませんが[Composer](https://getcomposer.org/)などでインストール可能です。

少ししか使っていませんが、以下の機能がありました。

* コマンドラインからプロジェクトのひな形を作成。
* Webtoolをインストールし、Webから各種操作が可能
  * コントローラ･モデルの作成
  * DBマイグレーション

今回時間がなかったため、上記機能が利用可能であることしか確かめていませんが、個人的にはDBマイグレーションがWeb上で利用できるのは便利そうだと感じています。


# まとめ

少ししか触ってないので異常となります。
個人的な感想としては、Cの拡張で書かれていることと、Phalconというちょっとチャラい名前から、イロモノフレームワークなのかなと最初に感じたのですが、他のフレームワークと比べて後発なだけあって使いやすさと保守性の両方からよく考えられたフレームワークなのかなと感じています。

業務などでは｢Cの拡張で書かれている｣という点がネックで利用しづらそうですが(周りの説得的な意味で)、機会があれば使ってみたいフレームワークです。