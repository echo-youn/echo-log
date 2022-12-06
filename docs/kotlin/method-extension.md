# Extensions

코틀린은 기존 자바 코드와 자연스럽게 통합되는 것이 코틀린의 핵심 목표 중 하나이다.

이때, 기존 자바 API를 재작성하지 않고 코틀린이 제공하는 편리한 기능을 같이 사용하려 할때 `확장 함수`를 활용할 수 있다.

확장 함수의 모양은 다음과 같다.

```kotlin
package strings

fun String.myExtension(): String = "$this my extension"
```

확장한 클래스의 이름을 `수신 객체 타입(receiver type)`이라고 부르고 호출되는 대상이 되는 값을 `수신 객체(receiver object)`라 한다.

위 예시에서는 수신 객체 타입은 "String"이고 수신 객체는 this의 값 또는 객체이다.

그러나 확장 함수가 클래스의 캡슐화를 깨지는 않는다.

클래스 밖에 있는 확장 함수에서는 수신 객체 타입에 정의된 private 멤버 또는 protected 멤버에는 접근할 수 없다.

## import

```kotlin
import strings.myExtension as me

val a = "LOL".me()
```

정의된 확장 함수를 사용하기 위해선 `import` 해야하는데 여러 파일, 여러 패키지에서 정의되어 있는 확장 함수의 이름이 충돌 할 수 있는 가능성이 있다.

그래서 import할 대에 별칭을 주어 확장 함수 이름 충돌을 방지하는것이 좋다.

## In Java

자바에서는 그러면 어떻게 실행될까 확인해 보았다.

확인하는 방법: Tools-Kotlin-Decompile to Java

```kotlin
...
String a = stringsKt.myExtension("hi");
...
```

여기서 보면 수신 객체 타입이 확장함수의 첫번째 파라미터로 컴파일 된다.

지금까지 확장 메서드에 대해서 이야기했는데 또 확장 프로퍼티를 정의할 수 있다.

그러나 확장 프로퍼티는 잘 사용하지 않을것 같기에 정리하지 않고 기술하고만 끝낸다.
