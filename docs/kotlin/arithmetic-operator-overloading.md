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

### 위임 프로퍼티 (delegated property)

코틀린에서 제공하는 특성 중 독특하면서 강력한 기능인 위임 프로퍼티(deletgated property)이다.
위임 프로퍼티를 사용하면 값을 뒷받침하는 필드에 단순히 저장하는 것 보다 더 복잡한 방식으로 작동하는 프로퍼티를 쉽게 구현할 수 있다.

예를 들면, 프로퍼티는 위임을 이용해 값을 필드가 아니라 데이터베이스 테이블이나 브라우저 세션이나 맵 등에 저장할 수 있다.

그러면 어떻게 사용하면 되는지 문법을 예제로 알아보자.

```kotlin
class Foo {
    var p: Type by Delegate()
}
```

위 예제를 컴파일러는 숨겨진 도우미 프로퍼티를 만들고 그 프로퍼티를 위임 객체의 인스턴스로 초기화한다.

```kotlin
class Foo {
    private val delegate = Delegate() // 컴파일러가 만든 도우미 프로퍼티다.
    var p: Type
    set(value: Type) = delegate.setValue(..., value) // 프로퍼티에 접근할때 이 메서드를 호출하게 된다.
    get() = delegate.getValue()
}
```

그러면 Delegate 클래스는 관례에 따라 `getValue`와 `setValue` 메소드를 제공해야한다.

```kotlin
class Delegate {
    operator fun getValue(...) { ... }
    operator fun setValue(..., value: Type) { ... }
}

class Foo {
    var p: Type by Delegate()
}
```

그러면 이제 Foo의 p 프로퍼티에 접근할때에 Delegate의 메서드를 호출하게 된다. 코틀린 라이브러리는 프로퍼티 위임을 사용해 프로퍼티 초기화를 지연시켜 줄 수 있다.

## 위임 프로퍼티 초기화 지연 (by lazy)

지연 초기화(lazy initialization)는 객체의 일부를 초기화하지 않고 있다가, 그 자원이 필요할때 초기화하는 흔히 쓰이는 패턴이다.

초기화 과정에서 자원을 많이 사용하거나 꼭 초기화하지 않아도되는 프로퍼티에 대해 지연 초기화 패턴을 사용할 수 있다.

지연 초기화의 예를 들어본다.

```kotlin
class Person(val name: String) {
    private var _emails: List<Email>? = null // 이메일의 실제 데이터는 이 프로퍼티에 저장한다.

    val emails: List<Email> // 이메일의 실제 데이터는 여기에 담겨있지 않다.
        get() {
            if (_emails == null) {
                _emails = loadEmails(this) // 최초 접근시(backing property가 널 일때)에만 이메일을 가져온다.
            }
            return _emails ?: listOf()
        }
}
```

여기서는 `backing property`라는 기법을 사용한다. `_emials`라는 프로퍼티는 값을 저장하고 `emails` 프로퍼티는 읽기 연산만을 제공한다.

하지만 이런 코드를 만드는것은 약간 성가시다. 이런 프로퍼티가 많아지면 구현도 번거로워지고 이 구현은 스레드 세이프하지 않아서 멀티스레드 환경에서 에러를 발생시킬 수 있다.

코틀린은 이런 경우를 코틀린 라이브러리에서 `by lazy` 함수로 지원해준다.

```kotlin
class Person(val name: String) {
    val emails by lazy { loadEmails(this) }
}
```

lazy 함수는 기본적으로 스레드 세이프하다. 그러나 필요에 따라 동기화에 사용할 락을 lazy 함수에 전달할 수도 있고, 다중 스레드 환경에서 사용하지 않을 프로퍼티를 위해 lazy 함수가 동기화를 하지 못하게 막을 수도 있다.

backing property -> non thread-safe

