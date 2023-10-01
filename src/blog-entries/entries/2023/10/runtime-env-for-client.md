<!--
title: Next13 の AppRouter で実行時の環境変数をクライアントで取り扱う
date:  2023-10-01 18:00
categories: []
-->

Next.js でアプリケーションを開発していると、クライアントで参照する設定値を環境変数で扱いたいケースは多々あると思います。Next.js では `NEXT_PUBLIC_` という接頭辞の環境変数はビルド時に解決され、ビルド成果物に埋め込まれるためクライアントから参照できるようになります (参考: [Configuring: Environment Variables | Next.js](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables))。

ただし、この環境変数は**ビルド時に埋め込まれるため**、当然ビルド時のものです。つまり、たとえばクライアントから参照する API の URL を環境変数で埋め込みたく、かつ API の URL はアプリケーションの環境(production, staging, development など)ごとに変わるというケースにおいて、**環境ごとにビルドをする必要がある**ということになります。ビルド成果物をバージョンごとに世代管理したい場合、バージョン x 環境ごとに成果物が増えるため、管理も煩雑化します。

そこで、ビルド時ではなく実行時の環境変数をどうにかクライアントから参照できないかということを考えます。

# 三行で

- Server Components は実行時の `process.env` にアクセスできる
- Server Components から Client Components である Context Provider に環境変数を props として渡す
- 他の Client Components は `useContext` 経由で実行時の環境変数にアクセスできるようになる

<!-- more -->

# 既存の方法

next 公式にもそういうことができないか、という内容の[discussion](https://github.com/vercel/next.js/discussions/52173)があります。ここでは**process.env の内容を返却する route を `force-dynamic` で定義する**ことで解決しています。クライアントで実行時の環境変数を利用したい場合はこのエンドポイントを呼び出す想定だと思われます。

また、この discussion の質問文でも触れられていますが、**docker の起動時などにビルド成果物中の環境変数を実行時の値に sed などで書き換えてから起動する**という[アイデア](https://dev.to/itsrennyman/manage-nextpublic-environment-variables-at-runtime-with-docker-53dl)も存在します。

どちらでも目的は達成できますが、回りくどさや HACK 感は否めません。

# ContextProvider に実行時の process.env を渡す方法

ここで、Server Components はサーバーでしか動かないこと、そのためサーバー実行時の `process.env` にアクセスできること(これ自体は先述の方法でもやられています)、更に Server Components で Client Components を Composition できること、を踏まえて以下のような方法を考えました。

- Client Components として環境変数を扱う Context Provider を実装する ( `EnvProvider` とする)
- `layout.tsx` などの Server Components で上記 EnvProvider をマウントし、更に server の環境変数を props で渡す
- 実際に環境変数にアクセスしたい Client Components で、 `useContext` 経由で値を取得する

## 実践

実際にやってみると以下のようになります。

まず、ContextProvider を実装します。

```typescript
// EnvProvider.tsx
"use client";

import React, { PropsWithChildren, createContext, useContext } from "react";

type Env = {
  SOME_ENV_VALUE: string;
  OTHER_ENV_VALUE: string;
};

const envContext = createContext<Env>({
  SOME_ENV_VALUE: "",
  OTHER_ENV_VALUE: "",
});

export function useEnv(): Env {
  return useContext(envContext);
}

export const EnvProvider: React.FC<PropsWithChildren<{ env: Env }>> = ({
  children,
  env,
}) => {
  return <envContext.Provider value={env}>{children}</envContext.Provider>;
};
```

フィールド 2 つのオブジェクトをコンテキストに持つ、かなりシンプルなコンテキストの実装となっています。

次に、この EnvProvider を Server Components である layout.tsx で利用します。

```typescript
// layout.tsx
import { EnvProvider } from "./EnvProvider";

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <EnvProvider
          env={{
            SOME_ENV_VALUE: process.env.SOME_ENV_VALUE || "",
            OTHER_ENV_VALUE: process.env.OTHER_ENV_VALUE || "",
          }}
        >
          {children}
        </EnvProvider>
      </body>
    </html>
  );
}
```

ポイントとしては `export const dynamic = "force-dynamic";` で動的にレンダリングされるようにすることです。これを指定しないとビルド時に静的に出力されてしまい、実行時の環境変数が読まれません(参考: [File Conventions: Route Segment Config | Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config))。

最後に値を利用するコンポーネントを実装します。

```typescript
// TestButton.tsx
"use client";

import { useCallback } from "react";

import { useEnv } from "./EnvProvider";

export const EnvButton: React.FC = () => {
  const { SOME_ENV_VALUE, OTHER_ENV_VALUE } = useEnv();

  const clickHandler = useCallback(() => {
    alert(JSON.stringify({ SOME_ENV_VALUE, OTHER_ENV_VALUE }, null, 2));
  }, [SOME_ENV_VALUE, OTHER_ENV_VALUE]);

  return <button onClick={clickHandler}>Click me!</button>;
};
```

```typescript
// page.tsx
import { EnvButton } from "./EnvButton";

export default function Home() {
  return (
    <main>
      <EnvButton />
    </main>
  );
}
```

これで、ボタンを押すとクライアント側で環境変数が表示されるはずです。

### 動作確認

以下のように、実行時に環境変数を渡し、その値がクライアントで表示できることを確認できます。

```bash
SOME_ENV_VALUE="tonkatsu" OTHER_ENV_VALUE="hirekatsu" npm start
```

![動作確認](https://manaten.net/wp-content/uploads/2023/10/ss.png)

今回ここで紹介したサンプル実装は [manaten/example-runtime-env-for-client](https://github.com/manaten/example-runtime-env-for-client) にあります。

### この方法の課題

このようにして Client Components の hook からクライアント側で実行時の環境変数にアクセスできるようになりましたが、実は以下のような課題があります。

- **Server Components では hook が使えない**ため、今回実装した `useEnv` を使えない
- Component 以外(たとえば fetch 用の関数で API の URL を参照したい場合など)からは**直接 `useEnv` を利用できないため、引数で受け取る必要がある**

これらを完全に解決するには、以下のような方法が考えられます。

- `EnvProvider` はサーバーから受け取った環境変数を `useEffect` でグローバル領域に保持する役割とする
- 環境変数にアクセスするための関数 `getEnv` を用意し、**クライアント側では Provider がグローバルに保持した値を、サーバー側では `process.env` を参照する**ようにする

実装例は以下のような感じです。

```typescript
"use client";

import React, { PropsWithChildren, useEffect } from "react";

type Env = {
  SOME_ENV_VALUE: string;
  OTHER_ENV_VALUE: string;
};

const globalEnv: Env = {
  SOME_ENV_VALUE: "",
  OTHER_ENV_VALUE: "",
};

export function getEnv(): Env {
  return typeof window === "undefined" ? process.env : globalEnv;
}

export const GlobalEnvProvider: React.FC<PropsWithChildren<{ env: Env }>> = ({
  children,
  env,
}) => {
  useEffect(() => {
    Object.assign(globalEnv, env);
  }, [env]);

  return children;
};
```

この場合、クライアント側では Provider マウント前は値が取得できないことには注意する必要があります。この問題も解決したい場合、いっそ環境変数の値を ServerComponents で html 中に埋めてしまい、getEnv はパースして取り出す役割にしてしまうとかでもいいかもしれません。

# おまけ: Server Components と Client Components の Composition について

Server Components から Client Components をレンダリングし、**更にその children として Server Components を渡すことができる** というのは以下の文献で紹介されています。

- [【React Server Component】Server を Client の内側に注入できる Composition の力 - Qiita](https://qiita.com/honey32/items/bc24d8c0ea3d096ff956)
- [Rendering: Composition Patterns | Next.js](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)

実は自分ははじめ Server Components はサーバーでレンダリングされるものだから、hook は扱えないし、hook を利用した状態の受け渡しや大域の状態の実現もできないと思いこんでいました。どこかで｢Server Components は PHP のようなもの｣という記述を見た記憶があり、そのイメージに引きづられていたのです。

しかし、実際は｢SSR されるコンポーネントのうち、必ずサーバーサイドでしか実行されないことが約束されているもの｣くらいのニュアンスで、そこからサーバーサイドの値を Client Components にわたすことはもちろん、**Client Components の children として別の Server Components を渡すこともできてしまう**のでした。

こうした場合でも children の Server Components は Server Components のままですので、async 関数となることができ、Next の Metadata の利用をすることもできます。そしてその子供の Client Components からはしっかり Context にアクセスすることができます。つまり、React と Next.js は**サーバー側で一部実行したレンダリング結果を、クライアント側でいい感じに結合してくれている**ということです。めちゃくちゃすごい技術ですよね Server Components･･･。

# 参考文献

- [We need an official mechanism to allow runtime configuration from process.env · vercel/next.js · Discussion #52173](https://github.com/vercel/next.js/discussions/52173)
  - 実行時の環境変数にアクセスする方法についての discussion
- [Manage NEXT_PUBLIC Environment Variables at Runtime with Docker - DEV Community](https://dev.to/itsrennyman/manage-nextpublic-environment-variables-at-runtime-with-docker-53dl)
  - 実行時に sed で書き換えて実行時の環境変数にアクセスする方法
- [Rendering: Composition Patterns | Next.js](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
  - Server Components の Composition についての Next 公式ドキュメント
- [File Conventions: Route Segment Config | Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)
  - `"force-dynamic"` に関する Next 公式ドキュメント
- [Configuring: Environment Variables | Next.js](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)
  - `NEXT_PUBLIC_` に関する Next 公式ドキュメント
- [【React Server Component】Server を Client の内側に注入できる Composition の力 - Qiita](https://qiita.com/honey32/items/bc24d8c0ea3d096ff956)
  - Sever Components の Composition について解説されている日本語文献
