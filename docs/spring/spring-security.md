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

- [Servlet](/springBoot/dispatcher-servlet)
- Context Hierarchy
- Servlet Container
- DispatcherServlet
- FilterChain

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



