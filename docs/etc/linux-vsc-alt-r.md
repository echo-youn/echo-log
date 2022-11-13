# VSC ALT-R situation on ubuntu

우분투에서 Visual studio code를 사용하던 중 `한/영`키의 역할을 해주는 `Alt-R`키가 메뉴바의 포커스 때문에 사용할 수 없는 상황을 맞딱뜨렸다. 
애꿎은 `settings.json`의 `"window.customMenuBarAltFocus": false` 설정과 `keybindings.json`의 설정을 괴롭혔지만 해결되지 못했다. 아마 우분투의 설정(native)와 vsc의 충돌로 이슈가 생긴것으로 보인다.

# Solution

저희 해결방법은 VSC를 재설치하는 방법이었다. 대신 이때 snap으로 재설치 하는 대신 deb 패키지로 설치하는 방법으로 해결되었다. 설치하며 클린 삭제도 같이 진행했다.

다른 누군가도 비슷한 일을 겪는다면 고민하지말고 시원하게 밀어버리는것도 하나의 방법이라고 알려주고자 기록합니다.


```sh
# 삭제 방법
sudo apt-get remove code

# 클린 삭제
rm -rf $HOME/.config/Code
rm -rf ~/.vscode

# https://code.visualstudio.com/docs/setup/uninstall#_linux
```

위 방법으로 삭제 후 아래 링크를 통해 다운로드 받아 설치하면 됩니다.

다운로드 링크 : https://code.visualstudio.com/Download

```sh
sudo dpkg -i {다운로드받은 파일}.deb
```


\+ 재설치 후 눈에 들어온 부분인데, `menu bar visibility`의 설정을 변경해 보는것도 하나의 해결방법일 수도 있을것 같다.
