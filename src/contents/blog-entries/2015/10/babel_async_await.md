<!--
title: babelのasyncで遊んでみたメモ
date:  2015-11-xx 12:00
categories: [javascript,babel,memo]
-->

![babelのasyncで遊んでみたメモ](http://manaten.net/wp-content/uploads/2015/11/babel.png)

ES7から利用可能な [async/await](https://tc39.github.io/ecmascript-asyncawait/) は非同期プログラミングの際に非常に魅力的な構文です。
babelを用いることによりES5の環境でもコードを実行可能です。

babelで非同期処理がどのように変換されるのか興味があったので、いろいろ遊んでみました。

<!-- more -->

# async function

簡単なPromiseを用いた非同期コードとして以下の様な例があります。

```javascript
function wait(msec) {
  return new Promise((resolve) => setTimeout(resolve, msec));
}

function main() {
  console.log('hoge');
  wait(2000).then(() => {
    console.log('fuga');
  });
}
main();
```

setTimeoutを用いた非同期なwait関数を呼ぶだけの例です。
async/awaitを用いると上のコードを次のように記述できます。

```javascript
function wait(msec) {
  return new Promise((resolve) => setTimeout(resolve, msec));
}

async function main() {
  console.log('hoge');
  await wait(2000);
  console.log('fuga');
}
main();
```

ネストがなくなり、より人間に直感的な形で記述できるようになりました。


# babelで変換してみる

babelを用いることで、上記async/awaitを利用したコードをES5の処理系で実行可能な形に変換できます。
babelは通常 [regenerator-babel](https://www.npmjs.com/package/regenerator-babel) を用いて async/await を変換するようです。

```javascript
function wait(msec) {
  return new Promise((resolve) => setTimeout(resolve, msec));
}

async function main() {
  console.log('hoge');
  await wait(2000);
  console.log('fuga');
}
main();
```

このコードは次のようになります。

```javascript
function wait(msec) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, msec);
  });
}

function main() {
  return regeneratorRuntime.async(function main$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        console.log('hoge');
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(wait(2000));

      case 3:
        console.log('fuga');

      case 4:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}
main();
```

regeneratorを用いたやや複雑なコードが吐き出されました。
awaitのタイミングで `main$` の実行が中断され、 `wait(2000)` が終了すると再度呼び出されるが、 `context$1$0.next` の値が変化してるため中断された箇所から実行されるのであろうことはなんとなく想像できます。

## 制御構文

上記のような単純なコードの変換は納得ができますが、if、whileなどの制御構文がどうなるかも気になります。

```javascript
async function getWithRetry(retryCount) {
  let result = false;
  for (let i = 0; i < retryCount; i++) {
    try {
      result = await getSomething();
    } catch(e) {}
    if (result !== false) {
      break;
    }
    console.log('retry');
  }
  if (result) {
    return result;
  }
  throw new Error('fail!');
}
```

例えば上記のような、取得できるまでリトライするコードを変換してみます。

```javascript
function getWithRetry(retryCount) {
  var result, i;
  return regeneratorRuntime.async(function getWithRetry$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        result = false;
        i = 0;

      case 2:
        if (!(i < retryCount)) {
          context$1$0.next = 17;
          break;
        }

        context$1$0.prev = 3;
        context$1$0.next = 6;
        return regeneratorRuntime.awrap(getSomething());

      case 6:
        result = context$1$0.sent;
        context$1$0.next = 11;
        break;

      case 9:
        context$1$0.prev = 9;
        context$1$0.t0 = context$1$0['catch'](3);

      case 11:
        if (!(result !== false)) {
          context$1$0.next = 13;
          break;
        }

        return context$1$0.abrupt('break', 17);

      case 13:
        console.log('retry');

      case 14:
        i++;
        context$1$0.next = 2;
        break;

      case 17:
        if (!result) {
          context$1$0.next = 19;
          break;
        }

        return context$1$0.abrupt('return', result);

      case 19:
        throw new Error('fail!');

      case 20:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[3, 9]]);
}
```

このコードを見ると、case説のそれぞれがラベルになってて `context$1$0.next` を指定して `break` するのが GOTO、
`context$1$0.next` に次の行を指定してPromise返すのがawaitなんだなとなんとなく理解できますね。
(breakで `switch` を抜けると直上に `while(1)` があるため、再度実行されて `context$1$0.next` で指定した箇所から再開される)

気になるのが元のコードでtry-catchしてる箇所ですが、 `regeneratorRuntime.async` の第四引数が `tryLocsList` であり、そこに渡っている `[3,9]` が、
3番で例外が発生した場合のキャッチ節が9番であることを知らせているようで、 `getSomething` で例外が発生した場合は9番に入る模様ですね。

case節を使ってラベル+GOTOを表現するのが面白いですね。


# asyncToGenerator

ところで、[asyncToGenerator](https://babeljs.io/docs/advanced/transformers/other/async-to-generator/) オプションを使用することで、regeneratorを使わずasync/awaitをES6 generatorを用いたコードを出力できるようです。

```javascript
function wait(msec) {
  return new Promise((resolve) => setTimeout(resolve, msec));
}

async function main() {
  console.log('hoge');
  await wait(2000);
  console.log('fuga');
}
main();
```

このコードは次のように変換されます。


```javascript
var main = _asyncToGenerator(function* () {
  console.log('hoge');
  yield wait(2000);
  console.log('fuga');
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function wait(msec) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, msec);
  });
}

main();
```

`_asyncToGenerator` がやや複雑であるものの、main関数はregeneratorを用いた変換と比べ、かなり素直に変換されています。
この形は、[Async Functions の Informative Desugaringの項](https://tc39.github.io/ecmascript-asyncawait/#desugaring)とほぼ同じですね。 `_asyncToGenerator` 関数は `spawn` 関数と形がやや違うもののやってることはほぼ同じです。
asyncToGeneratorオプションは上記desugaringの実装と言えそうです。


## 制御構文

```javascript
async function getWithRetry(retryCount) {
  let result = false;
  for (let i = 0; i < retryCount; i++) {
    try {
      result = await getSomething();
    } catch(e) {}
    if (result !== false) {
      break;
    }
    console.log('retry');
  }
  if (result) {
    return result;
  }
  throw new Error('fail!');
}
```

先ほどの制御構文を用いたコードも変換してみます。

```javascript
var getWithRetry = _asyncToGenerator(function* (retryCount) {
  var result = false;
  for (var i = 0; i < retryCount; i++) {
    try {
      result = yield getSomething();
    } catch (e) {}
    if (result !== false) {
      break;
    }
    console.log('retry');
  }
  if (result) {
    return result;
  }
  throw new Error('fail!');
});
```

こちらでも変わらず、素直に変換されました。

## asyncToGenerator → regenerator

ちなみに、asyncToGeneratorで変換したコードをregeneratorで再変換すると次のようになります。


```javascript
var main = _asyncToGenerator(regeneratorRuntime.mark(function callee$0$0() {
  return regeneratorRuntime.wrap(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        console.log('hoge');
        context$1$0.next = 3;
        return wait(2000);

      case 3:
        console.log('fuga');

      case 4:
      case 'end':
        return context$1$0.stop();
    }
  }, callee$0$0, this);
}));

function _asyncToGenerator(fn) { /** 省略 */ }

function wait(msec) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, msec);
  });
}

main();
```

main関数の形が最初のregeneratorを用いた変換に近い形になりました。
`regeneratorRuntime.async` の [実装](https://github.com/rdy/regenerator-babel/blob/master/runtime.js#L96) を見てみると、 `_asyncToGenerator` 相当の処理を `regeneratorRuntime.wrap` した関数に対して行っていることがわかり、変換→再変換したコードとだいたい一緒であることがわかります。面白いですね。


# 感想

regeneratorによる変換はbabelのほかのES6の変換と違い、もとの文脈をかなり破壊するのでちょっと怖いし、パフォーマンスも心配です。デバッグもやりづらそう。
遊びコードなら使うと楽しそうですけど、真面目コードで使うのは少し不安ですね。

対してasyncToGeneratorによる変換はかなり素直な変換なので、
generatorを利用できる環境ならば、asyncToGeneratorを使うと結構安心して使えそうです。


# 参考リンク

- [Async Functions](https://tc39.github.io/ecmascript-asyncawait/)
- [regenerator · Babel](https://babeljs.io/docs/advanced/transformers/other/regenerator/)
- [asyncToGenerator · Babel](https://babeljs.io/docs/advanced/transformers/other/async-to-generator/)
