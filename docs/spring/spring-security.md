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

- [Servlet](/spring/dispatcher-servlet)
- Context Hierarchy
- Servlet Container
- DispatcherServlet
- FilterChain


## Servlet
자바 프로그램 (함수, 클래스 등...)

## DispatcherServlet
많은 서블렛을 연결해주는 중앙의 서블렛이다.

`DispatcherServlet`은 다른 서블렛과 마찬가지로 같은 서블레이여서, 정의되고 설정이나 web.xml에 매핑되어 있어야한다.

DispatcherServlet은 스프링 설정에 따라 요청매핑, 뷰 만들기, 예외처리 등에 사용될 `위임 컴포넌트`를 찾습니다.

다음 예시는 서블렛 컨테이너에 의해 자동으로 Dispatcher가 설정되고 등록되고 생성되는 과정을 보여줍니다.

```kotlin{10}
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

Dispatcher가 제공해 주는 몇가지 기능과 기본 구현체들에 대해 적고 지나가보자.

- HandlerMapping
  - BeanNameUrlHandlerMapping
  - RequestMappingHandlerMapping
- HandlerAdapter
  - HttpRequestHandlerAdapter
    - RequestMappingHandlerAdapter
  - SimpleControllerHandlerAdapter
- HandlerExceptionResolver
  - ExceptionHandlerExceptionResolver
  - ResponseStatusExceptionResolver
  - DefaultHandlerExceptionResolver
- ViewResolver
  - InternalResourceViewResolver
- RequestToViewNameTranslator
  - DefaultRequestToViewNameTranslator
- MultipartResolver
  - None(없음)
- LocaleResolver
  - AcceptHeaderLocaleResolver




https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#web.servlet.spring-mvc
스프링 프레임워크에서는 이렇게 지원하지만, 스프링 부트에서는 자체적으로 내장된 서블릿 컨테이너에 자동으로 후킹됩니다.

정의된 ServletFilter와 서블릿가 알아서 자동으로 매핑됩니다. (RequestMapping 등...) https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#web.servlet.embedded-container.servlets-filters-listeners.beans

Servlet이나 Filter, *Listener 서블릿들이 빈으로 등록되면 알아서 서블렛 컨테이너에 등록됩니다.

## Servlet Container
들어온 HTTP 요청에 대해서 HttpRequest 쓰레드를 생성해주고 서블렛에 매핑해준다.

## Filter
필터


## 서블렛 인증 관련 용어 및 구조 설명

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


## AuthenticationProvider를 구현해 인증 하기

### CustomAuthenticationProvider 구현

`AbstractAuthenticationProcessingFilter`가 `Authentication` 객체를 만들어주면 `AuthenticationManager`가 받아 인증을 한다.

이때 `AuthenticationManager`는 `Provider`를 갖고 인증을 하므로 우리가 그 부분을 구현하는거다. 

```java
@Component
public class CustomAuthenticationProvider implements AuthenticationProvider {

    @Override
    public Authentication authenticate(final Authentication authentication) throws AuthenticationException {
        final String name = authentication.getName();
        final String password = authentication.getCredentials().toString();
        if (!"admin".equals(name) || !"system".equals(password)) {
            return null;
        }
        return authenticateAgainstThirdPartyAndGetAuthentication(name, password);
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
    
    private static UsernamePasswordAuthenticationToken authenticateAgainstThirdPartyAndGetAuthentication(String name, String password) {
      final List<GrantedAuthority> grantedAuths = new ArrayList<>();
      grantedAuths.add(new SimpleGrantedAuthority("ROLE_USER"));
      final UserDetails principal = new User(name, password, grantedAuths);
      return new UsernamePasswordAuthenticationToken(principal, password, grantedAuths);
    }
}
```

### Security Manager에 등록

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomAuthenticationProvider authProvider;

    @Bean
    public AuthenticationManager authManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = 
            http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.authenticationProvider(authProvider);
        return authenticationManagerBuilder.build();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http.authorizeHttpRequests(request -> request.anyRequest()
                .authenticated())
            .httpBasic(Customizer.withDefaults())
            .build();
    }
}
```

## OncePerRequestFilter로 구현

```kotlin
    addFilterBefore<UsernamePasswordAuthenticationFilter>(
        JwtTokenFilter(jwtTokenService, userService)
    )


SecurityContextHolder.getContext().authentication = UsernamePasswordAuthenticationToken(
          subject,
        credential,
        listOf(
            SimpleGrantedAuthority(role)
        )
    )
```

## 참고 링크
// todo
- https://velog.io/@mindfulness_22/%EC%9E%90%EB%8F%99-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EA%B8%B0%EB%8A%A5-%EA%B5%AC%ED%98%84-with-remember-me
- https://codevang.tistory.com/277
- 