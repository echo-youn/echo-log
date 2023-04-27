# Web Filter
서블릿과 웹서버 사이에 있는 서블릿 컨테이너가 Servlet`(많은 경우 Dispatcher Servlet)` 실행 전, 후에 어떤 작업을 하고자 할때 사용할 수 있다.
헷갈릴 수 있는 컴포넌트로 `Interceptor(Handler Interceptor)`가 있다.
이는 `HandlerMapping`이 끝난 후 해당 `Servlet`에 접근할때 어떤 작업을 할때 사용하는 것이다.

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

```txt [result]
23:54:38 INFO  com.spring.demo.TransactionFilter - Starting Transaction for req :/users
23:54:38 INFO  c.s.d.RequestResponseLoggingFilter - Logging Request  GET : /users
...
23:54:38 INFO  c.s.d.RequestResponseLoggingFilter - Logging Response :application/json;charset=UTF-8
23:54:38 INFO  com.spring.demo.TransactionFilter - Committing Transaction for req :/users
```

:::
