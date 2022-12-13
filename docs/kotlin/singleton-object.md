# Class for singleton

시스템을 설계하다 보면 인스턴스를 하나만 만들어서 사용하는 클래스가 유용한 경우가 있다. 

자바에서는 클래스의 생성자를 private으로 제한하고 static 필드에 그 클래스의 인스턴스를 저장하는 싱글턴 패턴을 사용하기도 한다.

코틀린은 `객체 선언`을 통해 언어에서 기본적으로 지원한다.

`object` 클래스는 클래스의 정의와 인스턴스의 생성을 합친 키워드이다.

`object` 클래스는 다른 클래스와 마찬가지로 인터페이스나 클래스를 상속할 수 있다.



```kotlin
// 정의와 선언을 같이 한다.
object Counter {
    var count: Int = 0

    fun add() {
        count++
    }
}

@Test
fun o() {
    println(Counter.count)
    Counter.add()
    println(Counter.count)
}
```

```java
// static final로 정의 되어있다.
public static final class Counter {
    // Instance가 Counter 클래스의 INSTANCE 멤버로 컴파일 된다.
    @NotNull
    public static final Counter INSTANCE = new Counter();
    private static int count;

    private Counter() {
    }

    public final int getCount() {
        return count;
    }

    public final void setCount(int <set-?>) {
        count = <set-?>;
    }

    public final void add() {
        int var1 = count++;
    }
}
```

따라서 static한 멤버, 클래스를 사용하고 싶다면 최상위 함수 또는 객체 선언을 통해 static한 필드를 만들어 사용할 수 있다.
