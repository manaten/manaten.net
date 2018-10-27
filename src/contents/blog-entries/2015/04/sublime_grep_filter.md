<!--
title: SublimeTextでgrep, sort, uniq, diff, sedっぽいテキスト操作
date:  2015-4-xx 12:00
categories: [SublimeText]
-->

![SublimeTextでgrep, sort, uniq, diff, sedっぽいテキスト操作](http://manaten.net/wp-content/uploads/2015/04/sublime.gif)

SublimeTextでもコマンドラインで行うような、grep, sort, uniq, diff, sed といたコマンド相当の操作ができます。
ログファイルをSublimeTextで眺めてる時などに便利なのでご紹介。


<!-- more -->

# 正規表現によるフィルタ

![grep](http://manaten.net/wp-content/uploads/2015/04/sublime_filter.gif)

[FilterLines](https://github.com/davidpeckham/sublime-filterlines)というパッケージを入れることで、簡易grepのような正規表現による行フィルタを行うことができます。
例では値段が3桁の行のみにフィルタしています。
アクセスログで日付やリファラなどで絞るときに便利です。

# 行のソート

![sort](http://manaten.net/wp-content/uploads/2015/04/sublime_sort.gif)

ソートはSublimeTextが[標準機能として](http://www.sublimetext.com/docs/commands)持っています。
単純に行をソートすることしかできないため、[sortコマンド](http://itpro.nikkeibp.co.jp/article/COLUMN/20060227/230887/)には劣ってしまいますが、閲覧中のファイルをその場でsortしたくなる時がまれにあるので、知っていると便利な機能です。


# 重複する行の削除

![uniq](http://manaten.net/wp-content/uploads/2015/04/sublime_uniq.gif)

こちらも[標準機能のpermuteLinesのメソッドとして](http://www.sublimetext.com/docs/commands)利用できます。他にもshuffleやreverseなども利用できるようですが、僕個人ではuniqueが圧倒的に利用シチュエーションが多いです。
置換をした後の重複除去を手軽に行えます。

# ファイルの行比較

![diff](http://manaten.net/wp-content/uploads/2015/04/sublime_diff.gif)

[Sublimerge](http://www.sublimerge.com/)というパッケージの一機能として利用できます。
他にもいろいろ機能があるようですが、僕はdiffツールとして主に利用しています。
開いてるタブと別のタブのdiff、開いてるタブとクリップボードのdiffを行うことができ、
わざわざファイルに保存する必要がなく、新規タブに貼り付ければ比較ができるため、簡単な比較を行いたい場合は[diffコマンド](http://itpro.nikkeibp.co.jp/article/COLUMN/20060228/231144/)よりも使い勝手が良いです。

# 置換

![sed](http://manaten.net/wp-content/uploads/2015/04/sublime_sed.gif)

SublimeTextの標準機能として、Ctrl+Hで置換バーを表示し、正規表現による置換も行えます。
これはSublimeTextに限らず、ほとんどのテキストエディタで利用可能な機能ですが、
正規表現にある程度慣れて、マッチした箇所を参照した置換を使えるようになると
使い勝手が一気に向上し、図のようなスペース区切りの列の除去などもでき頻繁に利用します。

# まとめ

再利用性･オプションによるカスタマイズ性ではコマンドラインに軍配が上がりますが、
ファイル保存の必要がなく、エディタを眺めながら気軽に操作できるという点でSublimeTextが優っています。
SublimeTextは10万行程度のファイルであれば問題なく軽快に動作するため、なんだかよくわからないエラーログの調査などでいろいろ試してみたいときに知っていると便利です。

最近テキストエディタ界隈だと[Atom](https://atom.io/)の勢いが強く感じ、
JS好きな僕も何度か乗り換えようかと思ったのですが、
デカめのファイルを開いた時の軽快さはSublimeTextのほうが圧倒的で、
この記事で紹介した機能も相まってデフォルトのエディタはまだしばらくSublimeTextなのかなと思っている次第です。
