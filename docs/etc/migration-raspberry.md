# 라즈베리파이 업그레이드

집에서 취미로 홈서버를 운영중이다.

부피, 가격, 비용 등의 이유로 라즈베리파이를 홈서버용으로 사용중이다.

내부 네트워크에 게이트웨이 역할을 하며 배스천 호스트 역할을 해주던 라즈베리파이의 버전이 너무 오래되어 다른 기기로 교체하려고 한다.

교체하며 유지해야하는 기능은 다음과 같다.

1. API Gateway - Nginx 그대로 옮기기
2. Bastion 호스트 정보 그대로 옮기기
3. SSL 인증서 그대로 옮기기 (certbot 활용)

## 구 기기의 sd카드를 새 기기로 옮기기

sd 카드를 옮기는 방법으로 마이그레이션 하고자 했으나 이는 불안정하고 추천되지 않는 방법이여서 패스한다.

- [포럼 글](https://forums.raspberrypi.com/viewtopic.php?t=243520)
- [그럼에도 불구하고 누군가가 방법을 제시해 놓은 문서](https://seven1m.sdf.org/tutorials/upgrade_raspberry_pi_3_to_4_with_same_sd_card.html)

## 하나씩 마이그레이션 하기

별 수 없이 매뉴얼로 마이그레이션하기로 마음먹었다.

마이그레이션하며 한가지 목표를 잡고 진행하고자 한다.

지금은 서비스들을 os의 패키지 매니저로 직접 설치해 사용하다보니 이식성이 매우 떨어지는 편이다.

앞으로 이런 상황을 대비하고자 새로 만들 서버에서는 docker를 활용해 사용할 모든 기능을 컨테이너로 운영할 계획이다.

## 새로운 머신 준비하기

새 머신은 Raspberry Pi 4B의 8기가 모델이다.

기기에는 Raspberry Pi OS를 설치할 계획이고 docker 를 설치해 사용할 계획이다.

하드웨어로는 SD 카드는 장기간 쓰기, 읽기 작업을 해야하므로 삼성 sd 카드의 Endurance 제품을 사용하고 32GB를 장착한다.

[Raspberry Pi Imager](https://www.raspberrypi.com/software/)를 사용해 sd카드에 원하는 OS를 설치한다.

GUI는 사용하지 않으므로 서버 버전으로 설치한다.

- Raspberry Pi OS Lite 버전으로 설치

개인적으로 설치한 순서

```shell
$ sudo apt update
$ sudo apt install vim
$ sudo apt install ca-certificates curl # docker 설치를 위한 패키지
# [Docker 설치](https://docs.docker.com/engine/install/debian/#installation-methods)
# ...
$ sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
$ sudo apt-get insatll ufw

```


## 구버전 머신 백업하기

`dd` 커맨드를 사용해 라즈베리파이에 직접 디스크를 쓰기하는 방법이 있다.

어느 커뮤니티에서 `dd` 란 `Disk Destroyer`라는 우스갯소리를 들어 겁이나서 `dd`로 하지 않았다

```
# pipe viewer
$ dd if=/dev/urandom | pv | dd of=/dev/sda1

# dd
$ sudo dd bs=4M if=/dev/mmcblk0 of=/dev/sda
```

대신 `win32diskimager` 라는 프로그램을 이용해 디스크를 복제하려고 한다.

1. `win32diskimager`를 다운로드 받는다. [공식 사이트](https://win32diskimager.org)
2. 구 머신의 전원을 끈 뒤 sd 카드를 뽑아 PC에 인식시킨다.
3. `win32diskimager`를 실행해 PC가 인식한 Driver를 선택한 뒤 ImageFile이 저장될 경로를 선택한다.
4. 아래에 `Read` 버튼을 클릭하여 읽은 뒤 저장한다. PC 사양에 따라 다르겠지만 16기가 기준 7분정도 소요되었다.
5. 복원시, 저장한 이미지를 Write한 SD 카드를 인식하면 똑같이 동작한다.

## 구버전에서 신버전으로 마이그레이션하기

마이그레이션할 서비스를 확인하기 위해 현재 실행중인 프로세스들 전체를 확인한다.

```shell
$ ps -ef
```

마이그레이션할 서비스는 다음과 같다.

1. nginx
2. certbot `SSL 인증서`
3. ssh 키
4. ufw

### Nginx 마이그레이션

1. 
