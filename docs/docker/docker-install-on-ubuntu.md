# 우분투에 도커 설치하기

우선 도커를 우분투에 정상적으로 설치하기 위해 최소 사양을 살펴본다.

[리눅스 최소사양 확인](https://docs.docker.com/desktop/install/linux-install/#system-requirements)

2022-11-18 특이사항으로는 우분투 22.04와 우분투 21.10에서는 64비트 버전이 필요합니다.

만약 non-Gnome Desktop 환경이라면 반드시 gnome-terminal을 설치해야합니다.

```shell
# gnome-shell 버전 확인
$ gnome-shell --version

# gnome-shell 설치
$ sudo apt install gnome-terminal 
```

## 레파지토리 설정

```shell
$ sudo apt-get update

# 필요한 패키지 설치
$ sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release


$ sudo mkdir -p /etc/apt/keyrings

$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

$ echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

## 도커 엔진 설치

위의 레파지토리 설정을 전부 진행한 후 도커 엔진을 설치한다.

```shell
$ sudo chmod a+r /etc/apt/keyrings/docker.gpg

$ sudo apt-get update

$ sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

## DEB 패키지 다운로드

아래 도커 공식 홈페이지로 가서 다운로드 받습니다.

[다운로드 페이지](https://docs.docker.com/desktop/install/ubuntu/)

## 패키지 설치

```shell
$ sudo apt-get update

# 다운로드 받은 패키지 설치
$ sudo-get install ./docker-desktop-<version>-<arch>.deb
```

설치가 끝나면 Docker Desktop을 실행한다.

그 후 command line에 도커가 정상적으로 설치되었는지 확인한다.

```shell
$ docker info
```
