# Windows 10에 IIS 설치하기 및 로컬 머신에서 호스팅하기

C#으로 .NET 프로젝트를 하다보면 윈도우 머신에서 로컬에서 실행할 수 있는 방법에 대해 공유한다.

이 포스트에서는 IIS를 이용하여 로컬에서 호스팅할 수 있는 방법에 대해 공유한다.

## Windows 기능 켜기/끄기

IIS를 설치하기 위해서 `Windows 기능 켜기/끄기`를 통해 Windows에 내장된 IIS을 활성화 해야한다.

> 시작 메뉴 - Windows 기능 켜기/끄기 - 필요한 기능 체크(IIS) - IIS 실행 후 사이트 추가

시작 메뉴에서 Windows 기능 켜기/끄기를 검색한 뒤 클릭합니다.

![iis-search](https://user-images.githubusercontent.com/39899731/201528100-b4421394-a107-4596-a788-236e50f4f174.png)

그럼 아래와 같은 목록들이 나타나는데 하이라이트 된 부분을 체크합니다.

![dotnet-7](https://user-images.githubusercontent.com/39899731/201528199-b0f7deaf-df52-40a2-af7b-1b55d2166144.jpeg)

그리고 밑으로 내려가면 `인터넷 정보 서비스`라는 항목이 있습니다.

이 항목이 바로 IIS(Intternet Information Service)입니다.
이 항목과 사진에 나와있는 항목들을 체크합니다.

![iis](https://user-images.githubusercontent.com/39899731/201528238-1defdc25-3c7b-4673-af81-a0fe200ed21b.png)

만약 필요없는 항목이 있다면 체크 해제 후 진행합니다. 확인 버튼을 누르면 설치가 시작되는데 잠시 기다리면 설치가 완료됩니다.

이제 시작메뉴에 `IIS`를 검색하면 기능을 이용할 수 있습니다.

![IIS_startmenu](https://user-images.githubusercontent.com/39899731/201528294-3472f0f7-d703-448f-a106-4c35777b23dd.png)

## ASP 등록하기

제 경우에는 나머지 단계를 진행하기 전 머신에 ASP.NET이 등록되어 있지 않아서 삽질을 좀 했습니다.

하이라이트 된 부분
![aspnet](https://user-images.githubusercontent.com/39899731/201528547-80b9b7af-0e9b-498b-9e76-7e26dc572787.jpeg)

우선 Windows 기능 추가/제거 에서 `ASP.NET`의 사용하려는 버전 또는 모든 버전에 체크가 되어 있는지 확인하여 체크합니다.

그 후 명령 프롬프트 창을 관리자 모드로 실행합니다.

그리고 아래 명령어로 .NET Framework 폴더로 접근합니다.

```cmd
$ cd c:\Windows\Microsoft.NET\Framework64\v4.0.30319
```

그 후 다음 명령어를 입력합니다.

```cmd
$ aspnet_regiis.exe -i
```

설치가 완료되었습니다. 라는 문구가 뜨면 정상적으로 등록된 것이며 다시 IIS에 들어가 확인합니다.

## IIS 웹사이트 만들기

이제 본격적으로 로컬에 웹사이트를 호스팅 합니다.

IIS의 왼쪽 메뉴에서 `사이트`를 오른쪽 클릭하여 `웹 사이트 추가`를 클릭합니다.

그럼 다음과 같은 창이 뜹니다.

![iis-new](https://user-images.githubusercontent.com/39899731/201528790-d818fd76-b131-412f-8d48-2d2014cd3882.png)

|사이트이름|실제 경로|IP 주소|포트|호스트 이름|
|-|-|-|-|-|
|웹 사이트의 별칭|프로젝트의 위치(bin 폴더)|서버의 IP 주소|HTTP: 80, HTTPS: 443|도메인|

사이트 이름에는 사이트를 구분하기 위한 이름을 임의로 설정하여 적습니다.

실제 경로에는 프로젝트를 빌드하고 빌드된 bin 파일의 위치로 설정합니다.

IP 주소에는 로컬 머신에 호스팅하기 때문에 127.0.0.1로 설정합니다.

포트는 HTTP는 80으로 HTTPS는 443으로 설정합니다.

만약 도메인 없이 IP와 포트로만 호스트명을 설정하려면 비워두면 됩니다. 그러나 도메인을 설정하여 호스팅하려면 `hosts` 파일을 수정하여 도메인을 속여 호스팅합니다.

## 호스트 속이기

`hosts` 파일에 접근합니다. 명령어 없이 GUI로 접근해도 됩니다.

```cmd
$ cd C:\Windows\System32\drivers\etc\hosts
```

이 파일을 노트패드 또는 메모장으로 다음과 같이 수정합니다.

```
# Copyright (c) 1993-2009 Microsoft Corp.
#
# This is a sample HOSTS file used by Microsoft TCP/IP for Windows.
#
# This file contains the mappings of IP addresses to host names. Each
# entry should be kept on an individual line. The IP address should
# be placed in the first column followed by the corresponding host name.
# The IP address and the host name should be separated by at least one
# space.
#
# Additionally, comments (such as these) may be inserted on individual
# lines or following the machine name denoted by a '#' symbol.
#
# For example:
#
#      102.54.94.97     rhino.acme.com          # source server
#       38.25.63.10     x.acme.com              # x client host

# localhost name resolution is handled within DNS itself.
#	127.0.0.1       localhost
#	::1             localhost


127.0.0.1 각자가 설정한 호스트 이름
127.0.0.1 여러 사이트를 등록할 수도 있습니다.
```

이렇게 하면 비주얼 스튜디오에서 번거롭게 빌드 후 디버그 모드로 매번 기다리지 않고 브라우저에서 바로 설정해 놓은 호스트 이름으로 접속하여 새로고침으로 변경된 내용을 쉽게 확인 하실수 있습니다.
