<!--
title: ブラウザ履歴をブックマークに無期限保存するchrome拡張｢Eternal-History｣をストア公開しました
date:  2025-07-07 10:00
categories: [プログラミング,chrome拡張,claude code]
-->

[Claude Codeのお陰で積ん趣味プロが一週間で片付いた - MANA-DOT](https://blog.manaten.net/entry/claude-code-tsumipro) でも紹介した、もともと作っててClaude Codeで完成させたChrome拡張をストア公開したので紹介します。

![Eternal History](https://manaten.net/wp-content/uploads/2025/07/eternal-history.gif)
[Eternal History on bookmarks - Chrome ウェブストア](https://chromewebstore.google.com/detail/eternal-history-on-bookma/bbajmicfgjljmbjpjbabgkiallplgjoa)

このChrome拡張はChromeの90日しか保持できない履歴を永続化し、検索機能で使いやすくする拡張です。以下のような特徴があります。

- Chromeのhistory APIをもちいて、すべての履歴をブックマークに保持する
  - 通常、Chromeの履歴は90日で消えてしまいますが、ブックマークに保存することで永続化します
- 新しいタブを置き換え、スクリーンショットのような履歴閲覧 & 検索UIを提供
  - `site:` 、 `-` などのクエリを用いた検索機能
  - 検索UIのクエリを保存してショートカットとして利用できる機能

主に仕事などで、一度開いたドキュメントへのアクセスを効率化させるための拡張となっています。
会社で｢ドキュメントが色んなところにたくさんあり、一度見たあのドキュメントが見つからない！｣ということが頻繁にあるため、その解決策として作りました。

<!-- more -->

# Eternal Historyはどんなことができる？

## Chromeのhistory APIをもちいて、すべての履歴をブックマークに保持する

![すべての履歴をブックマークに保持する](eternal-history_1.png)

ページにアクセスしてChromeの履歴に追加されると、Eternal Historyは同じエントリをChromeのブックマークにも追加します。
履歴は通常90日で消えてしまいますが、ブックマークなのでこちらは永遠に消えません。

## 新しいタブを置き換え、履歴閲覧 & 検索UIを提供

![履歴閲覧 & 検索UIを提供](eternal-history_2.png)

新しいタブをEternal Historyがブックマークに保存した履歴の閲覧UIと置き換えます。表示時点では最新3日分の履歴を表示します。
さらに、フォームに検索文字列を入力することで、その文字列をタイトルまたはURLに含む履歴のみに絞ることができます。こちらは保存されている履歴全体から検索します。

## `site:` 、 `-` などのクエリを用いた検索

![クエリを用いた検索](eternal-history_3.png)

`site:manaten.net` とすることで、URLにmanaten.netを含む履歴のみに、 `-manaten` とすることで、結果に `manaten` を含まない履歴のみに絞ることができます。

## 検索UIのクエリを保存してショートカットとして利用できる

![検索UIのクエリを保存](eternal-history_4.png)

検索フォームの右端にある + ボタンを押すことでそのクエリを保存することができ、ショートカット的に使うことができます。
よく見るサイト名などを入れておくと、一発でそのサイトの履歴のみに絞ったりできます。

## 注意点

ブックマークにすべての履歴を残す都合上、長期使用でブックマークのエントリ数が増え、Chromeが重くなる可能性があります(未検証)。
もしそうなってしまった場合、ブックマークの｢Eternal History｣フォルダにすべての履歴が保存されているため、このフォルダを消すことで改善するはずです。

# なぜ作ったか？

会社で働いていると、多くのドキュメントはブラウザでアクセスできますが、色んなところに散っていて｢数ヶ月前に見たあのドキュメント、どこだっけ･･･？｣となってしまうことが多々あります。
特に昨今はいろいろな便利なツールがWeb上で利用できることもあり、ドキュメントと呼べるものはGoogle Drive、Confluenceのほか、FigmaやMIRO、Githubなど、様々なツール上に散っています。

そうした場合は、そのドキュメントは言及があったであろうSlackや議事録から検索を駆使して頑張って探す、ということを多くの人はしていると思います。自分はそうならないよう、後でアクセスしそうなドキュメントは都度ブックマークしておき、Chromeのアドレスバーから検索可能な状態にしていました。
人によってはその上できちんと階層的に保存することもあるかもしれませんが、本当に後で見るかもわからないのを逐一整頓するのも面倒で、ただブックマークするだけ、としていました。
ただ、この｢ただブックマークするだけ｣でも一瞬見ただけのドキュメントをブックマークし忘れたりすることはあります。

そこで、｢もう会社では開いたページは全部保存しておけばいいんじゃない？(= Chromeの履歴が無制限に残れば解決じゃない？)｣という発想に行き着きます。
まず、Chromeの履歴を無制限化する方法を探したところ、 [History Trends Unlimited](https://chromewebstore.google.com/detail/history-trends-unlimited/pnmchffiealhkdloeffcdnbgdnedheme) が見つかりました。この拡張は独自領域にChromeの履歴を保存してくれ、独自領域に制限はないため無限に履歴を残せ、独自のUIから検索可能、という一見理想的なものでした。しかし自分の用途における致命的な弱点として｢独自UIの検索機能が、日本語の部分一致検索ができない｣というものがありました。英語でも単語が完全一致しないと検索できないので、DBへの保存時に英単語単位での分かち書きでしか保存してないのだろうと考えました。

他の履歴系の拡張を利用することも考えたものの、履歴というセンシティブなものを扱う以上、マイナーな拡張を利用するのも積極的に慣れませんでした。
そこでもう自分で作ってしまうことにして生まれたのがこの拡張になります。

## ブックマークを用いた実装について

Chromeの[historyAPI](https://developer.chrome.com/docs/extensions/reference/api/history)を用いれば、履歴が増えるたびに処理を行うことができるのはわかっていましたが、取得した履歴の永続化先に悩まされることになりました。Chrome拡張のローカルの永続化先としてメジャーなのは[indexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)か、[chrome拡張のstorage API](https://developer.chrome.com/docs/extensions/reference/api/storage)です。しかし｢最終的に全文検索したい｣という要件だと検索機能のないこれらのストレージでは、専用に検索のためのインデックスを実装する必要があり、インデキシングにも実行コストがかかるという問題がありました。History Trends Unlimitedは独自ストレージに保存しているようでしたが、その実装コストもやりたいことに対して高いと感じていました。

そこで、ブックマークを永続ストレージとしてしまおうというアイデアを思いつきます。
Chromeのブックマークはそもそも全文検索機能がついており、かなりの量でも安定して利用できる他、Googleアカウントによる複数端末間の同期までついているため、｢履歴を永続化したい｣というモチベーションに対するライトな解決策として適していました。

# 最後に

自分の働くうえでの課題に対する解決した拡張なので、同じ問題を感じる人の役に立つ可能性はあり、そういった方には是非試していただき、この拡張で至らないところやバグの報告をいただけると嬉しいです。

履歴を扱う以上、プライバシーなどが気になる方もいると思いますので、そういった方は[github](https://github.com/manaten/eternal-history)で公開しているソースコードも参照していただきたいです。権限的にも、外部通信は一切許可せずに、履歴APIとブックマークAPI、faviconのためのfavicon権限、設定保存のためのstorageAPIで完結しています。

# 関連リンク

- [Eternal History on bookmarks - Chrome ウェブストア](https://chromewebstore.google.com/detail/eternal-history-on-bookma/bbajmicfgjljmbjpjbabgkiallplgjoa)
- [manaten/eternal-history: A Chrome extension make history unlimited and searchable.](https://github.com/manaten/eternal-history)
- [Claude Codeのお陰で積ん趣味プロが一週間で片付いた - MANA-DOT](https://blog.manaten.net/entry/claude-code-tsumipro)
