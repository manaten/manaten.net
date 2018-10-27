<!--
title: LVMでないVagrant(VirtualBox)の仮想ディスクの容量を拡張する
date:  2014-09-xx 12:00
categories: [Vagrant, VirtualBox, プログラミング]
-->

# 手順概要

1. 移し替えるディスクを普通にVirtualBoxのGUIで作る
2. VBoxManage clonedで既存ディスクの中身を新しいものに丸々コピー
    1. VBoxManage clonehd box-disk1_old.vmdk box-disk1.vmdk --existing
    2. VBoxManage はWinならVirtualBoxのインストールディレクトリにある
3. 仮想ディスクを入れ替える
    1. どうせ中身は一緒なので、ファイル名変更でスッと入れ替えて良い
        * 以上でVM内からはディスクが増え、パーティションがもとのままという状態に
4. gparted LiveCDでVMを起動し、パーティションを拡張する
    1. http://gparted.org/livecd.php
    2. fdiskよくわからないゆとりでもめんどいこと全部やってくれるのでイージー


# 参考リンク

* [vagrant：vmdkをvdiに変更してCentOSのLVMで容量を拡張 | ログってなんぼ](http://wp.me/p4Mc4A-bJ)
* [Vagrant VMのディスクサイズを後から拡張する方法 | dakatsuka's blog](http://blog.dakatsuka.jp/2014/04/24/vagrant-hdd-resize.html)
* [GParted -- Live CD/USB/PXE/HD](http://gparted.org/livecd.php)

