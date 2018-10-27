---
title: ssh-agentのforwardを利用し、ホストマシンとローカルVMの非公開鍵を共有する
date:  2014-07-22 12:00
categories: [ssh, プログラミング]
---

![](http://manaten.net/wp-content/uploads/2014/07/ssh_2.png)

ssh-agentはずっと利用していたものの、agentのforwardという機能をつい最近まで知リませんでしたが、ローカルVM開発する上でかなり便利な機能でしたので書きます。

ssh-agentのforwardを利用すると、例えばVM開発する上で、ホストマシンの非公開鍵を使用してゲストマシンでsshを利用できたりします。特に、githubに複数の鍵登録する必要がなくなるのが便利。


<!-- more -->

# ssh-agentとは
リモートマシンにSSHでログインする際、最もよく利用する方式は[公開鍵認証](http://ja.wikipedia.org/wiki/%E5%85%AC%E9%96%8B%E9%8D%B5%E6%9A%97%E5%8F%B7)であると思います。
公開鍵認証では、あらかじめログイン先に登録しておく公開鍵と、ローカルマシンにおいておく非公開鍵のペアを用いますが、非公開鍵には通常パスフレーズを設定すると思います。

この、パスフレーズの入力を、シェルにログインした時の一回のみで済ませ、以後の入力を省いてくれるのが[ssh-agent](http://www.unixuser.org/~euske/doc/openssh/jman/ssh-agent.html)の仕事になります。Agentはパスフレーズ入力後に常駐し、以降の公開鍵認証が必要な場面で認証を代わりにやってくれるイメージです。


# forward-agentとは
ホストマシンの```ssh-agent```をログイン先のマシンからも参照できる```ssh```の機能です。
これを利用することで、githubなどいろいろなところに登録されたホストマシンの公開鍵を、ローカルVMからも利用することができ、開発の際に捗ります。

# 利用方法

## ssh-agent
```ssh-agent```はそのままコマンドで叩くと、プロセスに常駐しつつ以下の様な出力を行います。
```
SSH_AUTH_SOCK=/tmp/ssh-dX4G7kvpdh04/agent.9172; export SSH_AUTH_SOCK;
SSH_AGENT_PID=10776; export SSH_AGENT_PID;
echo Agent pid 10776;
```

```ssh```コマンドがagentを利用するために必要な環境変数をエクスポートしつつ、PIDの出力を行っています。これをシェルで評価することで、必要な環境変数を得るという寸法です。

```ssh-agent```が常駐している状態で、```ssh-add```コマンドを叩くことで、そのagentに鍵を覚えさせることができます。

シェル起動時にssh-agentを起動し、またssh-agentを複数のシェルで利用したいので、ファイルに出力し、これら環境変数がなかった場合にssh-agentを起動するように.zshrcに記述します。

[こちら](http://www.snowelm.com/~t/doc/tips/20030625.ja.html)を参考にしました。

```sh
SSH_AGENT_FILE="$HOME/.ssh-agent-info"
test -f $SSH_AGENT_FILE && source $SSH_AGENT_FILE
if ! ssh-add -l >& /dev/null ; then
  ssh-agent > $SSH_AGENT_FILE
  source $SSH_AGENT_FILE
  ssh-add
fi
```

これで、シェル起動時にagentが起動していればそのagentを利用し、起動していなければ起動して非公開鍵のパスフレーズの入力を求められるようになります。この状態でsshを実行すると、鍵のパスフレーズの入力を求められないことがわかります。

現在agentで管理されている鍵は、```ssh-add -l```することで参照できます。
```sh
2048 ### 省略 ### /home/mana/.ssh/id_rsa (RSA)
```

## Forward Agent
以上でagentが利用可能となっているシェルで、```ssh```の```-A```オプションまたは、sshのconfigで```ForwardAgent yes```を設定していると、ホストマシンの```ssh-agent```をログイン先でも利用できるようになります。

ログイン先で```ssh-add -l```することで、ホストと同じ鍵を参照できることがわかります。

```sh
2048 ### 省略 ### /home/mana/.ssh/id_rsa (RSA)
```

## tmuxとの兼ね合い
以上でログイン先でもssh-agentを利用できるのですが、このままではひとつ問題があります。

ログイン先でtmuxなどを利用している場合で既存のセッションにアタッチした場合、そこでは環境変数が以前のssh-agentを参照しており、結果としてssh-agentの利用ができなくなります。
この問題に関しては、[こちら](http://d.hatena.ne.jp/xabre/20130407/1365327582)が詳しかったのです。

結論から言うと複数ログインを考慮しないぶんには(今回はローカルVM想定なので)、ssh-agentのソケットをシンボリックリンクとして、tmuxからは常にそのシンボリックリンク経由で利用できるようにしてやれば良いようです。

それを加味すると、ssh-agentの起動スクリプトは次のようになりました。
```sh
AGENT_SOCK_FILE="/tmp/ssh-agent-$USER"
SSH_AGENT_FILE="$HOME/.ssh-agent-info"
if test $SSH_AUTH_SOCK ; then
  if [ $SSH_AUTH_SOCK != $AGENT_SOCK_FILE ] ; then
    ln -sf $SSH_AUTH_SOCK $AGENT_SOCK_FILE
    export SSH_AUTH_SOCK=$AGENT_SOCK_FILE
  fi
else
  test -f $SSH_AGENT_FILE && source $SSH_AGENT_FILE
  if ! ssh-add -l >& /dev/null ; then
    ssh-agent > $SSH_AGENT_FILE
    source $SSH_AGENT_FILE
    ssh-add
  fi
fi
```
```$SSH_AUTH_SOCK```が定義済みかつ、シンボリックリンクと異なる場合に、張り替えてあげるという処理を行います。

同じ.zshrcをホストマシンでもローカルVMでも利用したかったため、無理やり混ぜ込んだ形になりました。

# vagrantからの利用
vagrantの```vagrant ssh```でVMにログインする場合、以下の記述をVagrantFileに追加することでForwardAgentが利用できるようです。

```sh
config.ssh.forward_agent = true
```

# 参考リンク
- [SSH (1)](http://www.unixuser.org/~euske/doc/openssh/jman/ssh.html)
- [SSH-AGENT (1)](http://www.unixuser.org/~euske/doc/openssh/jman/ssh-agent.html)
- [SSH-ADD (1)](http://www.unixuser.org/~euske/doc/openssh/jman/ssh-add.html)
- [Using SSH Agent Forwarding | GitHub API](https://developer.github.com/guides/using-ssh-agent-forwarding/)
- [Makino Takaki's Page - 文書館 - Technical Tips - ssh-agent で快適 ssh 生活 (.ja)](http://www.snowelm.com/~t/doc/tips/20030625.ja.html)
- [ssh-agentの基本 - Qiita](http://qiita.com/yudoufu/items/82f752807893c63f06db)
- [tmuxとssh-agent - PF-X.NET Diary](http://d.hatena.ne.jp/xabre/20130407/1365327582)

