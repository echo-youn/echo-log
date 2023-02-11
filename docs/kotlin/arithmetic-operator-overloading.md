# arithmetic operator overloading

코틀린에서는 관례를 사용하는 가장 단순한 예는 산술 연산자이다.

자바에서는 원시 타입에서만 산술 연산자를 사용할 수 있고, 예외적으로 String에 대해서만 `+` 연산자를 사용할 수 있다.

코틀린에서는 이를 가능하게 해 준다.

## 이항 산술 연산 오버로딩

아래의 예시는 두 점의 좌표를 각각 더해주는 메서드가 있는 `Point` 클래스이다.

`operator` 키워드를 붙임으로서 관례를 따르는 함수명이라면 그 연산자에 오버로딩 해주는 키워드이다.

```kotlin
data class Point(val x: Int, val y: Int) {
    operator fun plus(other: Point): Point {
        return Point(x + other.x, y + other.y)
    }
}

println((Point(2, 3) + Point(1, 1))) // Point(3, 4)
```

위와 같이 정의해 준 다음 `+`로 두 객체를 더한다면 오버로딩된 대로 실행이 된다.

또는 멤버함수로 만드는 대신 확장 함수로 정의할 수 있다.

```kotlin
operator fun Point.plus(other: Point): Point {
    return Point(x + other.x, y + other.y)
}
```

## <b>오버로딩 가능한 이항 산술 연산자 </b>
[공식 문서 링크](https://kotlinlang.org/docs/operator-overloading.html)


### 단항 연산 (Unary operations)

<b>prefix operators</b>

|식|함수 명|
|-|-|
|+a|a.unaryPlus()|
|-a|a.unaryMinus()|
|!a|a.not()|

<b>increments and decrementss</b> 

|식|함수 명|
|-|-|
|a++|a.inc()|
|a--|a.dec()|

### 이항 연산자

|식|함수 이름|
|-|-|
|a * b|a.times(b)|
|a / b|a.div(b)|
|a % b|a.mod(b)(1.1부터 a.rem(b))|
|a + b|a.plus(b)|
|a - b|a.minus(b)|
|a..b|a.rangeTo(b)|

<b>in 연산자</b>

|식|함수 이름|
|-|-|
|a in b|b.contains(a)|
|a !in b|b!.contains(a)|

<b>for 문에서의 in 연산자 (iterator 관례)</b>

for 문에서도 in 연산자를 사용하나 위에서의 in 연산자와는 의미가 다르다.

아래의 예시로 설명해본다.

```kotlin
for (x in list) {
    // list.iterator() 를 호출해서 이터레이터를 얻는다.
    // list.hasNext(), list.next() 호출을 반복하는 식으로 변환된다.
}
```

<b>인덱스 접근 연산자(indexed access operator)</b>

|식|함수 이름|
|-|-|
|a[i]|a.get(i)|
|a[i,j]|a.get(i, j)|
|a[i_1, ..., i_n]|a.get(i_1, ..., i_n)|
|a[i] = b|a.set(i, b)|
|a[i, j] = b|a.set(i, j, b)|
|a[i_1, ..., i_n] = b|a.set(i_1, ..., i_n, b)|

<b>호출 연산자 (invoke operator)</b>

|식|함수 이름|
|-|-|
|a()|a.invoke()|
|a(i)|a.invoke(i)|
|a(i, j)|a.invoke(i, j)|
|a(i_1, ..., i_n)|a.invoke(i_1, ..., i_n)|

<b>증강 대입 연산자</b>

|식|함수 이름|
|-|-|
|a += b|a.plusAssign(b)|
|a -= b|a.minusAssign(b)|
|a *= b|a.timesAssign(b)|
|a /= b|a.divAssign(b)|
|a %= b|a.remAssign(b)|

<b>비교 연산자</b>

|식|함수 이름|
|-|-|
|a == b|a?.equals(b) ?: (b === null)|
|a != b|!(a?.equals(b) ?: (b === null))|
|a > b|a.compareTo(b) > 0|
|a < b|a.compareTo(b) < 0|
|a >= b|a.compareTo(b) >= 0|
|a <= b|a.compareTo(b) <= 0|

### 구조 분해 선언

코틀린의 관레를 사용한 마지막 특성인 구조 분해 선언(destructuring declaration)에 대해 살펴본다.
구조 분해를 사용하면 복합적인 값을 분해해서 여러 다른 변수를 한꺼번에 초기화할 수 있다.

```kotlin
val p = Ponint(10, 20)
val (x, y) = p

println(x) // 10
println(y) // 20
```

구조 분해 선언의 각 변수를 초기화하기 위해 `componentN`이라는 함수를 호출한다. 위의 예제의 구조 분해 선언은 다음과 같이 컴파일된다.

```
val (a, b) = p

val a = p.component1()
val b = p.component2()
```

`data class`의 주 생성자에 들어있는 프로퍼티에 대해서는 컴파일러가 자동으로 componenetN 함수를 만들어 준다. 다음 예제에서는 데이터 타입이 아닌 클래스에서 이런 함수를 어떻게 구현하는지 보여준다.

```kotlin
class Point(val x: Int, val y: Int) {
    operator fun component1() = x
    operator fun component2() = y
}
```






