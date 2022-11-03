# Comparision

IT 대기업이 운영하는 클라우드인 AWS, Azure, Google Cloud(Firebase)는 거의 같은 역할을 할 수 있고 일하는 환경에 따라 달라질수 있다. 
이 때 가장 헷갈리는게 같은 서비스이지만 부르는 명칭이 달라 일하기 어려운 경우가 있는데 주로 많이 사용되는 서비스들 기준으로 각각의 서비스에서는 어떻게 불리는지 정리한다.

## AWS

AWS는 아마존이 운영하는 클라우드 서비스이다. 비교할 3 업체중 가장 점유율이 높고 레퍼런스도 가장 많은 편이다. 현업에서 어떤 계층이나 구조를 명칭할때 AWS의 서비스를 부르는 경우가 종종 있다.

2021년 기준 국내외 AWS 주요 고객
- 넷플릭스
- 트위치
- 링크드인
- 페이스북
- 어도비
- 당근마켓
- 컬리
- 마카롱팩토리

## Azure

Azure는 마이크로소프트가 운영하는 클라우드 서비스이다. 잠깐 얕게 써본 입장으로 마이크로소프트 생태계(깃헙, C#, 비주얼스튜디오 등...)안에서 편의기능을 공식적으로 많이 제공하고 있다.
AWS에 비해 후발주자로 약간 어설픈 부분도 있는것 같지만 반면에 개선되어 나온 부분들도 많은편이다.

2021년 기준 국내외 주요 고객
- SK 텔레콤
- 두산중공업
- NH투자증권
- 유비소프트
- 우버
- 스택오버플로우

## GoogleCloud, Firebase

구글이 운영하는 클라우드 서비스이다. 써본적이 없으나 언젠가 써보겠지 하는 마음에 같이 정리해놓는다.

2021년 기준 국내외 주요 고객
- 알리바바
- 뉴옥타임스
- 링크드인
- SAP
- 야후
- 인텔

## 서비스명 비교 테이블

<table>
<thead>
<tr>
<th>서비스</th>
<th>AWS</th>
<th>Azure</th>
<th>GoogleCloud, Firebase</th>
</tr>
</thead>
<tbody>
<tr>
<td>가상머신(Virtual Machine)</td>
<td>EC2(Elastic Compute Cloud)</td>
<td>Virtual Machines</td>
<td>Compute Engine</td>
</tr>
<tr>
<td>컨테이너 오케스트레이터</td>
<td>ECS(Elastic Container Services)</td>
<td>Container Instances</td>
<td>Cloud Run</td>
</tr>
<tr>
<td>컨테이너 보관소</td>
<td>ECR(Elastic Container Registry)</td>
<td>Container Registry</td>
<td>Container Registry, Artifact Registry</td>
</tr>
<tr>
<td>관계형 데이터베이스</td>
<td>RDS</td>
<td>SQL Database, Database for (MySQL, PostgreSQL, MariaDB)</td>
<td>Cloud SQL</td>
</tr>
<tr>
<td>서버리스 관계형 데이터베이스</td>
<td>Aurora Serverless</td>
<td>Azure SQL Database serverless</td>
<td>Cloud Spanner(?)</td>
</tr>
<tr>
<td>Nosql/Document 데이터베이스</td>
<td>DynamoDB, SimpleDB, Amazon DocumentDB</td>
<td>Cosmos DB, Azure Table storage,</td>
<td>Cloud Bigtable, Firbase Realtime Database, Cloud Firestore</td>
</tr>
<tr>
<td>In-memory DB</td>
<td>ElastiCache</td>
<td>Cache for Redis</td>
<td>Cloud Memorystore</td>
</tr>
<tr>
<td>개체 스토리지(Object Storage)</td>
<td>S3(Simple Storage Services)</td>
<td>Blob Storage</td>
<td>Cloud Storage, Cloud Storage for Firebase</td>
</tr>
<tr>
<td>메세징 & 이벤팅</td>
<td>SQS (Simple Queue Services), SNS (Simple Notification Services)</td>
<td>Queue Storage, Service Bus</td>
<td>Cloud Pub/Sub</td>
</tr>
<tr>
<td>pub/sub</td>
<td>Amazon EventBridge</td>
<td>Azure Service Bus, Azure Event Hubs</td>
<td>Cloud Pub/Sub</td>
</tr>
<tr>
<td>CDN</td>
<td>Cloud Front</td>
<td>Azure CDN</td>
<td>Cloud CDN</td>
</tr>
<tr>
<td>로드밸런스</td>
<td>Network Load Balancer, Application Load Balancer</td>
<td>Load Balancer, Application Gateway</td>
<td>Network Load Balancing, Global load balancing</td>
</tr>
<tr>
<td>빌드, 호스팅 서비스</td>
<td>Elastic Beanstalk</td>
<td>App Service</td>
<td>App Engine</td>
</tr>
<tr>
<td>API 서비스</td>
<td>API Gateway</td>
<td>API Management</td>
<td>Apigee</td>
</tr>
<tr>
<td>파일저장소</td>
<td>Elastic File System</td>
<td>Files, One Drive</td>
<td>Filestore, Google Drive</td>
</tr>
</tbody>
</table>
