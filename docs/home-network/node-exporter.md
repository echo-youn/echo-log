# Node exporter 설치

필요
- docker
- docker compose
- internet

1. node-exporter 디렉토리 생성
2. compose 파일 생성 및 실행
3. prometheus targets에 추가

```aiignore
# docker-compose.yml
services:
  node_exporter:
    image: quay.io/prometheus/node-exporter:latest
    container_name: node_exporter
    command:
      - "--path.rootfs=/host"
    pid: host
    restart: unless-stopped
    volumes:
      - "/:/host:ro,rslave"
    ports:
      - "9100:9100"
    logging:
      driver: local
      options:
        max-size: 3m
        max-file: "3"

$ docker compose up -d
[+] Running 4/4
 ✔ node_exporter Pulled                                                                                                                                                                                             8.8s
   ✔ 6ce8b87a9754 Pull complete                                                                                                                                                                                     1.6s
   ✔ d2f8aae8d80e Pull complete                                                                                                                                                                                     3.5s
   ✔ cceed781d889 Pull complete                                                                                                                                                                                     5.1s
[+] Running 2/2
 ✔ Network node-exporter_default  Created                                                                                                                                                                           0.2s
 ✔ Container node_exporter        Started                                                                                                                                                                           2.0s
```
