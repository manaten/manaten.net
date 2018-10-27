tmuxのタブ名を今いるディレクトリのリポジトリ名にする
=====
<a href="http://manaten.net/wp-content/uploads/2014/01/tmux_repository.png"><img src="http://manaten.net/wp-content/uploads/2014/01/tmux_repository.png" alt="tmux_repository" width="574" height="108" class="aligncenter size-full wp-image-888" /></a>

知ってる人には今更でしょうけど、タブに今いるリポジトリ名が出るようにしてみた。

<!-- more -->

precmdでリポジトリ名を```tmux rename-window```に渡すだけです。
```sh
autoload -Uz vcs_info
zstyle ':vcs_info:*' enable git svn
zstyle ':vcs_info:*' formats '%r'

precmd () {
  LANG=en_US.UTF-8 vcs_info
  [[ -n ${vcs_info_msg_0_} ]] && tmux rename-window $vcs_info_msg_0_
}
```
[github](https://github.com/manaten/dotfiles/blob/master/.zshrc)
