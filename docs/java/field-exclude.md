# Exclude fields

때로 동적으로 유저에게 보여주고 싶은 필드들을 조절하고 싶은 경우가 있을 것이다.

그럴때 할 수 있는 방법은 제외할 필드들을 받아와 제외하는 것이다.

이를 동적으로 처리해야하는 경우 Reflection 등의 방법으로 처리가 가능한데 내 아이디어와 코드를 공유하고자 한다.

## 직접 매칭

내가 첫번째로 생각해 낸 방법은 제공할 데이터 타입과 제외할 필드를 갖고 있는 데이터의 타입을 1:1로 일치시켜 Reflection 없이 값 비교 만으로 null 또는 삭제 처리를 하는 것이다.

앞으로 예제들에서 사용할 타입이다.

```kotlin
data class User(
  var charname: String?,
  var gender: String?,
  var age: Int?
)

data class UserExcludeField(
    val charname: Boolean,
    val gender: Boolean,
    val age: Boolen
)
```

1:1 로 값비교 하는 로직은 다음과 같다.

```kotlin
fun User.excludeIntersection(exclude: A_EXCLUDE): A {
            return copy(
                charname = if (exclude.charname) {
                    null
                } else {
                    charname
                },
                gender = if (exclude.gender) {
                    null
                } else {
                    gender
                },
                age = if (exclude.age) {
                    null
                } else {
                    age
                }
            )
        }

@Test
fun test1() {
        val mockDatabaseData = User("캐릭터a", "남성", 10)

        // true가 제외 false가 그대로 나가는거
        val excludeAge = UserExcludeField(false, false, true)
        val excludeGenderAge = UserExcludeField(false, true, true)

        val result1 = mockDatabaseData.excludeIntersection(excludeAge)

        assert(result1.charname == mockDatabaseData.charname)
        assert(result1.gender == mockDatabaseData.gender)
        assert(result1.age == null)

        val result2 = mockDatabaseData.excludeIntersection(excludeGenderAge)

        assert(result2.charname == mockDatabaseData.charname)
        assert(result2.gender == null)
        assert(result2.age == null)

        println(result1)
        println(result2)
}
```

이 코드를 봤을때 그럼 모든 Dto나 엔티티에 다 해줘야하는건가? 라고 할 수 있겠지만 적절히 공통화 한다면 가능하지 않을까 싶다.

## Reflection

그 다음으로 생각한 방법은 리플렉션을 사용하는 것이다.

```kotlin
fun User.excludeWithReflect(excludes: Set<String>): User {
    val temp = copy()
    val exMembers: List<KCallable<*>> = User::class.memberProperties.filter {
        excludes.contains(it.name)
    }

    this::class.memberProperties.filter {
        exMembers.contains(it)
    }.forEach {
        if (it is KMutableProperty<*>) {
            // 이 부분에서 setter를 호출하기 때문에 프로퍼티들이 var로 강제된다.
            // 따라서 이후에 생성자 등으로 변경하는편이 더 좋을 수도 있을것 같다.
            it.setter.call(temp, null)
        }
    }

    return temp
}

@Test
fun fieldReflect() {
    val mockDatabaseData = User("캐릭터a", "남성", 10)
    val excludeAge = setOf("age")
    val excludeGenderAge = setOf("gender", "age")

    val result1 = mockDatabaseData.excludeWithReflect(excludeAge)

    assert(result1.charname == mockDatabaseData.charname)
    assert(result1.gender == mockDatabaseData.gender)
    assert(result1.age == null)

    val result2 = mockDatabaseData.excludeWithReflect(excludeGenderAge)

    assert(result2.charname == mockDatabaseData.charname)
    assert(result2.gender == null)
    assert(result2.age == null)

    println(result1)
    println(result2)
}
```

## Jackson ObjectMapper Filter

자바의 유명한 라이브러리인 Jackson을 활용한 방법이 있다.

```kotlin
fun User.excludeWithJackson(excludes: Array<String>): User {
    val filter  = SimpleBeanPropertyFilter.serializeAllExcept(*excludes)
    val filterProvider = SimpleFilterProvider()
        .addFilter("exFilter", filter)
    val om = jacksonObjectMapper()
        .setFilterProvider(filterProvider)
    return om.convertValue<User>(this)
}

@Test
fun jacksonTest() {
    val mockDatabaseData = User("캐릭터a", "남성", 10)
    val excludeAge = arrayOf("age")
    val excludeGEnderAge = arrayOf("gender", "age")

    val result1 = mockDatabaseData.excludeWithJackson(excludeAge)

    assert(result1.charname == mockDatabaseData.charname)
    assert(result1.gender == mockDatabaseData.gender)
    assert(result1.age == null)

    val result2 = mockDatabaseData.excludeWithJackson(excludeGEnderAge)

    assert(result2.charname == mockDatabaseData.charname)
    assert(result2.gender == null)
    assert(result2.age == null)

    println(result1)
    println(result2)
}
```

