# Null safety

코틀린에는 NPE(NullPointerException)를 피하는 것을 돕는 타입이 있다. 바로 Nullable Type인데, 컴파일 단계에서 nullable한 상황에 대해 대응 할 수 있도록 해준다.

이 상황에서 개발자는 가급적 프로퍼티나 변수가 nullable하지 않은 상태로 만들어 두는것이 시스템의 안정성이나 성능에 도움이 된다.

> Optional, @Nullable, @NotNull 등 자바에서 null을 다루는 방법은 여러가지가 있다.

nullable 타입은 타입 정의 뒤에 `?`를 붙이면 nullable Type이 된다.

## Safe call operator

코틀린에는 nullable 필드를 참조할때 안전한 호출 연산자(Safe call operator)를 통해 널을 안전하게 다루도록 도와준다.
이는 nullable 뒤에 `?`를 붙이는 것으로 간단하게 사용할 수 있다.

```kotlin
var a: String? = null
println(a?.split(",")) // a가 nullable이기 때문에 a에 안전한 호출 연산자를 사용하지 않으면 컴파일 에러가 발생한다.

a = "test,test2,test3"
println(a.split(",")) // 컴파일러가 a에 값이 있는걸 판단해서 null 핸들링을 안해주어도 된다.

>>
null
[test, test2, test3]
```

## Elvis operator

그리고 마지막으로 코틀린에는 null 대신 사용할 기본값을 지정할 수 있는 엘비스 연산자가 있다. nullable 타입 뒤에 `?: <기본 값 또는 식>`를 붙여 사용하면 된다.

```kotlin
var a: String? = null
println(a?.split(",") ?: "This is null")

a = "test,test2,test3"
println(a.split(","))

>>
This is null
[test, test2, test3]
```

## Safe casts

코틀린에서는 타입을 캐스팅하기 위해 `as`를 사용한다.
이때 이를 변환 가능한 타입인지 `is`로 미리 검사해 볼 수 있으나 코틀린에서는 이를 `as?`로 더 간결하게 표현 할 수 있다.

```kotlin
fun t(a: Any): Any? {
    if (a is Int) {
        return 1
    }
    return null
}

// 이를 다음과 같이 리팩토링 할 수 있다.
fun t2(a: Any): Any? = (a as? Int)
```

## The !! operator

코틀린 공식 문서에는 이 연산자를 `NPE-lover`를 위한 연산자라고 부르고 있는데, 이는 nullable 타입을 컴파일러에게 nullable 타입이지만, non-null 타입이라고 강제하는 연산자이다. 예외가 발생하더라도 이를 감수하겠다는 강한 의지가 연산자에서도 느껴지는 부분이다.

## Type parameter

코틀린에서는 타입 파라미터는 기본적으로 nullable 이다.

따라서 타입 파라미터를 정의할 때에 상한선을 정해 non-null 타입으로 제한할 수 있다.

```kotlin
fun <T> printHashCode(t: T) {
    println(t?.hashCode()) // t는 nullable이므로 null 핸들링을 해야한다.
}

fun <T: Any> printHashCode2(t: T) {
    print(t.hashCode()) // t는 non-null 타입이다.
}
```

## 플랫폼 타입

자바 API를 사용할 때 대부분 라이브러리는 널 관련 어노테이션을 쓰지 않는다.
따라서 어떤 라이브러리를 사용할때 문서를 자세히 살펴봐 Null을 반환하는지 아닌지를 판단해 널 검사를 추가해야 한다.

## 자바로의 컴파일

원시타입
Boxed Primitives(Wrapper Class)
AutoUnboxing