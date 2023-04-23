# Spring Security

개인 프로젝트하면서 항상 인증/인가 단계에서 다시금 해매고 문서를 찾아보게 되어 한번 정리할 겸 문서 작성해봅니다.

## 제공해 주는 기능
- 어플리케이션 사용 인증 및 권한
- `FormLogin` 활성화 시 기본 로그인 화면
- 기본 유저 생성
- 비밀번호 암호화 (Bcrypt) 및 암호 저장소 제공
- 로그아웃
- CSRF 공격 방지
- 세션 탈취 방지
- ETC...

스프링 시큐리티를 이해하기 위해서는 다음을 기본적으로 이해하고 있어야한다.

- Servlet
- Context Hierarchy(Servlet WebApplicationContext, Root WebApplicationContext)
- Servlet Container
- DispatcherServlet
- FilterChain


## Servlet
자바 프로그램 (함수, 클래스 등...)

## DispatcherServlet
많은 서블렛을 연결해주는 중앙의 서블렛이다.

`DispatcherServlet`은 다른 서블렛과 마찬가지로 같은 서블렛이여서, 정의되고 설정이나 web.xml에 매핑되어 있어야한다.

`DispatcherServlet`은 스프링 설정에 따라 `HttpRequest Mapping`, `View Resolve`, `Exception Handler` 등을 `위임(Delegation)`하여 사용될 컴포넌트를 찾습니다.

다음 예시는 서블렛 컨테이너에 의해 자동으로 `Dispatcher`가 설정되고 등록되고 생성되는 과정을 보여줍니다.

```kotlin
class MyWebApplicationInitializer : WebApplicationInitializer {

    override fun onStartup(servletContext: ServletContext) {

        // Load Spring web application configuration
        val context = AnnotationConfigWebApplicationContext()
        context.register(AppConfig::class.java)

        // Create and register the DispatcherServlet
        val servlet = DispatcherServlet(context)
        val registration = servletContext.addServlet("app", servlet)
        registration.setLoadOnStartup(1)
        registration.addMapping("/app/*")
    }
}
```

다음은 `DispatcherServlet`을 `web.xml`로 `Servlet`을 등록하고 `url-pattern`을 매핑하는 내용을 기재한 xml의 예시입니다.

```xml
<web-app>

    <!-- 
        ServletContextListener의 구현체를 지정합니다.
        이는 WAS 에서 서블릿 컨텍스트가 시작될때, 서블릿들을 RootContext에 적재하고 종료될때 서블릿들을 제거하는 역할을 합니다.
        Spring boot에서는 @WebListner 어노테이션을 활용해 커스텀 리스너를 지정할수 있습니다.
    -->
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>

    <!-- Dispatcher Servlet 생성시 파라미터로 넘길 값 -->
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <!-- 기본값은 다음과 같다. /WEB-INF/applicationContext.xml -->
        <param-value>/WEB-INF/app-context.xml</param-value>
    </context-param>

    <!-- Dispatcher Servlet 정보 -->
    <servlet>
        <servlet-name>app</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value></param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>

    <!--
         Servlet과 url pattern 매핑
         /app 아래에 있는 모든 요청을 처리하겠다는 의미이다.
         ex) *.do, /*, /
    -->
    <servlet-mapping>
        <servlet-name>app</servlet-name>
        <url-pattern>/app/*</url-pattern>
    </servlet-mapping>
</web-app>
```

https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#web.servlet.spring-mvc
스프링 프레임워크에서는 이렇게 지원하지만, 스프링 부트에서는 자체적으로 내장된 `서블릿 컨테이너`에 자동으로 후킹됩니다.

정의된 `Servlet`, `Filter`, `*Listener 서블릿`들이 빈으로 등록되면 알아서 `서블렛 컨테이너`에 등록됩니다.

https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#web.servlet.embedded-container.servlets-filters-listeners.beans



## Servlet Container
들어온 HTTP 요청에 대해서 HttpRequest 쓰레드를 생성해주고 매핑된 서블렛에 매핑해준다.

## Web Filter
HTTP 요청 전과 후에 실행되는 컴포넌트입니다.

### 예시 (Bealdung 참고)

::: code-group

```java [TransactionFilter.java]
@Component
@Order(1)
public class TransactionFilter implements Filter {

    @Override
    public void doFilter(
        ServletRequest request, 
        ServletResponse response, 
        FilterChain chain) throws IOException, ServletException {
 
        HttpServletRequest req = (HttpServletRequest) request;
        LOG.info(
          "Starting a transaction for req : {}", 
          req.getRequestURI());
 
        chain.doFilter(request, response);
        LOG.info(
          "Committing a transaction for req : {}", 
          req.getRequestURI());
    }

    // other methods 
}
```

```java [RequestResponseLoggingFilter.java]
@Component
@Order(2)
public class RequestResponseLoggingFilter implements Filter {

    @Override
    public void doFilter(
      ServletRequest request, 
      ServletResponse response, 
      FilterChain chain) throws IOException, ServletException {
 
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        LOG.info(
          "Logging Request  {} : {}", req.getMethod(), 
          req.getRequestURI());
        chain.doFilter(request, response);
        LOG.info(
          "Logging Response :{}", 
          res.getContentType());
    }

    // other methods
}
```

```text [result]
23:54:38 INFO  com.spring.demo.TransactionFilter - Starting Transaction for req :/users
23:54:38 INFO  c.s.d.RequestResponseLoggingFilter - Logging Request  GET : /users
...
23:54:38 INFO  c.s.d.RequestResponseLoggingFilter - Logging Response :application/json;charset=UTF-8
23:54:38 INFO  com.spring.demo.TransactionFilter - Committing Transaction for req :/users
```

:::

## 서블렛 인증 관련 용어 및 구조

### SecurityContextHolder
`Spring Security`에 의해 누가 인증됐는지를 저장하는 공간입니다.

### SecurityContext
`SecurityContextHolder`로 얻을수 있습니다.그리고 여기엔 현재 인증된 유저의 정보가 저장되어 있습니다.

### Authentication
유저가 인증정보를 `SecurityContext`에 저장되고 `AuthenticationManager`에 의해 입력 또는 생성되는 객체입니다.

### GrantedAuthority
`Authentication`에 있는 유저에게 부여된 권한 정보가 들어있는 객체입니다.

### AuthenticationManager
`Spring Security`에 등록된 필터들이 어떻게 인증 단계를 동작해야하는지 정의되어있습니다.

### ProviderManager
가장 흔히 사용되는 `AuthenticationManger`의 구현체이다.

### AuthenticationProvider
`ProviderManager`가 특정 방식의 인증을 수행할때 주로 사용된다. ex. JwtAuthenticationProvider, DaoAuthenticationProvider 등..

### Request Credentials with AuthenticationEntryPoint
클라이언트에게 인증정보를 요구할때 사용된다. (Login page로 리디렉트 또는 401 응답 등...)

### AbstractAuthenticationProcessingFilter
인증을 위한 기본 필터. 이것은 높은 수준의 인증 흐름과 조각이 함께 작동하는 방식에 대한 좋은 아이디어를 제공합니다.



