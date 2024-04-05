# 연습용 playbook

## Docker compose

```yaml
services:
  ansible:
    image: python:3.11.9-slim-bullseye
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
    stdin_open: true
  alpines:
    build:
      context: .
      dockerfile: ./dockerfile-alpine
    deploy:
      mode: replicated
      replicas: 4
      resources:
        limits:
          cpus: '0.5'
          memory: 300M
    ports:
      - "22"
    stdin_open: true
```

## dockerfile

```dockerfile
FROM python:3.11.9-alpine3.19

COPY custom-ca-certificates.crt "/usr/local/share/ca-certificates/"
RUN update-ca-certificates
RUN apk update
RUN apk add openssh
RUN apk add vim
RUN apk add openrc
RUN rc-update add sshd
RUN rc-status
RUN rc-service sshd start 2>&1 || echo "test"

RUN ["touch", "-c", "/run/openrc/softlevel"]
EXPOSE 22
```

## docker compose up

```shell
docker compose up -d
```

- Control node
```shell
docker exec -it <ansible> bash
# 앤서블 설치
# 유저 추가
# sudo 설치

```

인벤토리

```yaml
webservers:
  hosts:
    app1:
      ansible_host: 172.22.0.3
    app2:
      ansible_host: 172.22.0.4
    app3:
      ansible_host: 172.22.0.5
    app4:
      ansible_host: 172.22.0.6

dev:
  hosts:
    app1:
      ansible_host: 172.22.0.3

prod:
  hosts:
    app3:
      ansible_host: 172.22.0.5

all:
  children:
    webservers:
```

플레이북 

```yaml
- name: ping apps
  hosts: webservers
  tasks:
    - name: ping servers
      ping:
    - name: ping again
      ping:
    - name: apk update
      community.general.apk:
        name: "openssh"
    - name: echo test
      shell: "echo 1234"
```

플레이북 실행 (기본)
```shell
$ ansible-playbook -v playbook.yaml -i inventory.yaml # -v 옵션으로 결과 확인
ok: [app3]
ok: [app4]
ok: [app1]
ok: [app2]

TASK [ping servers] **************************************************************************************************************************************************
ok: [app3] => {"changed": false, "ping": "pong"}
ok: [app2] => {"changed": false, "ping": "pong"}
ok: [app1] => {"changed": false, "ping": "pong"}
ok: [app4] => {"changed": false, "ping": "pong"}

TASK [ping again] ****************************************************************************************************************************************************
ok: [app1] => {"changed": false, "ping": "pong"}
ok: [app2] => {"changed": false, "ping": "pong"}
ok: [app3] => {"changed": false, "ping": "pong"}
ok: [app4] => {"changed": false, "ping": "pong"}

TASK [apk update] ****************************************************************************************************************************************************
ok: [app3] => {"changed": false, "msg": "package(s) already installed"}
ok: [app2] => {"changed": false, "msg": "package(s) already installed"}
ok: [app1] => {"changed": false, "msg": "package(s) already installed"}
ok: [app4] => {"changed": false, "msg": "package(s) already installed"}

TASK [echo test] *****************************************************************************************************************************************************
changed: [app2] => {"changed": true, "cmd": "echo 1234", "delta": "0:00:00.001534", "end": "2024-04-05 08:11:51.364266", "msg": "", "rc": 0, "start": "2024-04-05 08:11:51.362732", "stderr": "", "stderr_lines": [], "stdout": "1234", "stdout_lines": ["1234"]}
changed: [app1] => {"changed": true, "cmd": "echo 1234", "delta": "0:00:00.001316", "end": "2024-04-05 08:11:51.364750", "msg": "", "rc": 0, "start": "2024-04-05 08:11:51.363434", "stderr": "", "stderr_lines": [], "stdout": "1234", "stdout_lines": ["1234"]}
changed: [app3] => {"changed": true, "cmd": "echo 1234", "delta": "0:00:00.001314", "end": "2024-04-05 08:11:51.375560", "msg": "", "rc": 0, "start": "2024-04-05 08:11:51.374246", "stderr": "", "stderr_lines": [], "stdout": "1234", "stdout_lines": ["1234"]}
changed: [app4] => {"changed": true, "cmd": "echo 1234", "delta": "0:00:00.001431", "end": "2024-04-05 08:11:51.380676", "msg": "", "rc": 0, "start": "2024-04-05 08:11:51.379245", "stderr": "", "stderr_lines": [], "stdout": "1234", "stdout_lines": ["1234"]}

PLAY RECAP ***********************************************************************************************************************************************************
app1                       : ok=5    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
app2                       : ok=5    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
app3                       : ok=5    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
app4                       : ok=5    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

플레이북 실행 (개발만)
```shell
$ ansible-playbook -v playbook.yaml -i inventory.yaml --limit dev
No config file found; using defaults

PLAY [ping apps] *****************************************************************************************************************************************************

TASK [Gathering Facts] ***********************************************************************************************************************************************
[WARNING]: Platform linux on host app1 is using the discovered Python interpreter at /usr/local/bin/python3.11, but future installation of another Python interpreter
could change the meaning of that path. See https://docs.ansible.com/ansible-core/2.16/reference_appendices/interpreter_discovery.html for more information.
ok: [app1]

TASK [ping servers] **************************************************************************************************************************************************
ok: [app1] => {"changed": false, "ping": "pong"}

TASK [ping again] ****************************************************************************************************************************************************
ok: [app1] => {"changed": false, "ping": "pong"}

TASK [apk update] ****************************************************************************************************************************************************
ok: [app1] => {"changed": false, "msg": "package(s) already installed"}

TASK [echo test] *****************************************************************************************************************************************************
changed: [app1] => {"changed": true, "cmd": "echo 1234", "delta": "0:00:00.001362", "end": "2024-04-05 08:28:00.247627", "msg": "", "rc": 0, "start": "2024-04-05 08:28:00.246265", "stderr": "", "stderr_lines": [], "stdout": "1234", "stdout_lines": ["1234"]}

PLAY RECAP ***********************************************************************************************************************************************************
app1                       : ok=5    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

여러개
```shell
$ ansible-playbook -v playbook.yaml -i inventory.yaml --limit "dev,prod"
No config file found; using defaults

PLAY [ping apps] *****************************************************************************************************************************************************

TASK [Gathering Facts] ***********************************************************************************************************************************************
[WARNING]: Platform linux on host app1 is using the discovered Python interpreter at /usr/local/bin/python3.11, but future installation of another Python interpreter
could change the meaning of that path. See https://docs.ansible.com/ansible-core/2.16/reference_appendices/interpreter_discovery.html for more information.
ok: [app1]
[WARNING]: Platform linux on host app3 is using the discovered Python interpreter at /usr/local/bin/python3.11, but future installation of another Python interpreter
could change the meaning of that path. See https://docs.ansible.com/ansible-core/2.16/reference_appendices/interpreter_discovery.html for more information.
ok: [app3]

TASK [ping servers] **************************************************************************************************************************************************
ok: [app1] => {"changed": false, "ping": "pong"}
ok: [app3] => {"changed": false, "ping": "pong"}

TASK [ping again] ****************************************************************************************************************************************************
ok: [app1] => {"changed": false, "ping": "pong"}
ok: [app3] => {"changed": false, "ping": "pong"}

TASK [apk update] ****************************************************************************************************************************************************
ok: [app3] => {"changed": false, "msg": "package(s) already installed"}
ok: [app1] => {"changed": false, "msg": "package(s) already installed"}

TASK [echo test] *****************************************************************************************************************************************************
changed: [app1] => {"changed": true, "cmd": "echo 1234", "delta": "0:00:00.001110", "end": "2024-04-05 08:28:34.144502", "msg": "", "rc": 0, "start": "2024-04-05 08:28:34.143392", "stderr": "", "stderr_lines": [], "stdout": "1234", "stdout_lines": ["1234"]}
changed: [app3] => {"changed": true, "cmd": "echo 1234", "delta": "0:00:00.001501", "end": "2024-04-05 08:28:34.144038", "msg": "", "rc": 0, "start": "2024-04-05 08:28:34.142537", "stderr": "", "stderr_lines": [], "stdout": "1234", "stdout_lines": ["1234"]}

PLAY RECAP ***********************************************************************************************************************************************************
app1                       : ok=5    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
app3                       : ok=5    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0

```

- Managed Node
```shell
docker exec -it <managed-node> sh
# openssh 설치, 
# opennc 설치,
# sshd 실행
# 유저 추가
```

로그인
