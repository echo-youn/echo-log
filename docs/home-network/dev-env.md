# 개발환경 구축기

프로젝트를 하다보면 개발환경을 구축해야하는 경우가 있는데 서버에 있는 서버들로 사설 네트워크에 구축하는 일기를 써본다.

제약 조건은 다음과 같다.
- DB는 호스팅해서 사용한다. 접속 IP는 사설네트워크에서만 접속 가능하기 때문에 개발을 위해서는 VPN에 접속해야한다.
- dev-... 도메인을 구축하되 VPN에 접속해야만 사용 가능하다. (외부 접속 X)

## VPN
우선 vpn은 iptime 공유기에서 제공하는 VPN, DDNS 기능을 적극 활용하기로 했다.

최대 20명까지만 지원하지만 인원이 20명도 채 안되기 때문에 충분히 커버 가능할것으로 보인다.

![iptime-setting](https://private-user-images.githubusercontent.com/39899731/311441654-7942e721-272f-41a4-9759-f5bfbdb0bc44.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDk5OTI0MDYsIm5iZiI6MTcwOTk5MjEwNiwicGF0aCI6Ii8zOTg5OTczMS8zMTE0NDE2NTQtNzk0MmU3MjEtMjcyZi00MWE0LTk3NTktZjViZmJkYjBiYzQ0LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAzMDklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMzA5VDEzNDgyNlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTMyYjc1NzcwY2YyZjBjMWM0OWE0MDcwY2NlYzEwMjhkNTIzYTk3M2EwMmEwZjBhZmQzNzhiMDdmOGYyNTAzMTcmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.9sx7eSqmSv3q8-DjE_QizZ8lgx2lY03XgolPdkyJzc0)

## 접속제한(ACL)
이 부분에서 두가지를 고려해봤다.

VPN에 접속한 뒤 사설네트워크에 네임서버를 `bind9`으로 구축해 `dev-api.sample.com`로 구현하는 방법을 생각해봤다.

하지만 내 환경에서는 nginx 라는 LB를 사용하고 있기때문에 여기에서 특정 ip만 허용하는 기능으로 구현하기로 결정했다.

```
server {
        server_name dev-api.sample.com;

        location / {
                return 404;
        }

        location /api {
              proxy_set_header Host $http_host;
              proxy_set_header X-Real-IP $remote_addr;

              proxy_connect_timeout 300;
              
              allow 192.168.0.1;
              deny all;

              proxy_pass http://sample-servers;
        }
}
```

이렇게 하여 원하는 스펙으로 구현한 것 같다-!
