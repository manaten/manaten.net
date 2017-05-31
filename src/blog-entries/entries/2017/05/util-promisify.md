先日Node.js8 がリリースされました [参考](https://nodejs.org/en/blog/release/v8.0.0/) 。
追加機能の中に `util.promisify` というものがあります。これは、すでに
[bluebird](http://bluebirdjs.com/docs/api/promise.promisify.html) や
[es6-promisify](https://www.npmjs.com/package/es6-promisify) といったパッケージで提供されていた、
コールバック関数を伴う非同期関数をPromiseを返す関数化するユーティリティ関数ですが、今回のリリースでNode本体に含まれるようになったようです。


# 何に使うのか

コールバック関数を伴う非同期関数、たとえば `fs.readdir` は次のように使います。

```js
fs.readdir(__dirname, (err, result) => {
  console.log(result);
});
```

しかし、現状JavaScriptでの非同期処理関数は、コールバックスタイルよりもPromiseを返す関数のほうがメジャーであり、
他の関数と合わせて使う上で不便です。また、ネストしたときの見通しもあまり良くないです。

そこで、promisify関数を使うと `fs.readdir` をPromiseを返す関数化でき、上記処理は次のように書けます。

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

npmには便利なパッケージがコールバックスタイルで用意されていることも多く、こういった資産をモダンなPromiseスタイルやasync/awaitスタイルのコードで利用するために promisify は便利な存在です。


# レシーバの扱いについて

ところで、普通の非同期関数をpromisifyする場合は問題ないのですが、オブジェクトのメソッドをPromise化するときは単純には行きません。
メソッドはその実装で `this` を利用しているため、何も考えずにメソッドを `promisify` の引数にしてしまうと、 `this` を参照できなくなってしまうからです。

例えばmysqlのクエリ実行などです。

```js
const {promisify} = require('util');
const mysql      = require('mysql');
const conn = mysql.createConnection({...});
conn.connect();

const result = await promisify(conn.query)('SELECT 1 + 2 AS solution');
console.log(result);
```

これは一見うまくいきそうですが、以下のようなエラーとなってしまいます。

```

```

bluebird/es6-promisifyとの比較
thisをどう使うか

# 参考
- [Util | Node.js v8.0.0 Documentation](https://nodejs.org/api/util.html#util_util_promisify_original) - ドキュメント
- [Node.js 8: `util.promisify()`](http://2ality.com/2017/05/util-promisify.html) - 解説記事
- [Nodeへutil.promisify()の追加 - 技術探し](http://abouthiroppy.hatenablog.jp/entry/2017/04/27/110733) - 解説記事
- [node/util.js at v8.0.0 · nodejs/node](https://github.com/nodejs/node/blob/v8.0.0/lib/internal/util.js#L204) - util.promisifyの実装
- [es6-promisify](https://www.npmjs.com/package/es6-promisify)
- [Promise.promisify | bluebird](http://bluebirdjs.com/docs/api/promise.promisify.html)
- [Hubotでasync functionを使う - MANA-DOT](http://blog.manaten.net/entry/hubot-with-async-func)
