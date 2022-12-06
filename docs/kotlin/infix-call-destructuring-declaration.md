# infix call & destructuring declaration

## 중위 호출

코틀린에서는 맵을 만들때 다음과 같은 방법으로 만든다.

```kotlin
mapOf("key1" to "value1", "key2" to "value2")
```

위 코드의 `to`는 특별한 키워드가 아니라 함수를 호출하는 방법 중 `중위 호출(infix call)` 방법으로 호출한 것이다.

중위 호출은 수신 객체와 파라미터가 유일한 메소드의 이름을 넣는다.

정의와 호출의 예시를 적는다.

```kotlin
@Test
fun test() {
    "a".myInfix("b")
    "a" myInfix "b"
}

infix fun <K, T> K.myInfix(msg: T): K {
    println(msg)
    return this
}
```

여기서는 수신 객체 타입을 제네릭하게 설정했지만 특정 타입을 설정할 수도 있다.

## 구조 분해 선언

구조 분해 선언 시 여러 예시를 들어 보겠다.

### 배열과 Pair 구조 분해 선언

```kotlin
val (a,b,c,d,e) = listOf(1,2,3,4) // ArrayIndexOutOfBoundsException
val (z, x) = "test" to "bb"
```

### 반복문에서 collection 구조 분해 선언

```kotlin
for ((key, value) in map) {
   // do something with the key and the value
}
```

## 여러 구조 분해 선언 케이스

```kotlin
{ a -> ... } // one parameter
{ a, b -> ... } // two parameters
{ (a, b) -> ... } // a destructured pair
{ (a, b), c -> ... } // a destructured pair and another parameter
```
