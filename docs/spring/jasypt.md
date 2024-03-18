# Jasypt

프로젝트에 데이터베이스 암호라던가 기타 민감 정보들이 필요하기 마련이다.

그럴때 보통은 오케스트레이션 도구의 Secrets 나 KMS 등을 활용하거나 `Vault`와 같은 솔루션을 사용한다.

그러나 프로젝트의 규모가 크다면 충분히 도입할만한 가치가 있지만 작은 경우 위와 같은 해결법을 배보다 배꼽이 더 클 수 있다.

그래서 코드에 민감정보를 그대로 두되 암호화해 저장하고 런타임 시점에 복호화해 사용할 수 있는 `Jasypt`를 도입하게 되었다.

# 의존성 추가

```
// jasypt
implementation("com.github.ulisesbocchio:jasypt-spring-boot-starter:3.0.5")
```

# StringEncryptor 설정

Jasypt는 암복호화를 위해서 `StringEncryptor`를 사용합니다.

이를 설정하는 방법은 AutoConfiguration을 이용하는 방법과 직접 Bean을 만들어 사용하는 법 두가지가 있습니다.

## AutoConfiguration

| Key                                       | Required | Default Value                        |
|-------------------------------------------|----------|--------------------------------------|
| jasypt.encryptor.password                 | 	True    | 	-                                   |
| jasypt.encryptor.algorithm                | 	False	  | PBEWITHHMACSHA512ANDAES_256          |
| jasypt.encryptor.key-obtention-iterations | 	False	  | 1000                                 |
| jasypt.encryptor.pool-size	               | False    | 	1                                   |
| jasypt.encryptor.provider-name            | 	False   | 	SunJCE                              |
| jasypt.encryptor.provider-class-name      | 	False   | 	null                                |
| jasypt.encryptor.salt-generator-classname | 	False   | 	org.jasypt.salt.RandomSaltGenerator |
| jasypt.encryptor.iv-generator-classname   | 	False	  | org.jasypt.iv.RandomIvGenerator      |
| jasypt.encryptor.string-output-type       | 	False	  | base64                               |
| jasypt.encryptor.proxy-property-sources   | 	False	  | false                                |
| jasypt.encryptor.skip-property-sources    | 	False   | 	empty list                          |

이렇게 프로퍼티를 채워넣으면 `StringEncryptor`가 생성되어 사용할 수 있습니다.

## Bean

```
@Bean
fun jasypt(): StringEncryptor {
    val config = SimpleStringPBEConfig()
        .apply {
            password = jasyptPassword
            algorithm = "PBEWITHHMACSHA512ANDAES_256"
            poolSize = 1
            saltGenerator = RandomSaltGenerator()
            ivGenerator = RandomIvGenerator()
        }

    return PooledPBEStringEncryptor().apply {
        setConfig(config)
    }
}
```

# 프로퍼티 암호화하기

이제 암호화 알고리즘 등을 설정해 `StringEncryptor`를 정했으면 이를 활용해 암호화할 평문을 암호화합니다.

```kotlin
@Test
fun jasyptEncodeTest() {
    val message = "test"
    println(jasypt.encrypt(message))
}
// abcdefg
```

암호문을 properties에 입력하는데 `ENC(암호문)`으로 입력합니다.

기본값으로 위 포맷이 설정되어 있으나 추후에 수정할 수도 있습니다.

```yaml
# application.yml
my-secret: ENC(abcdefg)
```

# 프로그램 실행 시 패스워드 환경변수로 설정하기

암호화는 성공적으로 됐지만 복호화를 위한 키를 관리하는 과제가 남아있습니다.

이를 위해 Secrets 나 KMS 등을 활용하거나 `Vault`와 같은 솔루션을 사용할 수 있습니다.

저와 같은 경우에는 오케스트레이션 툴을 사용하지 않고 `docker-compose`를 사용해 운영중이어서 다음과 같이 해결했습니다.

::: code-group

```dockerfile [Dockerfile]
FROM eclipse-temurin:17

VOLUME /tmp
COPY run.sh .
COPY build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["sh", "run.sh"]
```

```shell [run.sh]
#!/bin/sh

JAVA_OPTS=" -Duser.timezone=UTC ${JAVA_OPTS} "
JAVA_OPTS=" -Djasypt.encryptor.password=${JASYPT_PASSWORD} ${JAVA_OPTS}"
JAVA_OPTS=" -Dspring.profiles.active=${APP_ENV} ${JAVA_OPTS}"

exec java ${JAVA_OPTS} -jar app.jar
```

:::

그리고 동작하는 컴서버의 환경변수에 저 `PASSWORD`를 설정해 놓거나 `.env` 파일로 암호를 관리했습니다.
