HubotでIRCのログをとる
=====
<a href="http://manaten.net/wp-content/uploads/2014/01/hubot-irc-log.png"><img src="http://manaten.net/wp-content/uploads/2014/01/hubot-irc-log.png" alt="hubot-irc-log" width="623" height="96" class="aligncenter size-full wp-image-889" /></a>

常駐しているbotにログの残らないIRCのログをとってもらいます。

<!-- more -->

```javascript
fs = require 'fs'
mkdirp = require 'mkdirp'
LOG_ROOT = '/var/log/mana_bot'

module.exports = (robot) ->
  robot.adapter.bot.on 'raw', (message)->
    switch message.rawCommand
      when 'NOTICE', 'PRIVMSG', 'PART', 'JOIN', 'TOPIC'
        channel = message.args[0].replace /^#/, ''
        time = new Date
        year = time.getFullYear()
        month = time.getMonth()+1
        date = time.getDate()
        
        logContent = (JSON.stringify {
          command: message.rawCommand,
          args: message.args,
          time: time,
          nick: message.nick
        }) + ",\n"
        dir = "#{LOG_ROOT}/#{channel}/#{year}/#{month}"
        
        log = ()->
          fs.appendFile "#{dir}/#{date}", logContent, console.log.bind console
        fs.exists(dir, (exists)->
          if exists
            log()
          else
            mkdirp dir, log
        )
```
[github](https://github.com/manaten/mana_bot/blob/master/scripts/log.coffee)

robot.hearだと、privmsgしか取得できないため、hubotのメソッドではなく、アダプタが利用しているnode-ircのonメソッドを用います。このメソッドでrawイベントをハンドリングすると、すべてのIRCコマンドが取得できるので、 コマンドの種類でswitch-whenし、記録したいコマンドだけファイルに書き出してあげます。

ほんとはログは完全なJSONで吐きたかったけれど、JSONは追記には向かなかったので、各行をJSON.stringifyしたものをカンマ改行区切りでつないでいくというややキモい形式で吐かせています。
