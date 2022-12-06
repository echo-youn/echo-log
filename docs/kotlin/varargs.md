# varargs 가변인자

함수의 파라미터를 원하는 만큼 많이 전달 할 수 있도록 해주는 기능이 바로 `가변 인자`이다.

자바에서는 타입뒤에 `...` 붙이는것으로 가변인자를 선언하지만 코틀린에서는 파라미터 명 앞에 `varargs`를 붙임으로서 가변인자를 선언한다.

그리고 자바에서는 가변인자 메서드에 파라미터를 넘길때 배열이라면 그대로 넘겨도 되지만 코틀린에서는 명시적으로 풀어서 전달해야한다.

이때 `스프레드 연산자`를 이용해 배열을 펼쳐서 사용할 수 있다.


```kotlin
fun i2s(vararg numbers: Int): String {
    return numbers.joinToString(",")
}

@Test
fun test() {
    println(i2s(1,3,4,2))
    println(i2s(*intArrayOf(1,2,3,4)))
}

/** result
1,3,4,2
1,2,3,4
 */
```
