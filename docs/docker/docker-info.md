# 내 컴퓨터에 있는 도커 상태 및 정보 보기

내 컴퓨터에 설치되어 실행되고 있는 도커 정보를 가져옵니다.

## Usage

```shell
$ docker info [OPTIONS]
$ docker -D info # 도커 디버그 정보까지 전부 보여줍니다.
$ docker --debug info
```

## Json 포맷으로 보기

```shell
$ docker info --format '{{json .}}' 
$ docker info --format '{{json .}}' | jq # jq 패키지가 설치되어 있다면 이렇게 보면 더 편리합니다.
```

## Refs

[docker docs](https://docs.docker.com/engine/reference/commandline/info/)
