# Collection

## Mutable Collection

코틀린의 컬렉션은 `kotlin.collections.Collection`부터 시작한다. 이 인터페이스를 사용하면 다양한 연산을 수행할 수 있는 함수들이 있는데, 다만 원소를 추가하거나 삭제하는 메소드가 없다.

컬렉션의 데이터를 수정하려면 `kotlin.collections.MutableCollection` 인터페이스를 사용해야한다.

```kotlin
public interface Collection<out E> : Iterable<E> {
    public val size: Int

    public fun isEmpty(): Boolean

    public operator fun contains(element: @UnsafeVariance E): Boolean

    override fun iterator(): Iterator<E>

    public fun containsAll(elements: Collection<@UnsafeVariance E>): Boolean
}

public interface MutableCollection<E> : Collection<E>, MutableIterable<E> {
    override fun iterator(): MutableIterator<E>
    
    public fun add(element: E): Boolean

    public fun remove(element: E): Boolean

    public fun addAll(elements: Collection<E>): Boolean

    public fun removeAll(elements: Collection<E>): Boolean

    public fun retainAll(elements: Collection<E>): Boolean

    public fun clear(): Unit
}
```

코드에서는 가능하면 읽기 전용 인터페이스를 사용하는 것을 일반적인 규칙으로 삼는게 좋다.
컬렉션을 변경할 필요가 있을 때만 변경 가능한 버전을 사용해라.

프로그램에서 데이터에 어떤 일이 벌어지고 있는지를 좀 더 쉽게 이해하기 위해서이다.

때때로 원본의 변경을 막기 위해 컬렉션을 복사해야할 수 도 있다. 이런 패턴을 `방어적 복사(defensive copy)`라 부른다.

그렇다고 읽기 전용 컬렉션이라고, 컬렉션이 꼭 변경 불가능해야만 하지는 않는다.
그 인터페이스는 실제로는 어떤 컬렉션 인스턴스를 가르키는 수 많은 참조 중 하나일 수 있기 때문이다.

동일한 컬렉션 객체를 가르키는 두가지의 참조가 병렬로 실행된다면 다른 컬렉션들이 내용을 변경하는 상황이 생길 수 있다.
이런 상황에서는 `ConcurrentModificationException`이나 다른 오류가 발생할 수 있다.

따라서 읽기 전용 컬렉션이 항상 쓰레드 세이프하지 않다는 점을 명심해야한다.
멀티 스레드 환경에서 데이터를 다룬다면, 그 데이터를 적절히 동기화하거나 동시 접근을 허용하는 데이터구조를 활용해야 한다.

그러나 자바에서는 읽기 전용과 변경 가능 컬렉션을 구분하지 않는다.

그래서 코틀린에서는 읽기전용으로 선언되더라도 컴파일한 뒤에는 그 내용을 변경할 수 있게된다.

만약 코틀린 코드에 컬렉션을 바꾸는 자바 코드를 혼용하여 사용하게 된다면 호환가능한 자바/코틀린 혼용 프로그램(끔찍한 혼종)이 된다.

이는 널 타입도 마찬가지이다. 코틀린에서는 강제로 자바 코드에 금지할 방법이 없다. 그러니 자바 코드를 섞어서 사용할때는 특별한 주의가 필요하다.

## 플랫폼 타입

자바에서 정의한 타입을 플랫폼 타입으로 본다. 코틀린 컴파일러는 그 타입이 널인지 널이 될수 없는지 알수가 없다. 그래서 어느쪽으로든 다룰 수 있다.
이런상황에서는 여러가지를 고려해 선택해야한다.

- 컬렉션이 널이 될 수 있는가?
- 컬렉션의 원소가 널이 될 수 있는가?
- 오버라이드 하는 메소드가 컬렉션을 변경할 수 있는가?

## 배열과 원시 타입 배열

코틀린 배열을 타입을 파라미터로 받는 클래스다.

```kotlin
val a = Array<String>(26) { i -> ('a' + i).toString() } // 타입 인자는 추론 가능하므로 생략가능하다. 람다를 매개변수로 전달할 수 있다.

val s = listOf("a", "b", "c")
println("%s %s %s".format(*s.toTypedArray())) // vararg 인자를 넘기기위해 스프레드 연사자를 사용한다.
```

코틀린은 기본적으로 타입 인자도 박싱 클래스이다. `Array<Int>` 같은 배열을 선언하면 박싱 타입의 배열이 생성된다.

만약 원시타입의 배열이 필요하다면 `IntArray, ByteArray, CharArray, BooleanArray` 등의 원시 타입 배열을 사용하면 `int[], byte[]` 등으로 컴파일 된다.

그리고 코틀린에서는 표준 라이브러리 외에 확장 함수로 편리한 기능들을 다 제공해 주고 있다.
