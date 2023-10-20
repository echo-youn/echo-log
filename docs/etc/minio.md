# Minio 도입기

## 환경

```mermaid

```

가정집에서 사용하는 공유기의 IP를 도메인에 연결하여 L4 역할을 수행한다.

포트포워드를 설정해 80 포트와 443 포트를 네트워크 내에 있는 API Gateway로 포트포워딩을 해준다.

이때 삽질한 부분이 MINIO에서 설정한 API 포트와 Console 포트도 같이 열어주어야한다.

minio에서 API, Console Redirect로 설정한 주소로 요청을하는데 이때 minio의 포트로 요청을 한다.

처음에 sub-path로 reverse proxy로 시도하다가 sub-domain으로 변경한 뒤 해결방법을 찾아서 해결해 sub-path 방식으로는 테스트 안해봤지만 비슷한 맥락으로 통할 것 같다.

어쨋든 console, api 둘다 api gateway에서 443 포트의 ssl 설정도 해준다.

그와 동시에 9000, 9001로 요청이 들어왔을때도 처리를 해줘야한다.

### sub-domain

DNS Record
```
A s3.sample.com 100.100.100.100
A s3console.sample.com 100.100.100.100
```

포트포워드 규칙
```
2	nginx	192.168.0.11	TCP(80)	TCP(80)	
3	nginx_ssl	192.168.0.11	TCP(443)	TCP(443)

6	minio	192.168.0.11	TCP(9000)	TCP(9000)	
7	minio_console	192.168.0.11	TCP(9001)	TCP(9001)
```

```
MINIO_ROOT_USER=root
MINIO_ROOT_PASSWORD=password
MINIO_VOLUMES="/minio"
MINIO_SERVER_URL="https://s3.sample.com"
MINIO_BROWSER_REDIRECT_URL="https://s3console.sample.com"

services:
  minio:
    image: minio/minio
    container_name: minio
    restart: always
    command: server /minio --console-address ":9001" --address ":9000"
    environment:
      MINIO_CONFIG_ENV_FILE: /etc/config.env
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - /mnt/data1/minio:/minio
      - /mnt/data1/minio-compose/config.env:/etc/config.env
    dns:
      - 1.1.1.1
      - 8.8.8.8
```

API Nginx conf
```
upstream minio_s3 {
  least_conn;
  server 192.168.0.11:9000;
}

server {
        server_name s3.sample.com;
        # Allow special characters in headers
        ignore_invalid_headers off;
        # Allow any size file to be uploaded.
        # Set to a value such as 1000m; to restrict file size to a specific value
        client_max_body_size 0;
        # Disable buffering
        proxy_buffering off;
        proxy_request_buffering off;

        location / {
              proxy_set_header Host $http_host;
              proxy_set_header X-Real-IP $remote_addr;
              proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
              proxy_set_header X-Forwarded-Proto $scheme;

              proxy_connect_timeout 300;

              # To support websocket
              proxy_http_version 1.1;
              proxy_set_header Connection "";
              chunked_transfer_encoding off;

              proxy_pass http://minio_s3; # This uses the upstream directive definition to load balance
        }

    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/s3.sample.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/s3.sample.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}

server {
    if ($host = s3.sample.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


        server_name s3.sample.com;
        listen 80;
        listen [::]:80;
        return 404; # managed by Certbot
}
```

Console Nginx conf
```
upstream minio_console {
  least_conn;
  server 192.168.0.11:9001;
}

server {
        server_name s3console.sample.com;
   # Allow special characters in headers
   ignore_invalid_headers off;
   # Allow any size file to be uploaded.
   # Set to a value such as 1000m; to restrict file size to a specific value
   client_max_body_size 0;
   # Disable buffering
   proxy_buffering off;
   proxy_request_buffering off;

        location / {
                proxy_set_header Host $http_host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-NginX-Proxy true;

      # This is necessary to pass the correct IP to be hashed
      real_ip_header X-Real-IP;

      proxy_connect_timeout 300;

      # To support websockets in MinIO versions released after January 2023
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      # Some environments may encounter CORS errors (Kubernetes + Nginx Ingress)
      # Uncomment the following line to set the Origin request to an empty string

      chunked_transfer_encoding off;

      proxy_pass http://minio_console; # This uses the upstream directive definition to load balance
        }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/s3console.sample.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/s3console.sample.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = s3console.sample.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


        server_name s3console.sample.com;
    listen 80;
    return 404; # managed by Certbot
}
```

### sub-path

```
https://s3.sample.com -> api gateway 443
https://s3.sample.com/console -> api gateway 443

https://s3.sample.com:9000 -> 9000번을 타고 MINIO 서버로 직접 연결
https://s3.sample.com:9001/console -> 9001번을 타고 MINIO 서버로 직접 연결
```

```
config.env

MINIO_SERVER_URL=https://s3.sample.com
MINIO_BRWOSER_REDIRECT_URL=https://s3.sample.com/console
``

L4 장비(포트포워딩), APIGateway, SSL, docker-compose, config