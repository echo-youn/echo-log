## 지연 계산 컬렉션 연산

코틀린 표준 API인 `filter`와 `map`은 리스트를 반환한다.

이는 메서드 체인시, 리스트를 2개를 만든다는 의미이다.

첫 리스트에는 `map`의 결과를 담고, 그 결과로 `filter`을 수행한다.

원소가 적다면 문제가 없겠지만, 수백만개 이상이 된다면 효율이 떨어진다.

(Lazy와 Eager의 성능은 무조건 이게 좋다라고 할수 없고 상황에 따라서 프로파일링 해봐야한다.)

```kotlin
people.asSequence()
    .map(Person::name)
    .filter { it.startsWith("A") }
    .toList()
```

코틀린의 지연 계산 시퀀스는 Sequence 인터페이스에서 시작된다.

Sequence 안에는 iterator라는 단 하나의 메소드가 있다. 이 메소드를 통해 시퀀스로부터 원소 값을 얻을 수 있다.

### Note
> 큰 컬렉션에 대해서 연산을 할때 시퀀스를 사용하는것을 규칙으로 삼아라.
종종 중간 컬렉션을 생성함에도 불구하고 즉시 계산 컬렉션이 효율적인 경우가 있다.
그러나 컬렉션에 들어있는 원소가 많으면 중간 원소를 재배열하는 비용이 더 커지기 때문에 지연 계산이 더 낫다.

## 시퀀스 연산 순서

시퀀스는 중간(intermediate) 연산과 최종(terminal) 연산으로 나뉜다.

```kotlin
listOf(1,2,3,4).asSequence()
    .map {it * it }         // 중간 연산 1
    .filter { it % 2 == 0 } // 중간 연산 2
    .toList()               // 최종 연산
``

시퀀스는 중간 연산의 결과에 따라서 그 다음의 중간 연산 시퀀스가 실행되지 않을 수 있다.

예를 들어, 아래 코드에서 asSequence는 find의 조건에 맞는 원소를 찾게되면 이후의 연산은 실행하지 않는다.

반면에 컬렉션은 모든 원소에 대해 map을 실행한 뒤 리스트를 저장한 뒤 find를 수행하게 된다.

```kotlin
listOf(1,2,3,4).asSequence()
    .map { it * it }
    .find { it > 3 }

listOf(1,2,3,4)
    .map { it * it }
    .find { it > 3 }
```

이를 이용해 시퀀스를 수행할 때, 이를 이용해 불필요한 연산을 줄일 수 있다.
아래 코드에서 `filter`를 먼저하면 `map`연산은 "4,5"만 실행되지만 `map`을 먼저하면 전부 연산 후 `filter`가 연산되므로 불필요한 연산을 하게 된다.

```kotlin
listOf(1,2,3,4,5).asSequence()
    .filter { it > 3 }
    .map { it * it }
    .toList()

listOf(1,2,3,4,5).asSequence()
    .map { it * it }
    .filter { it > 3 }
    .toList()
```
