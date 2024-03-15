# Caffeine 캐시 적용

주로 서버 어플리케이션을 분산 환경이다보니 Redis를 주로 사용하게 된다.

간혹 Redis 없이 앱 내에 데이터를 캐시하고 싶은 경우 어떻게 적용하는지 알아본다.

`Caffeine`의 특징은 다음으로 요약이 가능하다.

- High performance
- Rich API
- Spring boot auto configuration

# 프로젝트 의존성 추가

::: code-group
```kotlin [build.gradle.kts]
// ...
implementation("com.github.ben-manes.caffeine:caffeine")
implementation("org.springframework.boot:spring-boot-starter-cache")
// ...
```
:::

# 캐시 활성화, 카페인 설정, 캐시 매니저 설정

::: code-group
```kotlin [Main.kt]
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cache.annotation.EnableCaching

@SpringBootApplication
@EnableCaching
class Application

fun main(args: Array<String>) {
    runApplication<Application>(*args)
}
```

```kotlin [CacheConfig.kt]
import com.github.benmanes.caffeine.cache.Caffeine
import org.springframework.cache.CacheManager
import org.springframework.cache.caffeine.CaffeineCache
import org.springframework.cache.support.SimpleCacheManager
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class CacheConfig {

    @Bean
    fun caffeineConfig(): List<CaffeineCache> {
        return listOf(
            CaffeineCache(
                "cacheName",
                Caffeine.newBuilder()
                    .expireAfterWrite(10L, java.util.concurrent.TimeUnit.MINUTES)
                    .maximumSize(1000L)
                    .build()
            )
        )
    }

    @Bean
    fun cacheManager(caffeineCaches: List<CaffeineCache>): CacheManager {
        val cacheManager = SimpleCacheManager()
        cacheManager.setCaches(caffeineCaches)
        return cacheManager
    }
}
```
:::

# 사용법

## @Cacheable
```kotlin
@Service
class AddressService {
    @Cacheable(value = "cacheName", key = "customerId")
    fun getAddress(customerId: Long): AddressDTO {
        // lookup and return result
    }
    
    @CacheEvict(value = "cacheName", key = "customerId")
    fun removeCache() {
        // ...
    }
    
    @CachePut(value = "cacheName", key = "customerId")
    fun writeCache() {
        // lookup and return result
    }
}
```

## CacheManager

```kotlin
@Service
class AddressService(
    private val cacheManager: CacheManager
) {
    fun getAddress(customerId: Long): AddressDTO {
        val cache = cacheManager.get("cacheName")
        cache?.put("key", "value")
        // ...
    }
}
```