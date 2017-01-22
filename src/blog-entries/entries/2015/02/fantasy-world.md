<!--
title: Fantasy World
date:  2015-2-xx 12:00
categories: [ドット絵]
-->

<div>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script type="text/javascript">
$(function() {
  var $container = $('div#fantasy.pixelParallax');
  var scale = function() {
    return $container.height() > 240 ? 2 : 1;
  };
  var baseX = $container.offset().left;
  var baseY = $container.offset().top + 240;
  var layers = $container.children().map(function(_, layer) {
    return {
      $: $(layer),
      factor: $(layer).attr("data-zFactor")/10000,
      baseX : $(layer).position().left / scale(),
      baseY : $(layer).position().top / scale()
    };
  });

  var mouceHandler = function(ev) {
    var dx = (ev.pageX !== undefined ? ev.pageX : baseX) - baseX;
    var dy = (ev.pageY !== undefined ? ev.pageY : baseY) - baseY;
    $.each(layers, function(_, layer) {
      layer.$.css({
        left: layer.baseX * scale() + (dx * layer.factor) + 'px',
        top : layer.baseY * scale() + (dy * layer.factor) + 'px'
      });
    });
  };
  var motionHandler = function(ev){
    var dy = baseY / 2 + ev.accelerationIncludingGravity.y * 100;
    var dx = baseX / 2 - ev.accelerationIncludingGravity.x * 100;
    $.each(layers, function(_, layer) {
      layer.$.css({
        left: layer.baseX * scale() + (dx * layer.factor) + 'px',
        top : layer.baseY * scale() + (dy * layer.factor) + 'px'
      });
    });
  };
  if (navigator.userAgent.search(/(iPhone|iPad|Android)/) !== -1) {
    window.addEventListener('devicemotion', motionHandler);
  } else {
    document.body.addEventListener('mousemove', mouceHandler);
    window.addEventListener('resize', mouceHandler);
  }
});
</script>

<style>

@-moz-keyframes anime {
0% {opacity: 0;}
80% {opacity: 0;}
100% {opacity: 1;}
}

@-webkit-keyframes anime {
0% {opacity: 0;}
80% {opacity: 0;}
100% {opacity: 1;}
}

@-o-keyframes anime {
0% {opacity: 0;}
80% {opacity: 0;}
100% {opacity: 1;}
}

@-ms-keyframes anime {
0% {opacity: 0;}
80% {opacity: 0;}
100% {opacity: 1;}
}


div.pixelParallax {
  margin: 0 auto;
  width: 0px;
  height: 480px;
  position: relative;
}
div#fantasy.pixelParallax div {
  background-image: url(http://manaten.net/wp-content/uploads/2015/02/fantasy_2_spritex2.gif);
  display: block;
  overflow: hidden;
  position: absolute;
}
div#fantasy div.Priest {
  -moz-animation: anime 5s ease -3.5s 1 alternate;
  -webkit-animation: anime 5s ease -3.5s 1 alternate;
  -o-animation: anime 5s ease -3.5s 1 alternate;
  -ms-animation: anime 5s ease -3.5s 1 alternate;
  width: 160px; height: 192px;
  background-position: -640px -0px;
  left: 160px; top: 160px;
  z-index: 9;
}
div#fantasy div.Mage {
  -moz-animation: anime 5s ease -2.5s 1 alternate;
  -webkit-animation: anime 5s ease -2.5s 1 alternate;
  -o-animation: anime 5s ease -2.5s 1 alternate;
  -ms-animation: anime 5s ease -2.5s 1 alternate;
  width: 192px; height: 224px;
  background-position: -640px -192px;
  left: 128px; top: 0px;
  z-index: 8;
}
div#fantasy div.Fighter {
  -moz-animation: anime 5s ease -3s 1 alternate;
  -webkit-animation: anime 5s ease -3s 1 alternate;
  -o-animation: anime 5s ease -3s 1 alternate;
  -ms-animation: anime 5s ease -3s 1 alternate;
  width: 192px; height: 160px;
  background-position: -832px -192px;
  left: -320px; top: 64px;
  z-index: 7;
}
div#fantasy div.Smoke {
  width: 480px; height: 192px;
  background-position: -0px -224px;
  left: -256px; top: 224px;
  z-index: 6;
  opacity: 0.5;
}
div#fantasy div.Dragon {
  width: 640px; height: 448px;
  background-position: -544px -416px;
  left: -320px; top: 0px;
  z-index: 5;
}
div#fantasy div.Treasure {
  width: 224px; height: 192px;
  background-position: -800px -0px;
  left: -224px; top: 192px;
  z-index: 4;
}
div#fantasy div.Volcano {
  width: 480px; height: 160px;
  background-position: -0px -64px;
  left: -256px; top: 320px;
  z-index: 3;
}
div#fantasy div.BG1 {
  width: 544px; height: 288px;
  background-position: -0px -416px;
  left: -288px; top: 32px;
  z-index: 2;
}
div#fantasy div.BG2 {
  width: 416px; height: 64px;
  background-position: -0px -0px;
  left: -224px; top: 32px;
  z-index: 1;
}
@media (max-width: 640px) {
  div.pixelParallax {
    height: 240px;
  }
  div#fantasy.pixelParallax div {
    background-image: url(http://manaten.net/wp-content/uploads/2015/02/fantasy_2_sprite.gif);
  }
  div#fantasy div.Priest {
    width: 80px; height: 96px;
    background-position: -320px -0px;
    left: 80px; top: 80px;
  }
  div#fantasy div.Mage {
    width: 96px; height: 112px;
    background-position: -320px -96px;
    left: 64px; top: 0px;
  }
  div#fantasy div.Fighter {
    width: 96px; height: 80px;
    background-position: -416px -96px;
    left: -160px; top: 32px;
  }
  div#fantasy div.Smoke {
    width: 240px; height: 96px;
    background-position: -0px -112px;
    left: -128px; top: 112px;
  }
  div#fantasy div.Dragon {
    width: 320px; height: 224px;
    background-position: -272px -208px;
    left: -160px; top: 0px;
  }
  div#fantasy div.Treasure {
    width: 112px; height: 96px;
    background-position: -400px -0px;
    left: -112px; top: 96px;
  }
  div#fantasy div.Volcano {
    width: 240px; height: 80px;
    background-position: -0px -32px;
    left: -128px; top: 160px;
  }
  div#fantasy div.BG1 {
    width: 272px; height: 144px;
    background-position: -0px -208px;
    left: -144px; top: 16px;
  }
  div#fantasy div.BG2 {
    width: 208px; height: 32px;
    background-position: -0px -0px;
    left: -112px; top: 16px;
  }
}

</style>

<div class="pixelParallax" id="fantasy">
  <div class="BG2"    data-zFactor="-300"></div>
  <div class="BG1"    data-zFactor="-250"></div>
  <div class="Volcano"  data-zFactor="100"></div>
  <div class="Treasure" data-zFactor="-50"></div>
  <div class="Smoke"  data-zFactor="100"></div>
  <div class="Dragon"   data-zFactor="100"></div>
  <div class="Fighter"  data-zFactor="300"></div>
  <div class="Mage"   data-zFactor="350"></div>
  <div class="Priest"   data-zFactor="500"></div>
</div>
</div>


トップ絵変えました。以下これを打つにあたって考えてたことなど。

<!-- more -->

# テーマ
去年の7-8月頃に[ファンタジーライフ](http://www.fantasylife.jp/)をプレイしてたら打ちたくなって、最近まで放置していたもの。
テーマはドラクエのような、王道ファンタジーの中盤。
戦士･僧侶･魔法使い vs なんか強そうなドラゴン。
冒険者達の目的はドラゴンの守る宝。



# 制作的な話

## サイズ
最初からトップ絵にすること & パララクスで動かすことを目論んで大きめのサイズで打とうと考えていました。
[前回](http://manaten.net/city-witch)･[前々回](http://manaten.net/cafe)もパララックストップ絵だったが、
ページサイズに対して小さすぎる、逆にスマホだと大きすぎると感じていたので、更に大きなサイズで打ち、
PCでは二倍･スマホでは等倍にしたらちょうどいいかなあという感じで、320x240で打ったらいい感じになった。

はじめはもっと大きくこんなかんじで
![](http://manaten.net/wp-content/uploads/2015/02/fantasy.png)


![](http://manaten.net/wp-content/uploads/2015/02/fantasy_2_line.png)


# テーマ的な話
  * ゲーム作りたい(今も)作ってない理由を軽く
  * 作りたい目的の一つが世界観の構築
  * 世界観を作るのにゲームでなくてもいいなということ
  * 今回のトップ絵
  * ファンタジーライフやっててファンタジーでパーティがドラゴン倒すトップ絵つくろうと思っただけだった
  * 書いてるうちに面白くなっていろいろ設定を散りばめた
  * 多分誰も気づかないのでここに供養として書く





  *
    * 三人の目的
    * 三人の容姿
    *
      * 表情、ポーズで性格を表現する
      * 余談だが、ドット絵でキャラの性格を表現する方法は普通の絵より限られていて、ポーズ、服装、髪型、表情(小さいと無理)しかない
      * ↑を表現するためにキャラのサイズが決まる


    * 背景
    * ドラゴンと宝
    * 看板の矛盾
    * 三人の腕輪
    * 詠唱している魔法
    * ･･･

  * 世界観の構築したいという欲求を満たすにはこのくらいでも十分(ゲームとか、小説各必要はない)
  * あーでもやっぱゲームも作りたいな
  * いい感じにまとまらんので書きながら考える
  * 無理やりドット絵の魅力につなげる？


# 終わり
今後も気合入れて打った系のドット絵はこういうあとがき的なのを書いていこうと思いました。
せっかく色々考えてるのだから、吐き出しておかないともったいない理論。
