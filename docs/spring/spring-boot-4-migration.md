# Spring Boot 3에서 4로 마이그레이션하기

Spring Boot 4로 올리면서 실제로 수정한 내용을 정리한 메모다.

공식 가이드는 먼저 읽는 것이 맞다.

- [Spring Boot 4.0 Migration Guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Migration-Guide#upgrading-jackson)

이 글은 그 가이드를 기반으로, 실제 프로젝트에서 바뀐 의존성과 컴파일 에러를 중심으로 정리한다.

## 먼저 확인할 것

Spring Boot 4로 바로 점프하기 전에 다음 순서를 먼저 보자.

1. Spring Boot 3.5.x 최신 버전으로 먼저 올린다.
2. deprecated API를 먼저 제거한다.
3. Java 17 이상, Kotlin 2.2 이상인지 확인한다.
4. Spring Cloud, Springdoc, AWS SDK, 기타 외부 의존성의 호환 버전을 확인한다.
5. 테스트 코드까지 한 번에 빌드해 본다.

Spring Boot 4는 더 이상 작은 버전 업그레이드가 아니다. Jakarta EE 11과 Spring Framework 7 기반으로 올라가면서 의존성 경계가 같이 움직인다.

## 의존성 업데이트

실제로는 아래처럼 손봤다.

```diff
plugins {
    kotlin("jvm") version "2.3.10"
    kotlin("plugin.spring") version "2.3.10"
-   id("org.springframework.boot") version "3.5.10"
+   id("org.springframework.boot") version "4.0.3"
    id("io.spring.dependency-management") version "1.1.7"
    id("org.springdoc.openapi-gradle-plugin") version "1.9.0"
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(25)
    }
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-data-r2dbc")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-webflux")
-   implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
-   implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310")
+   implementation("tools.jackson.module:jackson-module-kotlin")
    implementation("io.projectreactor.kotlin:reactor-kotlin-extensions")
    implementation("org.jetbrains.kotlin:kotlin-reflect")

-   implementation("org.springframework.cloud:spring-cloud-gateway-proxyexchange-webflux:4.3.2")
+   implementation("org.springframework.cloud:spring-cloud-gateway-proxyexchange-webflux:5.0.1")

-   implementation("com.trendyol:kediatr-spring-boot-3x-starter:4.2.0")
+   implementation("com.trendyol:kediatr-spring-boot-4x-starter:4.3.0")

    implementation("org.springframework.boot:spring-boot-starter-cache")
    implementation("com.github.ben-manes.caffeine:caffeine")

    api("io.jsonwebtoken:jjwt-api:0.13.0")
    implementation("io.jsonwebtoken:jjwt-impl:0.13.0")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.13.0")

    implementation("io.swagger.parser.v3:swagger-parser:2.1.36")
-   implementation("com.fasterxml.jackson.dataformat:jackson-dataformat-yaml")
+   implementation("tools.jackson.dataformat:jackson-dataformat-yaml")

-   implementation(platform("io.awspring.cloud:spring-cloud-aws-dependencies:3.4.1"))
+   implementation(platform("io.awspring.cloud:spring-cloud-aws-dependencies:4.0.0"))
    implementation("io.awspring.cloud:spring-cloud-aws-starter-s3")

    implementation(platform("io.modelcontextprotocol.sdk:mcp-bom:0.12.1"))
    implementation("io.modelcontextprotocol.sdk:mcp")
    implementation("io.modelcontextprotocol.sdk:mcp-spring-webflux")

    runtimeOnly("io.r2dbc:r2dbc-pool")
    runtimeOnly("org.postgresql:postgresql")
    implementation("org.postgresql:r2dbc-postgresql")

-   implementation("org.springdoc:springdoc-openapi-starter-webflux-ui:2.8.15")
-   implementation("jakarta.xml.bind:jakarta.xml.bind-api:4.0.5")
-   implementation("javax.xml.bind:jaxb-api:2.3.1")
-   runtimeOnly("org.glassfish.jaxb:jaxb-runtime:4.0.6")
+   implementation("org.springdoc:springdoc-openapi-starter-webflux-ui:3.0.2")
}
```

의존성 자체보다 중요한 것은 Spring Boot 4에서 더 이상 끌고 가지 않는 조합이 많다는 점이다. 버전만 올리면 끝나는 구간이 아니라, 라이브러리 호환성 재검토 구간이다.

## Jackson 업그레이드

Spring Boot 4 마이그레이션 가이드는 Jackson 쪽에서 `com.fasterxml.jackson` 계열 대신 `tools.jackson` 계열을 사용하도록 안내한다.

즉, 프로젝트에서 직접 가져오던 Jackson 모듈은 전반적으로 경로를 바꾸는 작업이 필요하다.

### 바뀐 점

- `com.fasterxml.jackson.module` -> `tools.jackson.module`
- `com.fasterxml.jackson.dataformat` -> `tools.jackson.dataformat`
- `JavaTimeModule`은 별도 추가가 필요하지 않은 경우가 많다
- `jackson-annotations`는 예외적으로 기존 group ID를 그대로 유지한다

실제로는 다음처럼 바뀐다.

```kotlin
implementation("tools.jackson.module:jackson-module-kotlin")
implementation("tools.jackson.dataformat:jackson-dataformat-yaml")
```

기존에 `jackson-datatype-jsr310`을 직접 넣었다면, 업그레이드 후에는 중복 의존성인지 먼저 확인하는 편이 낫다. Spring Boot 4에서는 날짜/시간 처리가 이미 기본 구성에 들어와 있는 경우가 많다.

## HttpHeaders

업그레이드 과정에서 `org.springframework.http.HttpHeaders` 사용 코드도 손봐야 했다.

내 프로젝트에서는 `set` 계열 호출이 예전처럼 리스트를 받는 코드와 맞지 않아 수정이 필요했다. 이런 류의 변경은 컴파일 에러로 바로 드러나므로, 실제로는 가장 먼저 잡히는 편이다.

핵심은 `HttpHeaders`를 직접 조립하는 코드가 있다면 아래를 점검하는 것이다.

- 단일 값인지 복수 값인지
- 헤더를 덮어쓰는지 추가하는지
- nullable 타입으로 들어오는 값이 없는지

예시로는 다음처럼 정리할 수 있다.

```kotlin
val headers = HttpHeaders()
headers.set("X-Request-Id", requestId)
headers.setBearerAuth(token)
```

만약 기존 코드가 여러 값을 한 번에 넣는 방식이었다면 Spring Boot 4 올라오면서 의도에 맞게 단일 값 또는 컬렉션 처리로 분리해야 한다.

## JSpecify

Spring Boot 4와 Spring Framework 7로 올라오면서 JSpecify 기반 nullability 정보가 더 강하게 반영된다.

이 변화의 체감 포인트는 다음과 같다.

- Kotlin에서 플랫폼 타입이 줄어든다
- 기존에는 넘어가던 null 처리 코드가 경고 또는 오류로 드러난다
- `String!`처럼 애매하게 보이던 부분이 더 명확해진다

즉, 런타임 버그를 컴파일 타임에 더 많이 잡게 되는 쪽이다.

실무에서는 다음을 확인하면 된다.

- Spring API를 호출할 때 nullable 여부를 다시 본다
- DTO와 컨트롤러 파라미터의 null 처리 방식을 맞춘다
- extension function에서 `!!` 의존이 늘지 않았는지 본다

Kotlin 프로젝트라면 이 변화는 귀찮지만, 장기적으로는 타입 안정성에 도움이 된다.

## Spring Cloud / 외부 라이브러리

Spring Boot만 올린다고 끝나지 않는다. 같이 물려 있는 외부 라이브러리도 함께 봐야 한다.

이번 마이그레이션에서는 다음을 같이 갱신했다.

- Spring Cloud Gateway proxyexchange
- Kediatr
- Spring Cloud AWS
- springdoc-openapi

특히 Spring Cloud, AWS 관련 라이브러리는 Boot 메이저 변경과 맞물려 호환 버전이 따로 있는 경우가 많다. Spring Boot 버전만 맞고 동작은 안 하는 경우가 있어서, 공식 호환표를 같이 봐야 한다.

## 마이그레이션 체크리스트

실제로는 아래 순서로 확인하면 된다.

1. build.gradle.kts에서 Spring Boot 버전과 호환 라이브러리를 갱신한다.
2. Jackson import 경로를 `tools.jackson`으로 바꾼다.
3. `jackson-datatype-jsr310`처럼 더 이상 필요한지 애매한 의존성을 정리한다.
4. `HttpHeaders`를 쓰는 코드를 전부 빌드해 본다.
5. Kotlin nullability 관련 컴파일 경고를 정리한다.
6. 테스트를 돌려서 security, WebFlux, R2DBC, swagger까지 확인한다.
7. 실제 배포 전에 OpenAPI 생성, startup log, actuator endpoint를 확인한다.

## 정리

Spring Boot 3에서 4로의 업그레이드는 단순 버전 교체가 아니다.

Jackson 패키지 경로가 바뀌고, Spring API의 nullability가 더 엄격해지고, 외부 starter들의 호환 버전까지 다시 맞춰야 한다.

실제 프로젝트 기준으로는 아래 세 가지가 가장 먼저 눈에 띄었다.

- `com.fasterxml.jackson` -> `tools.jackson`
- `HttpHeaders` 사용 코드 수정
- JSpecify 반영으로 인한 Kotlin 타입 정리

공식 가이드는 먼저 읽고, 그 다음에 자기 프로젝트의 컴파일 에러를 기준으로 하나씩 정리하는 게 가장 빠르다.

## References

- [Spring Boot 4.0 Migration Guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Migration-Guide#upgrading-jackson)
