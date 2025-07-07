<!--
title: ブラウザ履歴をブックマークに無期限保存するchrome拡張機能｢Eternal-History｣をストア公開しました
date:  2025-07-07 10:00
categories: [プログラミング,chrome拡張機能,claude code]
-->

[Claude Codeのお陰で積ん趣味プロが一週間で片付いた - MANA-DOT](https://blog.manaten.net/entry/claude-code-tsumipro) でも紹介したChrome拡張機能をストア公開したので紹介します。

![Eternal History](https://manaten.net/wp-content/uploads/2025/07/eternal-history.gif)
[Eternal History on bookmarks - Chrome ウェブストア](https://chromewebstore.google.com/detail/eternal-history-on-bookma/bbajmicfgjljmbjpjbabgkiallplgjoa)

このChrome拡張機能は **Chromeの90日しか保持できない履歴を永続化** し、検索で使いやすくする拡張機能です。以下のような特徴があります。

- Chromeのhistory APIをもちいて、 **すべての履歴をブックマークに保持** する
  - 通常、Chromeの履歴は90日で消えてしまいますが、ブックマークに保存することで永続化します
- 新しいタブを置き換え、スクリーンショットのような **履歴閲覧 & 検索UIを提供**
  - ブックマークに保存した履歴を効率的にアクセスするためのUIを提供します
  - `site:` 、 `-` などのクエリを用いた検索ができます
  - 検索クエリを保存して、ショートカットとして利用することができます

一度開いたドキュメントへのアクセスを効率化するための拡張機能となっています。
会社で｢ドキュメントが色んなところにあり、一度見たあのドキュメントが見つからない！探すのに時間がかかる！｣ということが頻繁にあるため、その解決策として作りました。

もともと個人で作っていて作りかけで放置していたものを、[Claude Code](https://www.anthropic.com/claude-code)を使って完成させたものになります。

<!-- more -->

# Eternal Historyはどんなことができる？

## Chromeのhistory APIをもちいて、すべての履歴をブックマークに保持する

![すべての履歴をブックマークに保持する](https://manaten.net/wp-content/uploads/2025/07/eternal-history_1.png)

ページにアクセスしてChromeの履歴に追加されると、 **Eternal Historyは同じエントリをChromeのブックマークにも追加** します。
Chromeの履歴は通常90日で消えてしまいますが、ブックマークなのでこちらは永遠に消えません。

ブックマークを用いるため、Googleアカウントによって同期されますし、履歴と同じChromeの保存領域を用いることでプライバシーの不安も少ない仕様となっています。

## 新しいタブを置き換え、履歴閲覧 & 検索UIを提供

![履歴閲覧 & 検索UIを提供](https://manaten.net/wp-content/uploads/2025/07/eternal-history_2.png)

新しいタブをEternal Historyがブックマークに保存した履歴の閲覧UIと置き換えます。表示時点では最新3日分の履歴を表示します。

さらに、フォームに検索文字列を入力することで、 **その文字列をタイトルまたはURLに含む履歴のみに絞る** ことができます。こちらは保存されている履歴全体から検索します。

## `site:` 、 `-` などのクエリを用いた検索

![クエリを用いた検索](https://manaten.net/wp-content/uploads/2025/07/eternal-history_3.png)

`site:manaten.net` とすることで、URLにmanaten.netを含む履歴のみに、 `-manaten` とすることで、結果に `manaten` を含まない履歴のみに絞ることができます。

## 検索クエリを保存してショートカットとして利用できる

![検索UIのクエリを保存](https://manaten.net/wp-content/uploads/2025/07/eternal-history_4.png)

検索フォームの右端にある + ボタンを押すことで **そのクエリを保存することができ、ショートカットとして使う** ことができます。
よく見るサイト名(Githubなど)を入れておくと、一発でそのサイトの履歴に絞ったりできます。

## 注意点

ブックマークにすべての履歴を残す都合上、 **長期使用でブックマークのエントリ数が増え、Chromeが重くなる可能性があります** (未検証)。
もしそうなってしまった場合、ブックマークの｢Eternal History｣フォルダにすべての履歴が保存されているため、このフォルダを消すことで改善するはずです。

# なぜこの拡張機能を作ったか？

会社で働いていると、多くのドキュメントはブラウザでアクセスできますが、色んな場所に散っていて **｢数ヶ月前に見たあのドキュメント、どこだっけ･･･？｣** となってしまうことが多々あります。
特に昨今はいろいろな便利なツールがWeb上で利用できることもあり、ドキュメントと呼べるものはGoogle Drive、Confluenceのほか、FigmaやMIRO、Githubなど、様々なツール上に散っています。

そうした場合は、そのドキュメントは言及があったであろうSlackや議事録から検索を駆使して頑張って探す、ということを多くの人はしていると思います。
自分はそれに加えて、後でアクセスしそうなドキュメントはなるべく都度ブックマークしておき、Chromeのアドレスバーから検索可能な状態にするという予防的な対策をしています。
ただ、この｢ただブックマークするだけ｣だと一瞬見ただけのドキュメントをブックマークし忘れたりすることはあります。

そこで、｢もう会社では開いたページは全部保存しておけばいいんじゃないか？(= Chromeの履歴が無制限に残れば解決じゃない？)｣という発想に行き着きました。
Chromeの履歴を無制限化する方法を探したところ、 [History Trends Unlimited](https://chromewebstore.google.com/detail/history-trends-unlimited/pnmchffiealhkdloeffcdnbgdnedheme) という拡張機能が見つかりました。この拡張機能は独自領域にChromeの履歴を無制限に保存し、独自のUIから検索可能、という一見理想的なものでした。
しかし使ってみると、自分の用途における致命的な弱点として｢独自UIの検索機能が、日本語の部分一致検索ができない｣というものがありました。
英語でも単語が完全一致しないと検索できないようなので、保存時に部分一致検索可能な形で保存していない(=部分検索向けのインデックスを作成していない)のだと思いました。

他の履歴系の拡張機能を試してみることも考えたものの、仕事のブラウジング履歴というセンシティブなものを扱う以上、マイナーな拡張機能を利用するのにも積極的になれず、
いっそ自分で作ってしまうことにして生まれたのがこの拡張機能になります。

## ブックマークを用いた実装について

実装にあたり、Chromeの[historyAPI](https://developer.chrome.com/docs/extensions/reference/api/history)を用いれば履歴が増えるたびに保存処理を行うことができますが、取得した履歴の永続化先に悩まされることになりました。

Chrome拡張機能のローカルの永続化先としてメジャーなのは[indexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)か、[chromeのstorage API](https://developer.chrome.com/docs/extensions/reference/api/storage)です。
しかし｢最終的に全文検索したい｣という要件だと検索機能のないこれらのストレージでは、専用に検索のためのインデックスを独自に実装する必要があり、
インデキシングにも実行コストがかかるという問題がありました。
先述したHistory Trends Unlimitedは独自のストレージに保存しているようでしたが、その実装コストもやりたいことに対して高いと感じていました。

そこで、ブックマークを永続ストレージとしてしまおうというアイデアを思いつきます。
Chromeのブックマークはそもそも全文検索機能がついており、かなりの量でも安定して利用できる他、
Googleアカウントによる複数端末間の同期までついているため、｢履歴を永続化したい｣というモチベーションに対するライトな解決策として適しています。

# 最後に

自分の働くうえでの課題に対する解決した拡張機能なので、同じ問題を感じる人の役に立つ可能性はあります。
そういった方には是非試していただき、この拡張機能では至らないところや、バグなどの報告をいただけると嬉しいです。

履歴を扱う以上、プライバシー面が気になる方もいると思います。
権限的には、外部通信は一切許可せず、履歴APIとブックマークAPI、faviconのためのfavicon権限、設定保存のためのstorageAPIで完結するようにしています。

![Eternal Historyの権限](permissions.png)

また、[github](https://github.com/manaten/eternal-history)でソースコードを公開してますので、コードが読める方はこちらも確認していただけると良いと思います。

# 関連リンク

- [Eternal History on bookmarks - Chrome ウェブストア](https://chromewebstore.google.com/detail/eternal-history-on-bookma/bbajmicfgjljmbjpjbabgkiallplgjoa)
- [manaten/eternal-history: A Chrome extension make history unlimited and searchable.](https://github.com/manaten/eternal-history)
- [Claude Codeのお陰で積ん趣味プロが一週間で片付いた - MANA-DOT](https://blog.manaten.net/entry/claude-code-tsumipro)
