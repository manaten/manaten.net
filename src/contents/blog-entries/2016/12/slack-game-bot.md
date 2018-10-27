<!--
title: Slack上でインタラクティブに遊べるゲームを作るためのフレームワークを作った
date:  2016-12-24 12:00
categories: [javascript,slack,game]
-->


![Slack上でインタラクティブに遊べるゲームを作るためのフレームワークを作った](http://manaten.net/wp-content/uploads/2016/12/maze.gif)

この記事は [Slack Advent Calendar 2016](http://qiita.com/advent-calendar/2016/slack) 24日目の記事です。


<!-- more -->

半年ほど前に下のようなエントリを書きました。

[Slack上でインタラクティブに倉庫番を遊べるhubot-slack-soukobanを作った - MANA-DOT](http://blog.manaten.net/entry/hubot-slack-soukoban)

Slackのリアクション機能と編集機能を活用し、Slack上でインタラクティブにゲームを作るという趣旨の内容でした。
今回は、このようなゲームを汎用的に作るための [slack-game-bot](https://www.npmjs.com/package/slack-game-bot) というnpmパッケージを
(アドベントカレンダーのネタのために)作ったので紹介します。


# 概要

兎にも角にも、例を見ていただくのが早いです。

```javascript
const {Game, GameBot} = require('slack-game-bot');

class MyGame extends Game {
  getButtons() {
    return ['one', 'two', 'three'];
  }

  async initialize() {
    await this.draw('press button!');
  }

  async onPushButton(reactionType) {
    await this.draw(reactionType);
  }
}

new GameBot({
  myGame: MyGame,
}).run(process.env.SLACK_TOKEN);
```

上記のコードを(babelなど然るべき変換をしたのちに)実行すると、指定したトークンに紐づくSlackチームでbotが動き、以下のような挙動をします。

![mygame.gif (320×240)](http://manaten.net/wp-content/uploads/2016/12/mygame.gif)

このフレームワークは、自分でゲームを作るための抽象クラス `Game` と、 作ったGameをbot上で動かすための `GameBot` クラスから成ります。

## Gameクラス

`Game` クラスには抽象メソッド `getButtons`, `initialize`, `onPushButton` があり、それぞれを実装することでゲームを作ります。

`getButtons` はゲームで利用するボタンの配列を返すようにします。例では、 `['one', 'two', 'three']` を指定しているため、 `:one:`, `:two:`,
`:three:` の3つのボタンが(リアクションとして)描画されています。

`initialize` では初期化処理を記述し、最初の描画を `draw` メソッドを用いて行います。また、ここで `this` に対してゲームの初期状態をセットしておく
こともできます。

`onPushButton` はユーザーがボタンを押したときに発火し、押されたリアクションの種別と、押したユーザーの情報が得られます。
ここで、押されたボタンの内容に従って状態を書き換えた後に `draw` してあげることでインタラクティブなゲームを作ることができます。

## GameBotクラス

`GameBot` クラスに実装した `Game` を登録し、トークンを指定して `run` メソッドを実行することでbotが起動します。
botは、登録の際に指定したオブジェクトのキーと同一の文字列に反応し、そのゲームを開始します。
複数回反応した場合は別々に新規ゲームが開始されます。また、複数の `Game` を別々のキーに登録することも可能です。


# 例

[src/samples](https://github.com/manaten/slack-game-bot/tree/master/src/samples)
下に配置してあります。

## Janken

![janken.gif (320×240)](http://manaten.net/wp-content/uploads/2016/12/janken.gif)

乱数を使ったシンプルなじゃんけんゲームです。ユーザー名を利用するサンプルでもあります。

## Slot

![slot.gif (320×240)](http://manaten.net/wp-content/uploads/2016/12/slot.gif)

setTimeoutを使い、定期的に表示を書き換えることで実装したスロットゲームです。

## Soukoban

![soukoban.gif (320×320)](http://manaten.net/wp-content/uploads/2016/12/soukoban.gif)

[以前実装した倉庫番](http://blog.manaten.net/entry/hubot-slack-soukoban)
を移植したものです。ゲーム起動時に引数を受け付けるサンプルにもなっています。

## Maze

![maze.gif (320×320)](http://manaten.net/wp-content/uploads/2016/12/maze.gif)

自動生成された迷路をさまようだけのクソゲーです。

# 余談

Slackには [messages buttons](https://api.slack.com/docs/message-buttons) という、よりゲーム向け(に悪用できそうな)機能もあり、
当初こちらでボタンを実装しようと思ったのですが、ボタンのhookを受けるためのサーバーが必要なようであったため、手軽さにかけると思い
今回は見送りました。

もっと気軽に使えるようにならないかなあ。

# あとがき

奇しくも今日はクリスマス･イブとなります。みなさんクリスマスプレゼントは決まりましたか？
まだの方はSlack上で遊べるゲームをプレゼントしてみてはいかがでしょうか？
職場の生産性を低下させること間違いなしです。

Slack上でゲームを作ることのメリットですが、チャットに参加している全員が参加可能なゲームを作れるというのが大きいです。
たかが倉庫番でも、複数人が操作するとまた違った面白さが見えてきます。
Twitchポケモンのようなカオスなゲームを作れる可能性を秘めています。


※この記事の内容は突貫で作ったネタですので、フレームワークのくせに設計が美しくないだとか、テストがないだとかは勘弁してください＞＜。


# 参考リンク

- [slack-game-bot](https://www.npmjs.com/package/slack-game-bot)
- [manaten/slack-game-bot](https://github.com/manaten/slack-game-bot)
- [Slack上でインタラクティブに倉庫番を遊べるhubot-slack-soukobanを作った - MANA-DOT](http://blog.manaten.net/entry/hubot-slack-soukoban)
- [文字列置換により20行程度で実装する倉庫番ゲームのミニマム実装 - MANA-DOT](http://blog.manaten.net/entry/20_lines_soukoban)
