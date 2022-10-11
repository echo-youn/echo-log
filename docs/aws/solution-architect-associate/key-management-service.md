# KMS

회사는 클라우드에 저장된 모든 데이터를 저장시 암호화 할 것을 요구한다. 이것을 다른 AWS 서비스와 쉽게 통합하려면 생성된 키의 암호화를 완전히 제어하고 AWS KMS에서 키 자료를 즉시 제거할 수 있어야 한다. 이 솔루션은 AWS CloudTrail과 독립적으로 주요 사용을 감사할 수 있어야 한다.

이 요구사항을 충족하는 옵션은 무엇인가요?

## Key Management Service

<img width="826" alt="지문" src="https://user-images.githubusercontent.com/39899731/194975335-39c55b50-5ac3-4c7c-9f1f-a90eb3522ee5.png">

AWS `Key Management Service`는 데이터를 보호하는데 사용하는 암호화 키를 쉽게 생성하고 제어할 수 있게 해주는 관리형 서비스다. AWS KMS는 FIPS 140-2 암호화 모듈 검증 프로그램에 따라 하드웨어 보안 모듈(HSM)을 사용하여 AWS KMS keys를 보호하고 검증한다. 

중국은 KMS 키를 보호하는데 사용하는 HSM은 모든 중국 규정을 준수 하나, FIPS 140-2 암호화 모듈 검증 프로그램에 따른 검증은 받지 않는다.

AWS KMS는 지정된 Amazon S3 버킷에 로그 파일을 전달하는 서비스인 AWS CloudTrail과 통합됩니다. CloudTrail을 사용하면 KMS 키가 언제 어떻게 사용되었는지, 누가 사용했는지 모니터링하고 조사할 수 있습니다.

### KMS 기능

- HMA를 포함한 대칭 및 비대칭 KMS 키를 생성,편집 및 확인한다.
- KMS 키를 활성화 및 비활성화할 수 있다.
- KMS 키의 암호화 구성요소 자동 교체를 활성화할 수 있다.
- 키 삭제가 가능하다.
- 암호화 작업에 KMS 키를 사용할 수 있다.
- KMS 키를 사용해 메세지를 서명하고 암호화 할 수 있다.
- 난수 생성이 가능하다.

## Explain

AWS KMS의 AWS CloudHSM의 `custom key store`에 저장되는 `CMK`를 만든다. 사용자의 vpc에서 관리되는 `Custom Key Store`과 CloudHSM를 통해 자료들을 암호화하고 검증한다.

![KMS & CloudHSM](https://user-images.githubusercontent.com/39899731/194975398-c0ffddc7-f8dd-4702-851c-4aca5c9a0454.png)

