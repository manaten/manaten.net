<!--
title: Hubotでasync functionを使う
date:  2017-03-21 12:00
categories: [javascript,hubot]
-->

![Hubotでasync functionを使う](http://manaten.net/wp-content/uploads/2014/04/hubot.gif)

最近(と言っても一ヶ月前ですが･･･)[node7.6.0がリリースされ](https://nodejs.org/en/blog/release/v7.6.0/)、
`--harmony-async-await` をつけなくても `async/await` が利用可能となりました。
これにより、非同期処理を行うスクリプティングがより行いやすくなった(スクリプティング以上の用途ならばどうせ `babel`
を使うためそこまで影響はない)と感じています。

[hubot](https://hubot.github.com/)などのbotプログラミングも
定常タスクを楽にするためのスクリプティングの一種であり、用途上連携サービスのAPIをたくさん叩くため、
恩寵を存分に得ることができます。この記事ではhubotで `async/await` を使う例を紹介します。


<!-- more -->

# 準備

手元の開発環境及び、botの動作環境のnodeを `7.6.0` 以上にします。
僕は手元では[nodebrew](https://github.com/hokaccha/nodebrew)を使っていますので、
`nodebrew install-binary 7.6.0` `nodebrew use 7.6.0` とします。

動作環境は、herokuや[dokku](https://github.com/dokku/dokku)を使っている場合は
`package.json` の `engines` フィールドに `7.6.0` を指定してやるだけです。楽ちん。

```json
{
  "name": "myapp",
  "description": "a really cool app",
  "version": "1.0.0",
  "engines": {
    "node": "7.6.0"
  }
}
```

余談ですが、個人のhubotや他のアプリケーションを気楽にデプロイする環境としてdokkuはとても便利です。
プライベートサーバーにインストールしておくととても捗ります。

# コーディング

コーディングと言っても、特に工夫することはありません。
hubotのハンドラにおもむろにasync functionを渡すだけです。
hubotはasync functionに対応しているわけではないのですが、単にasync functionの終了を誰も待たない結果に
終わるだけです。もともとhubotはハンドラ内で非同期処理をバリバリ行う思想であるため、それで問題はありません。

さて、ここでは `async/await` によって記述が楽になる例として、かんたんなスクリプトを書いてみます。


## hubot-slackで指定した相手にDMを送る

slackのDMを指定したユーザーに送るだけのスクリプトです。
DMは [API Methods | Slack](https://api.slack.com/methods) の、
`im.open` で送る相手をユーザーIDで指定してDMを開き、得られるチャンネルIDを `chat.postMessage` することで送ることができます。

hubot-slackの4.0.0くらいから、 `robot.adapter.client` 経由でslackのAPIを叩くことができるようになりました
([参照](https://slackapi.github.io/hubot-slack/basic_usage#general-web-api-patterns))。
加えて、叩くことのできるAPIのメソッドは、コールバックを指定しない場合はPromiseを返します。
よって、async/await を使い、次のようにして引数のユーザーにDMを送るスクリプトが書けます。

```javascript
robot.respond(/dm:send\s+([^\s]+)\s+(.+)/, async res => {
  const username = res.match[1];
  const text = res.match[2];

  const user = robot.adapter.client.rtm.dataStore.getUserByName(username);
  if (!user) {
    return;
  }

  const im = await robot.adapter.client.web.im.open(user.id);
  await robot.adapter.client.web.chat.postMessage(im.channel.id, text, {
    as_user: true
  });
  res.send('ok!');
});
```

動かすと次のような感じです。

![hubot-slackで指定した相手にDMを送る - 1](http://manaten.net/wp-content/uploads/2017/03/hubot_async_1.png)

![hubot-slackで指定した相手にDMを送る - 2](http://manaten.net/wp-content/uploads/2017/03/hubot_async_2.png)


## Github APIをたたき、指定したユーザーのそれぞれのpull request一覧を取得する

次の例は、githubのAPIを叩いて指定したユーザーのすべての所有リポジトリのpull requestを一覧するスクリプトです。
github APIの `repos.getForUser` でユーザーのリポジトリ一覧を取得した後、それぞれのリポジトリに対して `pullRequests.getAll`
でプルリクエストを取得することで実現できます。

```javascript
robot.respond(/github:repos\s+(.+)/, async res => {
  const username = res.match[1];
  const repos = (await github.repos.getForUser({username})).data;

  for (const repo of repos.filter(repo => repo.open_issues_count > 0)) {
    const pulls = (await github.pullRequests.getAll({
      owner: username,
      repo : repo.name,
      state: 'open'
    })).data;

    if (pulls.length > 0) {
      const text = pulls.map(pull =>
        `:octocat: *${username}/${repo.name}* <${pull.html_url}|${pull.title}>`
      ).join('\n');
      await robot.adapter.client.web.chat.postMessage(res.envelope.room, text, {
        as_user     : true,
        unfurl_links: false
      });
    }
  }
});
```

動かすと次のような感じです。

![Github APIをたたき、指定したユーザーのそれぞれのpull request一覧を取得する](http://manaten.net/wp-content/uploads/2017/03/hubot_async_3.png)



※これらのスクリプトは要点だけを抜き出しているため、実際はエラー処理などがあったほうが望ましいです。
スクリプトの全体は、[manaten/AsyncHubotExample](https://github.com/manaten/AsyncHubotExample) に置いてあります。


# 参考リンク

- [manaten/AsyncHubotExample](https://github.com/manaten/AsyncHubotExample)
- [Node v7.6.0 (Current) | Node.js](https://nodejs.org/en/blog/release/v7.6.0/)
- [HUBOT](https://hubot.github.com/)
- [hokaccha/nodebrew: Node.js version manager](https://github.com/hokaccha/nodebrew)
- [dokku/dokku: A docker-powered PaaS that helps you build and manage the lifecycle of applications](https://github.com/dokku/dokku)
- [Heroku Node.js Support | Heroku Dev Center](https://devcenter.heroku.com/articles/nodejs-support#specifying-a-node-js-version)
- [API Methods | Slack](https://api.slack.com/methods)
- [Slack | Basic Usage](https://slackapi.github.io/hubot-slack/basic_usage#general-web-api-patterns)
