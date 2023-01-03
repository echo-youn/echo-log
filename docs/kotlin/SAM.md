## Functional (SAM) interface

하나의 추상메서드만 있는 인터페이스를 `Functional interface` 또는 `Single Abstract Method(SAM) Interface` 라고 한다.

`Functional Interface`는 여러 비추상 멤버를 가질 수 있지만, 추상 멤버는 하나만 가질 수 있다.

```java
public interface OnClickListner {
    void onClick(Event e);
}

public class Button {
    public void setOnClickListener(OnClickListener l) {}
}
```

자바 8 이전에서는 함수형 인터페이스를 매개변수로 넘기기 위해서 익명 클래스로 인스턴스를 만들어서 넘겨야 했다.
(비록 나는 경험해 본적은 없지만 상상만해도 귀찮다...) 

```java
button.setOnClickListner(new OnClickListner() { // 익명 인스턴스 파라미터
    @Override
    public void onClick(Event e) {
        ...
    }
})
```

그러나 코틀린과 자바 8 이후에서는 익명 인스턴스 대신 직접 람다를 전달 할 수 있다.

```java
button.setOnClickListner( event -> {});
```

```kotlin
button.setOnClickListner { event -> ... }
```

위와 같은 코드가 동작하는 이유는 `OnClickListner`에 추상메서드가 단 1개만 있기 때문이다.

이런 인터페이스를 `함수형 인터페이스(functional interface)` 또는 `단일 추상 메서드 인터페이스(Single Abstract Method Interface)`라 한다.

자바 API에는 Runnable이나 Callable과 같은 함수형 인터페이스와 이 인터페이스를 활용하는 메서드가 많다.

코틀린은 이런 함수형 인터페이스를 인자로 넘겨줘야할 때 람다를 넘길 수 있도록 해준다.


## 자바 메서드에 코틀린의 람다를 파라미터로 전달


자바 메소드가 함수형 인터페이스를 파라미터로 요구할때, 코틀린에서 람다로 전달할 수 있다.

이때 코틀린 컴파일러는 익명 인스턴스로 만들어주거나 또는 함수를 선언하여 준다.

```kotlin
fun sam() {
    val button = Button()
    button.setOnclickListner {
        println("im from kotlin")
        println(it)
    }
}
```

디컴파일된 자바 코드의 모습
```java
public final void sam() {
    Button button = new Button();
    button.setOnclickListner(UT::sam$lambda$9); // 이 클래스이름이 "UT"이다.
}

private static final void sam$lambda$9(String it) {
    System.out.println("im from kotlin");
    System.out.println(it);
}
```

함수형 인터페이스를 람다로 전달할 경우 코틀린 컴파일러가 다 자동으로 처리해주기 때문에 따로 해야하는 일은 없다.

## 람다를 함수형 인터페이스로 명시적으로 전달

종종 컴파일러가 자동으로 생성하지 못할 수 있는 경우가 생기는데, 다음과 같다.

함수형 인터페이스를 반환하는 메서드는 반환하는 람다를 SAM의 생성자로 감싸야 한다.

```kotlin
fun createAllDoneRunnable(): Runnable {
    return Runnable { println("All Done!") }
}

>>>  createAllDoneRunnable().run()
All Done!
```

SAM 생성자의 이름은 사용하려는 함수형 인터페이스의 이름과 같다.

SAM 생서자는 함수형 인터페이스의 유일한 추상메서드의 본문에 사용할 람다만을 인자로 받아서 함수형 인터페이스를 구현하는 클래스의 인스턴스를 반환한다.


그리고 람다를 인스턴스에 저장하고 싶은 경우에도 SAM 생성자를 통해 명시적으로 선언할 수 있다.

```kotlin
val resuableListner = OnClickListner {
    println("I'm Reusable")
}

val button = Button()
button.setOnclickListner(resuableListner)
```
