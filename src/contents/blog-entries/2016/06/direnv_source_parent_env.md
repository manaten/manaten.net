<!--
title: direnvで親階層の.envrcも読む
date:  2016-06-xx 12:00
categories: [direnv]
-->

以前、 [direnvを使って複数のgitコミッタ名を切り替える](http://blog.manaten.net/entry/direnv_git_account) というエントリにて
[direnv](http://direnv.net/) を紹介しました。

direnvは、



  * direnvで多階層の.envrcを読んでくれると思ってたら違った話
  * 
    * 読むのは一番近い.envrcだけ
    * 
      * workにGITの設定、リポジトリに固有設定ってやってたらgitの設定が読まれなくて社内でmanaten.netでコミットしてしまった(そんなつらくない)

    * source_env .. で多階層で読めるとある、が.envrcが親の位置を知ってないとダメでちょっと微妙
    * .direnvrcにsource_parent_env をつくった。一個上の階層から直近の.envrcを読む。
    * 
      * # 開発用設定
      * export NODE_ENV=test
      * export PATH=./node_modules/.bin:$PATH



