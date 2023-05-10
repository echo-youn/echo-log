# Custom Annotation & Aspect

```kotlin [FeatureAvailableAspect]
package n.m.p.aspect

import n.m.p.FeatureAvailabilityService
import n.m.p.annotations.FeatureAvailable
import org.aspectj.lang.JoinPoint
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Before
import org.springframework.core.annotation.Order
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.server.ResponseStatusException

@Order(1)
@Aspect
@Component
class FeatureAvailableAspect(
    private val featureAvailabilityService: FeatureAvailabilityService
) {
    @Before(value = "@annotation(featureAvailable)", argNames = "featureAvailable")
    fun beforeRunRequest(joinPoint: JoinPoint, featureAvailable: FeatureAvailable): JoinPoint {
        return featureAvailabilityService.listFeatureAvailabilities(setOf(featureAvailable.key))
            .takeIf { it.isNotEmpty() && it.first().isAvailable }?.let {
                joinPoint
            } ?: throw ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "꺼져있는 기능입니다.")
    }
}
```

```kotlin [FeatureAvailableAnnotation]
package n.m.p.annotations

@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
annotation class FeatureAvailable(
    val key: Long
)
```
