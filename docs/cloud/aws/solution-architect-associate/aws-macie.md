# 2022-10-07 Question 6

정부 기관이 도시에서 인구와 주택 인구 조사를 실시하고 있다.
온라인 포털에 업로드된 각 가정 정보는 Amazon S3의 암호화된 파일에 저장됩니다.
정부는 규정 준수 표준을 충족하는 방식으로 개인 식별 정보(PII)가 포함된 데이터를 확인하는 규정 준수 정책을 설정하도록 솔루션 아키텍트를 배정했다.
그들은 또한 S3 버킷의 개인 정보 보호에 대한 잠재적인 정책 위반이 있는지 경고해야 합니다.

건축가가 이 요구 사항을 충족시키기 위해 다음 중 어느 것을 구현해야 합니까?

![aws_macie](https://user-images.githubusercontent.com/39899731/194449534-9e196eb9-e49e-4f52-be60-caf52c6fbcda.jpeg)


## AWS Macie [링크](https://aws.amazon.com/ko/macie/features/)

`Amazon Macie는` 완전관리형 데이터 보안 및 데이터 프라이버시 서비스로서, 기계 학습 및 패턴 일치를 활용하여 AWS에서 민감한 데이터를 검색하고 보호합니다.
S3 버킷의 개인 정보 보호에 대한 잠재적인 정책 위반을 모니터링 및 경고해야하기 때문에 `Amazon Macie`가 적절합니다.

## 지문 분석

- Amazon Kendra

  이 서비스는 기게 학습을 통해 제공되는 엔터프라이즈 검색 서비스입니다. 어플리케이션에 검색 기능을 추가하하여 시스템 전반에 걸쳐 많은 양의 컨텐츠를 검색할 수 있도록 해줍니다. S3, Microsoft SharePoint, Salesforce, RDS, Microsoft Onedrive 등 다양한 시스템를 찾아 볼 수 있습니다. 자연어 검색도 지원하여 줍니다.
  
- Amazon Fraud Detector

  이 서비스는 잠재적인 사기 행위를 식별하는 서비스입니다. 온라인 사기를 막기 위한 도구이며 `Amazon Macie`와 달리 개인 식별 정보(PII)를 포함한 데이터를 확인하지 않습니다.
  
- Amazon Polly

  이 서비스는 단순히 텍스트를 음성으로 변환하는 음성 지원 어플리케이션을 위한 서비스입니다. 폴리는 S3 데이터의 사용 패턴을 스캔하는데에 사용할 수 없습니다.

  
