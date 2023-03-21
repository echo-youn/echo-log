# hibernate

- Spring 3.2.18 > JVM 1.5 최적화 (1.8 일부 지원)
- hibernate 3.6.10.Final
  - hibernate-entitymanager
  - hibernate-ehcache
- spring-data-jpa 1.6.6.RELEASE
- jvm 1.8


## Hibernate 2차 캐싱 옵션

Hibernate 3.6.10.Final에서는 `hibernate.cache.use_second_level_cache`가 기본으로 enabled이다.

https://github.com/hibernate/hibernate-orm/blob/ba46673b25e82654826f2c95cdca9cbe3917e557/hibernate-core/src/main/java/org/hibernate/cfg/Environment.java#L427-L430

```
/**
* Enable the second-level cache (enabled by default)
*/
public static final String USE_SECOND_LEVEL_CACHE = "hibernate.cache.use_second_level_cache";
```

소스코드에서는 Cache 관련한 코드가 없는데 캐싱이 되고 있는 상황이었다.

