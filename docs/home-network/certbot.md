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

```shell
$ sudo apt update
$ sudo apt install snapd

# snapd의 최신버전을 다운로드 받기 위해 snap에서 core를 설치한다.
$ sudo snap install core
core 16-2.61.2 from Canonical✓ installed
```

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

## nginx server 추가하기

nginx에 먼저 서버가 설정되어있어야한다.

::: code-group

``` [conf.d/dev-api.sample.com.conf]
upstream dev-servers {
  least_conn;
  server 192.168.0.37:8080;
}

server {
        server_name dev-api.sample.com;

        location / {
                return 404;
        }

        location /sample {
              proxy_set_header Host $http_host;
              proxy_set_header X-Real-IP $remote_addr;

              proxy_connect_timeout 300;

              proxy_pass http://dev-servers ;
        }
}
```

``` [nginx.conf]
...
 include /etc/nginx/conf.d/dev-api.sample.com.conf;
...
```

:::

nginx 재시작

```
$ sudo systemctl restart nginx
```


## nginx 설정 자동하기 vs 수동하기

인증서 발급 후 자동으로 nginx에도 적용할것이라면 다음 명령어를 사용한다.

```
$ sudo certbot --nginx
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator nginx, Installer nginx

Which names would you like to activate HTTPS for?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: sample.com
...
6: dev-api.sample.com
...
9: www.sample.com
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate numbers separated by commas and/or spaces, or leave input
blank to select all options shown (Enter 'c' to cancel): 6
Requesting a certificate for dev-api.sample.com
Performing the following challenges:
http-01 challenge for dev-api.sample.com
Waiting for verification...
Cleaning up challenges
Deploying Certificate to VirtualHost /etc/nginx/conf.d/dev-api.sample.com.conf
Redirecting all traffic on port 80 to ssl in /etc/nginx/conf.d/dev-api.sample.com.conf

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Congratulations! You have successfully enabled https://dev-api.sample.com
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/dev-api.sample.com/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/dev-api.sample.com/privkey.pem
   Your certificate will expire on 2024-06-07. To obtain a new or
   tweaked version of this certificate in the future, simply run
   certbot again with the "certonly" option. To non-interactively
   renew *all* of your certificates, run "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
```

갱신된 설정 파일을 볼 수 있다.

::: code-group

``` [conf.d/dev-api.sample.com.conf]
...
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/dev-api.sample.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/dev-api.sample.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
...

server {
    if ($host = dev-api.sample.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    server_name dev-api.sample.com;
    listen 80;
    return 404; # managed by Certbot
}
```

:::

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


## 수동으로 DNS TXT로 인증서 발급!
```
certbot certonly -d local.echo-youn.com --manual --preferred-challenges dns
```
