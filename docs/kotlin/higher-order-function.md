# 고차함수 (Higher-order functions)

고차함수란 함수를 매개변수로 받거나 함수를 반환하는 함수이다. 코틀린에서는 람다나 함수 참조를 사용해 함수를 값으로 표현할 수 있다. 따라서 고차 함수는 람다나 함수 참조로 매개변수로 넘기거나 함수의 결과 값으로 람다나 함수 참조를 반환할 수 있다.

## 함수 타입

먼저 고차 함수를 정의하고 사용하기 위해서는 함수 타입(function type)에 대해 알아야한다.

함수 타입은 `(<Parameter Type>, ...) -> <Return Type>` 이렇게 표현한다. 함수 타입을 변수에 선언과 함수 타입을 정의 및 대입하는 예제를 살펴보자.

```kotlin
val sum: (Int, Int) -> Int = { x, y -> x + y } // sum 변수의 Type을 함수 타입으로 선언한다. 그리고 람다를 작성하여 sum 변수에 대입한다.
```

## 파라미터로 람다를 받는 고차함수 정의하기

이번엔 람다(함수 타입)을 매개변수로 받는 함수(고차 함수)를 정의해 본다.

```kotlin
fun twoAndThree(operation: (Int, Int) -> Int) { // 함수 타입을 매개변수로 받도록 선언한다.
    val result = operation(2, 3) // 매개변수로 받은 함수를 호출한다.
    println("The result is $result")
}

twoAndThree { a, b -> a + b }
// The result is 5
twoAndThree { c, d -> c * d }
// The result is 6
```

이는 자바로 컴파일될 때 함수 타입의 인자의 갯수에 따라 `FunctionN` 인터페이스로 제공된다. 각 인터페이스에는 `invoke` 메서드가 정의가 하나 들어있다. `invoke`를 호출하면 함수를 실행 할 수 있다.

```java
public final void tt() {
    tt$twoAndThree((Function2)null.INSTANCE);
    tt$twoAndThree((Function2)null.INSTANCE);
}

private static final void tt$twoAndThree(Function2 operation) { // FunctionN 인터페이스로 컴파일
    int result = ((Number)operation.invoke(2, 3)).intValue(); // operation 함수 파라미터의 invoke 메서드 실행
    System.out.println("The result is " + result);
}
```

### 디폴트, 널이 될 수 있는 파라미터

함수 타입을 선언할 때 파라미터의 디폴트 값을 정할 수 있다. 예시로 joinToString 구현을 살펴보자.

```kotlin
fun <T> Collection<T>.joinToString(
    seperator: String = ", ",
    perfix: String = "",
    postfix: String = ""
): String {
    val result = StringBuilder(prefix)

    for((index, element) in this.withIndex()) {
        if (index > 0) result.append(seperator)
        result.append(element) // 기본 toString 메소드로 문자열로 변환한다.
    }

    result.append(postfix)

    return result.toString()
}
```

이 구현은 유연하지만 각 원소를 문자열로 변환하는 방식을 제어할 수 없다. `element`의 기본 toString 대신 사용자가 람다로 넘기고, 사용하지 않는경우 디폴트 값으로 넣는 예시를 들어보자.

```kotlin
fun <T> Collection<T>.joinToString(
    seperator: String = ", ",
    perfix: String = "",
    postfix: String = "",
    transform: (T) -> String = { it.toString() } // default 람다
): String {
    val result = StringBuilder(prefix)

    for((index, element) in this.withIndex()) {
        if (index > 0) result.append(seperator)
        result.append(transform(element)) // tranform 함수를 호출한다.
    }

    result.append(postfix)

    return result.toString()
}

println(listOf("abcd", "xyz").joinToString())
// abcd, xyz
println(listOf("abcd", "xyz").joinToString { it.toUpperCase() })
// ABCD, XYZ
println(listOf("abcd", "xyz").joinToString(seperator = "! ", postfix = "! ", transform = { it.toUpperCase() }))
// ABCD! XYZ! 
```

코틀린에서는 함수타입이 `invoke` 메서드를 구현하는 인터페이스라는 것을 기억하여, 이번엔 안전 호출 구문으로 구현해보면 다음과 같다.

```kotlin
fun <T> Collection<T>.joinToString(
    seperator: String = ", ",
    perfix: String = "",
    postfix: String = "",
    transform: ((T) -> String)? = null // nullable 함수 타입을 선언한다.
): String {
    val result = StringBuilder(prefix)

    for((index, element) in this.withIndex()) {
        if (index > 0) result.append(seperator)
        result.append(
            transform?.invoke(element) // 안전 호출을 사용해 함수를 호출한다.
                ?: element.toString() // 엘비스 연산자를 사용해 default 경우를 처리한다.
        )
    }

    result.append(postfix)

    return result.toString()
}
```

### 함수를 반환하는 함수

사실 함수 타입을 파라미터로 사용하는경우는 많지만 함수를 반환하는 경우는 그렇게 많지 않을 수 있다.
그러나 필요한 경우가 있을수 있다.

예를 들자면, 사용자가 선택한 배송 수단에 따라 배송비를 계산하는 방식이 달라지는 상황이 있다고 해보자.
이럴때는 적절한 로직 반환하는 함수를 정의해서 사용할 수 있다.

```kotlin
enum class Delivery { STANDARD, EXPEDITED }

class Order (val itemCount: Int)

fun getShippingCostCalculator(
    delivery: Delivery
): (Order) -> Double {
    when(delivery) {
        Delivery.EXPEDITED -> return { order -> 6 + 2.1 * order.itemCount }
        else -> return { order -> 1.2 * order.itemCount }
    }
}

val expeditedCost = getShippingCostCalculator(Delivery.EXPEDITED)
val standardCost = getShippingCostCalculator(Delivery.STANDARD)
println("cost is ${expeditedCost(Order(3))}")
// cost is 12.3
println("cost is ${standardCost(Order(3))}")
// cost is 3.5999999999999996
```

### 람다를 활용한 중복제거

List 인터페이스에 로컬 확장 함수로 정의해서 사용할 수 있다.


## 인라인 함수, 람다의 부가 비용 없애기

### 인라인 함수 동작 방식

### 인라인 함수의 한계

## 고차함수 안에서 흐름 제어


