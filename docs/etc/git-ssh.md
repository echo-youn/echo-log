# Github SSH 키

Github을 git repository로 사용할때 `ssh` 방식으로 사용하는 법을 공유합니다.

## 키 만들기
ssh키를 만드는 방법은 Windows 환경과 타 운영체제의 환경과 약간 다릅니다.

우선, Windows 환경에서는 putty로 ssh키를 생성 할 수도 있지만 이 방법보다는 `git-bash`를 설치하여 `ssh-keygen` 패키지를 사용하여 만드는 방법을 추천합니다.

윈도우 설치 방법은 최하단에 추가로 적어 놓고 설치 후 진행 합니다.

이제 mac은 터미널, windows는 깃배시를 실행한 뒤 `ssh-keygen`을 실행합니다.

```shell
$ ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/home/user_name/.ssh/id_rsa): 
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /home/user_name/.ssh/id_rsa
Your public key has been saved in /home/user_name/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:NvC/Ym6I177n+Zlwb+4xdSFL/DCFRZ978E2KyvQjW1Y user@pc_name
The key's randomart image is:
+---[RSA 3072]----+
|              ++ |
|            ... o|
|      .      *.oo|
|       o    ..*=+|
|        S . ..Eo*|
|       . = o . .o|
|     . o  * * o  |
|    . o = .X =.o |
|     . =+==.+++  |
+----[SHA256]-----+
$ cd ~/.ssh # 기본 ssh 키 저장 디렉토리
$ ls -alh # id_rsa, id_rsa.pub가 생성되었다.
drwx------  2 echo echo 4.0K 11월 13 23:16 .
drwxr-x--- 34 echo echo 4.0K 11월 13 22:41 ..
-rw-------  1 echo echo 2.6K 11월 13 23:16 id_rsa 
-rw-r--r--  1 echo echo  570 11월 13 23:16 id_rsa.pub
```

파일명과 저장할 위치를 물어보는데 그냥 빈값으로 입력하면 기본 위치에 저장이 된다.

그리고 `passphrase`를 물어보는데, 이는 키를 사용할때 마다 암호를 입력해야한다.

편의상 `passphrase`는 비워서 사용하기도 한다.

이제 파일명이 `id_rsa`로 키가 만들어지는데 기존에 같은 이름의 키가 있다면 덮어씌워지니 이점만 주의한다.

아래 `id_rsa`와 `id_rsa.pub` 둘 중 `id_rsa`는 절대 다른 곳에 공유하면 안되는 키니 앞으로 다른곳에 입력해야하는 키라면 `id_rsa.pub`을 복사 붙여넣기 하면 된다.

## Github 계정에 ssh 키 적용하기

이제 키를 만들었으면 키를 깃헙 계정에 적용해야한다. 공개키 `id_rsa.pub`를 복사 붙여넣기 하면 된다.

```shell
$ cat id_rsa.pub # 아래의 public 키를 전부 다 복사한다.
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCCX+K5dB1UUkJtO/u0L8Nnce4EbY0ce3MF8MMZm8rQWx2F/v3pnbVANqQg54HjvutcXp57PbBgT2QKxXhz/aEtPdiwHc4pYSSTtyYx1VIr+BXGGQBxBOhbEhDaa2eEU0Sk9DgwiHehGAq3FV2d1OR2QFKqMQ/bHM/osTM5NZ3kkPnnyjnO/+OxV57oapWeGXCKLZDzpbIHOiYuIoj4HLVs+PfdAQUPbElrVHw0wOCbUYY/v11QolgydyfJijijHQN9sYq/auTn6yrDFglVXfQxnoEBJyCkcIZQOCD6TAFPQ3UihMvYDitN77BaAYReqfb2ms+63BANoP+SLBFpVmotXzKogk8kauEM8p8Ae21nHnLN8hyR98fa9/T1W/GaY3dTxknzUH47TvRpP7pgfiTQNHeaXnJC+mvS6z41r5V97NrpG4ScBp1R/IqpOEuJezzJ7dGNZWWWY4oMIKjaGN4bxQ6phssgvup0zNQaiZv4o8l9WZ9+8v90a/cOFDx7lDM= username@pc-name
```

이제 레파지토리의 Setting 말고 깃헙 계정의 Settings에 들어가 `SSH and GPG keys` 메뉴에 들어간다. `New SSH Key`로 위에서 복사한 키를 붙여넣고 저장하면 적용 완료된다. 

![스크린샷](https://user-images.githubusercontent.com/39899731/201527294-6045049f-c23f-49ef-98df-7238c34b424c.png)



## Windows에서 Git Bash 설치하기

[**설치 파일 경로**](https://git-scm.com/downloads)

위 링크로 접속해 본인의 환경에 맞는 설치파일을 다운로드합니다. 이번에는 Windows를 선택합니다.

약관에 대해 동의 한 뒤 설치 경로를 지정해 주는데 다 기본으로 설정되어있는 옵션대로 설치하면 `git-bash`, `git-GUI`가 설치가 됩니다.
