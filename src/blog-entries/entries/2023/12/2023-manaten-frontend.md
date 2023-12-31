<!--
title: 2023年のmanatenのフロントエンド
date:  2023-12-31 22:30
categories: [JavaScript,TypeScript,React]
-->

# この記事は？

フロントエンドの(に限らずですが)技術はよく言われるように移り変わりが早いです。とはいえ個人で全て追い切るのは難しく、また必ずしも新しいものを使い続けていればいいわけではないとも思います。個人的には新しい技術であっても古い技術であっても、きちんと自分の中に技術採用の軸があることが大事だと思っています。

このエントリではmanatenが2023年末現在でフロントエンド(周辺)でアプリケーション開発をするときに、利用することが多い技術を概要や理由付きで挙げていきます。

(なお年の瀬に思い出して書いてるため、抜けがあったり内容いい加減だったりすると思います。)

<!-- more -->

# 今後も使っていくもの

## ライブラリ

### [React](https://react.dev/)

- 2023年時点である程度以上複雑なフロントエンドをコンポーネント指向+型安全に開発する上でベターな選択肢だと思います。
- コンポーネント=JSX≒JSのため、通常のJS開発におけるアセットをほぼそのまま使えるのが、vueなどの競合と比較したときのメリットだと思っています。
  - コンポーネント単位=JSのモジュール単位、コンポーネント=JSの関数(+JSX)というところで、一般的なjs開発に慣れている場合無理なくコンポーネント指向で開発できる
  - eslintによるコードスタイル統一をコンポーネントも含めて行うことができる
  - TypeScriptの支援で、コンポーネントやhookの型をかなり厳密に指定することができる
- Contextやhookでの依存注入は理解するまでの癖は強いものの、理解すればシンプルにViewとLogicを分離できるため、開発速度に貢献してくれていると思います。
- React Server Components(RSC)でSSRへの回帰の流れにもしっかり乗ろうとしているのも、まだしばらくはReactは廃れないだろうと思わせてくれます
  - フロントエンドライブラリは｢JAMStack寄りの技術スタックで、ロジックをAPIサーバー、Viewをフロントエンド｣の流れから、徐々に｢SSRして必要なインタラクションをクライアントで｣の流れに回帰しつつあると感じます。後で触れるsvelteやsolid.jsはそういったライブラリだと思っています
    - パフォーマンス･UX面もですが、そもそも｢クライアント側ですべての計算をする｣というのが富豪的な(もっというと、コンポーネント指向で開発したいという開発者体験優先の)アプローチであるというふうに以前から個人的には考えており、｢可能なものはなるべくビルド時に、難しいものはサーバーサイドで計算｣というアプローチのほうが優れていると感じていました(ただそのためにReactの開発体験は損ないたくはない)
    - RSCで従来のReactの開発者体験で古典的なテンプレートエンジン的なUI開発を行い、必要に応じてClient Componentによるインタラクションを注入する、というスタイルはこの思想上かなり合理的だと思っており、徐々に主流になるのかなと感じています。

### [Next.js (App Router / Server Components / Server Actions)](https://nextjs.org/)

- Reactで説明したSSRへの部分的回帰の流れに、完成度高く実装しているフレームワークの一つだと思います。
  - [Next13 の AppRouter で実行時の環境変数をクライアントで取り扱う](https://blog.manaten.net/entry/runtime-env-for-client) などでも触れましたが、｢コンポーネントをサーバーサイドでrender → ルーティング時にコンポーネント差分だけクライアントで差し替え、コンテキストも引き継ぎ｣という挙動をするため、古典的なSSR的コードを記述しつつ、実際には差分しか計算しないというのが(複雑なものの)良いです
  - 他に完成度高いフレームワークがあれば、必ずしもNext.jsである必要はないのかなとも思います
- キャッシュありきの戦略が実装を逆に難しくしてしまっている側面があるのは否めないです
- React Server Actionsが動くフレームワークとしても重要です(ただし現時点でバグもある)
  - API(ロジック)サーバー - フロントサーバー - クライアント という構成の場合、従来だとAPIサーバーの処理をクライアントが呼び出すためのラッパー的なエンドポイントをフロントサーバーにcustom routingなどで実装する必要があり、そのために｢クライアント向けのAPIクライアント｣｢custom routingでのエンドポイント実装｣｢呼び出し感で型安全にするための何らかの仕組み｣をわざわざ用意する必要がありました
  - Server Actionsが利用可能な場合、単にAPIサーバーを呼び出すServer Actionsを実装すれば良いため、非常に簡潔に、かつ型安全が保証される形で実装することができます
    - これを関数を書くだけで実現できるため、開発速度も向上します
    - ただし、実際は任意のパラメータでリクエストできうるため、Server Actionsには型チェックやエラーハンドリングしてResult型で返却する共通ラッパーを用意しておくのがおすすめです。
- Webpack等のビルドツールチェインを隠蔽してくれているのも大事な性質で、自前のconfigをかなり減らしてくれます。
- Vercelの動き自体は不安もあります
  - Next14でServerActionsは安定版となりましたが、以前致命的なバグが有ったり(ブラウザバック後のServer Actionsの呼び出しが、コード上で帰ってこなくなるバグを確認し、未だに修正されていない [vercel/next.js/issues/56811](https://github.com/vercel/next.js/issues/56811))、他にもApp Routerのキャッシュが前衛的すぎて、実用的なアプリケーションを作る上で確実にキャッシュを飛ばすのが難易度が高いなど、実装&リリース優先で安定化が二の次の体制なのではという不安があります。
  - ただ、個人的にはワークアラウンドでカバー可能な範疇で、それ以上に開発速度が上がる側面が大きいと感じています。同機能で安定性が高いフレームワークがあれば乗り換える可能性はありそう。

### [storybook](https://storybook.js.org/)

- フロントエンドコンポーネントのテストかわりにとりあえず書く、というのが癖になっています。デザイナーとコンポーネント単位の認識を視覚的に揃え、競業するためにも重要だと思っています。
- storybookの代替ライブラリというのは聞いたことがないため、まだしばらく一線級なのかなと思います。

### [React-hook-form](https://react-hook-form.com/)

- フォーム作る場合に思考停止で入れるライブラリです。
- あまり競合を調べられていませんが、特に不自由を感じていないため利用し続けています
- 後述のzodと組み合わせてバリデーションをすると快適です。また、フォームのJSXを記述したあとにcopilotに任せることでスキーマ自体も90%できた状態で生成してくれるため、非常に楽ちんです。

### [zod](https://zod.dev/)

- 独自のオブジェクトでスキーマを定義し、バリデーションするためのライブラリです。
- オブジェクトの不要フィールドを消す、曖昧な型変換をするなどの痒いところに手が届く機能も揃っており、更にTypeScriptとの親和性も高い(スキーマを定義したらそこから型定義も生成できる)です。
- スキーマライブラリもいくつか競合がある認識ですが、zodで特に不便を感じていないため比較したことないです

### css-modules

- 2022年はcss-in-jsのemotionや、emotionベースのChakraUIサイコーと思っていたんですが、転職後css-modulesが採用されていたことや、結局SSRに回帰するのであればcssが静的に出力できたほうが優位であることから2023年はcss-modulesを書いていた事が多いです。
- [mizdra/happy-css-modules](https://github.com/mizdra/happy-css-modules) を導入することで型安全に開発することができます
- コンポーネント指向開発におけるcssどうするのか？はまだ答えが出きってないと感じるため、発明があれば置き換わるのかもしれません

### [ky](https://github.com/sindresorhus/ky)

- 2022年は [axios](https://github.com/axios/axios) を使っていましたが、今年からkyに乗り換えました
- ReactがfetchをラップしてRequest memorizationを行うため、XHRベースのライブラリよりfetchベースのライブラリのほうが今後は良いだろうと考えたためです。
- 素のfetchで良いという方もいると思いますが、素のfetchは少しインタフェースが使いづらいため、重宝します
- openAPIのスキーマが提供されている場合、後述のopenapi-typescriptで型安全に扱うためのラッパーを用意して使うことが多いです。

### [openapi-typescript](https://www.npmjs.com/package/openapi-typescript)

- openAPIのjson/yamlから、TypeScriptの型定義を生成してくれるライブラリです
  - ただしそのままだと扱いづらいため、 [openapi-typescriptと型パズルで作るREST APIクライアント](https://zenn.dev/micin/articles/openapi-typescript-with-type-puzzles?redirected=1) を参考に、｢パス+メソッド → パラメータやレスポンスなどの型情報｣なUtil型を用意して使うことが多いです
  - kyをラップして用意したfetch関数でURLとメソッドのエディタ補完が効き、なおかつURLとメソッドが指定されるとパラメータの型が要求され、レスポンスが厳密になるというふうに実装できるため、非常に快適です
- openAPIとTypeScriptの橋渡しをするライブラリはいくつか存在しますが、ほとんどが｢型定義をもとに独自のクライアントを生成してくれる｣というものので、若干使いづらいクライアントが生成されることが多いため、型定義のみ生成してクライアントは自前で実装できるこのライブラリを気にいっています。

## ツールチェイン

### [TypeScript](https://www.typescriptlang.org/)

- ごく簡単なスクリプトを書くケース以外では基本的にTypeScriptを使っています
  - ごく簡単でもjsconfigを用意して、ts-checkしながら書くことが多いです
    - [レガシーなjs環境におすすめなts-checkコメントについて - MANA-DOT](https://blog.manaten.net/entry/ts-check-for-legacy)
- 漸進的型付け+柔軟なjsオブジェクト+Type Guardの快適性に勝る静的型付け言語を知らないので(真面目にサーベイしたわけではないです)、フロントエンド以外でも常に開発の第一候補として愛用しています。

### [prettier](https://prettier.io/) / [editorconfig](https://editorconfig.org/)

- リポジトリルートに .prettierrc / .editorconfig を設置し、[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) 、 [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) をVSCodeに入れておくだけでもコードスタイルを統一できるので、リポジトリを新規作成したときは思考停止で設置するのが良いです
- スタイルは、リポジトリ内で統一されていれば強い希望はないですが、個人開発の場合はスペース2、クオートはダブルクオートが好みです。

### [eslint](https://eslint.org/)

- js/tsのプロジェクトにはとりあえず導入して、コード構造を強制します。
  - vscodeの設定で、保存時にautofixをかけるようにできるため、autofixを当てにして適当に記述 → 保存してfix というコーディングがすっかり染み付いています
  - copilotに生成させたコードも同じく保存時に統一させます
- 最近気づきましたが [no-restricted-imports](https://eslint.org/docs/latest/rules/no-restricted-imports) が便利で、このルールをカスタマイズしておくと、｢腐敗防止層をプロジェクト内で実装しているため、直接importしてほしくないライブラリを禁止｣とか｢nextのuseRouterがPageRouter用とAppRouer用で2つあるため、間違った方を禁止｣などを実現することができます。

### [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)

- 主にimport-orderをautofixさせるために重宝しています。
  - 区分ごとにアルファベット順にimportを並ばせることができます。複数人開発でimportがぐちゃぐちゃになることを防げるため便利。
- 設定を都度カスタマイズする理由はないので、 [manaten/ts-node-cli-template/blob/main/.eslintrc.cjs#L24-L52](https://github.com/manaten/ts-node-cli-template/blob/main/.eslintrc.cjs#L24-L52) を毎回コピペしています。
  - cssを最後にさせることで、カスケード順が狂わないようにするのを気にいっています。

### [stylelint](https://stylelint.io/)

- css-moduleを利用しているため、stylelintでそのままlintできます。
- とりあえず入れておけば初歩的なミスにきづけるため、思考停止で導入。

### [stylelint-config-recess-order](https://www.npmjs.com/package/stylelint-config-recess-order)

- stylelintのプラグインで、プロパティの定義順を並べ替えてくれるものはいくつかありますが、これはrecessという順序規則に基づいて並べ替えてくれるものです
- 単なるアルファベット順だと、意味的に直感に反する順序になってしましますが、このプラグインは ｢親コンポーネント上の位置系のプロパティ(positionなど)｣｢要素の性質を決めるプロパティ(displayなど)｣｢要素の見た目を決めるプロパティ(paddingやborderなど)｣という順で並べてくれるため、直感的で気に入っています。

### [husky](https://github.com/typicode/husky)

- npmプロジェクトにインストールしておくと、git commitをhookして、コミット時に追加の処理を行い、失敗したらコミットを失敗させてくれるツールです。
- prettier、eslint、stylelintと、後述のimagemin-lint-stagedを設定することが多いです。後述のlint-staged経由で実行します。
- 基本的にはVSCodeの保存時のfixで事が足りてしまうのですが、二重でチェックできるため安心できるので重宝しています

### [lint-staged](https://www.npmjs.com/package/lint-staged)

- gitのstagingにあがっているファイルのみに処理をしてくれるツールです。
- huskyと組み合わせて、コミット時に変更があったファイルのみに処理をする用途で利用します。

### [imagemin-lint-staged](https://www.npmjs.com/package/imagemin-lint-staged)

- lint-stagedと組み合わせて、コミット前に画像の最適化をかけてくれるツールです。
- かつては自前で実装してましたが、ズバリのパッケージが公開されたため今はこちらを使っています
  - [husky + lint-stagedでgitのprecommit時にimageminを行い、minifyした画像のみコミットされるようにする - MANA-DOT](https://blog.manaten.net/entry/precommit-imagemin)

## エディタ

### [VSCode](https://code.visualstudio.com/)

- 実質js開発の標準です。他にはWebStorm派やVim派がいるのでしょうか？
- 拡張が多く、動作が軽快なのがメリットです。
  - また、拡張を自分で開発するのも、jsで記述ができるためフロントエンジニアには難易度低めです。
- また、copilotによる支援が便利(これはVSCodeに限らないのかも)で、storybookやテストコードなどの反復処理をとりあえず実装させて人間が細かい手直しをするという使い方が、すべて人間が実装するよりも圧倒的に時短(そして精神的負担も減る)になると思っています。

### [auto-snippet](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.auto-snippet)

- VSCodeの拡張で、拡張子に対して特定のスニペットをファイル生成時に自動適用してくれる拡張です。
- \*.tsx ファイルの場合にプロジェクトで使うReactのスニペットを自動展開するなどの用途で使っており、コードスタイルの統一と時短に貢献してくれます。
- `.vscode/settings.json` \*\*\*\*と `.vscode/snippets.code-snippets`をプロジェクトにコミットしておくことで、コードスタイルをある程度チーム感で共有できます。

## フロント以外

### [type-orm](https://typeorm.io/) + sqlite3

- 個人プロダクトでデータストアが手軽にほしいときに便利な選択肢です。
- TypeOrmはPrismaと競合だと思いますが、最小限の設定を記述したあとはEntityのクラス定義を実装するだけでテーブル作成からCRUDがすぐできるようになるため、手軽に利用したいときにより便利です。
  - [manaten/sqlite-prisma-vs-typeorm-example](https://github.com/manaten/sqlite-prisma-vs-typeorm-example)

### [ChatGPT](https://chat.openai.com/)

- 命名の相談も、TypeScriptの難しい型パズルも、ドット絵描くときのポーズ相談も何でもお願いしています
  - [個人的におすすめのchatGPT用法 (ぬけもれ探し･意味から逆引き･雑学のpush) - MANA-DOT](https://blog.manaten.net/entry/chatgpt-benri)
- 2023年度月額払いすべきサブスクリプションサービス一位だと思っています。

# 今後試してみたいもの

### [strapi](https://strapi.io/)

- 転職後の職場で利用されていたHeadlessCMSです。クラウドが用意されている他、npmのライブラリとしてオンプレミスでも動作するのがメリットです。
- 軽く触ってみたところ、できが非常に良く、CLIでデータストアを指定したらすぐ使える(しかもsqliteもサポートしているため、DBすら用意しなくてもとりあえず試せる)、ミニマルな管理ツールでスキーマ定義とエンティティ管理ができるのがメリットに感じました。
- 単純なデータ構造でREST APIを定義･実装して工数をかけるというのは少し前時代的に思っており、今後は出来のいいHeadless CMSで実現できるところはCMS上でスキーマ定義+ホスティング、というのも選択肢になりそうだなと思っています。

### [hono](https://hono.dev/) (+ [Cloudflare Workers](https://developers.cloudflare.com/workers/))

- 同僚複数人が別の文脈でおすすめしていたため気になっています。
- Cloudflare製品は最近勢いがあると感じます。AWSなどと比べるとエンタープライズ用途では若干勇気が必要な選択肢の印象はあるものの、個人ユースだと積極的に使いたい感じ。

### [Svelte](https://svelte.dev/) or [Solid.js](https://www.solidjs.com/)

- RSCところで書いた文脈で、ビルドタイム･SSR回帰の文脈で、現状有力な対抗馬としてのこれらのライブラリも気になっています。
- ただ、開発体験としてはReactで完成してしまっているため、趣味の気軽な開発でなかなか手を出す機会がないのが悩みどころ。

# 参考リンク

- [manaten/ts-node-cli-template](https://github.com/manaten/ts-node-cli-template)
- [manaten/nextjs-template.](https://github.com/manaten/nextjs-template)
