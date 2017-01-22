<a href="http://manaten.net/wp-content/uploads/2014/02/winphp4.png"><img src="http://manaten.net/wp-content/uploads/2014/02/winphp4.png" alt="winphp4" width="490" height="272" class="aligncenter size-full wp-image-927" /></a>

Windows上で使っている[SublimeText](http://www.sublimetext.com/) の [SublimeLinter](https://github.com/SublimeLinter/SublimeLinter3)でPHPのLintを行うためにWindows環境で[PHPMD](http://phpmd.org/)や[PHPCS](http://pear.php.net/package/PHP_CodeSniffer/redirected) を叩けるようにしたので、その時のメモです。

<!-- more -->

# PHPCS, PHPMDとは

[以前](http://blog.manaten.net/entry/645) もこのブログで触れたことが有ります。どちらもPHPのコードチェックを行うコマンドラインツールです。

[PHPCS](http://pear.php.net/package/PHP_CodeSniffer/redirected)は、PSR2などのコーディング規約に違反している箇所を教えてくれるツール。

[PHPMD](http://phpmd.org/)は不必要な変数宣言などの余分なコードや、長すぎる名前･行といった、いわゆるBuggyなコードを指摘してくれるツールです。

# SublimeLinterとは

[SublimeLinter](https://github.com/SublimeLinter/SublimeLinter3)は、定番テキストエディタの[SublimeText](http://www.sublimetext.com/)のプラグインで、外部プログラムを利用して編集中のコードのLintを行ってくれます。様々な追加プラグインがあり、それらを追加することで様々なLintを行うことが出来ます。

今回は、[SublimeLinter-php](https://github.com/SublimeLinter/SublimeLinter-php)、[SublimeLinter-phpmd](https://github.com/SublimeLinter/SublimeLinter-phpmd)、[SublimeLinter-phpcs](https://github.com/SublimeLinter/SublimeLinter-phpcs)の3つを入れ、PHPのLint環境を構築します。

# インストール

MacやUnix環境であれば、パッケージマネージャ経由でPHPとPEARを入れてしまえば、PEAR経由でPHPCSとPHPMDをインストールすることが出来、最も簡単だと思います。Windowsの場合は、そういったものはないので、サイトからダウンロードして頑張ります。また、PHPのパッケージマネージャとして[Composer](https://getcomposer.org/)を用いました。

## phpのインストール

[Windows向けのダウンロードページ](http://windows.php.net/download/)からバイナリをダウンロードできます。適当な箇所(僕はC:\phpにしました。)に解凍します。また、SublimeLinterがたたけるように、環境変数PATHに追加します。

<a href="http://manaten.net/wp-content/uploads/2014/02/winphp1.png"><img src="http://manaten.net/wp-content/uploads/2014/02/winphp1.png" alt="winphp1" width="495" height="460" class="aligncenter size-full wp-image-923" /></a>

コマンドプロンプトで```php -v```を叩き、正しくPATHが設定できていることを確認します。

```
C:\Users\mana>php -v
PHP 5.4.25 (cli) (built: Feb  5 2014 21:19:32)
Copyright (c) 1997-2014 The PHP Group
Zend Engine v2.4.0, Copyright (c) 1998-2014 Zend Technologies
```


パッケージのインストールにComposerを使いますが、opensslのモジュールが必須なので、php.iniでopensslを有効にします。php.iniの置き場所を ```php -i | findstr php.ini``` で確認し、(僕の場合はC:\Windowsでした)

```
C:\Users\mana>php -i | findstr php.ini
Configuration File (php.ini) Path => C:\Windows
```


そのパスに解凍したphpのディレクトリにある、php.ini-productionをphp.iniという名前に変更して配置し、opensslを有効にします。php_openssl.dllはphpのディレクトリのext下にあるので、extension_dirの値も設定してあげます。あと、このphp.iniはタイムゾーンが指定されておらず、いちいちWarningがでるので、これもついでに設定。

```
date.timezone = Asia/Tokyo
extension_dir = "ext"
extension=php_openssl.dll
```

```php -i | findstr openssl``` して、opensslモジュールが有効になっていることを確認します。

```
C:\Users\mana>php -i | findstr openssl
openssl
```

## composerのインストール

<a href="http://manaten.net/wp-content/uploads/2014/02/images.jpg"><img src="http://manaten.net/wp-content/uploads/2014/02/images.jpg" alt="images" width="206" height="245" class="aligncenter size-full wp-image-921" /></a>

次いで、[Composer](https://getcomposer.org/)をインストールします。
UnixではCurlするだけでインストールが可能ですが、
Windowsの場合は[ダウンロードページ](https://getcomposer.org/download/)の**Windows Installer**のところに、Windows向けのインストーラが有ります。便利ですね。

<a href="http://manaten.net/wp-content/uploads/2014/02/winphp2.png"><img src="http://manaten.net/wp-content/uploads/2014/02/winphp2.png" alt="winphp2" width="512" height="399" class="aligncenter size-full wp-image-924" /></a>

インストーラの指示に従えば問題なくインストールできると思います。途中、phpの場所を聞いてくるので、先ほど解凍した場所をしていしてやります。インストールが完了したら、```composer about```とタイプしてうまく参照できていることを確認します。

```
C:\Users\mana>composer about
Composer - Package Management for PHP
Composer is a dependency manager tracking local dependencies of your projects and libraries.
See http://getcomposer.org/ for more information.
```

また、Composerがインストールしたパッケージは、%USERPROFILE%\AppData\Roaming\Composer\vendor\bin (Windows7の場合)に実行可能なファイルが作られるので、こちらを環境変数PATHに追加しておきます。

<a href="http://manaten.net/wp-content/uploads/2014/02/winphp3.png"><img src="http://manaten.net/wp-content/uploads/2014/02/winphp3.png" alt="winphp3" width="456" height="400" class="aligncenter size-full wp-image-925" /></a>

## PHPMD, PHPCSのインストール

Composerが動くようになれば、これらのインストールはComposer経由で簡単に行えます。

```
composer global require squizlabs/php_codesniffer=*
composer global require phpmd/phpmd=*
```

以下のように、それぞれのコマンドが実行できれば問題なくインストールできています。

```
C:\Users\mana>phpcs --version
PHP_CodeSniffer version 1.5.2 (stable) by Squiz (http://www.squiz.net)

C:\Users\mana>phpmd --version
PHPMD @package_version@ by Manuel Pichler
```
これでSublimeLinterから利用する準備が整いました。

# SublimeLinterを入れる

これはSublimeText に [Package Controll](https://sublime.wbond.net/) が入っていれば一瞬です。[SublimeLinter](https://github.com/SublimeLinter/SublimeLinter3)、[SublimeLinter-php](https://github.com/SublimeLinter/SublimeLinter-php)、[SublimeLinter-phpmd](https://github.com/SublimeLinter/SublimeLinter-phpmd)、[SublimeLinter-phpcs](https://github.com/SublimeLinter/SublimeLinter-phpcs) の4つのパッケージをインストールしましょう。

あとはSublimeTextを再起動するだけで、Lintしてくれるようになっているはずです。

<a href="http://manaten.net/wp-content/uploads/2014/02/winphp4.png"><img src="http://manaten.net/wp-content/uploads/2014/02/winphp4.png" alt="winphp4" width="490" height="272" class="aligncenter size-full wp-image-927" /></a>

このように、unusedなローカル変数を怒ってくれたり、PSR2(特に設定していない場合のデフォルト)に反する箇所を怒ってくれたりします。

これで少しはマシなPHPライフを送れますね！