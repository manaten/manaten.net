<!--
title: まなてん的 プロンプトは頑張らないstable diffusion
date:  2023-02-09 00:00
categories: []
-->

実は最近StableDiffusionで画像生成を楽しんでいます。

おそらく多くの人とは違い、自分はtxt2imgでプロンプトを頑張ることはせず、**img2imgメインでイラスト生成**をしています。覚書の意味も含めてイラスト生成の手順を紹介します。

今回は**｢商店街のど真ん中でダイソンのコードレス掃除機を自慢する緑髪の魔女の女の子｣**を生成します。

利用しているのは [AUTOMATIC1111/stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) 、モデルは [Delcos/Hentai-Diffusion](https://github.com/Delcos/Hentai-Diffusion) です。HentaiDiffusionは名前はいかがわしいですが、かわいいイラストを出しやすいです。

## 完成形

![20230206.png](https://manaten.net/wp-content/uploads/2023/02/20230206.png)

｢商店街のど真ん中でダイソンのコードレス掃除機を自慢する緑髪の魔女の女の子｣です。


<!-- more -->


# 0. 元絵の準備

## 素材の用意

構図を大雑把に脳内でイメージし、必要な素材を集めます。

- 魔女の女の子のポーズを取らせたフィギュアちゃんの写真
- 家のダイソンのコードレス掃除機 ([Dyson DC62](https://www.dyson.co.jp/dyson-vacuums/cordless/dc62/dc62-motorhead.aspx)) の写真
- txt2img で `shoping street` を指定して生成した商店街の背景画像

を用意します。

![Untitled](https://manaten.net/wp-content/uploads/2023/02/Untitled.png)

フィギュアは [S.H.フィギュアーツ ボディちゃん - Amazon](https://amzn.to/3x7le5e) です。フィギュアちゃん + StableDiffusionで気軽にポーズ指定してイラスト生成できます。

<blockquote class="twitter-tweet" data-conversation="none" data-lang="ja"><p lang="ja" dir="ltr">ボディちゃん届いたから早速遊んでみたけど楽しすぎる <a href="https://twitter.com/hashtag/StableDifusion?src=hash&amp;ref_src=twsrc%5Etfw">#StableDifusion</a> <a href="https://t.co/GZs6UevDPS">pic.twitter.com/GZs6UevDPS</a></p>&mdash; manaten (@manaten) <a href="https://twitter.com/manaten/status/1611915272960770048?ref_src=twsrc%5Etfw">2023年1月8日</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


<iframe sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin" style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=manaten-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=B09M6PVT8J&linkId=ad552ef09e658a2e8698301695ade8f4"></iframe>

## 雑コラで元絵の作成

これらを重ねて雑コラし、適当にブラシツールで服･髪･表情を描き加えて元絵とします。

![Untitled](https://manaten.net/wp-content/uploads/2023/02/Untitled%201.png)

服は半透明のブラシで塗ったほうが体のラインを隠さないため、ポーズを維持してimg2imgしやすい気がします。

この画像は `728px * 960px` で出力し、この後のimg2imgの際も同じサイズで生成します。手元のGPUだとサイズが大きすぎるとメモリエラーになってしまうし、1生成あたりの生成速度も遅くなってしまいます。逆にサイズが小さいと細かい描写をしきれない傾向があるので(特に顔が小さい場合にぐちゃぐちゃになりやすい)、自分の環境ではこのサイズがベターであると判断しています。

# 1. 魔女の生成

いきなり重ね合わせた状態でimg2imgしてもうまくいかない可能性が高いので、まずはレイヤーごとに形を整えていきます。

フィギュアのレイヤーに `witch, witch hat, witch cape, green hair, deep green eyes, laughing, smug` などを指定して魔女の形を整えていきます。このとき、img2imgの際のノイズを加える `strength` 値が大きすぎるとポーズを全く尊重してくれないので、 `0.3 ~ 0.5` くらいを指定するのが良いです。

## img2img一回目

![Untitled](https://manaten.net/wp-content/uploads/2023/02/Untitled%202.png)

この段階ではぐちゃぐちゃになることが多いですが、ポーズを維持して人っぽくなったら採用します。人っぽくてもポーズが変わってしまったら本末転倒なので、そういう画像は採用しないようにします。

## img2img二回目

![Untitled](https://manaten.net/wp-content/uploads/2023/02/Untitled%203.png)

前段階で人っぽくなっているので、比較的安定しやすいです。服や顔の造形が好みのものを選ぶようにします。

## 三回目

![Untitled](https://manaten.net/wp-content/uploads/2023/02/Untitled%204.png)

更に人っぽくなります。手の形はこの段階ではあまり気にしなくてよいです。手であることがわかればよいです。

## img2imgと手動レタッチの併用

![1.gif](https://manaten.net/wp-content/uploads/2023/02/1.gif)

ある程度形ができてきたら、好みのパーツ(この場合は表情)がimg2imgの過程で失われることがあります。

その場合、GIMPなどのレタッチツールでimg2img前と後の画像をそれぞれ別レイヤとして重ね合わせ、**img2img後の画像のもとの形状を維持したい箇所を消しゴムツールで消してあげる**ことで、その場所だけimg2img前の形状を残すようにします。

この作業を毎回の生成ごとにしつこくやってあげることで、徐々に自分の好みのパーツだけで構成されたイラストにしていくことができ、理想のイラストに近づけていくことができます。

## 生成の一段落

![20230206.png](https://manaten.net/wp-content/uploads/2023/02/20230206%201.png)

何度かimg2imgしたのち、魔女はの生成を一段落します。まだ微妙ですが、背景と重ねる前に作り込んでしまっても背景との合成に苦労するため、この程度でとどめておきます。

# 2. ダイソンの掃除機をイラスト調にする

掃除機は本物の写真のため、形状は最初から完璧です。イラスト中で浮かないようにイラスト調に変更しておきます。写真を `((dyson codeless cleaner))` を指定してimg2imgし、イラスト調にしていきます。

![Untitled](https://manaten.net/wp-content/uploads/2023/02/Untitled%205.png)

ダイソンの掃除機をimg2imgすると、強めのstrengthを指定した場合、一応シルエットを維持したままダイソンの掃除機らしきものが生成されますが、ディティールが大きく変わってしまいカッコよくなってしまいます(AIはダイソンの掃除機自体は知っているらしい)。

![Untitled](https://manaten.net/wp-content/uploads/2023/02/Untitled%206.png)

仕方ないので弱めの `strength:0.3` でimg2imgを繰り返し、どうにか面影が残った状態でイラスト調になりました。

ここでも、形が変わりすぎてしまってるパーツを手動レタッチで取捨選択して元の形をなるべく維持するようにしています。

# 3. レイヤを重ね合わせ、img2img開始

![Untitled](https://manaten.net/wp-content/uploads/2023/02/Untitled%207.png)

ひとまず魔女、背景、ダイソンの掃除機は用意できたということで、重ね合わせて一枚の画像にします。ここから更にimg2imgを繰り返してはイメージに近いパーツを拾っていき、理想形に近づけていきます。

## ここでもimg2imgと手動レタッチの併用

![1.gif](https://manaten.net/wp-content/uploads/2023/02/1%201.gif)

ここでも手動レタッチによりパーツを取捨選択していきます。

これはいい感じの左手が生成されたときに消しゴムツールで合成する過程です。同じ絵からimg2imgしてるため、雑にぼかし強めの消しゴムで消すだけでもなんとなく馴染みます(気になる場合は丁寧にトリミングしたり、更にimg2imgして境界部分だけ拾うなどします)。

![1.gif](https://manaten.net/wp-content/uploads/2023/02/1%202.gif)

手足の他、細かい服の装飾なども好みの形状が生成されたら採用していきます。

当然ですが、**好みの顔が出たら最優先で確保します。**一番大事。

img2imgする際、 strength値は新たなオブジェクトの生成や背景を書き直したい場合は `0.5 ~ 0.6` くらい、既存のイラストの細部を直したい場合は `0.2 ~ 0.4` くらいを指定します。小さめのstrengthはもとの絵の大まかな構造をほとんど維持してくれる反面、元の絵を尊重するあまりほとんど描き換えをしないため、繰り返すと徐々にボケていってしまいます。

そのため、局所的に直したいときなど最小限の利用にしたほうが全体の仕上がりがきれいになる印象があります。

## 掃除機の仕上げ

![Untitled](https://manaten.net/wp-content/uploads/2023/02/Untitled%208.png)

ダイソンの掃除機を強めの strength値でimg2imgすると、やはりこれらの画像のようにめちゃくちゃかっこよくなって掃除機じゃなくなってしまいます。

![Untitled](https://manaten.net/wp-content/uploads/2023/02/Untitled%209.png)

しょうがないので、StableDiffusion WebUI のInPaint機能で掃除機だけを選択し、さらに小さめのstrength値 ( `0.2` 程度) で少しずつなじませていきました。

# 4. 完成

![20230206.png](https://manaten.net/wp-content/uploads/2023/02/20230206%202.png)

以上のようなimg2imgの繰り返しを行い、個人的に満足できたら完成となります。

- 結局背景は普通に日本の商店街にしました( `strength: 0.6` くらいで `akihabara shoping street` にしたら簡単に書き換わりました)。なんかファンタジーっぽい商店街に魔女がいても面白みがないので。
- 掃除機はまだ若干浮いてますが、キリがないのでこのあたりで完了。
- 実は背景にも掃除機らしき物体が生成されています。おそらく `witch` にも反応して魔法っぽい意匠も生成されています。

# まとめ

今回はmanatenがStableDiffusionでイラスト生成するときの手順を紹介しました。フィギュアや写真、個別に生成した画像を使い、イメージどおりの構図を作ってからimg2imgしていくという手法を取っています。さらに、**img2imgを繰り返しながら手動で部位ごとに取捨選択して理想形に近づけていく**という手法を紹介しました。

この手法は、｢AIがノイズからプロンプトに近いのはどちらかを判定することを繰り返して画像生成する｣過程を更に人間の意志を介入させながら繰り返すという行為だと考えていて、ある意味**｢AIの生成に(力技で)個人の趣味嗜好を混ぜ込む｣**という手法だと思っています。その分時間はかかりますが(この画像の生成に数時間。主にダイソンのせい)。

また、よく｢現状のAIは手を描くのが苦手｣とは言われますが、｢苦手ではあるがちゃんと描けることもある｣ので、その面でもこの手法を取るときちんとしたイラストを生成しやすいです。

何より従来のお絵描きとは全く別の体験ではあるものの、｢自分で作ってる感｣がありなかなか楽しいです。プロンプト生成が苦手な人にもおすすめです。

# 参考資料

- [AUTOMATIC1111/stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
- [Delcos/Hentai-Diffusion](https://github.com/Delcos/Hentai-Diffusion)
- [S.H.フィギュアーツ ボディちゃん - Amazon](https://amzn.to/3x7le5e)
- [Dyson DC62 モーターヘッド | ダイソン公式オンラインストア](https://www.dyson.co.jp/dyson-vacuums/cordless/dc62/dc62-motorhead.aspx)
