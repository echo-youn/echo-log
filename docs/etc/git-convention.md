# Git Convention

커밋을 일관성있도록 작성하기 위한 커밋 컨벤션을 정리한다. 이 컨벤션은 유다시티 컨벤션을 기반으로 작성되었다.

## 커밋 메세지 구성
커밋 메세지는 빈줄로 구분된 세 부분으로 구성된다.
제목, 본문(optinal), 바닥글(optional)
```sh
type: Subject
## 빈줄
body (optional)
## 빈줄
footer (optional)
```

제목은 커밋의 타입과 제목으로 이루어져 있다.

## 커밋 종류
커밋의 종류는 아래와 같이 분류할 수 있다.

|**타입명**|**설명**|
|-|-|
|**feat**|새로운 기능|
|**fix**|버그 수정|
|**docs**|문서, 주석 수정|
|**style**|코드의 포맷팅, missing semi colons, code style, etc|
|**refactor**|프로덕션 코드 리팩토링|
|**test**|테스트 코드 추가 및 테스트 코드 리팩토링, 프로덕션 코드 수정 X|
|**chore**|빌드 작업 수정, 패키지 매니저 설정 수정 등...; 프로덕션 코드 수정 X|

## 제목
제목은 50자 이하여야 하며 대문자로 시작하고 마침표로 끝나지 않아야 합니다.

커밋이 무엇을 했는지보다 동사가 맨 앞으로 나오는 명령형을 사용하여 커밋이 하는 일을 설명합니다. 예를 들어 `chaged`나 `changes`대신 `change`를 사용합니다.

## 본문
모든 커밋이 본문을 작성해야할 만큼 복잡하지 않으므로 선택적으로 작성합니다. 커밋에 대해 자세한 설명을 작성합니다.

본문에는 커밋의 코드들의 `어떻게(how)` 동작하는지에 대해서가 아니라 커밋이 `무엇(what)`인지 `왜(why)` 수정됐는지 작성합니다.

본문을 작성할 때 제목과 본문 사이에는 빈 줄이 있어야 하며 각 줄의 길이는 72자 이내로 제한해야 합니다.

## 바닥글
바닥글은 선택사항이며 이슈 트래킹 ID나 레퍼런스들을 참조하는데 사용합니다.

## 예시
```
feat: Add new feature with special library and package

This feature add for new crews.

See also: #777(issue or pr), https://echo-youn.github.io/echo-log
```
