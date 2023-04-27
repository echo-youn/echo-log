# Servlet
자바 웹 어플리케이션을 구성하는 자바 프로그램들을 `Servlet`이라 부릅니다.
`Spring Web MVC` 문서의 첫 문장이 바로 다음과 같습니다.
`이 문서(Spring Web MVC)는 Servlet API와 Servlet Container에 배포되는 Servlet-stack 웹 어플리케이션을 위한 문서입니다.`
`Servlet`은 `Spring Web MVC`를 지탱하는 가장 기본이 되는 구성 요소임을 알 수 있습니다.

여기서는 Spring framework에서 대표적인 `Servlet`으로 `Servlet Container`에서 `Servlet`으로의 매핑정보를 다뤄주는 `Dispatcher Servlet`을 다룹니다.
그리고 Servlet Context Hierarchy를 살펴보도록 하겠습니다.

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
        <!-- 
            기본값은 다음과 같다. /WEB-INF/applicationContext.xml 
            혹시 Application Context 구조가 필요없다면 root-context.xml로 설정가능하다.        
        -->
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
들어온 HTTP 요청에 대해서 HttpRequest 쓰레드를 생성해주고 매핑된 서블렛에 해당 요청을 직접 매핑해준다.

## Servlet Application Context
이 컨텍스트는 `Controller`, `View Resolver`와 같은 기타 웹과 관련된 Bean들을 모아놓은 Context이다.

## Root Application Context
이 컨텍스트는 위 컨텍스트외에 모든 빈들을 모아놓은 Context이다. 만약 Servlet Context에 필요한 Bean이 없다면 이 컨텍스트에 있는 빈을 위임하게 된다.

이렇게 나눠놓은 이유는 대개 비즈니스 로직에 필요한 빈들이 여러 Servlet에 참조되는 경우가 많기때문에 이런 구조를 갖게 되었다.
