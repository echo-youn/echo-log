# Certbot

SSL 인증서 등록을 위해 Certbot을 사용해 Lets encrypt 인증서 발급받기.

[certbot 문서 바로가기](https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal&tab=standard)

## 요구사항
먼저 서버가 인터넷에서 접근이 가능해야한다.

나같은 경우 공유기로 포트포워딩해 사용하는 경우가 많아 ssl 인증서를 적용해야하는 경우 80포트와 433포트가 해당 서버에 접근 가능해야한다.

도메인을 소유하고 있어야한다.

Nginx를 LB로 사용할 것이기 때문에 nginx를 설치한다.

## wildcard vs default
wildcard와 default 둘 중에 wildcard가 더 편하지만 이 문서에서는 default로만 작성한다.

## snapd 설치

서버로 접속해 snapd를 설치한다. certbot를 사용함에 있어서 해당 패키지에 강한 의존성이 있는것 같다.

내가 사용할 Ubuntu 배포판에서는 snapd 가 미리 설치되어있다.

## 기존에 있는 Certbot을 다 삭제

```
$ sudo apt-get remove certbot
$ sudo dnf remove certbot
$ sudo yum remove certbot
```

## certbot 설치

```
$ sudo snap install --classic certbot
```

## certbot 실행되는지 확인하기

```
$ sudo ln -s /snap/bin/certbot /usr/bin/certbot 
```

## nginx 설정 자동하기 vs 수동하기

인증서 발급 후 자동으로 nginx에도 적용할것이라면 다음 명령어를 사용한다.

```
$ sudo certbot --nginx
```

인증서만 발급받고 nginx 설정을 별도로 할거라면 다음 명령어를 사용한다.

```
$ sudo certbot certonly --nginx
```

## 자동으로 갱신되는지 테스트하기

기본으로 자동 갱신되는 cron이 설정된다.

```
$ sudo certbot renew --dry-run
```

갱신하는 명령어는 아래 중 한곳에 설치된다.

- `/etc/crontab/`
- `/etc/cron.*/*`
- `systemctl list-timers`

## SSL 인증서 되는지 확인

확인해보자!!
