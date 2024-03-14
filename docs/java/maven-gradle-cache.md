# 메이븐 그레이등 로컬 캐시 저장소

간혹 자바 프로젝트를 하다보면 의존성 파일이 캐싱되어 의도치않게 빌드가 되지 않는 경우가 있다.

이런경우 캐시를 비워줘야하는데 기본 캐시 저장소는 다음과 같다.

|maven 기본경로|Gradle 기본경로|
|--|--|
|$HOME/.m2/repository|$HOME/.gradle/caches/modules-2/files-2.1|
