# Statement & Expression

코틀린을 접하고보니 자바에서는 문(Statement)로 쓰이는 것들이 코틀린에서는 식(Expression)으로 사용할 수 있는 문법들이 있다.

그래서 두개의 차이를 별로 느끼지 못했기에 이번에 정리를 하고 넘어가려고 한다.

## Expression 식

식(expression)은 어떤 작업을 하여 값을 반환하는 문장을 식이라 한다.

## Statement 문(문장)

문(statement)는 무언가 동작하는 모든 문장을 Statement라고 한다.

모든 코드는 문(statement)과 식(expression)으로 이루어져있다.

자바는 expression만을 실행할 수 없도록 컴파일러가 예외처리를 한다.

```java
int a = 0; // statement

a; // expression, compile error
a + a; // expression, compile error

int b = a + a; // statement

System.out.print(b); // statement
```

## 코틀린의 statement와 expression

코틀린의 if는 문(statement)이 아니라 식(expression)이다.

한마디로 if는 값을 반환할 수 있다.

```kotlin
fun echo(msg: String?): String {
    return if (msg == null) {
        "" // 코틀린은 식 블록의 마지막 라인을 반환한다.
    } else {
        msg
    }
}
```

## 식이 본문(body)인 함수

이를 이용해 코틀린의 `식이 본문인 함수` 문법을 사용해 아래와 같이 짧게 작성 할 수 있다.

```kotlin
fun echo(msg: String?): String = if (msg == null) "" else msg
```

다른 경우는 블록이 본문인 함수라고 한다.
