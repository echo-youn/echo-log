# 오버로딩

자바에서의 오버로딩은 함수가 갯수도 늘어날 뿐더러 같은 동작의 코드가 불필요하게 늘어난다.

그래서 코틀린에서는 함수에 Default 값을 가진 파라미터를 추가함으로써 함수 하나로 오버로딩의 효과를 얻을 수 있다.


## 자바 
```java
public String method() {
 return ""
}

public String method(String a) {
 return a
}

public String method(String a, String b) {
 return a + b
}
```



```kotlin
fun method(a: String = "", b: String = ""): String {
    return a + b
}
```
