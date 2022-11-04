# 도커 이미지 정리

도커를 띄워놓고 배포하면서 쓰다보면 이미지가 수천개 이상 쌓이는 경우가 있습니다.
이미지들은 사용중이 아니더라도 디스크에 누적해서 쌓여갑니다.
리스트를 조회하거나 할때 목록이 많아지면서 속도도 느려지고 관리가 더 힘들어집니다.

이럴때 사용하는 명령어가 있는데 바로 `docker image prune`입니다.

가끔 서버가 docker 명령어를 사용할때 응답시간이 오래걸린다면 `prune`으로 정리하는걸 추천드립니다.


```shell
$ docker images | wc -l # count docker images
```

## docker image prune

사용하지 않는 이미지를 삭제합니다.

### Usage

```shell
$ docker image prune [OPTIONS]
```

### Description

모든 `dangling`된 이미지를 제거합니다. 만약에 `-a` 옵션이 사용됐다면, 컨테이너가 사용하지 않고 있는 이미지를 전부 삭제합니다.

## Refs
[docker docs](https://docs.docker.com/engine/reference/commandline/image_prune/)
