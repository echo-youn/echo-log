# Ansible Installation

개발환경 배포 자동화를 위해 Ansible 도입을 결정했다.

설치를 해보자.

## Control node requirement
- POSIX OS
- Python
- Ansible
- ssh

## Managed node requirement
- Python
- sshd

앤서블이 설치될 `컨트롤 노드`와 자동화 대상이 되는 `매니지드 노드`로 구분되는데 앤서블은 컨트롤 노드에만 설치가 되면된다.

매니지드 노드에는 파이썬 스크립트를 실행해야하기 때문에 `python` 이 설치되어 있어야한다.

컨트롤 노드는 매니지드 노드에 SSH을 통해 통신하기 때문에 SSH가 설치되고 실행중이어야한다.

## pip를 사용해 설치

먼저 앞서 말했다시피 Ansible은 파이썬이 설치되어있어야한다.

컨트롤 노드와 매니지드 노드에 파이썬이 설치되어있는지 확인한다.

```shell
$ python3 -m pip -V
pip 21.0.1 from /usr/lib/python3.9/site-packages/pip (python 3.9)
# 만약 pip가 설치 안되어있다면
$ curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
$ python3 get-pip.py --user
```

그런 뒤 Ansible을 설치해준다.

```shell
# minimal 버전인 core 패키지가 있지만 굳이 필요하지 않아서 ansible을 설치한다.
$ python3 -m pip install --user ansible
# python3 -m pip install --user ansible-core
```

## Ansible 업그레이드

앤서블의 버전을 업그레이드 해야하는 경우 아래 커맨드를 사용하면 된다.

```shell
$ python3 -m pip install --upgrade --user ansible
```

## SSH 공개 키 등록

매니지드 노드에 컨트롤 노드의 SSH 공개 키를 등록해둔다.

```shell
$ ssh-copy-id username@hostname
```

## References
- [설치 안내 문서](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#installing-ansible)
