# 원격 캐시 Redis 사용

서버는 분산환경으로 구축하는 경우가 많아 원격 캐시를 사용하는 경우가 많다.

많은 서비스들이 있지만 단연 Redis가 가장 많이 사용된다.

Spring boot에서 Redis를 사용하는 법을 알아보자. 

# 프로젝트 의존성 추가

::: code-group
```kotlin [build.gradle.kts]
// ...
implementation("org.springframework.boot:spring-boot-starter-cache")
implementation("org.springframework.boot:spring-boot-starter-data-redis")
// starter-data-redis에 jedis와 lettuce가 포함되어 있다.
// ...
```
:::

# 설정

## Auto Configuration 로 설정하기

::: code-group
```yaml [application.yml]
spring:
  redis:
    host: ...
    port: ...
    username: ...
    password: ...
    timeout: ...
```

```kotlin [Service.kt]
class SampleService(
    private val stringRedisTemplate: StringRedisTemplate // 기본 생성되는 Bean을 주입받아 사용
)
```

:::

## Lettuce Bean 으로 설정하기

### LettuceConnectionFactory Cluster mode 인 경우
```kotlin
fun buildRedisClusterConfiguration(): LettuceClientConfiguration {
        return LettuceClientConfiguration.builder()
            .commandTimeout(
                Duration.ofMillis(redisProperty.commandTimeoutMillis)
            )
            .clientOptions(
                ClusterClientOptions.builder()
                    .topologyRefreshOptions(
                        ClusterTopologyRefreshOptions.builder()
                            .enableAllAdaptiveRefreshTriggers()
                            .enablePeriodicRefresh()
                            .dynamicRefreshSources(true)
                            .build()
                    )
                    .build()
            )
            .build()
    }

@Bean
fun redisConnectionFactory(): LettuceConnectionFactory {
     val clusterConfiguration = RedisClusterConfiguration().apply {
        username = redisProperty.username
        setPassword(redisProperty.password)
        clusterNode(redisProperty.host, redisProperty.port)
    }

    return LettuceConnectionFactory(clusterConfiguration, buildRedisClusterConfiguration())
}
```

### LettuceConnectionFactory Standalone mode 인 경우
```kotlin
@Bean
fun redisConnectionFactory(): LettuceConnectionFactory {
     val standaloneConfiguration = RedisStandaloneConfiguration().apply {
        hostName = redisProperty.host
        port = redisProperty.port
        username = redisProperty.username
        setPassword(redisProperty.password)
    }

    return LettuceConnectionFactory(standaloneConfiguration)
}
```

### CacheManager 설정
```kotlin
@Bean
fun remoteCacheManager(redisConnectionFactory: RedisConnectionFactory): CacheManager {
    val redisCacheConfig = RedisCacheConfiguration.defaultCacheConfig()
        .computePrefixWith { cacheName ->
            "$applicationName:$cacheName:"
        }
        .serializeKeysWith(
            RedisSerializationContext.SerializationPair.fromSerializer(
                StringRedisSerializer()
            )
        )
        .serializeValuesWith(
            RedisSerializationContext.SerializationPair.fromSerializer(
                GenericJackson2JsonRedisSerializer() // 담기는 데이터가 json 형식
            )
        )
        .entryTtl(Duration.ofSeconds(60))
        .disableCachingNullValues()

    return RedisCacheManager.builder(redisConnectionFactory)
        .cacheDefaults(redisCacheConfig)
        .enableStatistics()
        .build()
}
```

## 위에서 설정한 캐시매니저로 캐싱하기

```kotlin
@Cacheable(value = ["cacheKey"], key = "#id", cacheManager = "remoteCacheManager")
fun method(id: Long) {
    // lookup
}
```
