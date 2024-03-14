# Spring 3.2로 업데이트하며 생긴 이슈

스프링 부트의 `jarLauncher`의 경로가 변경되었다.

| 변경전                                                | 변경후                                                      |
|----------------------------------------------------|----------------------------------------------------------|
| org.springframework.boot.loader.JarLauncher        | org.springframework.boot.loader.lauch.JarLauncher        |
| org.springframework.boot.loader.PropertiesLauncher | org.springframework.boot.loader.lauch.PropertiesLauncher |
| org.springframework.boot.loader.WarLauncher        | org.springframework.boot.loader.lauch.WarLauncher        |

따라서 위 방식으로 사용한다면 경로를 변경해주어야 합니다.

```dockerfile
#...
# ENTRYPOINT ["java", "org.springframework.boot.loader.JarLauncher"]
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
```

## 기존방식대로 유지하기

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

## 참고링크
- https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.2-Release-Notes
