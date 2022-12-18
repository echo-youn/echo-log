# lambda

람다는 다른 함수에 넘길 수 있는 작은 코드 조각이다.

먼저 컬렉션에서 자주 사용되는 하나의 람다 예시를 봅시다.

아래 코드에는 `maxBy`와 `also`의 인자로 전달된 두개의 익명 람다가 있다.

```kotlin
listOf(10,1,2,3,4,5).maxBy { // 배열의 원소 중 가장 큰 숫자를 반환한다.
    it 
}.also {
    println(it) // 전달받은 매개변수 it을 출력한다.
}
```

아래에는 람다가 함수나 프로퍼티를 반환하는 역할을 수행하는 정도라면 `멤버 참조`로 대체할 수 있다.

```kotlin
listOf(Person("echo", 10), Person("echo2", 20)).maxBy(Person::age) // 클래스::멤버 구조로 이루어져 있다.
// ::메서드 이런 경우 최상위 함수를 참조한다.
```

## 람다 선언

람다는 동작의 모음, 코드의 모음이다.

대부분 파라미터에 람다를 즉석에서 정의해서 전달하는 경우가 대부분이지만, 람다도 마찬가지로 선언하여 변수에 저장할 수 있다.

```kotlin
val printer = { msg:String ->
    println(msg)
}

"my message".also(printer)
// my message
```

## 코틀린 람다의 특징

람다의 파라미터가 하나뿐이고 그 타입을 컴파일러가 추론할 수 있는경우 그 하나뿐인 람다의 파라미터를 `it`으로 사용할 수 있다.

람다의 본문을 블록으로 감싸 여러줄로 정의했다면 마지막 식(expression)이 값이 그 람다의 반환 값이 된다.


## 클로저

자바에서는 람다 바깥의 변수의 값을 참조하려면 그 변수는 final이여야 한다. 그래서 보통 블록 바깥에 있는 변수에 접근하기 위해 Atomic으로 감싸기도 한다.

그러나 코틀린에서는 바깥에 있는 변수가 final이 아니어도 접근이 가능하고 변경도 가능하다.

이떄 람다 안에서 사용하는 외부 변수를 `람다가 포획한 변수(captured variable by lambda)`라고 부른다.

포획한 변수의 원래 생명주기는 원래의 함수 블록이 끝나면 반환되어야 했다.

그런데 함수블록이 끝났는데 포획해간 변수가 담긴 람다 블록을 반환하거나 다른 변수에 저장한다면 그 변수의 생명주기는 바뀌게 된다.

이런경우 파이널 변수일 경우 람다를 변수값과 함께 저장한다.

파이널 변수가 아닌 경우 특별한 래퍼로 감싸서 나중에 변경하거나 읽을 수 있도록 한 다음, 래퍼에 대한 참조를 람다 코드와 함께 저장한다.

## count와 size

컬렉션을 다루는 람다를 작성할 때에 컬렉션을 다루게 되므로 가장 적합한 연산을 하도록 노력해야한다.

```kotlin
val a= (1..100).toList()
// 이렇게 처리하면 중간에 filter된 원소가 포함된 컬렉션이 생긴다. 
println(a.filter { it % 2 == 0 }.size)
// 조건을 만족하는 원소만 추적하므로 별도의 컬렉션이 생기지 않는다.
println(a.count { it % 2 == 0 })
```

위의 코드와 같이 count로 하는것이 훨씬 효율적이다.

필요에 따라 컬렉션 API를 적절하게 사용해야 한다.

## flatMap

`Kotlin in action`에서 코틀린의 컬렉션 메서드 중 `flatMap`을 예시로 소개하고 있다.

`flatMap`은 컬렉션안에 또다른 컬렉션이 중첩되어 있을때 이를 하나의 컬렉션으로 변환해 주는 역할을 한다.

컬렉션 안의 컬렉션을 `flat`하도록 변환할 때 `map`으로만 처리해야한다면 다음과 같이 해야할 것이다.

```kotlin
data class Book(
    val title: String,
    val authors: List<String>
)

val a = listOf(Book("bb", listOf("alen")), Book("cc", listOf("alen", "echo")), Book("title", listOf("a", "b", "c")))

val temp = mutableListOf<String>()

a.forEach {
    it.authors.mapTo(temp) {innerIt ->
        innerIt
    }
}

println(temp)

>> [alen, alen, echo, a, b, c]
```

더 나은 코드가 있겠지만 2중 반복문으로 컬렉션 안의 컬렉션을 하나의 컬렉션에 담기위해 여러 줄의 코드를 구현해야한다.

아래는 `flatMap`을 사용했을 때 간결해진 코드를 볼 수 있다.

```kotlin
println(a.flatMap { it.authors })

>> [alen, alen, echo, a, b, c]
```

## 지연 계산 컬렉션 연산

lazy <-> eagerly

