![SublimeTextの設定をgit管理し、複数PCで設定やパッケージを同期する。](http://manaten.net/wp-content/uploads/2014/03/Sublime_Text_git.png)

[SublimeText](http://www.sublimetext.com/)の設定をgitでバージョン管理し、複数PCで同じ設定を使う方法のメモです。

<!-- more -->

やることは簡単で、SublimeText の User Settings は同じディレクトリにまとめられてるので、そのディレクトリをバージョン管理するだけです。


![SublimeText の User Settings](http://manaten.net/wp-content/uploads/2014/03/Sublime_Text_git_3.png)

このディレクトリには [Package Controll](https://sublime.wbond.net/) の設定ファイル( Package Control.sublime-settings )も有り、ここに Package Controll で入れたパッケージのリストも記載されています。

![Package Control.sublime-settings](http://manaten.net/wp-content/uploads/2014/03/Sublime_Text_git_2.png)

Package Controll は SublimeText 起動時にこのファイルのパッケージを自動でインストールするので、このファイルを同期することで結果的にパッケージも同期されます。便利。


# User Settings のディレクトリのありか
[Preferences] -> [Settings - User] としてユーザー設定ファイルを開き、そのファイルが有るパスを確認するのが確実かと思います。

![User Settings のディレクトリのありか](http://manaten.net/wp-content/uploads/2014/03/sublime_user_settings.png)

# リポジトリ管理例
最後に、僕の Sublime Text の設定管理の例を晒します。githubで管理しています。

[manaten/sublime-settings](https://github.com/manaten/sublime-settings)

.gitignore は以下のようにし、cacheなどを省いています。
```
*.cache
*_tmp
encoding_cache.json
Package Control.last-run
Evernote.sublime-settings
```

以上です。

# 参考
[Syncing - Package Control](https://sublime.wbond.net/docs/syncing)