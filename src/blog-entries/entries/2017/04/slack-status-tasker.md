<!--
title: Slackのstatusをtaskerを使って自分の居場所によって自動変更する
date:  2017-04-17 12:00
categories: [slack,tasker]
-->

![slack status]()

先日、slackで [名前の横に自分のステータスを表示する機能](https://slackhq.com/set-your-status-in-slack-28a793914b98) がリリースされました。
これはDMを送ろうとしたときの入力欄などにも表示されるため、適切に設定すれば「まだ出社してないのにメンション飛ばされた」「有給休暇中なのにDM送られた」みたいな気まずい悲劇を回避するのに役立ちそうです。

ただ、有給休暇などの特別なイベントならともかく、毎日出社時・退社時にslackのstatusをマメに変更するのは少々面倒です。そこで、Androidアプリの [Tasker](https://play.google.com/store/apps/details?id=net.dinglisch.android.taskerm&hl=en) を使い、Android端末の位置情報から自動でslackのstatusを更新できるようにしてみました。

<!-- more -->

# Taskerとは

# Taskerの設定




# 参考リンク

- [Tasker](https://play.google.com/store/apps/details?id=net.dinglisch.android.taskerm&hl=en) - 様々な条件に基づいてタスクを実行できるAndroidアプリ
- [Tasker: Location Without Tears](http://tasker.dinglisch.net/userguide/en/loctears.html) - taskerの位置情報系イベントの消費電力・制度についてまとまっている
- [Set your status in Slack – Several People Are Typing — The Official Slack Blog](https://slackhq.com/set-your-status-in-slack-28a793914b98) - slackのstatus機能について
- [users.profile.set method | Slack](https://api.slack.com/methods/users.profile.set) - statusを変更するときに叩くAPIのドキュメント
