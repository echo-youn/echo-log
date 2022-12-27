# 클린 설치 후 세팅

설치 리스트 공통
- git
- curl
- wget
- docker
- docker-compose
- node
- nvm
- maven
- gradle
- google-chrome
- slack
- postman
- dbeaver
- intelliJ
- visual studio code
- JDK

## MacOS
- iterm


설치
```shell
-- Xcode 이때 설치 됨.
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

brew update

/****************** Dev Tools ********************/

brew install git iterm2 docker docker-compose node vnm curl maven gradle

brew install --cask google-chrome slack postman dbeaver-community intellij-idea visual-studio-code github 

brew tap AdoptOpenJDK/openjdk

brew install --cask adoptopenjdk8 adoptopenjdk11

/************* 단축어 *************/
echo "alias ll='ls -al'" > ~/.zshrc

```

# Linux
## Ubuntu

### Utility

```shell
usermod -aG sudo $(whoami)
sudo apt-get update

sudo apt-get install wget curl gpg git apt-transport-https

# node(19.x) npm nvm
curl -fsSL https://deb.nodesource.com/setup_19.x | sudo -E bash - &&\
sudo apt-get install -y nodejs
sudo apt install build-essential libssl-dev
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.1/install.sh | bash

# reload bash
nvm install --lts

```

### Visual Studio Code (VSC)
```shell
$ wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg

$ sudo install -D -o root -g root -m 644 packages.microsoft.gpg /etc/apt/keyrings/packages.microsoft.gpg

$ sudo sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'

$ rm -f packages.microsoft.gpg

$ sudo apt update

$ sudo apt install code
```

### Chrome

```shell
$ wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb

$ sudo dpkg -i google-chrome-stable_current_amd64.deb
```

### Korean Language
```shell
$ ibus-setup # setup 후 로그아웃
```

### JDK
### Temurin (Hotspot)
https://adoptium.net/installation/linux/

### Semeru (OpenJ9)
https://developer.ibm.com/languages/java/semeru-runtimes/downloads/
