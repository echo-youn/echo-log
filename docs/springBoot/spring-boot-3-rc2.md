# 스프링 부트 3

이번 목표는 스프링부트3, 자바 17을 사용하여 인증, 권한 기능을 가진 서비스를 만들어 보려고 한다.

## starter 선택사항
- Maven
- Kotlin
- Spring Boot 3
- Packaging: Jar
- Java 17
- Spring Web
- Spring Security
- Spring Data JPA
- Lombok
- Spring Boot DevTools
- Spring Configuration Processor
- Thymeleaf
- MySQL Driver

## 자바 17 설치

`adoptopenjdk`를 설치하여 사용하려고한다. 버전은 17버전을 사용하고 JVM은 `Temurin(HotSpot)`과 `OpenJ9`을 선택할 수 있는데 이번에는 가상 컨테이너 환경에서 더 성능을 잘 내준다는 후자를 선택해 개발한다.

Temurin은 Adoptium에서 다운로드받을 수 있고 이번에 사용하려는 OpenJ9은 IBM에서 다운로드받을 수 있다.

[OpenJ9 Semeru 다운로드 페이지](https://developer.ibm.com/languages/java/semeru-runtimes/downloads/)

각자 맞는 환경을 선택해서 다운로드 받는다.

`tar.gz` 파일을 받았으면 설치하고 싶은 위치에 파일을 옮긴 뒤 압축해제한다.

```shell
$ tar -zxvf <다운로드받은 파일>
```

그리고 `JAVA_HOME` 환경변수와 `PATH`를 설정해준다.

```
export JAVA_HOME=/usr/local/java/jdk-17.0.5+8
export PATH=$PATH:/usr/local/java/jdk-17.0.5+8/bin
```

이제 자바가 잘 설치됐는지 확인해 보면 정상적으로 설치되었다.

```shell
$ java -version
openjdk version "17.0.5" 2022-10-18
IBM Semeru Runtime Open Edition 17.0.5.0 (build 17.0.5+8)
Eclipse OpenJ9 VM 17.0.5.0 (build openj9-0.35.0, JRE 17 Linux amd64-64-Bit Compressed References 20221018_325 (JIT enabled, AOT enabled)
OpenJ9   - e04a7f6c1
OMR      - 85a21674f
JCL      - 32d2c409a33 based on jdk-17.0.5+8)

$ javac -version
javac 17.0.5
```

또는 IDE를 IntelliJ를 사용한다면 Project Settings에서 JDK를 설치할 수 있다.

## 프로젝트 실행

