# JVM 25 Compact Object Headers

JVM 객체는 필드 값만 들고 있지 않다. HotSpot JVM의 일반 객체는 보통 다음 영역으로 구성된다.

- object header
- instance field
- alignment padding

`Compact Object Headers`는 이 중 object header를 줄이는 기능이다. 작은 객체를 아주 많이 만드는 애플리케이션에서는 헤더가 실제 데이터보다 더 큰 비중을 차지할 수 있기 때문에, 헤더 크기를 줄이면 heap 사용량과 GC 부담을 줄일 수 있다.

## JVM 옵션

JDK 25 기준으로 compact object headers는 product feature다. 다만 기본값은 비활성화이므로 직접 켜야 한다.

```sh
java -XX:+UseCompactObjectHeaders -jar app.jar
```

적용 여부는 `PrintFlagsFinal`로 확인할 수 있다.

```sh
java -XX:+UseCompactObjectHeaders -XX:+PrintFlagsFinal -version | grep UseCompactObjectHeaders
```

`UseCompactObjectHeaders` 값이 `true`면 적용된 것이다.

JDK 24에서는 experimental feature였기 때문에 다음처럼 `UnlockExperimentalVMOptions`가 필요하다.

```sh
java -XX:+UnlockExperimentalVMOptions -XX:+UseCompactObjectHeaders -jar app.jar
```

JDK 25에서는 `UnlockExperimentalVMOptions` 없이 사용한다.

## Gradle 테스트에 적용하기

JOL(Java Object Layout)로 테스트 코드를 작성했다면 테스트 JVM에도 옵션을 넘겨야 한다.

```kotlin
tasks.withType<Test> {
    jvmArgs("-XX:+UseCompactObjectHeaders")
}
```

Spring Boot 실행 태스크에 적용할 수도 있다.

```kotlin
tasks.named<org.springframework.boot.gradle.tasks.run.BootRun>("bootRun") {
    jvmArgs("-XX:+UseCompactObjectHeaders")
}
```

단순히 한 번만 실행해 보고 싶다면 커맨드 라인에서 직접 넘긴다.

```sh
java -XX:+UseCompactObjectHeaders -jar build/libs/app.jar
```

## 기존 객체 헤더

예제로 Kotlin data class를 하나 만든다.

```kotlin
data class Point(
    val x: Int,
    val y: Int,
)
```

compressed class pointer를 사용하는 일반적인 64-bit HotSpot JVM에서 객체 헤더는 보통 12바이트다.

- mark word: 8 bytes
- class pointer: 4 bytes

`Point`는 `Int` 필드 2개를 가진다. 필드 크기는 총 8바이트다.

```text
object header 12 bytes
Point.x        4 bytes
Point.y        4 bytes
alignment gap  4 bytes
----------------------
instance size 24 bytes
```

JOL 출력도 같은 구조를 보여준다.

```text
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000001 (non-biasable; age: 0)
  8   4        (object header: class)    0x0110efa8
 12   4    int Point.x                   10
 16   4    int Point.y                   20
 20   4        (object alignment gap)
Instance size: 24 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

여기서 `object header: class`가 별도 4바이트로 보인다. 이 출력은 legacy object header 레이아웃이다.

## Compact Object Headers를 켜면

Compact Object Headers는 mark word와 class pointer를 하나의 64-bit header 안에 압축한다. 즉 일반 객체의 헤더가 12바이트에서 8바이트로 줄어든다.

`Point` 객체는 다음처럼 계산된다.

```text
compact header 8 bytes
Point.x        4 bytes
Point.y        4 bytes
----------------------
instance size 16 bytes
```

legacy header에서는 24바이트였지만 compact header에서는 16바이트가 된다. 이 예제에서는 객체 하나당 8바이트가 줄어든다.

정렬 때문에 모든 객체가 항상 같은 비율로 줄어드는 것은 아니다. 필드 배치와 object alignment에 따라 절감량이 달라진다. 그래도 작은 객체가 많을수록 효과가 커진다.

JOL 버전과 JDK 지원 상태에 따라 출력 문자열은 다를 수 있지만, 핵심은 별도의 4바이트 class header가 사라지고 instance size가 줄어드는지 확인하는 것이다.

## Thin Lock

객체의 mark word에는 hash, age, lock state 같은 런타임 정보가 들어간다. 그래서 `synchronized`로 객체를 잠그면 같은 객체라도 mark word 값이 바뀐다.

thin lock 상태에서 관찰한 출력이다.

```text
com.echoyoun.webfluxpoc.WebfluxPocApplicationTests$Point object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000000 (thin lock: 0x0000000000000000)
  8   4        (object header: class)    0x0110efa8
 12   4    int Point.x                   10
 16   4    int Point.y                   20
 20   4        (object alignment gap)
Instance size: 24 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

lock을 잡는 동안 mark word가 thin lock 상태로 표시된다.

lock이 끝난 뒤에는 다시 일반 객체 상태로 돌아온다.

```text
com.echoyoun.webfluxpoc.WebfluxPocApplicationTests$Point object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000009 (non-biasable; age: 1)
  8   4        (object header: class)    0x0110efa8
 12   4    int Point.x                   10
 16   4    int Point.y                   20
 20   4        (object alignment gap)
Instance size: 24 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

JDK 15 이후 biased locking은 기본적으로 비활성화되었고, JDK 18에서 제거되었다. 그래서 출력에 `non-biasable`이 보이는 것은 이상한 상태가 아니다.

## Fat Lock

여러 스레드가 같은 객체의 monitor를 두고 경쟁하면 lock이 inflate될 수 있다. 이때 객체는 fat lock 상태로 보인다.

먼저 Thread1이 lock을 잡고 있고 Thread2가 진입을 기다리는 시점이다.

```text
=== FAT LOCK - Thread1 보유 중 (Thread2가 대기) ===
com.echoyoun.webfluxpoc.WebfluxPocApplicationTests$Point object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x0000000000000008 (thin lock: 0x0000000000000008)
  8   4        (object header: class)    0x0110efa8
 12   4    int Point.x                   10
 16   4    int Point.y                   20
 20   4        (object alignment gap)
Instance size: 24 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

이 시점에는 아직 JOL 출력상 thin lock으로 보일 수 있다. lock inflate는 경쟁을 감지한 즉시 항상 같은 타이밍에 출력되는 것이 아니라 JVM 내부 상태 전이에 따라 관찰된다.

Thread2가 진입하고 monitor inflate가 완료된 뒤에는 fat lock으로 보인다.

```text
=== FAT LOCK - Thread2 진입 (inflate 완료) ===
com.echoyoun.webfluxpoc.WebfluxPocApplicationTests$Point object internals:
OFF  SZ   TYPE DESCRIPTION               VALUE
  0   8        (object header: mark)     0x00000200ee4ac7f2 (fat lock: 0x00000200ee4ac7f2)
  8   4        (object header: class)    0x0110efa8
 12   4    int Point.x                   10
 16   4    int Point.y                   20
 20   4        (object alignment gap)
Instance size: 24 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

fat lock에서는 mark word에 monitor를 가리키는 포인터 성격의 값이 들어간다. 그래서 일반 객체의 mark word 값과 완전히 다른 형태로 보인다.

## Compact Header와 Lock

Compact Object Headers를 켜면 class pointer가 mark word 안으로 들어간다. 그러면 mark word 안에 기존보다 더 많은 정보를 함께 담아야 한다.

그래서 JDK 25의 compact header는 기존 stack locking 방식에 의존하지 않는다. 가벼운 lock은 객체 헤더 전체를 덮어쓰는 방식이 아니라 lock bit 중심으로 처리하고, 경쟁이 심해지면 별도의 monitor로 inflate한다.

관찰할 때는 다음 두 가지를 구분해야 한다.

- 객체 크기 확인: class header가 사라져 instance size가 줄었는가?
- lock 상태 확인: mark word가 thin lock 또는 fat lock 상태로 바뀌는가?

위 JOL 출력은 class header가 별도 4바이트로 보이므로 compact header를 켠 결과라기보다는 기본 legacy header에서 lock 상태를 관찰한 결과로 보는 것이 맞다.

## 언제 효과가 큰가

효과가 큰 경우는 다음과 같다.

- 작은 객체가 아주 많이 생성되는 서비스
- DTO, value object, tuple 성격의 객체가 많은 코드
- collection 내부에 작은 wrapper 객체가 많이 들어가는 코드
- heap 사용량과 GC pause가 객체 수에 민감한 서비스

효과가 제한적인 경우도 있다.

- 큰 `byte[]`, `int[]` 같은 배열 데이터가 대부분인 경우
- 큰 필드를 가진 객체가 대부분인 경우
- native memory, direct buffer, off-heap 사용량이 더 큰 경우
- 객체 수보다 I/O나 CPU 연산이 병목인 경우

즉 이 옵션은 모든 애플리케이션을 빠르게 만드는 스위치라기보다, 객체 수가 많고 heap pressure가 큰 애플리케이션에서 검토할 만한 메모리 최적화 옵션이다.

## 주의할 점

JDK 25에서 product feature가 되었지만 기본값은 아니다. 운영에 적용하기 전에는 반드시 실제 워크로드로 검증해야 한다.

확인할 항목은 다음과 같다.

- heap 사용량이 실제로 줄어드는가?
- GC 횟수나 pause time이 줄어드는가?
- throughput 변화가 없는가?
- 사용하는 JVM 옵션과 충돌하지 않는가?
- JOL, profiler, APM 도구가 JDK 25 compact header를 올바르게 해석하는가?

특히 객체 레이아웃을 직접 읽는 도구는 JDK 내부 구현 변경에 민감하다. JOL 출력이 이상해 보이면 먼저 JOL 버전이 JDK 25를 지원하는지 확인해야 한다.

## 정리

기본 HotSpot 객체 헤더는 compressed class pointer 환경에서 보통 12바이트다. `Point(Int, Int)` 같은 작은 객체는 필드보다 헤더와 padding의 비중이 크기 때문에 instance size가 24바이트가 된다.

JDK 25에서 `-XX:+UseCompactObjectHeaders`를 켜면 일반 객체 헤더가 8바이트로 줄어든다. 같은 `Point` 객체는 16바이트로 줄 수 있다.

lock 상태를 관찰할 때는 mark word 값이 바뀐다. thin lock, fat lock 출력은 객체 동기화 상태를 보여주는 것이고, compact header 적용 여부는 class header가 별도 슬롯으로 남아 있는지와 instance size 변화로 확인하는 것이 좋다.

## References

- [JEP 450: Compact Object Headers (Experimental)](https://openjdk.org/jeps/450)
- [JEP 519: Compact Object Headers](https://openjdk.org/jeps/519)
