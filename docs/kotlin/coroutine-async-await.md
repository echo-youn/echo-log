# 코루틴 Async Await

## 서브루틴

책에서 서브루틴이란 개념을 다음과 같이 설명하고 있다.

`서브루틴`은 여러 명령어를 모아 이름을 부여해 반복 호출할 수 있게 정의한 프로그램의 구성요소이다. 다른말로 `함수`라고 부른다. 서브루틴에 진입하는 방법은 한가지이며 그때마다 활성 레코드(activation record)가 스택에 할당되면서 서브루틴 내부의 로컬 변수 등이 초기화 된다.

진입점은 하나인 반면 반환점은 여러개가 있기 때문에 서브루이 실행을 중단하고 제어권를 호출한쪽(caller)에게 돌려주는 지점은 여럿 있을 수 있다. 대신 일단 서브루틴에서 제어권을 반환하고 나면 활성레코드가 스택에서 사라지기 때문에 실행 중이던 모든 상태를 잃어버린다.

그래서 서브루틴을 여러 번 반복 실행해도 항상 같은 결과를 반복해서 얻게 된다.

::: details 활성 레코드와 PCB

책을 읽으면서 운영체제의 PCB와 서브루틴의 활성 레코드가 비슷한 개념같아서 찾아보게 되었다.

PCB는 운영체제에서 프로세스를 관리하는 데 사용되는 자료구조로, 프로세스의 상태(State), 우선순위(Priority), 레지스터 값(Register Values), 자원(Resource) 사용 정보 등의 정보를 저장합니다.

반면, 서브루틴의 활성 레코드는 서브루틴(Subroutine)이 실행되는 동안 사용되는 데이터를 저장하는 자료구조로, 레지스터 값(Register Values)과 서브루틴에서 사용하는 변수(Variables) 등의 정보를 저장합니다.

두 개념은 모두 프로그램 실행 중에 동적으로 생성되는 자료구조로, 프로그램 실행을 제어하고, 관리하는 데 사용됩니다. 그러나 PCB는 프로세스를 관리하는 데 사용되고, 서브루틴의 활성 레코드는 서브루틴에서 사용되는 데이터를 저장하는 데 사용됩니다. 따라서, 두 개념은 서로 다른 개념입니다.

:::


## 비선점형 멀티태스킹

멀티태스킹이랑 사용자에게 여러 작업을 동시에 수행하는 것처럼 보이거나 실제로 동시에 수행하는 것이다. `비선점형`이란 멀티태스킹의 기존에 적업을 수행하는 참여자들의 실행을 운영체제가 강제로 일시 중단시키고 다른 참여자를 실행하게 만들 수 없다는 뜻이다. 따라서 각 참여자들이 서로 자발적으로 협력해야만 비선점형 멀티태스킹이 정상적으로 동작할 수 있다.

## 코루틴

따라서 `코루틴`이란 서로 협력해 제어권을 주고 받으면서 작동하는 서브루틴을 말한다. 코루틴의 대표격인 제너레이터(generator)를 예로 들면, 함수 A가 실행되다가 제너레이터인 코루틴 B를 호출하면 A가 실행되던 스레드 안에서 코루틴 B가 실행된다. 코루틴 B는 실행을 진행하다가 제어권을 A에게 양보한다. (yield 라는 명령어를 사용하는 경우가 많다.) A는 다시 코루틴B를 호출했던 바로 다음 부분부터 실행을 계속 진행하다가 또 코루틴 B를 호출한다. 이때 일반적인 함수였다면 로컬 변수를 초기화하면서 처음부터 실행을 다시 실행하겠지만, 코루틴이면 이전에 yield로 실행을 양보했던 지점부터 실행을 계속하게 된다.

코루틴을 사용하는 경우 장점은 일반적인 프로그램 로직을 기술하듯 코드를 작성하고 상대편 코루틴에 데이터를 넘겨야 하는 부분에서만 yield를 사용하면 된다는 점이다.

## kotlinx.coroutines.CoroutineScope.launch

`launch`는 코루틴을 `Job`으로 반환하고 만들어진 코루틴은 기본적으로 즉시 실행된다. 원한다면 launch가 반환한 Job의 `cancle()`을 호출해 코루틴을 중단시킬 수 있다.

launch가 작동하려면 `CoroutineScope`객체가 `this`로 지정되어 있어야 한다. launch가 실행될 곳이 suspend 함수 내부라면 해당 함수가 사용 중인 CoroutineScope가 있겠지만 그렇지 않은경우 `GlobalScope`를 사용하면 된다.

```kotlin
private fun log(msg: String) = println("${now()}: ${Thread.currentThread()}: $msg")

@OptIn(DelicateCoroutinesApi::class)
fun launchInGlobalScope() {
    GlobalScope.launch {
        delay(2000)
        log("1")
    }
}

@Test
fun main() {
    log("main() started")
    launchInGlobalScope()
    log("Executed")
    Thread.sleep(3000) // 메인스레드가 실행중인 동안만 코루틴의 동작을 보장해준다. 만약 delay의 시간보다 짧으면 코루틴의 log("1")은 실행되지 못한다.
    log("main() Finished")
}

>> 2023-03-08T13:08:51.536249700Z: Thread[main,5,main]: main() started
>> 2023-03-08T13:08:51.665248500Z: Thread[main,5,main]: Executed
>> 2023-03-08T13:08:53.691276Z: Thread[DefaultDispatcher-worker-1 @coroutine#1,5,main]: 1
>> 2023-03-08T13:08:54.679022700Z: Thread[main,5,main]: main() Finished
```
여기서 주목할 점은 메인함수와 `GlobalScope.launch`가 만들어낸 코루틴이 서로 다른 스레드에서 실행된다는 점이다.
GlobalScope는 메인 스레드가 실행 중인 동안만 코루틴의 동작을 보장해준다. 

`launchInGlobalScope()`가 호출한 launch는 스레드가 생성되고 시작되기 전에 메인스레드의 제어권(Blocking)을 다시 main()에 돌려주기 때문에 메인스레드에서 코루틴이 실행되기 기다려주지 않으면 메인스레드가 종료되어 프로그램 전체가 종료돼 버린다. 그래서 GlobalScope를 사용할 때는 조심해야 한다.

이를 방지하려면 비동기적으로 launch를 실행하거나 CoroutineScope 안의 launch가 모두 다 실행될때까지 기다려야한다. 코루틴의 실행이 끝날 때 까지 현재 스레드를 블록시키는 함수 `runBlocking()`가 있다. runBlocking은 CoroutineScope의 확장 함수가 아닌 일반 함수이기 때문에 별도의 코루틴 스코프 객체 없이 사용가능하다.

```kotlin
private fun runBlockingExample() {
    runBlocking {
        launch {
            log("GlobalScope.launch started")
        }
    }
}

@Test
fun main() {
    log("main() started")
    runBlockingExample()
    log("Executed")
    Thread.sleep(3000)
    log("main() Finished")
}

>> 2023-03-08T13:17:25.160760600Z: Thread[main,5,main]: main() started
>> 2023-03-08T13:17:25.309760600Z: Thread[main @coroutine#2,5,main]: GlobalScope.launch started
>> 2023-03-08T13:17:25.309760600Z: Thread[main,5,main]: Executed
>> 2023-03-08T13:17:28.322028700Z: Thread[main,5,main]: main() Finished
```

여기서 주목할만한 점은 스레드가 모두 main 스레드라는 점이다. 이 코드만 봐서는 딱히 스레드나 다른 비동기 도구와 다른 장점을 찾아볼 수 없지만, 코루틴들은 서로 `yield()`를 해주면서 서로 협력하고 있다.

다음 예를 살펴보자.

```kotlin
    private fun yieldExample() {
        runBlocking {
            launch {
                log("1")
                yield()
                log("3")
                yield()
                log("5")
                yield()
            }
            log("after first launch")
            launch {
                log("2")
                delay(2000)
                log("4")
                delay(2000)
                log("6")
            }

            log("after second launch")
        }
        log("after runBlocking")
    }

    @Test
    fun main() {
        log("main() started")
        yieldExample()
        log("Executed")
        Thread.sleep(3000)
        log("main() Finished")
    }

>> 2023-03-08T13:27:01.662351900Z: Thread[main,5,main]: main() started
>> 2023-03-08T13:27:01.788349Z: Thread[main @coroutine#1,5,main]: after first launch
>> 2023-03-08T13:27:01.793349200Z: Thread[main @coroutine#1,5,main]: after second launch
>> 2023-03-08T13:27:01.796349500Z: Thread[main @coroutine#2,5,main]: 1
>> 2023-03-08T13:27:01.798349600Z: Thread[main @coroutine#3,5,main]: 2
>> 2023-03-08T13:27:01.805348900Z: Thread[main @coroutine#2,5,main]: 3
>> 2023-03-08T13:27:01.805348900Z: Thread[main @coroutine#2,5,main]: 5
>> 2023-03-08T13:27:03.808410100Z: Thread[main @coroutine#3,5,main]: 4
>> 2023-03-08T13:27:05.816112500Z: Thread[main @coroutine#3,5,main]: 6
>> 2023-03-08T13:27:05.822093500Z: Thread[main,5,main]: after runBlocking
>> 2023-03-08T13:27:05.823094400Z: Thread[main,5,main]: Executed
>> 2023-03-08T13:27:08.837834Z: Thread[main,5,main]: main() Finished
```

로그를 보면 다음을 알 수 있다.
- launch는 즉시 반환된다. (async, non-blocking)
- runBlocking은 내부 코루틴이 모두 끝난 뒤 반환된다. (sync, non-blocking)
- delay()를 사용한 코루틴은 그 시간이 지날때 까지 다른 코루틴에게 제어권을 양보한다. (yield())
  앞 코드에서 `delay` 대신 `yield`를 쓰면 차례대로 1,2,3,4,5,6 이 표시될 것이다.
  그리고 첫번째 launch에서 yield를 두번이나 했지만 두번째 launch에서 delay 상태였기 때문에 다시 제어권이 첫번째 코루틴에게 돌아왔다는 것이다.


## kotlinx.coroutines.CoroutineScope.async

`async`는 사실 launch와 같은일을 한다. 다른점은 launch는 `Job`을 반환하는 반면 async는 `Deffered`를 반환한다. 심지어 Deffered는 Job을 상속한 클래스이기 때문에 launch 대신 async를 사용해도 항상 아무 문제가 없다. 실제로 두 함수의 구현을 보면 거의 똑같다.

Deffered와 Job의 차이는 Job은 아무 파라미터가 없는데 Deffered는 타입 파라미터가 있는 제네릭 타입이다. Deffered안에는 `await()` 함수가 정의되어있다.
Deffered의 타입 파라미터는 코루틴이 계산하고 돌려주는 값의 타입이다. Job은 Unit을 반환하는 `Deffered<Unit>`이라고 볼수도 있다.

따라서 async는 코드 블록을 비동기로 실행할 수 있고(제공하는 코루틴 컨텍스트에 따라서 여러 스레드를 사용하거나 한 스레드안에서 제어만 왔다갔다 할 수 있다.), async가 반환하는 Deffered의 await()를 사용해서 코루틴이 결과를 내놓을 때 까지 기다렸다가 결과값을 얻어낼 수 있다.

다음은 1부터 3까지 수를 더하는 과정을 async/awiat를 사용해 처리하는 모습을 보여준다.

```kotlin
fun sumAll() {
    runBlocking {
        val d1 = async { delay(1000L); log("d1 done!"); 1 }
        log("after async(d1)")
        val d2 = async { delay(1000L); log("d2 done!"); 2  }
        log("after async(d2)")
        val d3 = async { delay(10000L); log("d3 done!"); 3 }
        log("after async(d3)")

        log("1+2+3 = ${ d1.await() + d2.await() + d3.await() }")
        log("after await all & add")
    }
}

>> 2023-03-08T13:43:39.703883900Z: Thread[main @coroutine#1,5,main]: after async(d1)
>> 2023-03-08T13:43:39.734887Z: Thread[main @coroutine#1,5,main]: after async(d2)
>> 2023-03-08T13:43:39.735889100Z: Thread[main @coroutine#1,5,main]: after async(d3)
>> 2023-03-08T13:43:40.759801900Z: Thread[main @coroutine#2,5,main]: d1 done!
>> 2023-03-08T13:43:40.761800300Z: Thread[main @coroutine#3,5,main]: d2 done!
>> 2023-03-08T13:43:49.751558300Z: Thread[main @coroutine#4,5,main]: d3 done!
>> 2023-03-08T13:43:49.770588200Z: Thread[main @coroutine#1,5,main]: 1+2+3 = 6
>> 2023-03-08T13:43:49.771575400Z: Thread[main @coroutine#1,5,main]: after await all & add
```

d1, d2, d3를 순서대로(병렬 처리에서 이런 경우를 직렬화해 실행한다고 한다.) 실행하면 총 12초이상이 걸려야한다. 그러나 결과를 얻기까지 10초만 걸렸다. 또한 async 코드를 실행하는데 시간이 거의 걸리지 않았음을 알 수 있다. 게다가 스레드를 여럿 사용하는 병렬 처리(Spring async)와 달리 모든 async 함수르들이 메인 스레드 안에서 실행됨을 볼 수 있다. 이 부분이 `async/await`와 스레드를 사용한 병렬 처리의 큰 차이다.

실행하려는 작업이 시간이 얼마 걸리지 않거나 I/O에 의한 대기시간이 크고, CPU 코어수가 작아 동시에 실행할 수 있는 스레드가 적은 경우에 `코루틴`과 `일반 스레드를 이용한 비동기 처리`와의 차이가 커진다.

## 코루틴 컨텍스트와 디스패처

launch와 async 등은 모두 CoroutineScope의 확장 함수다. 그런데 CoroutineScope에는 CoroutineContext 타입의 필드 하나만 들어있다. 사실 CoroutineScope는 CoroutineContext 필드를 launch 등의 확장 함수 내부에서 사용하기 위한 매개체 역할만을 담당한다. 원한다면 launch 등에 CoroutineContext를 넘길 수도 있는 점에서 실제로는 CoroutineScope보다 CoroutineContext가 코루틴 실행에 더 중요한 의미가 있음을 유추할 수 있다.

CoroutuneContext는 실제로 코루틴이 실행 중인 려어 작업(Job 타입)과 디스패처를 저장하는 일종의 맵이라 할 수 있다. 코틀린 런타임은 이 CoroutineContext를 사용해 다음에 실행할 작업을 선정하고 어떻게 스레드에 배정할지 방법을 정한다.

코틀린 가이드 문서에서 가져온 예를 runBlocking 안에 넣은 예제를 살펴보자.

```kotlin
fun coroutineDispatcherExample() {
    runBlocking {
        launch {
            log("main")
        }


        launch(Dispatchers.IO) {
            log("IO")
        }

        launch(Dispatchers.Unconfined) {
            log("Unconfined")
        }

        launch(Dispatchers.Default) {
            log("Default")
        }

        launch(newSingleThreadContext("MyOwnThread")) {
            log("MyOwnTread")
        }
    }
}

>> 2023-03-08T14:27:39.232155100Z: Thread[main @coroutine#4,5,main]: Unconfined
>> 2023-03-08T14:27:39.232155100Z: Thread[DefaultDispatcher-worker-1 @coroutine#3,5,main]: IO
>> 2023-03-08T14:27:39.261153500Z: Thread[DefaultDispatcher-worker-1 @coroutine#5,5,main]: Default
>> 2023-03-08T14:27:39.268155800Z: Thread[MyOwnThread @coroutine#6,5,main]: MyOwnTread
>> 2023-03-08T14:27:39.269154700Z: Thread[main @coroutine#2,5,main]: main
```

같은 launch를 사용해도 전달하는 컨텍스트에 따라 서로 다른 스레드상에서 코루틴이 실행됨을 알 수 있다.

## 코루틴 빌더와 일시중단 함수

지금까지 살펴본 launch나 async, runBlocking은 모두 `코루틴 빌더`라고 불린다. 이들은 코루틴을 만들어주는 함수다. 책에서 소개하는 코루틴 빌더는 2가지 더 있는데 다음과 같다.

- produce
  정해진 채널로 데이터를 스트림으로 보내는 코루틴을 만든다. 이 함수는 `ReceiveChannel<>`을 반환한다. 그 채널로부터 메세지를 전달받아 사용할 수 있다.
- actor
  정해진 채널로 메세지를 받아 처리하는 액터를 코루틴으로 만든다. 이 함수가 반환하는 `SendChannel<>` 채널의 `send()` 메소드를 통해 액터에게 메세지를 보낼 수 있다.

한편 `delay()`와 `yield()`는 코루틴 안에서 특별한 의미를 지니는 함수들이다. 이런 함수를 일시중단 함수(`suspending function`)이라 부른다. 이 함수 외에 다른 일시 중단 함수들이 있다.

- withContext(): 다른 컨텍스트로 코루틴을 전환한다.
- withTimeout(): 코루틴이 정해진 시간안에 실행되지 않으면 예외를 발생시킨다.
- withTimeoutOrNull(): 코루틴이 정해진 시간안에 실행되지 않으면 null을 결과로 돌려준다.
- awaitAll(): 모든 작업의 성공을 기다린다. 작업 중 어느 하나가 예외로 실패하면 awaitAll도 예외를 발생시킨다.
- joinAll(): 모든 작업이 끝날 때 까지 현재 작업을 일시 중단시킨다.

## suspend 키워드와 코틀린의 일시 중단함수 컴파일 방법


 
