<!--
title: Slackのstatusをtaskerを使って自分の居場所によって自動変更する
date:  2017-04-17 12:00
categories: [slack,tasker]
-->

![slack status](http://manaten.net/wp-content/uploads/2017/04/slack-status-tasker-01.png)

先日、slackで [名前の横に自分のステータスを表示する機能](https://slackhq.com/set-your-status-in-slack-28a793914b98) がリリースされました。
これはDMを送ろうとしたときの入力欄などにも表示されるため、適切に設定すれば「まだ出社してないのにメンション飛ばされた」「有給休暇中なのにDM送られた」みたいな気まずい悲劇を回避するのに役立ちそうです。

![slack status](http://manaten.net/wp-content/uploads/2017/04/slack-status-tasker-02.png)

ただ、有給休暇などの特別なイベントならともかく、毎日出社時・退社時にslackのstatusをマメに変更するのは少々面倒です。そこで、Androidアプリの [Tasker](https://play.google.com/store/apps/details?id=net.dinglisch.android.taskerm&hl=en) を使い、Android端末の位置情報から自動でslackのstatusを更新できるようにしてみました。

<!-- more -->

# Taskerとは

スマートフォンの様々なイベントの発生時に予め指定したタスクを実行してくれるAndroidアプリです。
イベントは時間指定やディスプレイのオンオフといったベーシックなものから、位置情報や各種センサーなど様々なものが利用できます。
実行するタスクも、電話をかけるだとか、音量を下げるだとかいろいろなものがあります。

今回は、イベントとして｢特定のWifiに繋がったとき｣を、タスクとして｢httpのgetメソッド｣を利用してslackのAPIを叩き、
家のwifiに繋がったときにstatusを｢在宅中｣に、会社のwifiに繋がったときに｢出社中｣に、
どちらかのwifiから接続が切れたときに｢外出中｣に変更するようにしてみました。

# Taskerの設定

最終型として以下のような状態を目指します。

![slack status](http://manaten.net/wp-content/uploads/2017/04/slack-status-tasker-03.png)

自宅wifi用のprofileを作り、条件を満たしたときにslackのstatusを自宅に、条件から外れたときに
statusを外出中にします。他のprofileも同様です。

## タスクの作成

タスクは変えたいslackのstatusの個数分それぞれ作ります。tasksのビューで+ボタンを押してタスクを作ります。

![slack status](http://manaten.net/wp-content/uploads/2017/04/slack-status-tasker-04.png)

それぞれのタスクの中身は次のようになっています。

![slack status](http://manaten.net/wp-content/uploads/2017/04/slack-status-tasker-05.png)

ここではstatusを変えたいslack teamが2つあったのでhttp getを二回しています。
http getはNetカテゴリの中にあります。http getの内容はこんな感じです。

![slack status](http://manaten.net/wp-content/uploads/2017/04/slack-status-tasker-06.png)

[users.profile.set](https://api.slack.com/methods/users.profile.set) でstatusを変更することができます。
slack tokenを発行し、profileにJSONオブジェクトを与えています。
JSONオブジェクトの `status_text` に変更後のstatusの文字列を、 `status_emoji` に変更後のstatusの絵文字を指定します。

ここでhttp getの設定が正しいかどうかは、task editの画面で ▶ ボタンを
押すことで確認できます。指定したとおりにstatusが変更されればOKです。(slack apiは失敗しても200を返すためtaskerではエラーにならない点が少し罠です)

## profileの設定

profileタブに戻り、 + ボタンを押してシチュエーションごとにprofileを作っていきます。
Wifiの接続状態を使ったprofileは State -> Net -> Wifi connectedを使います。
Wifi connectedではSSIDとMACアドレスのどちらかを識別に利用できます。

![slack status](http://manaten.net/wp-content/uploads/2017/04/slack-status-tasker-03.png)

profileにはEnter taskとExit taskの2つのtaskを紐付けることができ、それぞれ、profileの条件を満たした時と条件から外れたときに実行するタスクです。
profileの設定を終えれば完了です。

## 動作確認

![slack status](http://manaten.net/wp-content/uploads/2017/04/slack-status-tasker-07.png)

通知領域にtaskerが常駐し、満たしているべきprofileの名前が表示されていればprofileの設定はOKです。
あとは、Wifiをオン・オフしてみてtaskerの表示が変わることと、slackのstatusが変化するかを確認します。

# 応用

上記のWifi接続状況によるstatusの変更に加えて、会社で充電中の場合は｢自席にいる｣、会社だけど充電中じゃない場合は｢会社にいるけど離席中｣みたいな
statusにするようにしてみました。
他にもたくさんのイベントを扱えるので、いろんなことができそうです。

# 気になってること

Wifi connectedのexit taskでhttp getを実行しているわけですが(上図の｢slack status 外出中｣)、
wifiが切れた瞬間は瞬間的にネットワークが存在してない状態になってしまい、http getが高確率で失敗してしまいます。
リトライが設定できればいいのですが、軽く調べた感じだととても面倒そうであったため、http getの前にwaitを15秒程度挟んでいます。
もっと良いやり方があったら教えていただきたいところ。

追記: 「外出中」へ変更する条件を「Wifiが切れたとき」ではなく、「モバイルに繋がったとき」にすると良さそうです。

# 参考リンク

- [Tasker](https://play.google.com/store/apps/details?id=net.dinglisch.android.taskerm&hl=en) - 様々な条件に基づいてタスクを実行できるAndroidアプリ
- [Tasker: Location Without Tears](http://tasker.dinglisch.net/userguide/en/loctears.html) - taskerの位置情報系イベントの消費電力・制度についてまとまっている
- [Set your status in Slack – Several People Are Typing — The Official Slack Blog](https://slackhq.com/set-your-status-in-slack-28a793914b98) - slackのstatus機能について
- [users.profile.set method | Slack](https://api.slack.com/methods/users.profile.set) - statusを変更するときに叩くAPIのドキュメント
