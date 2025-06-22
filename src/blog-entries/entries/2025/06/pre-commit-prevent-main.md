<!--
title: 【小ネタ】AIコーディングする場合、mainへのコミット禁止hookを書いておくと捗る
date:  2025-06-22 10:00
categories: [programming,tips]
-->

先週 [Claude Codeのお陰で積ん趣味プロが一週間で片付いた - MANA-DOT](https://blog.manaten.net/entry/claude-code-tsumipro) という記事で、 Claude Code で趣味プロを久々に楽しんでいることを書きました。以降も自宅ではClaude Codeを使いまくっていますし、会社ではCopilot Agentを使っています。これらAIコーディング時に [husky](https://typicode.github.io/husky/) などで以下のようなpre-commitでのmainブランチへのコミットを防止するとはかどります。

```sh
branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$branch" = "main" ]; then
  echo "Direct commits to main branch are not allowed."
  exit 1
fi
```

AIコーディングをしてるともはやブランチはコミット直前にAIに切らせるほうが事前に人間が名前を考えて切るよりも楽なのですが、この場合AIが作業中に勢い余ってmainにコミットしてしまうことがあり、これを防ぐためのhookです(一回、そのまま勝手にリモートのmainにpushされてしまい、それに気づいたAIがforce pushまでしようとしていたことがあった)。
もちろん作業開始時に作業内容を伝えてまずブランチを切らせてもいいですが、もはやそんな手間すら省略したいということです。

このhookを入れておけばAIはコミットが必要なときまずmainにコミットしようとしますが失敗し、このエラーメッセージを見て｢ブランチを切らないといけない｣と勝手に気づいてくれるため、そのまま適切な名前のブランチを切ってくれます。機械的に守れるだけでなく人間の手間が一つ減るので、考えることとやることの両方が減るのでおすすめです。

## 人間がどうしてもmainにコミットしたいとき

`git commit --no-verify` をすればpre-commitの実行をスキップできますが、 `npm version patch` など内部でコミットを行うコマンドの場合に困ります。huskyの場合は環境変数 `HUSKY` に `0` を指定することでもスキップできます。

```sh
HUSKY=0 npm version patch
```

自分はgithub actionsでバージョンコミットを作りたいときなどこの指定をしています。

このように、このhookを入れてもどうしても必要な場合の抜け道も存在するため、大きなデメリットにはなりづらいので入れ得です。
