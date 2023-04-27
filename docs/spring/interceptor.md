# Handler Interceptor
`Handler Interceptor`는 `HandlerMapping`이 끝난 후 해당 `Servlet`에 접근할때 어떤 작업을 할때 사용하는 것이다.

헷갈릴 수 있는 컴포넌트로 `Filter`가 있다.
서블릿과 웹서버 사이에 있는 서블릿 컨테이너가 Servlet `(많은 경우 Dispatcher Servlet)` 실행 전, 후에 어떤 작업을 하고자 할때 사용할 수 있다.

::: code-group

```java [CustomInterceptorImpl.java]
public class CustomInterceptorImpl implements HandlerInterceptor{
	// controller로 보내기 전에 처리하는 인터셉터
	// 반환이 false라면 controller로 요청을 안함
	// 매개변수 Object는 핸들러 정보를 의미한다. ( RequestMapping , DefaultServletHandler ) 
	@Override
	public boolean preHandle(
			HttpServletRequest request, HttpServletResponse response,
			Object obj) throws Exception {
		
		System.out.println("preHandle");
		return false; // 반환값이 true 면 다음 체인이 실행됨. false면 실행 안됨
	}

	// controller의 handler가 끝나면 처리됨
	@Override
	public void postHandle(
			HttpServletRequest request, HttpServletResponse response,
			Object obj, ModelAndView mav)
			throws Exception {
	}

	// view resolve까지 처리가 끝난 후에 처리됨
	@Override
	public void afterCompletion(
			HttpServletRequest request, HttpServletResponse response,
			Object obj, Exception e)
			throws Exception {
	}
}
```

```java [InterceptOverride.java]
public class InterceptOverride extends HandlerInterceptorAdapter {
	@Override
	public boolean preHandle(
			HttpServletRequest request, HttpServletResponse response,
			Object obj) throws Exception {
		
		System.out.println("MyInterCeptor - preHandle");
		return true;
	}
}
```

:::
