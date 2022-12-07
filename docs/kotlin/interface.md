# Interface

코틀린의 인터페이스를 정의해보면서 자바와 차이점이 무엇인지, 코틀린에서의 특징을 살펴본다.


## 정의 및 구현

아래 코드는 click이라는 추상 메소드가 있는 인터페이스다.

```kotlin
interface Clickable {
    fun click()
}
```

이 인터페이스를 구현하는 추상클래스가 아닌 클래스는 click에 대한 구현을 제공해야만 한다.


```kotlin
class Button: Clickable {
    override fun click() = println("I was clicked")
}
```

여기서 자바의 인터페이스 구현과 다른점은 자바는 `implements`와 `extends`를 사용하는데 반해 코틀린은 `:`뒤에 구현할 인터페이스와 상속받을 클래스를 적는것으로 모두 처리된다.

코틀린은 상위의 메소드를 오버라이드 할때에는 반드시 `override` 변경자를 붙여줘야한다.

## 디폴트 구현

코틀린의 인터페이스의 메소드에도 디폴트 구현을 해 놓을 수 있는데 방법은 다음과 같다.

```kotlin
interface Clickable {
    fun click()
    fun showOff() = println("I'm clickable!")
}
```

만약 구현하려는 인터페이스들에 같은 메소드가 있다면 `super<T>`로 상위 타입을 지정해 줄 수 있다.

```kotlin
interface Focusable {
    fun showOff() = println("I'm focusable")
}

interface Clickable {
    fun showOff() = println("I'm clickable")
}

class Button: Clickable, Focuable {
    override fun showOff() { // 구현할 같은 이름의 메서드가 2개 이상인 경우 반드시 구현해줘야한다.
        super<Clickable>.showOff()
        super<Focusable>.showOff()
    }
}
```

## 인터페이스의 access modifier

인터페이스의 멤버는 final, open, abstract 등의 키워드를 사용할 수 없다.

인터페이스의 멤버는 항상 open이며 final로 변경할 수 없다.