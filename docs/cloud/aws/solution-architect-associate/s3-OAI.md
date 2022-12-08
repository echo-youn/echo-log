# Origin Access Identifier

A company has clients all across the globe that access product files stored in several S3 buckets, which are behind each of their own CloudFront web distributions. They currently want to deliver their content to a specific client, and they need to make sure that only that client can access the data. Currently, all of their clients can access their S3 buckets directly using an S3 URL or through their CloudFront distribution. The Solutions Architect must serve the private content via CloudFront only, to secure the distribution of files.

Which combination of actions should the Architect implement to meet the above requirements? (Select TWO.)

한 회사는 전 세계에 자체 CloudFront 웹 배포판 뒤에 있는 여러 S3 버킷에 저장된 제품 파일에 액세스하는 고객을 보유하고 있습니다. 그들은 현재 특정 클라이언트에게 콘텐츠를 전달하기를 원하며, 그 클라이언트만이 데이터에 액세스할 수 있는지 확인해야 합니다. 현재 모든 클라이언트는 S3 URL을 사용하거나 CloudFront 배포를 통해 S3 버킷에 직접 액세스할 수 있습니다. 솔루션 아키텍트는 파일 배포를 보호하기 위해 CloudFront를 통해서만 개인 콘텐츠를 제공해야 합니다.

아키텍트는 위의 요구 사항을 충족시키기 위해 어떤 조합의 조치를 구현해야 합니까? (두 개를 선택하세요.)

### 보기

1. Require the users to access the private content by using special ColudFront signed URLs or signed cookies
2. Restrict access to files in the origin by creating an origin access identiy (OAI) and give it permission to read the files in the bucket
3. Use S3 pre-signed URLs to ensure that only their client can access the files. Remove permission to use Amazon S3 URLs to read the files for anyone else
4. Enable the Origin Shield feature of the Amazon CloudFront distribution to protect the files from unauthorized access
5. Create a custom CloudFront function to check and ensure that only their client can accesss the files

## 해설
