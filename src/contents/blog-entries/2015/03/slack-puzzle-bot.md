<!--
title: Hubot-slack で絵文字でアニメーションする8パズルゲームができるbotを作った
date:  2015-3-xx 12:00
categories: [Hubot,Slack,CoffeeScript]
-->


![Hubot-slack で絵文字でアニメーションする8パズルゲームができるbotを作った](http://manaten.net/wp-content/uploads/2015/03/puzzle_demo.gif)

社内の[Slack](https://slack.com/)で後輩がSlackの[絵文字](https://slack.zendesk.com/hc/en-us/articles/202931348-Using-emoji-and-emoticons)にでかい絵を分割して登録し、パズルだとか言っていたので、なんとなく作りたくなってしまいHubot上で[8パズル](http://ja.wikipedia.org/wiki/15%E3%83%91%E3%82%BA%E3%83%AB)が出来るbotを作ってしまいました。

<!-- more -->

# できること

## 現在の状態を確認

![現在の状態を確認](http://manaten.net/wp-content/uploads/2015/03/puzzle_demo_check.gif)

コマンドなしでbotを呼ぶと現在のパズルの状態を表示します。

## パズルをシャッフル
![パズルをシャッフル](http://manaten.net/wp-content/uploads/2015/03/puzzle_demo_shuffle.gif)

shuffle でランダムに10手動かします。

## パズルを動かす
![パズルをシャッフル](http://manaten.net/wp-content/uploads/2015/03/puzzle_demo_move.gif)

u, d, l, r (それぞれup, down, left, rightに対応)を並べて打ち込むと、そのとおりにパズルを動かします。


## 絵柄を選んでパズルをリセット
![現在の状態を確認](http://manaten.net/wp-content/uploads/2015/03/puzzle_demo_reset.gif)

reset の後に絵柄(ここではことりちゃん)を指定すると絵柄をリセットしてくれます。


# コード

特に解説はしませんが、[hubot-slack](https://github.com/slackhq/hubot-slack) からアダプタ経由でAPIを呼び、投稿したメッセージを編集することを `async.eachSeries` で逐次的に呼ぶことでパズルをアニメーションさせています。

```javascript
# Description:
#  play puzzle.
#
# Dependencies:
#
#
# Configuration:
#
# Commands:
#  hubot                - 現在のパズルの状態を表示
#  hubot shuffle        - パズルをシャッフル
#  hubot reset <image>  - パズルをリセット。引数で絵柄を指定
#  hubot (↓|下|down|d)  - 下に移動
#  hubot (←|左|left|l)  - 左に移動
#  hubot (→|右|right|r) - 右に移動
#  hubot (↑|上|up|u))   - 上に移動
#
_ = require 'lodash'
async = require 'async'
config = require 'config'


class Puzzle
  constructor: (setting) ->
    @width = setting.width
    @height = setting.height
    @images = setting.images
    @current = [1...(@width * @height)].concat 0

  toString: ->
    _.chain(@current).map((e) => @images[e]).chunk(@width).map((e) -> e.join '').join("\n").value()

  shuffle: ->
    for i in [1..1000]
      @move ['u', 'l', 'd', 'r'][Math.floor(Math.random() * 4)]

  move: (command) ->
    spaceIndex = _.indexOf @current, 0

    if command.match /(↓|下|down|d)/
      if spaceIndex < @width
        return false
      newSpaceIndex = spaceIndex - @width

    else if command.match /(←|左|left|l)/
      if spaceIndex % @height == @width - 1
        return false
      newSpaceIndex = spaceIndex + 1

    else if command.match /(→|右|right|r)/
      if spaceIndex % @height == 0
        return false
      newSpaceIndex = spaceIndex - 1

    else if command.match /(↑|上|up|u)/
      if spaceIndex >= @width * (@height - 1)
        return false
      newSpaceIndex = spaceIndex + @width

    @current[spaceIndex] = @current[newSpaceIndex]
    @current[newSpaceIndex] = 0
    return true


module.exports = (robot) ->
  puzzles = {}
  getPuzzle = (msg) ->
    room = msg.envelope.room
    if puzzles[room]
      return puzzles[room]
    return puzzles[room] = new Puzzle config.kotori

  puzzleAnim = (msg, iteratee, iterator) ->
    puzzle = getPuzzle msg

    chid = robot.adapter.client.getChannelGroupOrDMByName(msg.envelope.room)?.id
    robot.adapter.client._apiCall 'chat.postMessage',
      channel: chid
      text: puzzle.toString()
      as_user: true
    , (res) ->
      oldMove = -1
      async.eachSeries iteratee
      , (i, done) ->
        try
          iterator puzzle, i
        catch e
          return done e
        robot.adapter.client._apiCall 'chat.update',
          channel: chid
          text: puzzle.toString()
          ts: res.ts
        , (res) -> done null
      , (err) ->

  robot.respond /reset\s*(.*)/, (msg) ->
    msg.finish()

    if config[msg.match[1]]?
      puzzles[msg.envelope.room] = new Puzzle config[msg.match[1]]
    else if msg.match[1] is ''
      msg.send "次のいずれかを指定 #{Object.keys(config).join(', ')}"
      return
    else
      msg.send "自分で作れ"
      return

    msg.send getPuzzle(msg).toString()


  robot.respond /shuffle/, (msg) ->
    msg.finish()

    oldMove = -1
    puzzleAnim msg, [0...10], (puzzle, i) ->
      rand = Math.floor(Math.random() * 4)
      for i in [0..3]
        move = (i + rand) % 4
        continue if oldMove is (move + 2) % 4
        if puzzle.move ['u', 'l', 'd', 'r'][move]
          break
      oldMove = move

  robot.respond /((↓|下|down|d|←|左|left|l|→|右|right|r|↑|上|up|u)+)/i, (msg) ->
    msg.finish()
    puzzleAnim msg
    , msg.match[1].match(/(↓|下|down|d|←|左|left|l|→|右|right|r|↑|上|up|u)/ig)
    , (puzzle, command) ->
      unless puzzle.move command
        msg.send 'そっちには移動できないよ'
        throw new Error


  robot.respond /.*/, (msg) ->
    msg.send getPuzzle(msg).toString()
```

以下の様な設定ファイルを用意し、configで読み込ませます。別途、Slack上で対応する絵文字を登録しています。

```yaml
kotori:
  width: 3
  height: 3
  images:
    - ':mu:'
    - ':kot_1:'
    - ':kot_2:'
    - ':kot_3:'
    - ':kot_4:'
    - ':kot_5:'
    - ':kot_6:'
    - ':kot_7:'
    - ':kot_8:'
    - ':kot_9:'
```

# 思ったこと

slackの編集をbotから叩きまくれば、もっと複雑なゲーム(インベーダーとか、ローグライクとか)でも作れそうで夢が広がりんぐだと思いました(Slackから怒られそう)。

![やはりSlackはパズルゲームプラットフォームだった](http://manaten.net/wp-content/uploads/2015/03/slack_puzzle_yahari.png)
