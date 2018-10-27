<!--
title: direnvを使って複数のgitコミッタ名を切り替える
date:  2015-5-xx 12:00
categories: [git,memo]
-->

![direnvを使って複数のgitコミッタ名を切り替える](http://manaten.net/wp-content/uploads/2015/05/octcat.gif)

例えば会社のPCでこっそり個人的なリポジトリで作業してgithubにpushする場合、
うっかり会社用のgitコミッタ名(本名@会社名.co.jp みたいなアドレスとか)で
commit/pushしてしまい、紐付けるつもりのなかったネットの人格と本名/会社名が紐付いてしまう
というのは皆が恐れるところであると思います。

そこで、[direnv](https://github.com/zimbatm/direnv) を利用するといい感じに切り替えられることができたので、共有いたします。


<!-- more -->

# direnv

[zimbatm/direnv](https://github.com/zimbatm/direnv)

あるディレクトリに `.envrc` というファイルを置いておくと、そのディレクトリ以下に cd した時に `.envrc` の内容の環境変数が読み込まれるという代物です。

例えば、

```
- home
  ├ .envrc  // export SOME_ENV=hogehoge
  ├ c
  └ a
    ├ .envrc  // export SOME_ENV=fugafuga
    └ b
```

という構造の場合、 home直下やhome/cでは SOME_ENV=hogehogeとなり、
home/aやhome/a/bの下ではSOME_ENV=fugafugaとなります。


# GIT 環境変数

環境変数 `GIT_COMMITTER_NAME` 、`GIT_COMMITTER_EMAIL` 、`GIT_AUTHOR_NAME` 、`GIT_AUTHOR_EMAIL` を設定することで、.gitconfigで設定したコミッタ名を環境変数で上書きすることができます。

[Git - Environment Variables](http://git-scm.com/book/es/v2/Git-Internals-Environment-Variables#Committing)
> which uses these environment variables as its primary source of information, falling back to configuration values only if these aren’t present.


# 運用

個人用の作業をするディレクトリを作り、以下の様な内容の .envrc を配置し、個人用のリポジトリはそこ以下にのみcloneするようにします。

```sh
export GIT_COMMITTER_NAME="manaten_kojin"
export GIT_COMMITTER_EMAIL="kojin@manaten.net"
export GIT_AUTHOR_NAME="manaten_kojin"
export GIT_AUTHOR_EMAIL="kojin@manaten.net"
```

こうすることで、個人用のレポジトリでは個人用のコミッタ名でcommitすることができます。

こんな感じに動きます。

![direnvを使って複数のgitコミッタ名を切り替える](http://manaten.net/wp-content/uploads/2015/05/direnv_git.gif)

いい感じです。

direnvは他にも応用効きそうですね。


# 参考リンク

- [zimbatm/direnv](https://github.com/zimbatm/direnv)
- [direnvを使おう - Qiita](http://qiita.com/kompiro/items/5fc46089247a56243a62)
- [Git - Environment Variables](http://git-scm.com/book/es/v2/Git-Internals-Environment-Variables#Committing)
