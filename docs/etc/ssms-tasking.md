# SSMS 엑셀 태스킹 오류

```
오류 메세지 : 
제목: SQL Server 가져오기 및 내보내기 마법사
작업을 완료할 수 없습니다.
추가 정보:
'Microsoft.ACE.OLEDB.12.0' 공급자는 로컬 컴퓨터에 등록할 수 없습니다. (System.Data)
```

DB에 엑셀 데이터를 SSMS로 import할 때 이런 이슈가 발생해 해결 방법에 대해 공유합니다.

## 해결방법

**2007 Office system 드라이버: 데이터 연결 구성 요소**를 설치합니다.

https://www.microsoft.com/ko-kr/download/confirmation.aspx?id=23734

++ 2022년 11월 14일 기준으로 위 링크가 사라지고 Office 2007 관련하여 지원이 중단되었습니다. 따라서 Windows에서 드라이버를 찾아 설치하여야 합니다.
