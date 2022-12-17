<!--
title: レガシーなjs環境におすすめなts-checkコメントについて
date:  2022-06-10 00:00
categories: []
-->


# このエントリの内容

このエントリは、javascriptの型チェックをすることができるtypescriptの機能 [@ts-check](https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html) について紹介し、個人的に感じた便利なところや使い所を紹介していきます。

このエントリの読者は以下のような人を想定しています。

- レガシーな環境でTypeScriptを導入しづらいが、複雑化するコードベースを少しでも楽に保守したい人
- TypeScriptに興味があるが、昨今のjsのツールチェインについていけず、とりあえず試してみたい人


<!-- more -->


# @ts-checkとは

@ts-checkとは、JavaScriptファイルの先頭に `//@ts-check` というコメントをすることで、TypeScriptコンパイラや、TypeScriptを標準で型チェックできる [VSCode](https://code.visualstudio.com/) により、JavaScriptファイルに対してTypeScript相当の型チェックを行う事ができる仕組みです。


![tscheck](https://manaten.net/wp-content/uploads/2022/06/tscheck00.png)

上記の例では、Number型の変数aにはpushというプロパティが存在しないため、型エラーとなっています。

なおts-checkとはチェックを有効化するためのコメントのことで正確な機能名ではありません。 [JS Projects Utilizing TypeScript](https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html) にて解説されている、 `@ts-check` コメントを書くことでTypeScriptコンパイラにJavaScriptファイルもチェックさせることを、このエントリでは便宜上ts-checkと呼びます。

# なにができるのか

`@ts-check` と書くことでVSCodeにJavaScriptファイルも型チェックさせることができるのは上記のとおりですが、より詳しく説明すると以下のことができます。

- TypeScriptと同様の型推論を行い、型定義がなくてもある程度型を推論してくれ、型チェックができる
- 型が機能することによる、VSCodeでの厳密なコード補完
- JSDocによる、明示的な型付けや型定義
- TypeScriptの型定義ファイルの利用による、外部ライブラリの型チェック･コード補完

それぞれ詳しく見ていきます。

## TypeScriptと同様の型推論を行い、型定義がなくてもある程度型を推論してくれ、型チェックができる

冒頭の例がまさにそうですが、一切型宣言のないJavaScriptファイルでも、推論可能な型は型推論してくれ(これ自体はTypeScriptでも一緒で、すべての変数に型定義する必要はないです)、今までのJavaScriptファイルにとりあえず `@ts-check` を書くだけでもある程度は型チェックすることができてしまいます。

変数宣言だけでなく、関数も推論可能であれば推論できます。

![tscheck](https://manaten.net/wp-content/uploads/2022/06/tscheck01.png)

この例では明らかにnumberしか返さない関数であるため、numberを返す関数であると推論できています。また、`Math.floor` `Math.random` を呼び出していますが、標準関数についても型定義をTypeScriptが知っているため、型チェック可能です。

## 型が機能することによる、VSCodeでの厳密なコード補完

TypeScriptユーザーからすると当たり前のことではありますが、JavaScriptファイルもTypeScriptが型チェックできるということは、VSCodeが厳密なコード補完をできるということです。

![tscheck](https://manaten.net/wp-content/uploads/2022/06/tscheck02.png)

上記の例では、ブラウザAPIでおなじみの `document.getElementById` で取得した `HTMLElement` に対して、プロパティ名( `addEventListener` )を補完させようとしています。大量にあるブラウザAPIを補完でき、またタイポしていたりシグニチャを間違えていたりしてもチェックでエラーを出してくれるため、非常に便利です。(ちなみに、ブラウザAPIも標準で読み込まれます)

## JSDocによる、明示的な型付けや型定義

### 明示的な型宣言

ここまでは型推論のみでの型チェックを紹介してきましたが、JSDocを使うことで、型宣言を行うこともできます。

![tscheck](https://manaten.net/wp-content/uploads/2022/06/tscheck03.png)

上記では、string型を引数に取る `sayHello` 関数を実装しており、直後にnumber型で呼び出そうとしたためチェックエラーとなっています。

また、関数の戻り値を間違っている際もエラーにすることができます。

![tscheck](https://manaten.net/wp-content/uploads/2022/06/tscheck04.png)

しっかりJSDocで型宣言をしておくことで、誤った型を返却したり、returnの書き忘れを防止することができます。

### 型定義

また、JSDocにより自作型の定義も行うことができます。

![tscheck](https://manaten.net/wp-content/uploads/2022/06/tscheck05.png)

`@typedef` により、型に名前を与えることができ(ここで型リテラルとして、TypeScriptで有効な型はだいたい与えることができます)、 その型を `@type` 宣言で変数に型宣言しています。画像のように、型宣言した変数に対し、型を間違えたプロパティを与えたり、存在しないプロパティを与えたりしようとするとエラーとなります。

![tscheck](https://manaten.net/wp-content/uploads/2022/06/tscheck06.png)

また、こうして定義された型は当然VSCodeでのコード補完をすることもできます。JavaScriptで独自のオブジェクトを定義する機会は非常に多いため、これらを型安全に扱うことができるのはとても便利です。ちなみに、 `@typedef` しなくてもある程度は型推論でどうにかなることもありますが、型定義したほうがより安全にコーディングできるため断然おすすめです。

JSDocによりTypeScriptコンパイラができることは、 [TypeScript: Documentation - JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html) に書れているため、より詳しく知りたい人はこちらも参照してください。

## TypeScriptの型定義ファイルの利用による、外部ライブラリの型チェック･コード補完

TypeScript向けに書かれた型定義ファイルを利用することで、外部ライブラリについても型チェックすることができます。

![tscheck](https://manaten.net/wp-content/uploads/2022/06/tscheck07.png)

上記例では、型定義ファイルが提供されているlodashをrequireしたときに、JavaScriptファイルでもlodash配下の関数が型定義されており補完できることを示しています。

また、 `@type` 宣言時に import を行うことで外部の型定義を利用して変数宣言することもできます。

![tscheck](https://manaten.net/wp-content/uploads/2022/06/tscheck08.png)

上記の例は、next.jsが提供しているConfigの型定義をnextConfigというオブジェクトの変数に適用してあげることで、プロパティ名の補完や型チェックを可能にしています。設定ファイルをjsで書かないといけない場合に設定名の間違いなどを減らすことができ、とても便利です。

# TypeScriptの型の美味しい話

この節はTypeScript初学者向けに、 `@ts-check` を通して利用できるTypeScriptの(個人的に)便利機能を紹介していきます。

## 型推論

ここまでで何度か紹介しましたが、**｢人間が明示的に型を宣言しなくても、コンパイラが分かる範囲で型をつけてくれる｣**機能となります。

![tscheck](https://manaten.net/wp-content/uploads/2022/06/tscheck01.png)

先程のmyRandomの例ですが、｢Math.randomはnumberを返す｣｢number*numberはnumberを返す｣｢Math.floorはnumberを返す｣ことから、myNumberはnumberを返す関数であることを勝手に推論してくれています。

これは、もともと型のなかったコードをとりあえず型チェックしたい場合に非常に便利で、｢型が大事なのはわかるけど、今あるコードを全部治すことはできないよ｣という悩みを大幅に軽減してくれます。

また、これから書くコードであっても｢推論可能な型はわざわざ人間が書く必要がない｣ということになります。

![tscheck](https://manaten.net/wp-content/uploads/2022/06/tscheck09.png)

たとえば、上記の例では `addEventListener` の第2引数に与えたクロージャの引数は、 `Event` であることが推論可能であるため、特に型宣言などしなくても勝手にevは `Event` 型となり、プロパティ名の補完や型チェックを行うことができます。

## 漸進的型つけ

TypeScriptといえば、最も世界で使われている漸進的型付けの言語であると言えます。

[What is Gradual Typing: 漸進的型付けとは何か - Qiita](https://qiita.com/t2y/items/0a604384e18db0944398)

漸進的型付けの言語は、動的型と静的型のいいとこ取りと表現されることもありますが、大雑把に以下のような振る舞いをする言語という風に理解しています(間違っていたら指摘してください･･･)。

- 型付けのある変数や関数に対しては、静的言語のように型チェックを行う
    - ここまでで触れてきたとおり
- 型付けがない変数や関数に対しては、動的言語のように振る舞う
    - つまり型チェックをせず、型付けの無い変数に対しては任意の演算が可能であるし、任意の関数に渡すことができる。型付けのない関数は任意の引数を受け取ることができる。それでまずかった場合は実行時にエラーとなる。
        - ※ ただしTypeScriptは型推論も行うことができるため、人間が型を書かなかったコードが必ずしも型付けがないわけではない
    - このような型付けがない変数は、型としては `any` 型となり、上記のような挙動となる。
- 型付けのない変数を後付けで型付けすることができる
    - TypeScriptでは上記のように型付けがない変数は `any` 型となるが、  `any`型の変数は任意の型の変数に代入可能で、代入するとその型の変数として扱われる
        - 型定義のない未知のライブラリの返却値は `any`となるが、返す型がわかっているなら適切な型に再代入できる
        - よくある例としては、API返却値に対するJSON.parseなど。JSON.parseの返却値はanyとなってしまうが、プログラマは実際のAPIの返却型を知っているので、型を後付けできる
            
            ![tscheck](https://manaten.net/wp-content/uploads/2022/06/tscheck10.png)
            
- 型付けのある変数を後付で型をなくすことができる
    - 型定義のない外部ライブラリの関数に対して、型付けされた変数を渡すことができる

漸進的型付けのこれら特徴と、型推論を合わせて、従来の型のないJavaScriptのファイルでも動かすことができ、またTypeScript対応していない過去のリソースでもとりあえず動かすことができるのがTypeScriptの強みです。もちろん、 `any` が多ければ多いほど型の恩寵は受けれなくなるので、適宜型定義をしていくことが大切です。

## union typeとtype guard

個人的にTypeScriptで一番好きな機能として、Union TypeとType Guardがあります。

Union Type では `|` をつかって型定義することで、 ｢A型またはB型｣という型を定義することができます。一番わかりやすい例はnullableでしょう(※ nullチェックを有効化するには、TypeScriptのstrictオプションを使う必要があります)。

![tscheck](https://manaten.net/wp-content/uploads/2022/06/tscheck11.png)

この例では｢idに対応する値があれば値を、なければnullを返す｣関数を `string | null` としてstringまたはnullを返す関数として宣言しており、その結果をそのままstringとして使おうとしたため、nullの可能性があるとしてエラーが出力されています。JavaScriptにおいてnullまたは値を返す関数は頻出し、都度nullチェックを怠らないということが求められますが、TypeScriptではこの悩みから開放されます。

さらに、Union TypeはType Guardの仕組みを使って快適に操作ができます。

![tscheck](https://manaten.net/wp-content/uploads/2022/06/tscheck12.png)

この例では、if文で｢someNameはnullではない｣とチェックした場合、そのブロック内では **someNameをstringとして** 扱うことができています。このような、条件分岐(など)によって型を限定し、実際に型チェッカーも限定された型として扱ってくれる機能を**Type Guard**といったりします。Type Guardの素晴らしいところは、自然なコードで必要な条件分岐をした結果コンパイラも自然に型を断定してくれ、その後も自然にコードを書き続けられるところです(TypeGuardがない言語では、明示的にキャストをする必要があるはずです)。

最後に、Union TypeとType Guardのより複雑な例を紹介して終了します。

![tscheck](https://manaten.net/wp-content/uploads/2022/06/tscheck13.png)

この例では、bowメソッドを持つDog型とmeowメソッドを持つCat型、そしてそのいずれかであるAnimal型を定義しています。そして、実際のanimal型の変数に対して、typeプロパティがdogなのかcatなのかにより、Type Guardで型を限定し、型エラーとならずにmeowメソッドやbowメソッドを呼び出せています(TypeGuard外での呼び出しや、誤った組み合わせはエラーになります)。

現実でもこういった、すぐには内容を特定できないような型というのはしばしば発生するため、その際も非常に役立つ機能です。

## ジェネリクス

TypeScriptではジェネリクスを利用でき、総称型に型パラメータを与えることで、特化した型を生成できます。

![tscheck](https://manaten.net/wp-content/uploads/2022/06/tscheck14.png)

たとえば、numberの配列にはnumberしかpushできず、添字で取得した値もnumberであることが保証されます

# CLIでチェックする

ここまででts-checkの便利さはお伝えしてきましたが、実際に利用するときはvscodeではなくコマンドラインで継続的に型チェックしたくなると思います。

ここまで読んでピンときた方もいるかも知れませんが、 `@ts-check` コメントとは、JavaScriptに型付けして型チェックさせるための宣言というよりは、このJavaScriptファイルをTypeScriptファイルと同等に扱う(さらに、JSDocがあればTypeScriptの型宣言のように扱う)機能と言えます。

つまり、cliから型チェックしたいという場合は、普通にtscコマンドを利用することで型チェックが可能です。

![tscheck](https://manaten.net/wp-content/uploads/2022/06/tscheck15.png)

JSファイルも読み込む `--allowJs` オプションと、チェックだけを行いコンパイルを行わない `--noEmit` オプションを指定することで、tscによるJSファイルの型チェックができます。

また、実は `--checkJs` オプションを使うことで、 `@ts-check` を書かずとも、JavaScriptファイルをチェック対象にすることもできます。

![tscheck](https://manaten.net/wp-content/uploads/2022/06/tscheck16.png)

つまり、TypeScriptコンパイラにはそもそも `checkJs` でJavaScriptファイルも型チェックする機能が備わっており、 `@ts-check` は `checkJs` を指定してなくてもチェック対象に含めるための宣言であるというふうにも考えることができます。

TypeScriptの設定に詳しい人は、 これらのフラグをオンにした `tsconfig.json` をプロジェクトルートに設置するのも良いと思います。先述の `strict` などは、 `tsconfig.json` に書くのがおすすめです。

# @ts-checkの使いどころ

最後に、僕が `@ts-check` を使うと便利なところ、逆に使いづらいところを紹介していきます。

## 使い所

### レガシープロダクト

レガシーで直ちにTypeScript化しづらい、またTypeScriptのビルドシステムを導入しづらいプロダクトにはピッタリのソリューションだと思います。とりあえずチェック可能なファイルから `@ts-check` とかくだけで始められますし、型推論や漸進的型付で最低限の型導入ができます。慣れてきたり、より重要なロジックでは型宣言をしたり、strictオプションを使っていくことで緩急をつけて導入していくことができます。

### トイプロダクトやスクリプティング

いちいちビルドフェーズを作り込みたくない、トイプロダクトや気軽なスクリプティングにも向いていると言えます。 `@ts-check` したJavaScriptファイルはTypeScriptチェックが可能とはいえ単にJSDocの書かれたJavaScriptファイルなので、**そのままnodeやブラウザで実行可能**です。

### jsファイルであることが求められている設定ファイルなど

既に紹介しましたが、next.jsやwebpackのconfigファイルなど、**jsで書くことが求められている設定ファイル**を型安全に書きたいというケースでも便利です。頑張ってTypeScriptからビルドする仕組みを作り込んでもいいですが、ts-checkはお手軽でおすすめです。

## 使いづらいところ

### TypeScriptの機能を十全に発揮したいところ

JSDocで型宣言を行う以上、残念ながらTypeScriptのすべての機能を利用することはできません。たとえばジェネリクスで型引数を取る型の宣言はできませんし、関数呼び出し事の型引数の適用もできません。これによりたとえば、 `Array.filter` で型を絞りたい場合に絞る先の型を明示できず絞れない、なども問題が起こります。

![tscheck](https://manaten.net/wp-content/uploads/2022/06/tscheck17.png)

上記の例は、本当は `number[]` になってほしいが型を絞れず、 `(string|number)[]` になってしまいます。TypeScriptでは型引数を与えることで限定できます。

![tscheck](https://manaten.net/wp-content/uploads/2022/06/tscheck18.png)

### 巨大プロジェクト

上記のような機能制限や、JSDocで記述しなければいけないことによる記述性の低さから、大きなプロジェクトでは無理せずビルドの仕組みを組んで、TypeScriptで開発するのが良いでしょう。あくまで、ビルドシステムが用意しづらい･用意するほどではないものに対しての限定的な選択肢であるべきだと思います。

# まとめ

本エントリではTypeScriptコンパイラでJavaScriptコードの型チェックをすることができる `@ts-check` コメントについて紹介しました。JSDocを適切に書くことで(書かなくても型推論によってある程度)JavaScriptのコードでTypeScriptとほぼ同等の漸進的型付けプログラミングを行うことができます。

本エントリのサンプルコードは https://github.com/manaten/ts-check-example にありますので、興味がある方は触ってみるのもいいかもしれません( `npm test` で型チェックが走るようになっています)。

ちなみに、Microsoftは [このエントリ](https://www.publickey1.jp/blog/22/javascripttypes_as_commentsjavascripttc39.html) で紹介されている通り、JavaScript本体に型宣言のための構文の導入を目論んでいるようで、今回紹介したts-checkとJSDocによる型チェックを、JavaScript上の構文という形に昇華させたいのかな？という雰囲気を感じられます。エントリを読む限りは、TypeScriptに近い構文だが、実行時には無視され、外部の型チェッカーで型チェックできるもののようで、ts-checkのJSDocコメントと役割的には同じに見えます。

# 参考リンク

- [TypeScript: Documentation - JS Projects Utilizing TypeScript](https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html)
- [TypeScript: Documentation - Type Checking JavaScript Files](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html)
- [TypeScript: Documentation - JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- [What is Gradual Typing: 漸進的型付けとは何か - Qiita](https://qiita.com/t2y/items/0a604384e18db0944398)
- [マイクロソフト、JavaScriptに型宣言を追加しつつトランスパイラ不要の「Types as Comments」をJavaScript仕様策定会議のTC39に提案へ － Publickey](https://www.publickey1.jp/blog/22/javascripttypes_as_commentsjavascripttc39.html)
- https://github.com/manaten/ts-check-example
    - 本エントリで利用したサンプルコード
- [TypeScriptの型定義で麻雀の役判定をする 【dwango Advent Calendar 2日目】 - MANA-DOT](https://blog.manaten.net/entry/2021/12/03/030217)
