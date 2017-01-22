<!--
title: Hubot-slackでDMを送る
date:  2015-1-xx 12:00
categories: [Hubot, メモ, CoffeeScript]
-->

![Hubot-slackでDMを送る](http://manaten.net/wp-content/uploads/2014/04/hubot.gif)

[hubot-slack](https://github.com/slackhq/hubot-slack)
でDMを送るスクリプトを書きたかったが、
DMを送る方法が用意されてるにもかかわらず、単純に呼ぶだけでは利用できなかったので呼び方のメモ。

※ hubot-slackが利用するnode-slack-clientのバージョンが1.2時点での内容です。今後改善されると思います。


<!-- more -->

# コード

```javascript
module.exports = (robot) ->
  sendDM = (slackUserName , message) ->
    userId = robot.adapter.client.getUserByName(slackUserName)?.id
    return unless userId?

    if robot.adapter.client.getDMByID(userId)?
      robot.send {room: slackUserName}, message
    else
      robot.adapter.client.openDM userId
      # openをハンドルする手段がなさそうなので、仕方なくsetTimeout
      setTimeout =>
        robot.send {room: slackUserName}, message
      , 1000

  robot.respond /dm ([^\s]+) (.+)/, (msg) ->
    userName = msg.match[1]
    message = msg.match[2]
    sendDM userName, message
```
[slackhq/hubot-slack](https://github.com/slackhq/hubot-slack)の [sendメソッド](https://github.com/slackhq/hubot-slack/blob/master/src/slack.coffee#L194)を読むと、`channel = @client.getChannelGroupOrDMByName envelope.room`などとなっており、一見DMもユーザー名をチャンネル名のように渡せば送れそうではありますが、
hubot-slack が内部で利用している、[slackhq/node-slack-client](https://github.com/slackhq/node-slack-client) のコードを読むと、[getChannelGroupOrDMByName](https://github.com/slackhq/node-slack-client/blob/master/src/client.coffee#L275)は中で[getDMByName](https://github.com/slackhq/node-slack-client/blob/master/src/client.coffee#L253)を呼んでおり、このメソッドは予めフィールドに持ってるDMオブジェクトを返すだけであることがわかります。
既にDMオブジェクトが存在するユーザーに対しては`robot.send {room: slackUserName}, message`でDMを送ることができますが、
そうでないユーザーには `robot.adapter.client.openDM userId` でDMオブジェクトを生成してやる必要があります。
しかし、このメソッドはAPI通信をするが外部からコールバックを設定できないため、しょうがなく`setTimeout`で1秒待ったら得られただろうという仮定で1秒待った後に`send`してます。


# 動作確認
![hubot_slack_dm_1.png](http://manaten.net/wp-content/uploads/2015/01/hubot_slack_dm_1.png)
↓
![hubot_slack_dm_2.png](http://manaten.net/wp-content/uploads/2015/01/hubot_slack_dm_2.png)

OK。

会社でGithubの自分のプルリクにコメントが付いたり、メンションが飛んだりしたらslack上でも本人だけにDMで通知するようにしています。
DMは他人に関係ない情報を気兼ねなく流せるため、応用が効きそうです。


# 参考リンク
- [slackhq/hubot-slack](https://github.com/slackhq/hubot-slack)
- [slackhq/node-slack-client](https://github.com/slackhq/node-slack-client)
