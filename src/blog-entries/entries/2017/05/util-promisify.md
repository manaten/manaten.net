<!--
title: Node.js8になって util.promisify が利用できるようになったのでメモ
date:  2017-05-31 12:00
categories: [javascript,promise]
-->

先日Node.js8 がリリースされました ([参考](https://nodejs.org/en/blog/release/v8.0.0/)) 。
追加機能の中に `util.promisify` というものがあります。これは、すでに
[bluebird](http://bluebirdjs.com/docs/api/promise.promisify.html) や
[es6-promisify](https://www.npmjs.com/package/es6-promisify) といったパッケージで提供されていた、
コールバック関数を伴う非同期関数を、Promiseを返す関数化するユーティリティ関数ですが、今回のリリースでNode本体に含まれるようになったようです。

<!-- more -->

# 何に使うのか

コールバック関数を伴う非同期関数、たとえば `fs.readdir` は次のように使います。

```js
fs.readdir(__dirname, (err, result) => {
  console.log(result);
});
```

しかし、現状JavaScriptでの非同期処理関数は、コールバックスタイルよりもPromiseを返す関数のほうがメジャーであり、
他の関数と合わせて使う上で不便です。また、ネストしたときの見通しもあまり良くないです。

そこで、 `promisify` 関数を使うと `fs.readdir` をPromiseを返す関数化でき、上記処理は次のように書けます。

```js
const {promisify} = require('util');
promisify(fs.readdir)(__dirname)
  .then(result => console.log(result));
```

また、最近のNode.jsではasync/awaitがサポートされているため、次のように書くこともできます。

```js
const result = await promisify(fs.readdir)(__dirname);
console.log(result);
```

npmには便利なパッケージがコールバックスタイルで用意されていることも多く、そういった資産をモダンなPromiseスタイルやasync/awaitスタイルのコードで利用するときに `promisify` は重宝します。


# thisの扱いについて

ところで、普通の非同期関数を `promisify` する場合は問題ないのですが、オブジェクトのメソッドを `promisify` する場合は単純には行きません。
メソッドはその実装で `this` を利用しているため、何も考えずにメソッドを `promisify` の引数にしてしまうと、 `this` を参照できなくなってしまうからです。

例えばmysqlのクエリ実行などです。

```js
const {promisify} = require('util');
const mysql = require('mysql');
const conn = mysql.createConnection({...});
conn.connect();

const result = await promisify(conn.query)('SELECT 1 + 2 AS solution');
console.log(result);
```

これは一見うまくいきそうですが、以下のようなエラーとなってしまいます。

```
TypeError: Cannot read property 'typeCast' of undefined
```

これは、 `query` メソッドが実際に動作するときに、本来なら `this` 経由で得られる `conn` への参照が失われたことで、 `conn` の持っている情報(この場合は `typeCast` プロパティ)にアクセスできなくなるためです。

## bluebird, s6-prpmisify の場合
このような問題を解決するために、 
[bluebird](http://bluebirdjs.com/docs/api/promise.promisify.html) や
[es6-promisify](https://www.npmjs.com/package/es6-promisify)
では、以下のような記述ができるようになっています。


```js
const {promisify} = require('bluebird');
const result = await promisify(conn.query, {context: conn})('SELECT 1 + 2 AS solution');
console.log(result);
```

```js
const promisify = require('es6-promisify');
const result = await promisify(conn.query, conn)('SELECT 1 + 2 AS solution');
console.log(result);
```

どちらも、 `promisify` の第二引数で、何らかの形で `this` への参照を渡せるようになっています。

## util.promisifyではどうするか
[ドキュメント](https://nodejs.org/api/util.html#util_util_promisify_original)を読んだところ、 `this` を渡す方法は特に書かれていないようです。
[コード](https://github.com/nodejs/node/blob/v8.0.0/lib/internal/util.js#L204)を読んでも、 `promisify` の引数経由で `this` を渡す方法は定義されていないようです。
ですがよく見ると、 `promisify` の生成する関数は、その関数の `this` を元になった `this` として渡す挙動になっているようです([参考](https://github.com/nodejs/node/blob/v8.0.0/lib/internal/util.js#L229))。
ですので、次のように、promisifyで生成された関数に `this` を束縛することで正しく動作させることができます。

```js
const {promisify} = require('util');
const result = await promisify(conn.query).bind(conn)('SELECT 1 + 2 AS solution');
console.log(result);
```

少し冗長ですが、元となった関数の挙動をそのままにPromise化する、と考えれば自然なのかもしれません。

## bind-operator が実装されたら・・・
余談ですが、 [proposal-bind-operator](https://github.com/tc39/proposal-bind-operator) が実装されれば、次のように書くことができます。

```js
const result = await conn::(promisify(conn.query))('SELECT 1 + 2 AS solution');
```

または

```js
const result = await promisify(::conn.query)('SELECT 1 + 2 AS solution');
```

随分シンプルに書けるようになるため、実装が待ち遠しいです。

# 参考
- [Util | Node.js v8.0.0 Documentation](https://nodejs.org/api/util.html#util_util_promisify_original) - ドキュメント
- [Node.js 8: `util.promisify()`](http://2ality.com/2017/05/util-promisify.html) - 解説記事
- [Nodeへutil.promisify()の追加 - 技術探し](http://abouthiroppy.hatenablog.jp/entry/2017/04/27/110733) - 解説記事
- [node/util.js at v8.0.0 · nodejs/node](https://github.com/nodejs/node/blob/v8.0.0/lib/internal/util.js#L204) - util.promisifyの実装
- [es6-promisify](https://www.npmjs.com/package/es6-promisify)
- [Promise.promisify | bluebird](http://bluebirdjs.com/docs/api/promise.promisify.html)
- [tc39/proposal-bind-operator: This-Binding Syntax for ECMAScript](https://github.com/tc39/proposal-bind-operator)
- [Hubotでasync functionを使う - MANA-DOT](http://blog.manaten.net/entry/hubot-with-async-func)
