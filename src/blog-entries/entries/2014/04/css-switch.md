![switch.gif](http://manaten.net/wp-content/uploads/2014/04/switch.gif)

画像のような切り替えスイッチをHTMLとCSSだけで作ります。

<!-- more -->


# デモ

<div>
<style>

.switch input {
    display: none;
}
.switch label {
    padding: 12px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
}

.switch label:before {
    padding: 6px 10px;
    content: 'O N';
    border-radius: 6px 0 0 6px;
    background: linear-gradient(to bottom, #F0F0F0 0%, #DDD 100%);
    box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.1) inset;
    color: #333;
}
.switch label:after {
    padding: 6px 10px;
    content: 'OFF';
    border-radius: 0 6px 6px 0;
    background: #C30;
    box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.1) inset;
    color: #FFF;
}
.switch input + label:hover:before {
    opacity: 0.5;
}
.switch input:checked + label:before {
    background: #9C0;
    color: #FFF;
    opacity: 1;
}
.switch input:checked + label:after {
    background: linear-gradient(to bottom, #F0F0F0 0%, #DDD 100%);
    color: #333;
}
.switch input:checked + label:hover:after {
    opacity: 0.5;
}
</style>
</div>

<div class="switch">
    <input id="switch" checked type="checkbox">
    <label for="switch"></label>
</div>

# コード

## html
```html
<div class="switch">
    <input id="switch" checked type="checkbox">
    <label for="switch"></label>
</div>
```

## CSS
```css
.switch input {
    display: none;
}
.switch label {
    padding: 12px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
}

.switch label:before {
    padding: 6px 10px;
    content: 'O N';
    border-radius: 6px 0 0 6px;
    background: linear-gradient(to bottom, #F0F0F0 0%, #DDD 100%);
    box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.1) inset;
    color: #333;
}
.switch label:after {
    padding: 6px 10px;
    content: 'OFF';
    border-radius: 0 6px 6px 0;
    background: #C30;
    box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.1) inset;
    color: #FFF;
}
.switch input + label:hover:before {
    opacity: 0.5;
}
.switch input:checked + label:before {
    background: #9C0;
    color: #FFF;
    opacity: 1;
}
.switch input:checked + label:after {
    background: linear-gradient(to bottom, #F0F0F0 0%, #DDD 100%);
    color: #333;
}
.switch input:checked + label:hover:after {
    opacity: 0.5;
}
```

# 解説

checkboxなinput要素と関連付けられたlabelを用意します。
input要素は隠してしまい、labelのbeforeとafterでそれぞれオン･オフのデザインを作ってあげます。
あとは隣接セレクタでチェックが入ってる時に見た目を変えてあげれば完成です。
