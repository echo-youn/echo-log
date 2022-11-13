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

