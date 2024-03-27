# Spring 2.7.5에서 3.2로 업데이트

레거시 프로젝트의 부트 버전이 2.7.5였다.

스프링 부트의 3.2에서 개발 입맛을 돋구는 많은 기능들이 추가되었다.

이번 기회에 3.2.x로 업데이트하며 발생한 이슈를 남기며 공유한다.

변경점 전부는 아니니 참고하자.

---

## 요약

| no | 내용                                                          | 변경 전                                           | 변경 후                                                           |
|----|-------------------------------------------------------------|------------------------------------------------|----------------------------------------------------------------|
| 1  | `application.properties`의 spring 설정 경로 변경됨                  | `spring.redis`, `management.metrics.export.*`  | `spring.data.redis`, `management.*.metrics.export`             |
| 2  | `jakarta`로 패키지명 변경됨                                         | `import javax.*`                               | `import jakarta.*`                                             |
| 3  | `@ConstructorBinding` Target이 변경됨                           | Type Level에 어노테이션 적용                           | Constructor Level에 어노테이션 적용 혹은 제거                              |
| 4  | RequestMapping 시 Trailing slash matching 기본값 변경             | `RequestMapping("/name")` -> `/name/ OK`       | `RequestMapping("/name")` -> `/name/ NOT FOUND`                |
| 5  | Spring security HttpSecurity 메서드 deprecated                 | `HttpSecurity.cors()...`                       | `HttpSecurity.cors(withDefault())...`                          |
| 6  | `spring.jpa.properties.hibernate.timezone.default_storage`  | DB 타임존을 지원하지 않는 컬럼에 저장시 그냥 저장함                 | DB 타임존을 지원하지 않는 컬럼에 젖아시 UTC로 저장함                               |
| 7  | version specific Database Dialect Deprecated                | `MySQL8Dialect`, `PostgreSQL95Dialect`         | `MySQLDialect`, `PostgreSQLDialect`                            |
| 8  | JarLauncher 경로 변경됨                                          | `org.springframework.boot.loader.JarLauncher	` | `org.springframework.boot.loader.launch.JarLauncher`           |
| 9  | `spring.mvc.throw-exception-if-no-handler-found` Deprecated | Handler 없을 시 자동으로 404 응답                       | `NoResourceFoundException` 예외가 발생해 `GlobalExceptionHandler`로 처리 |
| 10 | Database custom 함수를 위한 `registerFunction` Deprecated        | `CustomDialect.registerFunction`으로 함수 설정       | `FunctionContributor` 를 사용해 커스텀 함수 설정                          |
| 11 | Java 버전 최소 17                                               | Java 버전 최소 8                                   | Java 버전 최소 17                                                  |


## 1. application.properties 설정 경로 변경

Spring boot 3.0으로 올라가면서 몇 설정용 프로퍼티들에 변경이 있습니다.

제 경우에는 영향이 `spring.redis`와 `management.metrics...`에 해당되어 아래와 같이 변경했습니다.

- `spring.data.redis`

- `management.prometheus.metrics...`

스프링부트에서 제공해주는 Configuration Properties Migrator 를 활용해 migration 해보시는것을 추천 드립니다.

### 참고링크
- https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.0-Migration-Guide#configuration-properties-migration

## 2. 패키지명 javax에서 jakarta로 변경

Spring boot 는 `Jakarta EE` 명세를 따르고 있습니다.

이번 3.0 버전에서는 Jakarta EE 10 버전에 의해 javax 패키지 대신 jakarta를 사용합니다.

### 참고링크
- https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.0-Migration-Guide#jakarta-ee

## 3. @ConstructorBinding 어노테이션 타겟 변경

제 경우 application property 를 type 으로 선언해 사용하고 있습니다.

이때 `data class`를 애용해 활용해 `@ConstructorBinding`을 이용해 값을 불러오고 있었습니다.

이제 어노테이션 없이도 생성자를 통해 바인딩이 가능해 해당 어노테이션을 제거하거나 다른 `Constructor`에만 활용하면 됩니다.

### 참고링크
- https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.0-Migration-Guide#constructingbinding-no-longer-needed-at-the-type-level

## 4. RequestMapping 시 Trailing slash matching 기본값 변경

기존에는 `RequestMapping` 작성시 `Trailing comma`를 명시하지 않아도 같이 매핑되었습니다.

이제는 명시하지 않으면 해당 경로로 조회시 메서드로 매핑되지 않으니 주의해야합니다.

예시) `@GetMapping("/some/greeting", "/some/greeting/")`

### 참고링크
- https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.0-Migration-Guide#spring-mvc-and-webflux-url-matching-changes

## 5. Spring security HttpSecurity 메서드 deprecated

Spring boot 3 에서는 Spring Security 6.0을 사용합니다.

Spring Security 5.8버전에서 설정 방식 등이 변경되었습니다.

Spring boot 2.7에서 업그레이드하는 경우 Spring Security 5.8 마이그레이션 문서를 참고해 설정을 변경해야합니다.

::: code-group

```kotlin [LegacySecurifyConfig.kt]
@Bean
fun filterChain(httpSecurity: HttpSecurity): SecurityFilterChain {
    return httpSecurity.cors()
        .and()
        .csrf().disable()
        .headers().frameOptions().disable()
        .and()
        .exceptionHandling().authenticationEntryPoint(entryPoint)
        .and()
        .requestMatchers()
        .antMatchers("/api/**")
        .antMatchers("/app/**")
        .and()
        .build()
    }

@Bean
fun adminFilterChain(httpSecurity: HttpSecurity): SecurityFilterChain {
    return httpSecurity.cors()
        .and()
        .csrf().disable()
        .headers().frameOptions().disable()
        .and()
        .exceptionHandling().authenticationEntryPoint(entryPoint)
        .and()
        .requestMatchers()
        .antMatchers("/admin/**")
        .antMatchers("/admin2")
        .and()
        .addFilterAfter(
            AdminAuthFilter(),
            ?::class.java
        )
        .build()
```

```kotlin [SecurityConfig.kt]
@Bean
fun filterChain(httpSecurity: HttpSecurity): SecurityFilterChain {
    return httpSecurity
        .cors(withDefaults())
        .csrf { csrf -> csrf.disable() }
        .headers { headersCustomizer -> headersCustomizer.frameOptions {}.disable() }
        .exceptionHandling { exceptionHandlingCustomizer ->
            exceptionHandlingCustomizer.authenticationEntryPoint(entryPoint)
        }
        .securityMatchers { matchers ->
            matchers.requestMatchers(
                antMatcher("/api/**"),
                antMatcher("/app/**")
            )
        }
        .build()
}

@Bean
fun adminFilterChain(httpSecurity: HttpSecurity): SecurityFilterChain {
    return httpSecurity
        .cors(withDefaults())
        .csrf { csrf -> csrf.disable() }
        .headers { headersCustomizer -> headersCustomizer.frameOptions {}.disable() }
        .exceptionHandling { exceptionHandlingCustomizer ->
            exceptionHandlingCustomizer.authenticationEntryPoint(authEntryPoint)
        }
        .securityMatchers { matchers ->
            matchers.requestMatchers(
                antMatcher("/admin/**"),
                antMatcher("/admin2")
            )
        }
        .addFilterAfter(
            AdminAuthFilter(),
            ?::class.java
        )
        .build()
}
```

:::

### 참고링크
- https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.0-Migration-Guide#spring-security
- https://docs.spring.io/spring-security/reference/5.8/migration/index.html
- https://docs.spring.io/spring-security/reference/6.0/migration/index.html

## 6. `spring.jpa.properties.hibernate.timezone.default_storage`

Spring boot 3.1 부터는 hibernate 6.2를 사용합니다.

변경 내용 중 시간대에 대한 내용을 알고 있어야 데이터가 정상적으로 적재될 것이여서 참고해야합니다.

DB 컬럼이 Timezone을 저장할 수 있는 컬럼의 경우 Timezone 정보와 함께 저장됩니다.

DB 컬럼이 Timezone을 저장할 수 없는 컬럼의 경우 UTC로 변환 후 저장합니다. 

### 참고링크
- https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.1-Release-Notes#hibernate-62
- https://docs.jboss.org/hibernate/orm/6.2/migration-guide/migration-guide.html#ddl-timezones

## 7. version specific Database Dialect Deprecated

Hibernate 버전이 6.2로 업데이트 되었습니다.

관련해서 DB의 Dialect를 지정해서 사용하고 있다면 굳이 설정할 필요가 없어졌습니다.

추가로 Version을 명시하는 Dialect가 Deprecated가 되어 버전 명시 Dialect 대신 포괄적인 Dialect를 사용해야합니다.

### 참고 링크
- https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.0-Release-Notes
- https://docs.jboss.org/hibernate/orm/6.2/migration-guide/migration-guide.html#database-versions
- https://docs.jboss.org/hibernate/orm/6.0/migration-guide/migration-guide.html#version-specific-and-spatial-dialects

## 8. JarLauncher 경로 변경됨

스프링 부트의 `jarLauncher`의 경로가 변경되었다.

| 변경전                                                | 변경후                                                       |
|----------------------------------------------------|-----------------------------------------------------------|
| org.springframework.boot.loader.JarLauncher        | org.springframework.boot.loader.launch.JarLauncher        |
| org.springframework.boot.loader.PropertiesLauncher | org.springframework.boot.loader.launch.PropertiesLauncher |
| org.springframework.boot.loader.WarLauncher        | org.springframework.boot.loader.launch.WarLauncher        |

따라서 위 방식으로 사용한다면 경로를 변경해주어야 합니다.

```dockerfile
#...
# ENTRYPOINT ["java", "org.springframework.boot.loader.JarLauncher"]
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
```

### 기존방식대로 유지하기

- gradle

```groovy
bootJar {
  loaderImplementation = org.springframework.boot.loader.tools.LoaderImplementation.CLASSIC
}
```

- maven

```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-maven-plugin</artifactId>
      <executions>
        <execution>
          <goals>
            <goal>repackage</goal>
          </goals>
          <configuration>
            <loaderImplementation>CLASSIC</loaderImplementation>
          </configuration>
        </execution>
      </executions>
    </plugin>
  </plugins>
</build>
```

### 참고링크
- https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.2-Release-Notes

## 9. `spring.mvc.throw-exception-if-no-handler-found` Deprecated

Spring 3.2버전으로 업데이트되면서 Spring framework 6.2 버전으로 업데이트 되었다.

이때 `throw-exception-if-no-handler-found` 옵션이 기본값이 `true`로 변경되었다.

그리고 해당 프로퍼티는 deprecated 되었다.

따라서 Spring boot 3.2로 업그레이드 시 `GlobalExceptionHandler` 도입을 적극 검토하고 `NoResourceFoundException`를 추가해주어야한다.

### 참고링크
- https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.2-Release-Notes
- https://github.com/spring-projects/spring-framework/wiki/Upgrading-to-Spring-Framework-6.x#web-applications

## 10. Database custom 함수를 위한 `registerFunction` Deprecated

이번 hibernate 버전 업데이트로 `registerFunction` 함수가 사라져 그대로 사용할 수 없게되었습니다.

제가 사용한 방법은 아래와 같습니다.

- querydsl의 stringTemplate, numberTemplate을 활용해 함수 사용
- registerFunction` 대신 `FunctionContributor`를 사용

::: code-group

```kotlin [LegacyCustomDBDialect.kt]
import org.hibernate.dialect.PostgreSQL95Dialect
import org.hibernate.dialect.function.SQLFunctionTemplate
import org.hibernate.type.StandardBasicTypes

class LegacyCustomDBDialect : PostgreSQL95Dialect() {
    init {
        registerFunction(
            "string_agg",
            SQLFunctionTemplate(
                StandardBasicTypes.STRING,
                "string_agg(distinct ?1, ?2)"
            )
        )
        registerFunction(
            "dense_rank",
            SQLFunctionTemplate(
                StandardBasicTypes.LONG,
                "dense_rank() over (order by sum(?1) desc)"
            )
        )
    }
}
```

```kotlin [CustomFunctionContributor]
package com.sample.example.path.config.db.CustomFunctionContributor

import org.hibernate.boot.model.FunctionContributions
import org.hibernate.boot.model.FunctionContributor
import org.hibernate.type.StandardBasicTypes

class CustomFunctionContributor : FunctionContributor {
    override fun contributeFunctions(functionContributions: FunctionContributions) {
        functionContributions.functionRegistry.registerPattern(
            "string_agg_distinct",
            "string_agg(distinct ?1, ?2)",
            functionContributions.typeConfiguration.basicTypeRegistry.resolve(StandardBasicTypes.STRING)
        )
    }
}

// src/resources/META-INF/services/src/main/resources/META-INF/services/org.hibernate.boot.model.FunctionContributor
// 에 클래스 추가
```

```kotlin [src/main/resources/META-INF/services/org.hibernate.boot.model.FunctionContributor]
com.sample.example.path.config.db.CustomFunctionContributor
```

```kotlin [CustomQueryDslImplementation.kt]
queryFactory.select(
  Projections.constructor(
    ProjectionClass::class.java,
    entity.id,
    // QueryDSL 의 numberTemplate을 그대로 활용해 호출
    Expressions.numberTemplate(
        Long::class.java,
        "dense_rank() over (order by sum({0}) desc)",
        entity.score
    ).`as`("rank"),
    // Query DLS 의 stringTemplate을 활용해 CustomFunction 호출
    // PostgreSQL의 string_agg(distinct {0}, {1})가 정상적으로 호출되지 않아 아래와 같은 방식 사용
    // stringTemplate을 그대로 사용시 string_agg(distinct ({0}, {1}))로 쿼리가 작성됨.
    Expressions.stringTemplate(
        "string_agg_distinct({0}, {1})",
        entity.string_for_array, // {0}
        Expressions.constant(",") // {1}
    ).`as`("string_arrays")
  )
)
```

:::

### 참고 링크
- https://aregall.tech/hibernate-6-custom-functions

## 11. Java 버전 최소 17

Spring boot 3 으로 업데이트 되면서 Java 버전이 최소 17이 되어야한다.

참고로 Spring boot 3.2부터 Java 21의 가상 스레드를 지원하니 참고하면 더 좋다.

### 참고링크
- https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.0-Release-Notes#java-17-baseline-and-java-19-support
