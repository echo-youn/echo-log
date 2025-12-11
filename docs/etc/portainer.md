# Portainer 설치

도커 컨테이너를 쉽게 관리하게 도와주는 portainer! 한번 사용해보자

## 설치

설치는 도커, 도커 스웜 등으로 설치 할 수 있는데 docker compose 로 설치하기로!

```yaml
services:
  portainer:
    container_name: portainer
    image: portainer/portainer-ce:lts
    restart: always
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer-data:/data
    ports:
      - 9443:9443
      - 8000:8000  # Remove if you do not intend to use Edge Agents

volumes:
  portainer_data:
    name: portainer-data

networks:
  default:
    name: portainer_network
```

## 로그인 
```
https://localhost:9443
```

## 설정

우선 설치한 서버에 설치된 도커들을 `Home - Environments - local`을 통해 모니터링 할 수 있다

Portainer에서는 도커가 설치된 노드를 `Environment`라 부르는것 같다.

다른 서버도 추가해본다

`Environment-related - Environments`에 가서 `Add Environment`한다. 

`Docker Standalone`을 선택해 `Start Wizard`를 선택한다

그리고 portainer-agent 이미지를 사용해 에이전트를 해당 서버에 설치한다.

```yaml
services:
  portainer-agent:
    container_name: portainer-agent
    image: portainer/agent:2.33.5
    restart: always
    ports:
      - 9001:9001
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /var/lib/docker/volumes:/var/lib/docker/volumes
      - /:/host
```

실행 후 연결 확인하면 끝!

