# Data class

우선 자바 플랫폼에서는 클래스가 `equals`, `hashCode`, `toString` 등의 메소드들을 구현해야한다.

그리고 이런 메소드들은 비슷한 방법으로 기계적으로 구현할 수 있다.

IDE에서 자동으로 만들어주거나 lombok과 같은 플러그인으로 번거로운 작업을 대신할 수 있다.

그러나 코틀린은 컴파일러단에서 이 작업을 해준다.

## 문자열 표현 toString

클래스를 문자열로 표현하는 방법에 대해 구현을 해야한다.

기본적으로 제공되는 문자열 표현은 `Client@abcd123` 같은 형식이다. 이 구현을 바꾸려면 `toString()` 메서드를 오버라이드하면 된다.

toString()이 어떻게 쓰이는지 확인해보기위해 코틀린 -> bytecode -> Java로 디컴파일 해보았다.

```kotlin
// UT.kt
fun a() {
    val a = mapOf("a" to "b")
    println(a)
}
```

```java
// UT.class
@org.junit.jupiter.api.Test 
public final fun a(): kotlin.Unit { /* compiled code */ }
```

```java
// UT.decompiled.java
public final void a() {
    Map a = MapsKt.mapOf(TuplesKt.to("a", "b"));
    System.out.println(a);
}

// java.io.PrintStream.println(obj)
public void println(Object x) {
    String s = String.valueOf(x);
    if (getClass() == PrintStream.class) {
        // need to apply String.valueOf again since first invocation
        // might return null
        writeln(String.valueOf(s));
    } else {
        synchronized (this) {
            print(s);
            newLine();
        }
    }
}

// String.valueOf()
public static String valueOf(Object obj) {
    return (obj == null) ? "null" : obj.toString();
}

// Object.java
public String toString() {
	return this.getClass().getName() + '@' + Integer.toHexString(this.hashCode());
}
```

위와 같이 Object에 있는 `toString()`을 써서 클래스를 문자열로 표현하는 것을 볼 수 있다.

따라서 기본 구현이 아닌 내가 보기 편한 방법으로 오버라이드하여 사용하는것이 바람직하다.

## 객체의 동등성, equals

같은 클래스의 두개의 인스턴스를 비교할때에 안에 들어있는 값이 같다면 같은 객체로 간주해야하는 경우가 있다.

이런 경우 자바에서는 `equals()`메서드를 사용하여 두 객체의 값에 대한 동등성을 비교하는데 코틀린에서는 `==` 비교 연산자만으로 동등성을 비교할 수 있다.

그러나 자바에서는 `==`로 비교할 시 두 객체의 포인터의 값이 같은지 비교하기 때문에 `euqals()` 메서드를 사용해야한다.

> 참조 비교(reference comparision)
> 
> 동등성(equality)

그리고 코틀린에서 참조 비교를 위해서 `===` 연산자를 사용할 수 있다.

```kotlin
// UT.kt
fun b() {
    val a = mapOf("a" to "b")
    val b = mapOf("a" to "b")
    println(a == b)
    println(a === b)
}
```

```java
// UT.java
public final void b() {
    Map a = MapsKt.mapOf(TuplesKt.to("a", "b"));
    Map b = MapsKt.mapOf(TuplesKt.to("a", "b"));
    boolean var3 = Intrinsics.areEqual(a, b);
    System.out.println(var3);
    var3 = a == b;
    System.out.println(var3);
}
```

그러나 여기까지만 구현한다면 두 클래스로 더 복잡한 작업을 하다보면 제대로 작동하지 않는 경우가 있다.

위 케이스에서는 `hashCode()`가 구현되어 있지 않기 때문이다.

## 해시 컨테이너 hashCode

자바에서는 `equals()`를 오버라이드 할 때 반드시 `hashCode()`도 함께 오버라이드 해야한다.

JVM 언어에서는 반드시 지켜야하는 제약이 있다.
> equals()가 true를 반환하는 두 객체는 반드시 같은 hashCode()를 반환해야 한다.

두 객체의 동등성을 비교할 때에 비용을 줄이기 위해서 먼저 객체의 `hashCode`를 비교하고 같은 경우에만 실제 값을 비교한다.

## 데이터 클래스

어떤 클래스가 데이터를 저장하는 역할만을 수행한다면 위 메서드들을 반드시 오버라이드 해야만한다.

> 반대로는 Controller, Service, Repository 등은 데이터 저장만을 위한 클래스가 아니라 레이어 등을 나타낼때 쓰이는 클래스라 볼 수 있을것 같다.

코틀린은 이런 경우 컴파일러가 다- 알아서 해주는 `data class`를 갖고 있다.

```kotlin
data class Client(val name: String, val postalCode: Int)
```

코틀린은 위 메서드 뿐만 아니라 더 편리한 메서드들도 같이 생성해준다.

## 데이터 클래스와 불변성 copy() 메서드

데이터 클래스의 프로퍼티가 반드시 `val`일 필요는 없다. 그러나 데이터 클래스의 모든 프로퍼티를 읽기 전용으로 만들어서 데이터 클래스를 불변(immutable)한 클래스로 만들라고 권장한다.

데이터 클래스의 프로퍼티가 가변적일 경우 다음과 같은 단점이 있다.
1. 프로그램을 추론하기 어려워진다.
2. 다중스레드의 경우 데이터의 동기화 작업의 필요가 줄어든다.
3. 객체를 키로하는 HashMap등의 컨테이너가 변이(mutation)으로 인해 잘못될 수 있다.

그래서 코틀린은 이런 불변 객체를 더 쉽게 활용할 수 있도록 해주는 메소드를 제공해 준다. 바로 `copy()` 메서드이다.

이 메서드는 객체를 복사하면서 일부 프로퍼티를 바꿀 수 있게 해주는 메서드이다.

객체를 메모리상에서 직접 바꾸는 대신 복사본을 만드는 편이 더 낫다.

복사본은 원본과 다른 생명주기를 갖고 원본을 참조하는 다른 부분에 영향을 끼치지 않는다.

그러나 이 `copy()` 메서드는 얕은 복사로 copy하기 때문에 주의해서 사용해야 한다.

```kotlin
fun c() {
    data class A(
        val a: String,
        val b: Int,
        var c: Long
    )
    data class B(
        val a: A,
        val b: Int,
        val c: String
    )

    val t = B(A("aa", 0, 1), 2, "c")

    println(t.a)
    val c = t.copy(b = -1)

    c.a.c = -99
    println(c.a)
    println(t.a)
}

A(a=aa, b=0, c=1)
A(a=aa, b=0, c=-99)
A(a=aa, b=0, c=-99)
```
