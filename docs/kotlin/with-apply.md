## 수신 객체 지정 람다: with와 apply

코틀린에는 `with`와 `apply`라는 매우 편리하며 많은 사용자가 사용중인 표준 라이브러리가 있다.

자바에는 없는 코틀린의 독특한 기능이 있는데 다음과 같다.

> 수신 객체를 명시하지 않고 람다의 본문 안에서 다른 객체의 메소드를 호출할 수 있게 해주는 기능

그런 람다를 `수신 객체 지정 람다(lambda with reciever)`라고 한다.

## with 함수

```kotlin
fun alphabet(): String {
    val result = StringBuilder()
    for (letter in 'A'..'Z') {
        result.append(letter)
    }

    result.append("\nNow I know the alphabet!")
    return result.toString()
}

println(alphabet())

fun alphabet2(): String {
    return with(StringBuilder()) {
        for(letter in '가'..'힣') {
            append(letter) // 메서드 앞에 this. 이 생략되어 있다.
        }
        append("\n나랏말싸미...")
        toString()
    }
}

println(alphabet2())

>>ABCDEFGHIJKLMNOPQRSTUVWXYZ
Now I know the alphabet!
가각갂..생략..힡힢힣 
나랏말싸미...
```

with 함수는 첫번째 파라미터가 수신객체이며, 두번째 파라미터는 첫번째 파라미터를 수신 객체로 사용하는 람다이다.

인자로 받은 그 람다에서는 this를 사용해 그 수신 객체에 접근 할 수 있다.

**with 정의**
```kotlin
public inline fun <T, R> with(receiver: T, block: T.() -> R): R {contract{};}
```

## apply 함수

apply 함수는 with와 거의 같은데, 차이점은 apply 함수는 자신에게 전달된 객체(수신객체)를 반환한다는 점이다.

```kotlin
val a= StringBuilder().apply {
    for (letter in 'A'..'Z') {
        append(letter)
    }
}.toString()

val b = with(StringBuilder()) {
    for(letter in '가'..'힣') {
        append(letter)
    }
    println(toString())
}.toString()

println(a)
println(b)

>>
가각갂갃간갅갆갇갈갉갊갋갌...힣
ABCDEFGHIJKLMNOPQRSTUVWXYZ
kotlin.Unit
```


