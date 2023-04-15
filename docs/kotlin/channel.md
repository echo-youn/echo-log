# Kotlin channel

어느날 다량의 데이터를 외부 API를 호출해 결과를 갖고 가공해 저장해야하는 일이 생겼다.

처음엔 파이썬 스크립트를 사용해 진행하려고 단순하게 생각했다.

그러나 데이터는 대략 백만건으로 API가 건당 20ms의 응답속도를 갖는다 쳐도 전부 다 호출하기 위해서 20,000,000ms로 5시간 반 정도 걸렸다...

그래서 비동기로 여러 쓰레드로 돌리고자 여러 솔루션을 다시 생각해보게 됐는데, 내가 생각한 솔루션의 조건은 다음과 같았다.

1. 병렬적으로 실행
2. 중간에 오류가 발생할경우 핸들링 가능해야함
3. csv 파일을 읽어들여 API 호출 후 csv 파일로 쓰기
4. 실행 중간 속도 제어

최근들어 코틀린에 대해 공부하고 친해지고 있는 중이어서 코틀린으로 해결할 수 있는 솔루션을 찾게 되었다.

나는 csv 파일을 읽어들여 큐에 탑재하고 여러 쓰레드가 그 큐를 읽어들이는 방식으로 처리하고자 했다.

여러 Consumer가 큐에서 데이터를 뽑아가 처리하는 방식을  `Fan-out`이라고 하더라~

그래서 큐로 사용할만한 구현체를 찾던 중 `ArrayBlockingQueue`를 찾게 되었는데 딱 내가 원하던 구현체였다.

우선 쓰레드-세이프하고 큐에 접근했을때 락을 걸어 문제가 생길 여지가 없다.

더 나은 큐로 `ConcurrentLinkedQueue`로 이는 `non-blocking`에 위와 같은 기능을 제공해준다.

이제 개발하려던 찰나에 코틀린에 비슷한 기능을 하는 `Channel`이라는 구현체가 있어 이왕 하는김에 코틀린으로 하지 뭐~ 해서 Channel을 사용하게 되었다.


## 특징

공식 문서에서는 `Channel`을 `BlockingQueue`와 비교를 많이하고 있다.

Channel은 BlockingQueue의 blocking put 대신 suspending send를 사용하고 blocking take 대신 suspending receive를 한다고 강조한다.

그리고 사용법이 굉장히 편하다.

채널은 큐와 다르게 큐에 더이상 데이터가 제공되지 않음을 `closed`상태로 나타낼 수 있습니다.
그래서 Consumer 쪽에서 일반 for 반복문을 사용해 채널에서 요소를 수신하는 방법을 사용할 수 있습니다.

<iframe src="https://pl.kotl.in/I2fv_VS3A?theme=darcula"></iframe>

공식 문서에 잘 설명이 나와있으니 더 자세한 내용은 살펴보면 될것 같고 제가 이번에 구현한 코드에 대해 공유하겠습니다.

## 구현

```kotlin
import com.github.doyaaaaaken.kotlincsv.client.CsvReader // kotlin-csv 라이브러리 사용
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*
import kotlinx.coroutines.flow.asFlow
import java.io.File

fun main(args: Array<String>) = runBlocking {
    val channel = Channel<Int>(20)
    dataProducer(channel)

    repeat(5) {
        launchProcessor(it, channel)
    }
}

fun CoroutineScope.launchProcessor(id: Int, channel: ReceiveChannel<Int>) = launch {
    for (i in channel) {
        println("#$id number: $i") // 여기에 채널에서 데이터를 가져와 처리하는 로직을 구현하면 된다.
        delay(1500) // Consumer 속도 조절
    }
}

fun CoroutineScope.dataProducer(channel: SendChannel<Int>) = launch {
    val path = javaClass.classLoader.getResource("my.csv")?.path ?: throw Exception("ex") // 파일 읽기 실패
    val file = File(path)
    CsvReader().openAsync(file) {
        readAllWithHeaderAsSequence().asFlow().collect {row ->
            row["id"]?.toInt()?.let {
                channel.send(it)
            }
            delay(1000) // 읽기 속도 조절
        }
        channel.close() // channel을 닫아줘야 processor(Consumer)가 더이상 대기하지 않는다.
    }
} 
```

1개의 프로듀서가 파일을 읽어 큐(채널)에 데이터를 탑재하고 여러 컨슈머들이 이를 처리하는 로직을 만들었습니다
컨슈머내의 동작을 non-blocking로 구현해야 효과적입니다~

비록 호출한 API의 호스트에게는 의도치않은 디도스 공격이었을 수도 있지만 결과적으론 문제 없이 빠르게 잘 처리했습니다
