# DSL

영역 특화 언어(Domain Specific Language)를 사용해 코틀린다운 API를 설계하는 방법에 대해 소개한다.

전통적인 API와 DSL 형식의 API의 차이를 설명하고 DSL 형식의 API로 DB 접근, HTML 생성, 테스트, 빌드 등 사용법도 소개한다.

그리고 `invoke` 관례를 사용해 DSL 코드 내에 람다와 프로퍼티 대입을 더 유연하게 조립할 수 있다.


## API에서 DSL로

DSL의 궁극적 목표는 코드의 가독성와 유지 보수성을 좋게 유지하는 것이다. 클래스에 있는 코드들은 대부분 다른 클래스와 상호작용을 한다. 따라서 그런 상호작용을 하는 지점인 인터페이스를 잘 살펴봐야한다. 한마디로 클래스의 API를 살펴봐야한다.

코틀린에서 간결한 구문을 위해 지원하는 기능에 대해 표로 살펴보자.

|일반구문|간결한 구문|언어 특성|
|--|--|--|
|```StringUtil.capitalize(s)```|```s.capitalize()```|확장 함수|
|```1.to("one")```|```1 to "one"```|중위 호출|
|```set.add(2)```|```set += 2```|연산자 오버로딩|
|```map.get("key")```|```map["key"]```|get 메소드에 대한 관례|
|```file.use({f -> f.read()})```|```file.use { it.read() }```|람다를 괄호 밖으로 빼내는 관례|
|```sb.append("yes"); sb.append("no")```|```with (sb) { append("yes"); append("no"); }```|수신 객체 지정 람다|

더 나아가 DSL 구축을 도와주는 코틀린 기능을 살펴본다.

## invoke 관례를 사용한 유연한 블록 중첩

관례는 특별한 이름이 붙은 함수를 일반 메소드에 호출 구문으로 호출하지 않고 더 간단한 다른 구문으로 호출할 수 있게 지원하는 기능이다.

예를 들어 `get` 관례에 대해서 `foo[bar]`는 `foo.get(bar)`로 변환된다. `invoke`도 이와 같은 역할을 한다.

다만 invoke는 get과 달리 각괄호 대신 소괄호를 사용한다. operator 변경자가 붙은 invoke 메소드 정의가 들어있는 클래스의 객체를 함수처럼 호출할 수 있다.

```kotlin

class Greeter(val greeting: String) {
    operator fun invoke(name: String) {
        println("$greeting, $name!")
    }
}

>> val greeter = Greeter("Hello")
>> greeter("Echo")

Hello, Echo!
```

invoke 메서드는 파라미터 타입 개수에 제한도 없다. 메서드 오버로딩도 할 수 있다.

