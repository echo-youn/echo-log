# 
https://engineering-skcc.github.io/cloud/tomcat/apache/performancetest/MySqlDBWaitTimeOut/

MySql/MariaDB에서 발생하는 Connection 끊김 문제 해결하기

Cloud의 Tomcat에 설정되어 있던 MySQL DB Connection Pool을 사용하려던 프로그램에서 “Communication Link Failue”에러가 발생하면서 약 930초 대기 현상이 발생한다.
이러한 현상이 모든 POD의 Tomcat에서 모두 돌아가면서 발생한다.
모든 DB Pool이 에러가 발생하는 것은 아니며 일부 DB Connection 연결 시 현상이 발생하고 있다.
왜 일정 시간이 지나면 DB Connection의 연결이 끊기는 것인지 그리고 DB와 WAS 외에 다른 문제가 있는 것인지 그 원인을 알아보기로 한다.


MySQL DB Connection Pool 연결 실패 에러Permalink


APM Jennifer Active Thread에 7개의 트랜잭션이 응답지연으로 인한 빨간색 상태가 확인되어 상세보기로 들어가보니 응답시간이 600초 이상인데 종료되지 않고 Validation Query를 수행하고 결과 대기 중인 것으로 확인이 되었다.
이후 약 930초 정도가 지나자 해당 트랜잭션들이 종료되어 X-View에 에러로 표시된다.
다른 POD의 WAS에서도 동일한 현상들이 계속 확인된다.


DB Connection Pool 연결 대기 및 실패 에러





SQLException-연결 실패

에러 내용을 확인하니 다음과 같은 메시지가 보인다.

```
com.mysql.jdbc.exceptions.jdbc4.CommunicationsException: Communications link failure

com.mysql.jdbc.exceptions.jdbc4.CommunicationsException: The last packet successfully received from the server was 39,196,147 milliseconds ago.
The last packet sent successfully to the server was 39,196,154 milliseconds ago. is longer than the server configured value of 'wait_timeout'. 
You should consider either expiring and/or testing connection validity before use in your application, increasing the server configured values for client timeouts, or using the Connector/J connection property 'autoReconnect=true' to avoid this problem.
```


기존에 자주 보던 DB Connection 연결 실패 에러는 WAS와 DB 사이의 방화벽 등에서 Idle 상태인 DB Connection을 끊어 버리고 WAS의 DB Connection Pool에서는 끊김 상태를 인지하지 못해 새로운 DB Connection 연결 요청 시 이미 끊긴 Pool을 제공하여 트랜잭션 처리 시 에러가 발생하는 경우가 가장 흔한 유형의 에러였다.
하지만 위 에러 메시지를 보면 이번에는 연결을 끊어 버리는 주체가 다른 네트워크 장비 등이 아니라 MySql DB서버로 확인된다.
일정 시간 동안 Idle인 DB Connection에 대해 MySql서버에서 강제로 연결을 끊어 버리는 것이다.
연결을 끊어 버리는 기준이 되는 “wait_timeout”의 설정은 다음과 같다.


설정	설명
wait_timeout	Idle 상태인 Connection을 끊을 때까지 서버가 대기하는 시간(default 28800초 = 8시간)



wait_timeout 설정값 조회 및 변경하기

wait_timeout 설정값의 조회와 변경은 아래와 같이 가능하지만 변경은 권장하지 않는다.
DB Connection Pool의 연결이 8시간 이상 Idle인 상태라면 연결을 유지하는 것보다는 해당 연결을 정리하고 필요 시에 다시 연결하는 것이 DB에 불필요한 자원 낭비를 줄일 수 있기 때문이다.
이번 문제 해결 후 다른 사이트를 지원하는 과정에서 실제로 wait_timeout값을 60초로 작게 변경하여 DB Connection Pool이 계속 유실되는 현상이 발생한 사례가 있다.
따라서 해당 설정은 default 설정을 유지하는 것을 권장한다.

- wait_timeout 설정값 조회

DB서버 접속 후 아래 명령어를 수행

show variables like '%timeout
- wait_timeout 설정값 변경
  설정값 변경 후에는 DB를 재시작 필요함

1. Command Line 명령어로 Parameter 설정값 변경
  set global wait_timeout = 대기시간(초)
  set session wait_timeout = 대기시간(초)

1. my.cnf 파일에서 설정값 변경(MariaDB의 경우는 50-server.cnf 파일)
  wait_timeout = 대기시간(초)




autoReconnect 설정

에러 메시지에는 연결 끊김 현상을 피하기 위해 DB Connection URL에 다음 “autoReconnect=true”설정을 추가할 것을 권장하고 있다.
그렇다면 해당 설정을 추가하면 연결 끊김 현상을 해결할 수 있는 것일까?
우선 해당 설정에 대해 상세한 설명을 확인해 보자.
아래 설명을 확인해 보면 해당 설정을 사용하는 것을 추천하지 않고 있다.
그 이유는 다음과 같다.
autoReconnect 설정은 DB Connection에 문제가 있으면 단순히 재접속할 수 있도록 해주지만 문제는 수행 중이던 트랜잭션에 대해서는 일관성 보장을 해주지 않는다.
따라서 데이터 일관성을 보장할 수 없으므로 수행 중이던 애플리케이션에 대한 트랜잭션에 대한 직접 예외 처리를 할 수 없다면 사용하지 않기를 권장한다고 명시하고 있다.

설정	설명
autoReconnect	Should the driver try to re-establish stale and/or dead connections? If enabled the driver will throw an exception for a queries issued on a stale or dead connection, which belong to the current transaction, but will attempt reconnect before the next query issued on the connection in a new transaction. The use of this feature is not recommended, because it has side effects related to session state and data consistency when applications don’t handle SQLExceptions properly, and is only designed to be used when you are unable to configure your application to handle SQLExceptions resulting from dead and stale connections properly. Alternatively, investigate setting the MySQL server variable “wait_timeout” to some high value rather than the default of 8 hours.



DBCP 설정으로 문제 해결하기Permalink

위의 MySql 서버 설정과 Connection 설정으로는 근본적인 문제해결이 어렵거나 Side Effect가 발생할 가능성이 있었다.
따라서 현재 사용 중인 DBCP Connection Pool의 설정을 최적화 하여 해당 문제를 해결해 보기로 한다.
Idle 상태인 DB Connection Pool이 MySql서버에서 강제로 정리되지 않도록 하기 위해서는 DBCP의 testWhileIdle와 validationQuery 설정을 활용하기로 한다.


testWhileIdle와 validationQuery 설정 활용하기Permalink
testWhileIdle와 validationQuery의 권장되는 설정은 아래와 같다.

설정	설명
testWhileIdle	true (default false)
validationQuery	select 1
timeBetweenEvictionRunsMillis	3600000(1시간). validationQuery를 수행할 주기. Evictor 스레드가 동작하는 간격. (default -1. Evictor 스레드의 실행이 비활성화됨)

참고) initialSize와 maxActive, maxIdle, minIdle 항목은 동일한 값으로 설정하는 것을 권장한다.



위 설정을 적용하면 1시간 마다 validationQuery(selcet 1)을 수행하도록 함으로써 DB Connection Pool의 Idle 상태 전환을 사전에 방지해 MySql서버에서 Connection을 강제로 끊지 않도록 한다.
단, DB Connection Pool의 갯수가 많은 경우 모든 Connection에 대해 Idle 상태 검증 및 ValidationQuery를 수행할 수 있도록 timeBetweenEvictionRunsMillis를 좀 더 짧게 설정하는 것을 권장한다.
또한 설정된 Pool의 갯수가 사용량 대비 지나치게 크다면 갯수를 줄이는 것도 검토해 보아야 한다.



DB Connection Pool 문제를 해결하고…Permalink

DB Connection Pool을 사용하는 이유는 DB 접속 시 발생하는 지연을 최소화해서 성능을 개선하기 위한 목적을 가지고 있다.
그 만큼 WAS의 성능에서 중요한 요소이기도 하지만 최적화되지 않은 설정을 사용할 경우에는 오히려 성능을 저하시키거나 장애까지 유발하는 경우를 종종 볼 수 있다.
이처럼 발생하는 문제는 대부분 설정만 잘 조정하면 쉽게 해결될 수 있는 경우가 대부분이다.
시스템에 최적화된 설정을 조율하는 작업은 많은 시행착오와 경험이 요구되는 일이다.
전문적인 튜닝 경험 없이 무턱대고 설정을 변경하다보면 서로 상쇄되는 설정을 하기도 하고 누가 왜, 무엇 때문에 설정을 변경했는지도 모를 때가 있다.
왜 문제가 발생하고 있는지를 점점 더 알기 어려울 수도 있다.
따라서 성능 최적화가 필요하다면 성능 전문가 그룹 SWAT 파트에 요청하기를 추천한다.