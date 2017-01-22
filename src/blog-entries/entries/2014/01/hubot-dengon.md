Hubotでいない人に伝言を残すスクリプト
=====

<a href="http://manaten.net/wp-content/uploads/2014/01/dengon_bot.png"><img src="http://manaten.net/wp-content/uploads/2014/01/dengon_bot.png" alt="dengon_bot" width="370" height="116" class="aligncenter size-full wp-image-887" /></a>

IRCを使っていると、用がある人がいなくてメッセージを残せなくて困ることがたまにあったので作りました。

<!-- more -->


# スクリプト
```javascript
formatDate = (d, formatStr)->
  a = {
    Y: d.getFullYear,
    m: ()-> ('0'+(d.getMonth()+1)).slice(-2),
    d: ()-> ('0'+d.getDate()).slice(-2),
    H: ()-> ('0'+d.getHours()).slice(-2),
    i: ()-> ('0'+d.getMinutes()).slice(-2),
    s: ()-> ('0'+d.getSeconds()).slice(-2)
  }
  formatStr.replace /[YmdHis]/g, (l)-> a[l].apply(d)


module.exports = (robot) ->
  robot.enter (msg) ->
    for targetUser, dengons of robot.brain.data.dengon[msg.envelope.room]
      # idにアンスコや数字がついたりすることがあるのでできるかぎり考慮(もちろん完全ではない)
      if new RegExp("#{targetUser}?[\d_]*").test msg.envelope.user.name
        msg.send "#{formatDate new Date(dengon.time), 'm/d H:i'} <#{dengon.sender}> #{dengon.message} #{msg.envelope.user.name}" for dengon in dengons
        delete robot.brain.data.dengon[msg.envelope.room][targetUser]
        robot.brain.save()

  robot.hear /^伝言 ([^\s]*) (.*)/, (msg)->
    target = msg.match[1]
    message = msg.match[2]

    robot.brain.data.dengon = {} if !robot.brain.data.dengon
    robot.brain.data.dengon[msg.envelope.room] = {} if !robot.brain.data.dengon[msg.envelope.room]
    robot.brain.data.dengon[msg.envelope.room][target] = [] if !robot.brain.data.dengon[msg.envelope.room][target]
    robot.brain.data.dengon[msg.envelope.room][target].push {
      message: message,
      sender: msg.envelope.user.name,
      time: new Date().getTime()
    }
    robot.brain.save()
    robot.adapter.notice msg.envelope, "伝言を受け付けました #{msg.envelope.user.name}"
```
[github](https://github.com/manaten/mana_bot/blob/master/scripts/dengon.coffee)

## やってること

* ```伝言 (ユーザ名) (メッセージ)```という発言を拾いRedisに保存しておく。
* ユーザが入ってきたのをハンドリングし、Redisに保存してあるのと一致(IRCはクライアントによってユーザ名に_や数字がついたりするので、一応それを考慮)した場合にそれを発言する


そんなに難しいことをしていませんが、メッセージの残せないIRCでは便利に使えそうです。
