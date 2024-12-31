<!--
title: 2024年のmanatenのフロントエンド
date:  2024-12-31 22:30
categories: [JavaScript,TypeScript,React]
-->

# この記事は？

manatenが2024年末現在でフロントエンド(周辺)でアプリケーション開発をするときに、利用することが多い技術を概要や理由付きで挙げていきます。
フロントエンドの技術は移り変わりが激しいため、現在のトレンドと言うより、あくまでmanaten自身が今何をどう思って使っているかを備忘録的に記載しています。

去年: [2023年のmanatenのフロントエンド - MANA-DOT](https://blog.manaten.net/entry/2023-manaten-frontend)
去年も書いているため、今年は差分の記載となります。

<!-- more -->

# 今年から使いはじめ、今後も使っていくもの

## tsx

[TypeScript Execute (tsx) | tsx](https://tsx.is/)

`npx tsx some.tsx` とするだけでTypeScriptを実行できるコマンドです。TypeScriptでスクリプトを書くなどの用途で利用ができ、雑作業時に非常に便利です。

類似コマンドに `ts-node` がありますが、こちらは `esbuild` でトランスパイルして実行するのみで、型チェックもせずスピード面で有利とあります
[参考](https://tsx.is/faq#how-does-tsx-compare-to-ts-node)。

また、[将来的にはnode.jsでTypeScriptが直接動くようになる可能性](https://nodejs.org/en/learn/typescript/run-natively)もあるため、TypeScriptでのスクリプティングに慣れておくという意味でもおすすめです。

## msw

会社の同僚から奨められ、主にfetchを行うServer Componentのテストで利用しています。
簡単なインタフェースでエンドポイント単位のモックを行うことができるため、Jestと組み合わせて｢サーバーがこの値を返したらこの表示を行う｣といったテストを書くことができます。

はじめ自分が知識をアップデートできておらず、mswはService Workerのモックを行い、ブラウザでのAPI実行をモックしてくれるものだと思い込んでいたのですが(mock service workerの略という印象が強かった)、nodeの `http` モジュールのモックもすることができます。

- [Node.js integration - Mock Service Worker](https://mswjs.io/docs/integrations/node/)

## Chromatic

会社で利用しています。

Storybookのホスティングだけでなく、UI TestでのVisual Regression Test(VRT)を手軽に行うことができるのがメリットです。
storybookを書くことが表示面の担保にもなるほか、Web上での差分レビューが非エンジニア職とのコミュニケーションで便利です(ソースコード差分レビューより遥かにハードルが低い)。

# 去年も使っており、今後も使っていくもの

[2023年のmanatenのフロントエンド - MANA-DOT](https://blog.manaten.net/entry/2023-manaten-frontend)
から変わらず使っていくものたちです。特筆するものは後述します

- React
- Next.js (App Router / Server Components / Server Actions)
- storybook
- React-hook-form
- zod
- css-modules
- ky
- openapi-typescript
- TypeScript
- prettier / editorconfig
- eslint
- eslint-plugin-import
- stylelint
- stylelint-config-recess-order
- husky
- lint-staged
- imagemin-lint-staged
- VSCode
- auto-snippet
- ChatGPT

## React

変わらず利用しています。語れるほど他のライブラリの利用をしていないのですが、JSXが結局糖衣構文でしかないため実態はただの関数であり、TypeScriptとの相性が抜群に良いというのが相変わらず利点に感じます。

個人の所感としては数年前から｢仮想DOMは(素のDOM操作と比較して)ランタイムの計算資源を犠牲に開発体験を優先する技術(ただし開発体験が非常に良いのでペイしている)であり、いずれ最適化のために置き換わっていく｣と想像しており、Svelteなどがそういった技術だと思っているんですが、Reactの強力なエコシステムや大規模開発における優位性でその牙城が崩せない、という印象があります(実際自分もReactを書き続けたい)。

ReactはReactでServer Componentsで部分的に計算資源をサーバーサイドに押し付けたり、その最適化でビルドフェーズに押し付けたりといった進化をしていますが、これらはNext.jsなどのサーバーサイドフレームワークの支援なしにはフル活用できない状態にもなってきていると感じます。これは、ライブラリのシンプルさが売りの一つであったReactが肥大化してしまっているようにも思えます。とはいえ、ビルド時最適化の領域に入ってくると、フレームワーク含むビルドツールチェーンと抱合せになるのは必然なのかもしれません。

## Next.js

React Server ComponentsやServer ActionsをProductionで利用する場合、現状最もメジャーで信頼できる選択肢かと思います。

とはいえ、Next15で緩和されたものの強力な[多層キャッシュ戦略](https://nextjs.org/docs/app/building-your-application/caching)や[parallel routes](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)、[partial prerendering](https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering)など独特の要素が多く、Webを再発明した｢Next.jsという新環境｣感が否めないところもあります。使いこなせば強力、ただし使いこなせばこなすほどNext.jsと心中していくことになる感覚が否めません。

個人的には[islands architecture](https://www.patterns.dev/vanilla/islands-architecture/)のほうがServer Components/Client Componentsを共存させるアプローチとしてはシンプルに感じております。多くのケースでは｢サーバーでレンダリングされた部分HTMLを用いて適切に表示を更新する｣Next.jsのアプローチはtoo muchで、大体のケースでやりたいのは｢JSXによるコンポーネント指向のUI｣と｢必要に応じたクライアントサイドスクリプティング｣なのではないかと思っており、サーバーサイドでベースとなるレンダリングを行い、必要に応じてクライアントサイドのhydrationをできるislands architectureがまさにこのニーズを満たしていると感じます。
あくまで触ったことない上での感覚値なので、来年こそはislands architectureなフレームワークを試してみたいところ･･･

# 今後試してみたいもの

以下は去年と変わらずです(去年から全く触れていないともいう･･･)

- hono
- Svelte or Solid.js

# まとめ

今年は去年と比較して真新しい技術をあまり触れていません(振り返り自体を去年始めたため、去年がモリモリだったというのはあるにはあります)。
今年は業務上開発をしていない期間があったり、全体的にいそがしかったり、その上で余暇時間にゲームをしすぎていたり(特に11月以降は[elin](https://store.steampowered.com/app/2135150/Elin/)をやり続けていた･･･)して、あまり技術的に新しいことができていなかったと感じます。来年はもう少し頑張りたい･･･！
