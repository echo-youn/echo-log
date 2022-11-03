# AWS 주요 서비스
AWS를 공부하고 사용하기에 앞서 어떤 서비스가 있는지 전반적으로 살펴보고자 글을 작성합니다.

AWS 홈페이지에서 제품 - 주요서비스 메뉴에서 제품 카테고리 별로 서비스를 정리해봅니다.

실무에서 활용해 본 경험이 있거나 자주 쓸 것 같은 서비스에는 "*"로 마킹합니다.

## Compute Services
- *Amazon EC2
- *Amazon EC2 Auto Scaling
  - EC2 Instance에 대해서만 오토스케일링 하는 기능
- [*Amazon EC2 Spot Instance](https://aws.amazon.com/ec2/spot/)
  -  EC2 인스턴스를 온디멘드 가격에 할인된 가격으로 사용할 수 있는 가성비 갑 서비스
- *Amazon Elastic Container Service (ECS)
  - 컨테이너화된 워크로드를 쉽게 배포할 수 있는 서비스
  - 기본적으로 Fargate를 이용하여 서버리스로 처리
  - ECS Anywhere를 이용하여 온프레미스 환경에서도 관리 가능
- *AWS Lambda
  - Amazon RDS Proxy를 사용하여 RDS에 연결 가능
- *Amazon Lightsail
- *AWS Batch
- AWS VMware Cloud on AWS
- [*AWS Fargate](https://aws.amazon.com/fargate)
  - 서버리스 컴퓨터
  - Fagate spot도 있음
- [*AWS Auto Scaling](https://aws.amazon.com/autoscaling/)
    - Amazon EC2 Auto Sacling와 결합하여 다른 AWS 서비스의 추가 리소스를 조정할 수 있음.
    - EC2, EC2 Spot Fleets, ECS, DynamoDB, Aurora 등...
- AWS Serverless Application Repository
- Amazon Elastic Kubernetes Service (EKS) 
- AWS Compute Optimizer
- AWS Wavelength
- AWS Outposts
- AWS Elastic Beanstalk
- AWS App Runner

## Containers Services
- *Amazon Elastic Container Service (ECS)
- [*Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/)
  - 컨테이너 이미지 저장소, 컨테이너 워크로드에서는 매우 유용할 것으로 보임
  - CI/CD가 매우 용이함
- *AWS Fargate

## Database Services
- [*Amazon RDS](https://aws.amazon.com/rds/features/)
  - EC2 인스턴스에 생성되기 때문에 성능이 제한될 수 있음
- *Amazon ElasticCache
- [*Amazon DynamoDB](https://aws.amazon.com/dynamodb/features/)
  - Nosql DB
- *Amazon Redshift
- [*Amazon Aurora](https://aws.amazon.com/rds/aurora/features)
  - 지속적인 스냅샷, 백업 S3에 가능
  - 99.99% 이상의 가용성 제공
  - 고가용성 Database
- Amazon Neptune
- Amazon DocumentDB
- *Amazon MemoryDB for Redis

## Networking & Content Delivery
- *Amazon CloudFront
  - CDN 서비스
- [*Elastic Load Balancing (ELB)](https://aws.amazon.com/elasticloadbalancing/features/)
- *Amazon Route 53
  - 도메인 관련 서비스 (Resolver...)
- [*Amazon VPC](https://aws.amazon.com/vpc/features/)
  - 온-프레미스 환경과 함께 사용 할 수 있는 서비스들이 많음
- *AWS Direct Connect
  - 패킷들이 public으로 노출되지 않음
- *Amazon API Gateway
  - 요청들이 한곳으로 모이기 때문에 모니터링하기 쉬움
  - Throttling 가능
  - 비용이 다소 발생함
- AWS PrivateLink
- AWS Global Accelerator
- *AWS Trasit Gateway
- *AWS VPN

## Storage Services
- [*Amazon Simple Storage Service (S3)](https://aws.amazon.com/s3/)
  - 고가용성 객체 저장소
  - [스토리지 클래스](https://aws.amazon.com/s3/storage-classes) (Standard ... Standard-IA ... Glacier)
- [*Amazon Elastic Block Store (EBS)](https://aws.amazon.com/ebs)
  - 블럭 저장소
- AWS Storage Gateway
- *Amazon S3 Glacier
- [Amazon Elastic File System (EFS)](https://aws.amazon.com/efs)
  - 서버리스 파일 시스템
- Amazon FSx
- AWS Backup

## Security
- AWS Cognito
- AWS Directory Service
- AWS Key Management Service (KMS)
- [*AWS WAF](https://aws.amazon.com/waf)
  - 트래픽 분석해서 Bot 방어
  - ACL 등..
- AWS Certificate Manager
- AWS Artifact
- AWS Shield
  - DDos 공격 방어
- Amazon GuardDuty
  - 해킹 방어
- AWS Single Sign-On (SSO)
- *AWS Firewall Manager
- AWS Resource Access Manager
- AWS Network Firewall

## Media Services
- *Amazon Elastic Transcoder
- AWS Elemental MediaPackage

## Application Integration
- [*Amazon Simple Queue Service (SQS)](https://aws.amazon.com/sqs/features/)
  - Standard Q, FIFO Q 선택 가능
- *Amazon Simple Notification Service (SNS)
  - Standard Topic, FIFO Topic 선택 가능
- AWS Step Functions
- Amazon MQ
- Amazon EventBridge
- Amazon AppFlow

## Analytic
- Amazon EMR
- Amazon CloudSearch
- AWS Data Pipeline
- Amazon Redshift
  - 웨어하우징
- Amazon Kinesis
- Amazon QuickSight
- *Amazon Athena
  - S3에 있는 데이터 SQL로 쿼리
  - 쿼리당 비용 발생하므로 조심해야함
- AWS Glue
  - ETL jobs
