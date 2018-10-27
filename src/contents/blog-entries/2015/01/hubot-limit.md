<!--
title: Hubotでbotの反応する部屋やユーザーに制限を設ける
date:  2015-1-xx 12:00
categories: [Hubot, メモ, CoffeeScript]
-->

![Hubotでbotの反応する部屋やユーザーに制限を設ける](http://manaten.net/wp-content/uploads/2014/04/hubot.gif)


少し前に [slackでbotアカウントが作れる](http://slackhq.com/post/104688116560/rtm-api)ようになり、それまで [IRC Gateway](https://slack.zendesk.com/hc/en-us/articles/201727913-Connecting-to-Slack-over-IRC-and-XMPP) で動作させていたSlack上のbotを [hubot-slack](https://github.com/slackhq/hubot-slack) を利用したbotアカウントによるbotに乗り換えました。

ところでslack上でhubotを動かす場合、IRCと比べ次の2点が不便です。

1. 必ずgeneralチャンネルに入ってしまうため、generalでの関係ない発言に反応してしまうおそれがある
2. notice発言がないため、botをbotに反応させない手段としてnotice発言を利用できない

そこで、特定の条件でbotの発言を抑制するスクリプトを書きました。

<!-- more -->

# コード

```javascript
_ = require 'lodash'

module.exports = (robot) ->
  robot.hear /.*/, (msg) ->
    if _.contains ['manaten', 'some_admin_user'], msg.envelope.user.name
      return

    unless _.contains ['ok_room_1', 'ok_room_2'], msg.envelope.room
      msg.finish()

    if /bot/.test msg.envelope.user.name
      msg.finish()
```

こんなかんじのスクリプトを `1_room_limit.coffee` のような名前でscripts下に配置します。

## 解説

スクリプトはアルファベット順に読まれるので(参照: [hubot/scripting.md](https://github.com/github/hubot/blob/master/docs/scripting.md#script-load-order))、他のどのスクリプトよりも先に読まれる名前をつけます。
これで他のスクリプトより先にこのスクリプトが呼ばれることになるため、
 `.*` ですべての発言をhearし、条件に当てはまる場合は `msg.finish()`を呼び以後のlistenerが反応しないようにします。
(`msg.finish()`についてはドキュメントが殆ど無いですが、[CHANGELOG](https://github.com/github/hubot/blob/master/CHANGELOG.md#v210)に書いてあります。)

今回は、

1. 予め指定したadminユーザーならば無条件で反応
2. 予め指定したOKなチャンネルでなければ反応しない
3. ユーザー名にbotという文字列を含む場合は反応しない

というルールにしました(実際は配列の部分は [node-config](https://github.com/lorenwest/node-config) から取得するようにし、カスタマイズ可能にしてあります。)。


# 参考リンク

- [lorenwest/node-config](https://github.com/lorenwest/node-config)
- [hubot/scripting.md at master · github/hubot](https://github.com/github/hubot/blob/master/docs/scripting.md#script-load-order)
- [add msg.done() · Issue #200 · github/hubot](https://github.com/github/hubot/issues/200)
- [slackhq/hubot-slack](https://github.com/slackhq/hubot-slack)
- [Several People Are Typing — A new Slack API: The inevitable rise of the bots](http://slackhq.com/post/104688116560/rtm-api)
- [Connecting to Slack over IRC and XMPP – Slack Help Center](https://slack.zendesk.com/hc/en-us/articles/201727913-Connecting-to-Slack-over-IRC-and-XMPP)

