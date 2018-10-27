<!--
title: すべてのリポジトリでGithubのpull requestをfetchする設定
date:  2016-06-xx 12:00
categories: [git,github]
-->


![すべてのリポジトリでgithubのpull requestをfetchする設定](http://manaten.net/wp-content/uploads/2015/05/octcat.gif)


[githubのプルリクエストのコミットをローカルにfetchする方法](https://gist.github.com/piscisaureus/3342247)はよく知らてていますが
(知らない人は是非設定をオススメします。特にコードレビューでレビュー相手がfork先からプルリクエストを出している場合でも対象コミットを取得できるため便利です）、
この方法はリポジトリごとに毎回設定する必要があり多少面倒です。

そこでこの設定を、
```sh
git config --global --add remote.origin.fetch '+refs/pull/*:refs/remotes/pr/*'`
``` 
としてグローバルに設定してみたところ、普通に動きすべてのローカルリポジトリでプルリクエストをfetchしてくれるようになりました。

![](http://manaten.net/wp-content/uploads/2016/06/fetch_pr.gif)

便利です。


# 気になること

remoteの設定をglobalに記述するのはあまり聞いたことがなく若干の不安はあります。
この状態でリポジトリの `remote.origin.fetch` の値を取ると、

```sh
>> git config --get-all remote.origin.fetch
+refs/pull/*:refs/remotes/pr/*
+refs/heads/*:refs/remotes/origin/*
```

となっており、リポジトリのconfigに記述した時と同じになっているため、問題ないのかな？とは思います。
今のところはGithub以外のリポジトリへのfetchも問題なく快適です。

もし詳しい方がいれば、補足していただけると助かります。

# 参考リンク

- [Checkout github pull requests locally](https://gist.github.com/piscisaureus/3342247)

