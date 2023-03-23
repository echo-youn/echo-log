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

레거시 프로젝트에서 hibernate-ehcache가 불필요하게 사용되고 있고 삭제시 이슈 없고 정상적으로 동작해서 이렇게 종결...


TransactionAspectSupport .currentTransactionStatus

Transactional 삭제...

프로젝트에 JPA와... Hibernate JDBC API를 혼용해서 쓰고 있어서 생기는 이슈였을까?
