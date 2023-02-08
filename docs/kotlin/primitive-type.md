# Primitive type

자바는 원시타입과 래퍼타입(참조 타입, Boxed Class 등...)을 구분한다.
그래서 값 비교할때에 박싱, 언박싱에 대해 알아야 정확하게 사용할 수 있다.
그리고 자바는 컬렉션에는 원시타입을 담을 수 없다.

코틀린은 원시 타입과 래퍼 타입을 구분하지 않는다.

그러면 코틀린은 항상 객체로 표현하는가?

## Non-null Type

아니다. 실행 시점에 가능한 가장 효율적인 방식으로 표현한다.
대부분의 코틀린의 `Int` 타입은 자바의 `int`로 컴파일된다.
그렇지 않은경우는 컬렉션과 같은 제네릭 클래스를 사용하는 경우 뿐이다.
`Int` 타입을 컬렉션의 타입 파라미터로 넘기면 그 컬렉션에는 `java.lang.Integer` 객체가 들어간다.
그리고 `Int`와 같은 코틀린의 원시 타입에는 널 참조가 들어갈 수 없기때문에 자바의 원시 타입으로 취급될 수 있다.

## Nullable Type

코틀린의 nullable type은 자바의 원시 타입으로 표현할 수 없기 때문에 자바의 래퍼 타입으로 컴파일 된다.
또는 제네릭 클래스의 경우 원시 타입을 허용하지 않는다.
이는 JVM에서 제네릭을 구현할 때 타입 인자로 원시 타입을 허용하지 않는다.
따라서 코틀린이든 자바든 제네릭 클래스는 항상 박스 타입을 사용해야 한다.
만약 원시 타입으로 이루어진 대규모 컬렉션을 저장해야한다면, 원시 타입으로 이루어진 고효율 컬렉션을 제공하는 서드파티 라이브러리(`트로브J4 등...`)를 사용하거나 배열을 사용해야한다.

## 숫자 변환

코틀린은 숫자 타입을 다른 숫자 타입으로 자동 변환하지 않는다.

대신 코틀린은 모든 원시 타입에 대한 변환 함수를 제공한다. `toByte()`, `toShort()`, `toChar()` 등과 같다.

양방향 변환 함수 모두가 제공된다.

범위가 큰 타입에서 작은 타입으로 변환하는 경우에 일부를 잘라내는 함수도 있다. `Long.toInt()`

코틀린은 혼란을 피하기 위해 형변환을 명시하기로 했다.

특히, 박스 타입을 비교하는 경우 문제가 많이 있다. 두 박스 타입간 equals 메소드는 그 안의 값을 비교하지 않고 박스타입 객체를 비교한다.
따라서 자바에서는 다음이 성립한다.

```java
new Integer(42).equals(new Long(42)); // 이 결과는 false이다.
```

따라서 코틀린에서는 다음과 같이 작성해야한다..

```kotlin
val a = 1
val b = listOf(1L, 2L, 3L)
a in b // 컴파일에러
a.toLong() in b // 비교 가능
```

## Any 최상위 타입

자바에서는 Object가 최상위 객체이듯, 코틀린에서는 Any가 최상위 타입이다.
코틀린에서는 Any 타입은 자바 바이트코드의 Object로 컴파일된다.

java.lang.Object에 있는 wait나 notify와 같은 메서드는 코틀린의 Any에 없기 때문에 그 메서드를 사용하기 위해서는 java.lang.Object로 캐스팅 해야한다.

## Unit 타입

코틀린의 Unit 타입은 자바의 void와 같은 기능을 한다.

코틀린에서 Unit을 리턴한다면 void로 컴파일 된다.

그렇다면 void와 Unit의 차이는 무엇일까,

Unit은 void와 달리 타입인자로 사용할 수 있다. Unit 타입에 속한 값은 단 하나뿐이며, 그 이름도 Unit이다.
Unit 타입의 한수는 Unit 값을 묵시적으로 변환한다.

이 특성으로 제네릭 파라미터를 변환하는 함수를 오버라이드하면서 반환 타입으로 Unit을 쓸 때 유용하다.

```kotlin
interface Processor<T> {
    fun process(): T
}

class NoResultProccessor: Processor<Unit> {
    override fun process() {
        // logic
    }
}

class IntResultProcessor: Processor<Int> {
    override fun process(): Int {
        println("hi2")
        return 0
    }
}
```

이 상황에서 인터페이스에서는 `process()`가 제네릭 타입을 반환하라고 명시하지만 Unit 값을 명시적으로 반환할 필요는 없다. 컴파일러가 묵시적으로 `return Unit`을 넣어준다.

왜 코틀린은 `Void`가 아닌 `Unit`이라는 이름으로 골랐는지 책에서 설명하고 있는데, 함수형 프로그래밍에서 전통적으로 `Unit`은 "단 하나의 인스턴스만 갖는 타입"을 의미해 왔다.

바로 그 유일한 인스턴스의 유무가 자바 void와 코틀린 Unit을 구분하는 가장 큰 차이다.

## Nothing 타입, 이 함수는 결코 정상적으로 끝나지 않는다.

코틀린에서는 결코 성공적으로 값을 돌려주는 일이 없는 함수가 일부 존재한다.

그래서 반환 값이라는 개념 자체가 의미 없는 함수가 있는데, 이때 함수를 호출할 때 반환 값으로 함수의 동작을 유추할 수 있으므로 유용하게 쓸 수 있다.

```kotlin
fun fail(message: String): Nothing {
    throw IllegalStateException(message)
}
```

Nothing을 반환하는 함수를 엘비스 연산자의 우항에 사용해서 전제 조건을 검사 할 수 있다.

```kotlin
val address = company.address ?: fail("No address")
println(address) // non-null 유추 가능
```

이 예제에서는 컴파일러가 우항에서 예외가 발생할것을 알기때문에 address가 non-null임을 추론할 수 있다.

