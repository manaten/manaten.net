<!--
title: TypeScriptの型定義で麻雀の役判定をする 【dwango Advent Calendar 2日目】
date:  2021-12-03 00:00
categories: []
-->

このエントリは [ドワンゴ Advent Calendar 2021](https://qiita.com/advent-calendar/2021/dwango) 2日目の記事です(夜が明けるまでは2日目！)。

# はじめに
TypeScriptには [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) や [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) といったクッソ強力な型機能があります。

これらを用いて、今回は `2p3p4p2m3m4m2s3s4s4s5s6s8s8s` のような天鳳牌譜形式の文字列を型引数に渡すと、麻雀の役判定をする型(あくまで型です、関数ではありません)を作ってみようとおもいます。

(ただし時間がなかったため断么九と平和のみです)。

![例](https://manaten.net/wp-content/uploads/2021/12/ex4.png)


<!-- more -->


# Conditional Types, Template Literal Types って何？
それぞれ具体的にどんなものか、マニュアルの例を用いて示すと、以下のような感じです。

```typescript
// Conditional Types の例
interface Animal {
  live(): void;
}
interface Dog extends Animal {
  woof(): void;
}
 
// type Example1 = number となる
type Example1 = Dog extends Animal ? number : string;

// type Example2 = string となる
type Example2 = RegExp extends Animal ? number : string;


// Template Literal Types の例
type World = "world";

// type Greeting = "hello world" とおなじになる
type Greeting = `hello ${World}`;
```

それぞれ、｢型に応じた型の分岐｣｢動的な文字列型の生成｣を可能にしています。
これだけだと｢ふーん｣といった感じかもしれませんが、これとGeneticsやinferによる推論、更に再帰的な型適用をあわせて利用することで、
プログラミングに近い表現力で型を定義することが出来てしまいます。

その強力さを示す例として、以下の参考サイトでは、JSONのパーサーを作る例や、SQL文字列からSQL構造の型を作り出す事例が紹介されています(今回非常に参考にさせていただいています)。

- [ghoullier/awesome-template-literal-types: Curated list of awesome Template Literal Types examples](https://github.com/ghoullier/awesome-template-literal-types)
- [TypeScriptで世界一型安全な型レベルSQL Interpreterを作っている話 | Studio Andy](https://blog.andoshin11.me/posts/typescript-sql-interpretor)

これらの事例を参考に、今回麻雀の役判定する型を実装してみたいと思います。

# 実装

今回成果物となるコードです。順を追って説明していきます。

[MahjongTypes/MahjongTypes.ts at main · manaten/MahjongTypes](https://github.com/manaten/MahjongTypes/blob/main/MahjongTypes.ts)

## 牌の型の定義

```typescript
type 数牌の数 = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type 数牌の色 = "s" | "p" | "m";
type 字牌の数 = "1" | "2" | "3" | "4" | "5" | "6" | "7";
type 字牌の色 = "z";

type 数牌 = `${数牌の数}${数牌の色}`;
type 中張牌= `${"2" | "3" | "4" | "5" | "6" | "7" | "8"}${数牌の色}`;
type 老頭牌 =`${"1" | "9"}${数牌の色}`;

type 東 = "1z";
type 南 = "2z";
type 西 = "3z";
type 北 = "4z";
type 白 = "5z";
type 發 = "6z";
type 中 = "7z";
type 字牌 = 東 | 南 | 西 | 北 | 白 | 發 | 中;

type 么九牌 = 老頭牌 | 字牌;
type 雀牌 = 数牌 | 字牌;
```
ここまではTypeScriptの型がわかればそんなに難しくない内容です。
純粋に共用体を使って麻雀牌の型を定義しています。
これはあとで役判定に使う想定です。

ちなみに、大量の型の英名をいちいち考えるのがしんどかったので、ほとんど日本語で型名をつけています。2日まで時間なかったし。

## 結果となる型の定義
冒頭のスクリーンショットで示したような、判定結果を収納する型の定義です。
`2p3p4p2m3m4m2s3s4s4s5s6s8s8s` のような文字列を最終的にこの型(の配列)に変換することを目指します。

```typescript
type Result = {
  雀頭: [雀牌, 雀牌],
  面子: [雀牌, 雀牌, 雀牌][],
  Rest: (雀牌 | "")[],
  役: string[],
}
```
再帰的にResult型を作っていくので、Restプロパティは、処理中の牌を入れておくために用意しています。

## 文字列を配列にする
ここからTypeScriptの型の本領が発揮されていきます。
まずは、処理のために `2p3p4p2m3m4m2s3s4s4s5s6s8s8s` 形式の文字列を雀牌の配列に変換します

```typescript
type ToArray<P extends string> =
  P extends "" ? [] :
    P extends `${infer A}${infer B}${infer Rest}` ?
    `${A}${B}` extends 雀牌 ?
      [`${A}${B}`, ...ToArray<Rest>]
    : never
  : never;
```

inferを使うことで、文字列を3パーツに分割します。
先頭2文字が雀牌であれば、先頭2文字を配列要素に入れ、残りを再びToArray型に適用しています。
すべて雀牌であれば、最終的に空文字列となり、雀牌の配列型となります。

実際に文字列を適用すると、以下のような結果となります。

![例](https://manaten.net/wp-content/uploads/2021/12/ex1.png)

きちんと配列になっています。自分はこれが動いたとき感動しました。


## 雀頭判定
配列になったので、次は配列をResult型に変換する型を書きます。
自分は｢まず雀頭だけ埋める｣→｢面子を1つずつ埋める｣というステップを考えました。
雀頭だけ埋めたResultの配列をこのステップでは生成します。

```typescript
type 雀頭判定<A extends 雀牌, B extends 雀牌, Rest extends 雀牌[]> =
  A extends B ?
    [{
      雀頭: [A, B],
      面子: [],
      Rest: Rest,
      役: [],
    }]
  : []

type 雀頭マッチング<A extends 雀牌, P0 extends 雀牌, P1 extends 雀牌, P2 extends 雀牌, P3 extends 雀牌, P4 extends 雀牌, P5 extends 雀牌, P6 extends 雀牌, P7 extends 雀牌, P8 extends 雀牌, P9 extends 雀牌, P10 extends 雀牌, P11 extends 雀牌, P12 extends 雀牌> = [
  ...雀頭判定<A, P0, [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12]>,
  ...雀頭判定<A, P1, [P0, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12]>,
  ...雀頭判定<A, P2, [P0, P1, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12]>,
  ...雀頭判定<A, P3, [P0, P1, P2, P4, P5, P6, P7, P8, P9, P10, P11, P12]>,
  ...雀頭判定<A, P4, [P0, P1, P2, P3, P5, P6, P7, P8, P9, P10, P11, P12]>,
  ...雀頭判定<A, P5, [P0, P1, P2, P3, P4, P6, P7, P8, P9, P10, P11, P12]>,
  ...雀頭判定<A, P6, [P0, P1, P2, P3, P4, P5, P7, P8, P9, P10, P11, P12]>,
  ...雀頭判定<A, P7, [P0, P1, P2, P3, P4, P5, P6, P8, P9, P10, P11, P12]>,
  ...雀頭判定<A, P8, [P0, P1, P2, P3, P4, P5, P6, P7, P9, P10, P11, P12]>,
  ...雀頭判定<A, P9, [P0, P1, P2, P3, P4, P5, P6, P7, P8, P10, P11, P12]>,
  ...雀頭判定<A, P10, [P0, P1, P2, P3, P4, P5, P6, P7, P8, P9, P11, P12]>,
  ...雀頭判定<A, P11, [P0, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P12]>,
  ...雀頭判定<A, P12, [P0, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11]>,
];

type 雀頭チェック<P extends 雀牌[]> = Uniq<[
  ...雀頭マッチング<P[0], P[1], P[2], P[3], P[4], P[5], P[6], P[7], P[8], P[9], P[10], P[11], P[12], P[13]>,
  ...雀頭マッチング<P[0], P[1], P[2], P[3], P[4], P[5], P[6], P[7], P[8], P[9], P[10], P[11], P[12], P[13]>,
  ...雀頭マッチング<P[1], P[0], P[2], P[3], P[4], P[5], P[6], P[7], P[8], P[9], P[10], P[11], P[12], P[13]>,
  ...雀頭マッチング<P[2], P[0], P[1], P[3], P[4], P[5], P[6], P[7], P[8], P[9], P[10], P[11], P[12], P[13]>,
  ...雀頭マッチング<P[3], P[0], P[1], P[2], P[4], P[5], P[6], P[7], P[8], P[9], P[10], P[11], P[12], P[13]>,
  ...雀頭マッチング<P[4], P[0], P[1], P[2], P[3], P[5], P[6], P[7], P[8], P[9], P[10], P[11], P[12], P[13]>,
  ...雀頭マッチング<P[5], P[0], P[1], P[2], P[3], P[4], P[6], P[7], P[8], P[9], P[10], P[11], P[12], P[13]>,
  ...雀頭マッチング<P[6], P[0], P[1], P[2], P[3], P[4], P[5], P[7], P[8], P[9], P[10], P[11], P[12], P[13]>,
  ...雀頭マッチング<P[7], P[0], P[1], P[2], P[3], P[4], P[5], P[6], P[8], P[9], P[10], P[11], P[12], P[13]>,
  ...雀頭マッチング<P[8], P[0], P[1], P[2], P[3], P[4], P[5], P[6], P[7], P[9], P[10], P[11], P[12], P[13]>,
  ...雀頭マッチング<P[9], P[0], P[1], P[2], P[3], P[4], P[5], P[6], P[7], P[8], P[10], P[11], P[12], P[13]>,
  ...雀頭マッチング<P[10], P[0], P[1], P[2], P[3], P[4], P[5], P[6], P[7], P[8], P[9], P[11], P[12], P[13]>,
  ...雀頭マッチング<P[11], P[0], P[1], P[2], P[3], P[4], P[5], P[6], P[7], P[8], P[9], P[10], P[12], P[13]>,
  ...雀頭マッチング<P[12], P[0], P[1], P[2], P[3], P[4], P[5], P[6], P[7], P[8], P[9], P[10], P[11], P[13]>,
]>;

type Uniq<A extends any[]> =
  A extends [ infer H, infer I, ...infer T ] ?
    H extends I ? [H, ...Uniq<T>] : [H, I, ...Uniq<T>]
  : A
type Ex2 = 雀頭チェック<ToArray<"2p3p4p2m3m4m2s3s4s4s5s6s8s8s">>
```

14個の牌が並ぶ配列型を、力技でマッチングしています。プログラミングならforループを回すところでしょうが、これは型定義なのでそんな高等テクニックは利用できません。
おとなしく要素の位置を変えて14回*14回の型を生成し、spread operatorで単一の配列にマージしていきます(型でspread operatorが使えるのも狂ってますね･･･)。
最後、 `雀頭判定` では、注目する2つの牌が一致していれば雀頭扱いにしてResult型を返し、一致しなければ雀頭ではない組み合わせとし空配列を返しています。

この型を適用すると以下のようになります。

![例](https://manaten.net/wp-content/uploads/2021/12/ex2.png)

きちんと雀頭っぽい部分だけ抜き出され、残りの雀牌がRestに入っていますね！
これが動いたとき僕はニ回目の感動をしました。

ちなみに、しれっと Uniq型という配列の連続した重複要素を取り除く型も用意しています。
これを適用しないと、雀頭は同じ牌の組み合わせなので、同じResultが2個以上生成されてしまいます。


## 面子判定
正直雀頭が判定できたら面子も判定できるような気がしませんか？
ほぼ同じ発想で出来てしまいますが、今回型引数となるのはResult型の配列なので一工夫が必要です。

```typescript

type 数<P> = P extends `${infer N}${数牌の色}` ? `${N}` : never;
type 色<P> = P extends `${数牌の数}${infer C}` ? `${C}` : never;
type 隣の牌<P> =
  数<P> extends "1" ? `2${色<P>}` :
  数<P> extends "2" ? `3${色<P>}` :
  数<P> extends "3" ? `4${色<P>}` :
  数<P> extends "4" ? `5${色<P>}` :
  数<P> extends "5" ? `6${色<P>}` :
  数<P> extends "6" ? `7${色<P>}` :
  数<P> extends "7" ? `8${色<P>}` :
  数<P> extends "8" ? `9${色<P>}` :
  never;

type 面子判定<R extends Result, A0, A1, A2, Rest> =
  A2 extends undefined ? [] : (
    // 刻子チェック
    A0 extends A1 ?
      A1 extends A2 ?
          [{
            雀頭: R["雀頭"],
            面子: [...R["面子"], [A0, A1, A2]],
            Rest: Rest,
            役: [],
          }]
      : []
    // 順子チェック
    : 隣の牌<A0> extends A1  ?
      隣の牌<A1> extends A2 ?
          [{
            雀頭: R["雀頭"],
            面子: [...R["面子"], [A0, A1, A2]],
            Rest: Rest,
            役: [],
          }]
      : []
    : []
  )

type 面子マッチング2<R extends Result, A0, A1, P0, P1, P2, P3, P4, P5, P6, P7, P8, P9> =
  A1 extends undefined ? [] : [
    ...面子判定<R, A0, A1, P0, [P1, P2, P3, P4, P5, P6, P7, P8, P9]>,
    ...面子判定<R, A0, A1, P1, [P0, P2, P3, P4, P5, P6, P7, P8, P9]>,
    ...面子判定<R, A0, A1, P2, [P0, P1, P3, P4, P5, P6, P7, P8, P9]>,
    // ...くりかえし
  ];

type 面子マッチング1<R extends Result, A0, P0, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10> =
  A0 extends undefined ? [] : [
    ...面子マッチング2<R, A0, P0, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10>,
    ...面子マッチング2<R, A0, P1, P0, P2, P3, P4, P5, P6, P7, P8, P9, P10>,
    ...面子マッチング2<R, A0, P2, P0, P1, P3, P4, P5, P6, P7, P8, P9, P10>,
    // ...くりかえし
  ];

type 面子チェック<RS extends Result[]> =
  RS extends [ infer R, ...infer T ] ?
    R extends Result ? T extends Result[] ?
      Uniq<[
        ...面子マッチング1<R, R["Rest"][0], R["Rest"][1], R["Rest"][2], R["Rest"][3], R["Rest"][4], R["Rest"][5], R["Rest"][6], R["Rest"][7], R["Rest"][8], R["Rest"][9], R["Rest"][10], R["Rest"][11]>,
        ...面子マッチング1<R, R["Rest"][1], R["Rest"][0], R["Rest"][2], R["Rest"][3], R["Rest"][4], R["Rest"][5], R["Rest"][6], R["Rest"][7], R["Rest"][8], R["Rest"][9], R["Rest"][10], R["Rest"][11]>,
        ...面子マッチング1<R, R["Rest"][2], R["Rest"][0], R["Rest"][1], R["Rest"][3], R["Rest"][4], R["Rest"][5], R["Rest"][6], R["Rest"][7], R["Rest"][8], R["Rest"][9], R["Rest"][10], R["Rest"][11]>,
        // ...くりかえし
        ...面子チェック<T>
      ]>
    : [] : []
  : [];
```

雰囲気は雀頭判定で伝わったと思うので、一部コードを省略しています。
基本的な発想は雀頭判定と一緒で、面子は3つの牌が関わるため3重ループ(力技)を行っています。

ポイントは2箇所あります。1つ目は、引数が配列なので、inferを使ってHeadとTailに分割し、再起でResult配列を1要素ずつ面子マッチング1に食わせています。

もう一つは、面子判定の順子の判定です。刻子は同じ牌の集まりなので、雀頭判定と同じ発想で判定できます。
順子は123のような、連続する牌の集まりですので、隣の牌が隣の数字であることを判定する必要があります。
このために、 `1p` のような文字列から `1` と `p` を取り出す `数<P>` `色<P>` 型と、それらを用いて隣の牌の型を返す `隣の牌<P>` 型を定義しています。
`隣の牌<"1p">` は `"2p"` になるという寸法です。

これらを用いて実装された面子チェック型を4回適用すると次のようになります。

![例](https://manaten.net/wp-content/uploads/2021/12/ex3.png)

赤線は型適用の回数が爆発してきたことによるVSCodeの悲鳴です( `型のインスタンス化は非常に深く、無限である可能性があります。ts(2589)` などと言ってきます)。幸い、型のプレビューは出来ているので助かりました。

これをみると、しっかり面子に分けられていることがわかります。省略されてますが、他の組み合わせ(例の手では順番が違うだけ)も判定され、すべてのパターンが配列になっています。

雀頭と面子の分解ができれば、もう役判定はできそうな気がしてきませんか？


## 役判定
最後に、役判定です。今回時間がなかったため、[断么九](https://ja.wikipedia.org/wiki/%E6%96%AD%E4%B9%88%E4%B9%9D)と[平和](https://ja.wikipedia.org/wiki/%E5%B9%B3%E5%92%8C_(%E9%BA%BB%E9%9B%80))のみの判定となります。

```typescript
type 断么九判定<R extends Result> =
  R extends {
    雀頭: [中張牌, 中張牌],
    面子: [[中張牌, 中張牌, 中張牌], [中張牌, 中張牌, 中張牌], [中張牌, 中張牌, 中張牌], [中張牌, 中張牌, 中張牌]],
  } ? ["断么九"] : []

type 平和判定<R extends Result> =
  R["面子"][0][0] extends infer A ?
    R["面子"][1][0] extends infer B ?
      R["面子"][2][0] extends infer C ?
        R["面子"][3][0] extends infer D ?
          R extends {
            雀頭: [雀牌, 雀牌],
            面子: [
              [A, 隣の牌<A>, 隣の牌<隣の牌<A>>],
              [B, 隣の牌<B>, 隣の牌<隣の牌<B>>],
              [C, 隣の牌<C>, 隣の牌<隣の牌<C>>],
              [D, 隣の牌<D>, 隣の牌<隣の牌<D>>],
            ],
          } ? ["平和"] : []
        : []
      : []
    : []
  : []

type 役チェック<RS extends Result[]> =
  RS extends [ infer R, ...infer T ] ?
    R extends Result ? T extends Result[] ?
      Uniq<[
        {
          雀頭: R["雀頭"],
          面子: R["面子"],
          Rest: [],
          役: [
            ...断么九判定<R>,
            ...平和判定<R>,
          ],
        },
        ...役チェック<T>
      ]>
    : [] : []
  : [];
```

雀頭･面子の判定と比べてかなり素直になっています。
役チェックではResult配列を面子判定と同じテクニックでループさせています。
ループのそれぞれで、役プロパティに各役の判定結果を突っ込んでいます。

役判定の方は、[断么九](https://ja.wikipedia.org/wiki/%E6%96%AD%E4%B9%88%E4%B9%9D)の判定がかなり美しくないでしょうか？

```typescript
type 断么九判定<R extends Result> =
  R extends {
    雀頭: [中張牌, 中張牌],
    面子: [[中張牌, 中張牌, 中張牌], [中張牌, 中張牌, 中張牌], [中張牌, 中張牌, 中張牌], [中張牌, 中張牌, 中張牌]],
  } ? ["断么九"] : []
```

冒頭で定義した、中張牌の型を用いて、Resultがこの形になっているかを判定するだけです。
ちゃんと雀頭も各メンツも中張牌のみで構成されていれば、Resultはこの型のサブ型になっているはずですので、断么九という文字列が返ります。
これをやりたかったがためにこんな苦行をしてきたといっても過言ではない･･･

同じ発想で字一色や緑一色は判定できそうですね。混一色などは複合しない清一色を除くのが難しそうです。

対して[平和](https://ja.wikipedia.org/wiki/%E5%B9%B3%E5%92%8C_(%E9%BA%BB%E9%9B%80)はやや複雑です。面子がすべて順子であることの判定に、隣の牌型を頑張って利用しています。inferは関数型言語のletのように用いることもできるんですね。

```typescript
type 平和判定<R extends Result> =
  R["面子"][0][0] extends infer A ?
    R["面子"][1][0] extends infer B ?
      R["面子"][2][0] extends infer C ?
        R["面子"][3][0] extends infer D ?
          R extends {
            雀頭: [雀牌, 雀牌],
            面子: [
              [A, 隣の牌<A>, 隣の牌<隣の牌<A>>],
              [B, 隣の牌<B>, 隣の牌<隣の牌<B>>],
              [C, 隣の牌<C>, 隣の牌<隣の牌<C>>],
              [D, 隣の牌<D>, 隣の牌<隣の牌<D>>],
            ],
          } ? ["平和"] : []
        : []
      : []
    : []
  : []
```

# 実行結果
ここまでで、少なくとも断么九と平和を役判定できる型が完成しました。以下に実行例を示します。

冒頭の断么九平和を判定する例です。

![例](https://manaten.net/wp-content/uploads/2021/12/ex4.png)

面子の一つに1pを混ぜると、平和のみになりました。

![例](https://manaten.net/wp-content/uploads/2021/12/ex5.png)

順子を一つ刻子にすると、断么九のみになりました。

![例](https://manaten.net/wp-content/uploads/2021/12/ex6.png)

面子を一つ崩すと、アガリ無しとなり空配列になります。

![例](https://manaten.net/wp-content/uploads/2021/12/ex7.png)


# さいごに
TypeScriptのTemplate Literal Typeの紹介エントリを読んだとき、真っ先に麻雀役の判定を思いついたのですが、なかなか時間が取れず実行できませんでした。
今回Advent Calendarにかこつけて部分的ですが実現することが出来、満足しています。

現状だと面子の並び順で同じ手が重複した結果が生成されたり、そもそも手によっては巨大で結果をVSCodeくんが表示されなかったりします。

TypeScriptの型でこれだけ遊んだのは初めてなので、型の特性をわかっておらず、記述的にも実行効率的にも、より効率の良い書き方はきっとあるのだろうと思います。
また、アルゴリズムとしてもリー牌(ソート)すれば全探索はする必要ないはずですので、改善可能に思えます。

特に、現状版は刻子が多い手だと、雀頭候補が大量に判定されるため、結果が出なくなったりするようです。
いずれ改善したい･･･という気持ちだけあるが、所詮一発ネタなので2021年とともに忘れ去られる運命かも知れません。

何にせよ、TypeScriptの型の自由度、可能性がこのエントリを通してみなさんに伝われば幸いです。

# 参考文献
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) 
- [ghoullier/awesome-template-literal-types: Curated list of awesome Template Literal Types examples](https://github.com/ghoullier/awesome-template-literal-types)
- [TypeScriptで世界一型安全な型レベルSQL Interpreterを作っている話 | Studio Andy](https://blog.andoshin11.me/posts/typescript-sql-interpretor)
