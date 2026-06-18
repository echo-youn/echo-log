# Nginx proxy manager 설치기

집에 있는 라즈베리파이로 홈 네트워크를 구성해 사용하고 있는데 reverse proxy로 이미 nginx와 certbot 등을 사용해 호스팅하고 있었다

그런데 `nginx-proxy-manager(이하 npm)`라 하는 좋은 툴을 발견해 설치해 사용해보고자 한다.

npm을 설치할때 docker compose 를 활용해 설치하고 기존에 설치되어있는 서비스를 제거하고 마이그레이션 하는 작업을 하고자 한다

<b>[사이트 링크](https://nginxproxymanager.com/)</b>

## standalone nginx 확인 및 종료

먼저 지금 떠있는 nginx를 확인하고자 사용중인 포트를 확인해봤다

```terminaloutput
$ sudo netstat -ltup # 사용 중인 포트 및 프로세스 이름

Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:https           0.0.0.0:*               LISTEN      816/nginx: master p
tcp        0      0 0.0.0.0:http            0.0.0.0:*               LISTEN      816/nginx: master p
```

nginx가 잘 돌아가고 있음을 확인했고 서비스로 돌아가고 있는 nginx를 종료시킨다

그 전에 nginx 설정 파일과 인증서 설정파일들도 확인해본다

```terminaloutput
# nginx 설정
$ ls /etc/nginx/
total 76
drwxr-xr-x  8 root root 4096 Oct 26 03:07 .
drwxr-xr-x 95 root root 4096 Nov 30 18:52 ..
drwxr-xr-x  2 root root 4096 Sep  1 23:39 conf.d # 설정 파일 디렉토리
-rw-r--r--  1 root root 1125 Mar 15  2023 fastcgi.conf
-rw-r--r--  1 root root 1055 Mar 15  2023 fastcgi_params
-rw-r--r--  1 root root 2837 Mar 15  2023 koi-utf
-rw-r--r--  1 root root 2223 Mar 15  2023 koi-win
-rw-r--r--  1 root root 4338 Mar 15  2023 mime.types
drwxr-xr-x  2 root root 4096 Mar 15  2023 modules-available
drwxr-xr-x  2 root root 4096 Mar 15  2023 modules-enabled
-rw-r--r--  1 root root 1484 Sep  1 23:40 nginx.conf # 기본 설정 디렉토리
-rw-r--r--  1 root root  180 Mar 15  2023 proxy_params
-rw-r--r--  1 root root  636 Mar 15  2023 scgi_params
drwxr-xr-x  2 root root 4096 Dec 29  2024 sites-available
drwxr-xr-x  2 root root 4096 Dec 29  2024 sites-enabled
drwxr-xr-x  2 root root 4096 Dec 29  2024 snippets
-rw-r--r--  1 root root  664 Mar 15  2023 uwsgi_params
-rw-r--r--  1 root root 3071 Mar 15  2023 win-utf

#  인증서
$ ll /etc/letsencrypt
total 44
drwxr-xr-x  7 root root 4096 Dec 10 21:43 .
drwxr-xr-x 95 root root 4096 Nov 30 18:52 ..
drwx------  3 root root 4096 Dec 29  2024 accounts
drwx------  3 root root 4096 Dec 29  2024 archive
drwx------  3 root root 4096 Dec 29  2024 live # 인증서 보관 디렉토리
-rw-r--r--  1 root root  774 Dec 29  2024 options-ssl-nginx.conf
drwxr-xr-x  2 root root 4096 Dec 10 21:43 renewal # 이 디렉토리에 설정파일 있음
drwxr-xr-x  5 root root 4096 Dec 29  2024 renewal-hooks
-rw-r--r--  1 root root  424 Dec 29  2024 ssl-dhparams.pem
-rw-r--r--  1 root root   64 Dec 29  2024 .updated-options-ssl-nginx-conf-digest.txt
-rw-r--r--  1 root root   64 Dec 29  2024 .updated-ssl-dhparams-pem-digest.txt

$ certbot 으로 설정한 인증서들
$ sudo certbot certificates
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Found the following certs:
  Certificate Name: domain
    Serial Number: 5463d7c67868ce30ab988be502e823127312
    Key Type: ECDSA
    Identifiers: domain
    Expiry Date: 2026-01-23 17:09:06+00:00 (VALID: 44 days)
    Certificate Path: /etc/letsencrypt/live/domain/fullchain.pem
    Private Key Path: /etc/letsencrypt/live/domain/privkey.pem
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

# 종료
$ systemctl stop nginx
==== AUTHENTICATING FOR org.freedesktop.systemd1.manage-units ====
Authentication is required to stop 'nginx.service'.
Authenticating as: ,,,
Password:
==== AUTHENTICATION COMPLETE ====
```

## npm 설치
이제 기존 서비스를 정리했으니 npm을 설치해본다

도커로 실행할건데 3개의 볼륨이 필요하다
- nginx 설정파일 및 로그를 저장할 볼륨 
- 인증서를 저장할 볼륨
- npm DB 데이터를 저장할 볼륨

미리 설정파일을 옮겨놓을 수 있었지만 나는 생성한 뒤 처음부터 세팅하기로 했다

```yaml
services:
  app:
    image: 'jc21/nginx-proxy-manager:2.13.5'
    restart: unless-stopped
    ports:
      - '80:80' # Public HTTP Port
      - '443:443' # Public HTTPS Port
      - '81:81' # Admin Web Port
    environment:
      TZ: "UTC"
      DB_POSTGRES_HOST: 'db'
      DB_POSTGRES_PORT: '5432'
      DB_POSTGRES_USER: 'npm'
      DB_POSTGRES_PASSWORD: ${DB_POSTGRES_PASSWORD}
      DB_POSTGRES_NAME: 'npm'
      # Uncomment this if IPv6 is not enabled on your host
      # DISABLE_IPV6: 'true'
    volumes:
      - /nginx-proxy-manager/data:/data
      - /nginx-proxy-manager/letsencrypt:/etc/letsencrypt
    depends_on:
      - db

  db:
    image: postgres:17
    environment:
      POSTGRES_USER: 'npm'
      POSTGRES_PASSWORD: ${DB_POSTGRES_PASSWORD}
      POSTGRES_DB: 'npm'
    volumes:
      - /nginx-proxy-manager-db/postgresql:/var/lib/postgresql
```

위 컴포즈를 작성한 뒤 실행하고 계정정보를 설정하면 다음과 같은 화면이 나온다

<img src="https://private-user-images.githubusercontent.com/39899731/524853153-6f3302d6-8f64-4ca0-8c3c-9691f86ce399.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjUzNzU2MjYsIm5iZiI6MTc2NTM3NTMyNiwicGF0aCI6Ii8zOTg5OTczMS81MjQ4NTMxNTMtNmYzMzAyZDYtOGY2NC00Y2EwLThjM2MtOTY5MWY4NmNlMzk5LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTEyMTAlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUxMjEwVDE0MDIwNlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTk5MzI3MWJkODZlYjI0NmQ4NTAzYWJkMTRjYmRhYzg4ZjhkYzI0MjljNzNlYjkwYjBhMjlhMzc1NDE3NDRkNjUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.bStekOYTCaYQgXDGhQxhouFTGQSFruAy6CalwXBmvDU">

## 인증서 설정
새로 만든 npm으로 letsencrypt 인증서를 다시 발급 받을수도 있고 기존 인증서를 사용할 수 있다

나는 어차피 새로 만드는거 새로 만들기로 했다

`Add Certificate - Add via DNS` 선택 후 만들어놓고 Cloudflare가 네임서버인 도메인을 설정한다

그리고 `DNS Provider`를 Cloudflare로 설정 하면 `dns_cloudflare_api_token`를 입력하는 창이 나오는데

Cloudflare 사이트의 프로파일로 가 API Tokens를 발급받는다

발급받을때 `API Token template` 중 `Edit zone DNS`를 사용한다

해당 토큰에 주어야하는 권한은 다음과 같다

permissions: Zone - DNS - Edit

Zone Resources: Include - Specific zone - {domain}
 
Client IP Address Filtering: Is in - {nginx server ip}

위와 같이 설정하면 토큰이 발급 되는데, 이를 npm에 복붙하면 인증서가 만들어진다


## 호스트 설정하기
마지막으로 호스트를 설정해주면 된다

Proxy Hosts로 가서 호스트를 추가해주는데 이때 삽질한 경험을 공유한다

npm 관리자 페이지를 테스트로 설정하고자 했는데 아래와 같이 설정하니 오류가 발생했다

<img src="https://private-user-images.githubusercontent.com/39899731/524930944-c36bb541-a708-4596-874a-d688473ce7b3.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjUzODQ4MzEsIm5iZiI6MTc2NTM4NDUzMSwicGF0aCI6Ii8zOTg5OTczMS81MjQ5MzA5NDQtYzM2YmI1NDEtYTcwOC00NTk2LTg3NGEtZDY4ODQ3M2NlN2IzLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTEyMTAlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUxMjEwVDE2MzUzMVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWYwMjcyNjFhNDQ1NjQxZmZhYTEwZjc1NGU2NWZlNDg0YzkwZTFiZGEzZGYxOGEyODVjYWIyNmY1YjY0MGIzNmEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.k6aSyVBGYJKRXzpuHKLCyxvAnY4Pn7GJUGKnGzDrxfo">

왜인지 확인해봤는데 npm을 생성할때 docker compose 로 생성하여 네트워크가 `bridge` 모드로 생성된것이다

그래서 localhost, 127.0.0.1, 서버의 사설 IP 등이 적용이 안됐다

그래서 `localhost` 대신 compose에서 만들어 주는 dns를 사용해 `app`으로 호출하니 정상 호출 되었다

이 과정에서 서로 다른 네트워크끼리 통신할때 연결을 해주어야하는것과 그 방법에 대해서 다시금 알게되었다

