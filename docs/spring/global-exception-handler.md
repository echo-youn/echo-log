# Global Exception Handler

스프링 부트에서 컨트롤러에서 발생하는 모든 예외를 처리해주는 AOP이다.

```kotlin
import jakarta.validation.ConstraintViolationException
import jakarta.validation.ValidationException
import org.apache.catalina.connector.ClientAbortException
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.annotation.Order
import org.springframework.http.HttpStatus
import org.springframework.http.InvalidMediaTypeException
import org.springframework.http.ResponseEntity
import org.springframework.security.web.firewall.RequestRejectedException
import org.springframework.web.HttpMediaTypeNotAcceptableException
import org.springframework.web.HttpRequestMethodNotSupportedException
import org.springframework.web.bind.MissingRequestHeaderException
import org.springframework.web.bind.MissingServletRequestParameterException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException

// @RestControllerAdvice
// @Order(0)
@ControllerAdvice
class GlobalExceptionHandler() {
    private val log = LoggerFactory.getLogger(this.javaClass)
    
    @ExceptionHandler(Exception::class)
    fun handleException(e: Exception): ResponseEntity {
        SlackLogger.error("Exception (profile: $activeProfile)", e)

        return ResponseEntity(
            e.message,
            HttpStatus.INTERNAL_SERVER_ERROR
        )
    }

    @ExceptionHandler(
        value = [
            ConstraintViolationException::class,
            MissingRequestHeaderException::class,
            MethodArgumentTypeMismatchException::class,
            ValidationException::class,
            MissingServletRequestParameterException::class,
            ClientAbortException::class,
            IllegalArgumentException::class,
            RequestRejectedException::class,
            HttpMediaTypeNotAcceptableException::class,
            InvalidMediaTypeException::class
        ]
    )
    fun handleInvalidParameterException(e: Exception): ResponseEntity {
        log.error("${e::class.simpleName}: ${e.message}")
        return ResponseEntity(
            e.message,
            HttpStatus.BAD_REQUEST
        )
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException::class)
    fun handleHttpMethodNotSupportedException(e: Exception): ResponseEntity {
        log.error("${e::class.simpleName}: ${e.message}")
        return ResponseEntity(
            e.message,
            HttpStatus.FORBIDDEN
        )
    }
}
```
