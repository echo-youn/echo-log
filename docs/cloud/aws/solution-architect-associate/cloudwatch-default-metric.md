# cloudwatch-default-metric

## Question

![문제](https://user-images.githubusercontent.com/39899731/194814054-cc39ff2a-1a19-4eb7-a0b5-3a95178dc806.PNG)

## Explain

CloudWatch에는 모니터링 할 수 있는 Amazon EC2 메트릭이 있다. CPU 사용률, 네트워크 수신 및 발신 트래픽양, 디스크 읽기 매트릭 이 있다. 그러나 메모리 활용도, 디스크 공간 활용도 등은 사용자 지정 메트릭을 설정하여 사용할 수 있다.

Perl로 작성된 CloudWatch 모니터링 스크립트를 사용하여 사용자 지정 매트릭을 준비해야한다. 그리고 CloudWatch 에이전트를 설치해 EC2 인스턴스에서 더 많은 시스템 수준의 매트릭을 수집할 수 있다. 다음은 사용자가 설정할 수 있는 사용자 지정 매트릭 목록이다.

- Memory utilization
- Disk swap utilization
- Disk space utilization
- Page file utilization
- Log collection
