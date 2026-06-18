# AWS EC2 Spot Fleet으로 GitLab Runner 저렴하게 구축하는 법

EC2 Launch Template과 Spot Fleet으로 GitLab Runner를 운영할 때 필요한 설정 메모입니다.

실제 암호, 토큰, 계정 ID, 내부 URL, 레지스트리 인증값, Key Pair 이름, VPC/Subnet/Security Group ID는 문서에 남기지 않습니다.

필요한 값은 AWS Secrets Manager, SSM Parameter Store, GitLab Runner 등록 절차, 또는 운영 환경 변수로 주입합니다.

## EC2 Launch Template

### AMI 선정

Amazon Linux 2023 최신 AMI를 사용합니다.

### Instance type

러너 워크로드에 맞춰 선택합니다.

Docker build, test, image pull/push가 많으면 CPU와 디스크 I/O가 넉넉한 타입을 선택합니다.

### Key pair

기존에 만들어 둔 Key Pair를 설정합니다. Key Pair 이름은 문서에 남기지 않습니다.

### Network settings

러너는 외부에서 직접 접속될 필요가 없으므로 Public IP를 부여하지 않습니다.

- 애플리케이션과 통신할 수 있는 VPC/Subnet을 선택합니다.
- Bastion에서만 SSH 로그인할 수 있도록 Security Group을 구성합니다.
- SSH 인바운드는 Bastion Security Group 또는 Bastion CIDR만 허용합니다.
- ECR, GitLab, Private Registry 등에 접근할 수 있도록 필요한 egress 경로를 확인합니다.

### Storage

Docker 이미지, build cache, job artifact, log가 쌓일 수 있으므로 EBS 용량을 넉넉하게 잡습니다. 러너 특성상 디스크 부족이 job 실패로 이어지기 쉽습니다.

### IAM instance profile

EC2에 IAM Role을 연결합니다.

- ECR pull/push가 필요하면 ECR 권한을 포함합니다.
- SSM Parameter Store 또는 Secrets Manager에서 runner token이나 registry auth를 읽는다면 해당 read 권한을 포함합니다.
- 운영 권한은 최소 권한으로 분리합니다.

### Purchasing option

Spot 전용으로 구성합니다.

### User data

아래 예시는 민감정보를 제거한 템플릿입니다. `<...>` 값은 실제 환경에서 Secrets Manager, SSM Parameter Store, CI 등록 절차 등으로 주입하거나 교체합니다.

```bash
#!/bin/bash

echo "==================== [Start Setup] ===================="

echo "1. Installing Docker & ECR Credential Helper..."
sudo yum update -y
sudo yum install -y docker amazon-ecr-credential-helper
sudo service docker start
sudo usermod -a -G docker ec2-user

echo "1.5 Configuring ECR Credential Helper for Host..."
# 1) 호스트의 root 계정 설정
sudo mkdir -p /root/.docker
cat << 'EOF' | sudo tee /root/.docker/config.json > /dev/null
{
  "credHelpers": {
    "public.ecr.aws": "ecr-login",
    "<AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com": "ecr-login"
  }
}
EOF

# 2) 호스트의 ec2-user 계정 설정
sudo mkdir -p /home/ec2-user/.docker
sudo cp /root/.docker/config.json /home/ec2-user/.docker/config.json
sudo chown -R ec2-user:ec2-user /home/ec2-user/.docker

# 3) [중요] GitLab Runner 컨테이너 내부가 참조할 독립적인 docker-config 디렉토리 생성
# Runner 컨테이너 내부의 /root/.docker/config.json 으로 마운트될 예정입니다.
sudo mkdir -p /home/ec2-user/gitlab-runner-docker-config
sudo cp /root/.docker/config.json /home/ec2-user/gitlab-runner-docker-config/config.json
sudo chown -R ec2-user:ec2-user /home/ec2-user/gitlab-runner-docker-config

DOCKER_CONFIG="/usr/local/lib/docker"
echo "DOCKER_CONFIG $DOCKER_CONFIG"
sudo mkdir -p $DOCKER_CONFIG/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/download/v5.1.2/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

echo "2. Creating gitlab-runner directories..."
TARGET_DIR="/home/ec2-user/gitlab-runner"
mkdir -p "$TARGET_DIR"

# 3. compose.yml 파일 생성
echo "3. Generating compose.yml..."
cat << 'EOF' > "$TARGET_DIR/compose.yml"
version: '3.8'
services:
  gitlab-runner-compose:
    image: gitlab/gitlab-runner:v18.9.0
    container_name: gitlab-runner-compose
    restart: always
    privileged: true
    stop_signal: SIGQUIT
    security_opt:
      - label=disable
    ulimits:
      nofile:
        soft: 32768
        hard: 65536
    volumes:
      - /home/ec2-user/gitlab-runner:/etc/gitlab-runner
      - /var/run/docker.sock:/var/run/docker.sock
      - gitlab-runner-home:/home/gitlab-runner
      - /usr/bin/docker-credential-ecr-login:/usr/bin/docker-credential-ecr-login
      - /home/ec2-user/gitlab-runner-docker-config:/root/.docker
    logging:
      driver: json-file
      options:
        max-size: "10g"
        max-file: "5"

volumes:
  gitlab-runner-home:
EOF

# 4. config.toml 파일 생성
echo "4. Generating config.toml..."
cat << 'EOF' > "$TARGET_DIR/config.toml"
concurrent = 5
check_interval = 0
connection_max_age = "15m0s"
shutdown_timeout = 0

[session_server]
  session_timeout = 1800

[[runners]]
  name = "gitlab-runner-__HOSTNAME__"
  url = "<GITLAB_URL>"
  id = <GITLAB_RUNNER_ID>
  token = "<GITLAB_RUNNER_TOKEN>"
  token_obtained_at = <GITLAB_RUNNER_TOKEN_OBTAINED_AT>
  token_expires_at = 0001-01-01T00:00:00Z
  executor = "docker"
  request_concurrency = 4
  environment = ["DOCKER_AUTH_CONFIG={\"auths\":{\"<PRIVATE_REGISTRY_HOST>\":{\"auth\":\"<PRIVATE_REGISTRY_AUTH_BASE64>\"}},\"credHelpers\":{\"<AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com\":\"ecr-login\",\"public.ecr.aws\":\"ecr-login\"}}"]

  [runners.cache]
    MaxUploadedArchiveSize = 0
    [runners.cache.s3]
    [runners.cache.gcs]
    [runners.cache.azure]

  [runners.docker]
    tls_verify = false
    image = "<PRIVATE_REGISTRY_HOST>/<NAMESPACE>/docker-dind:29.4.0"
    pull_policy = "if-not-present"
    privileged = true
    disable_entrypoint_overwrite = false
    oom_kill_disable = false
    disable_cache = false
    volumes = ["/cache", "/certs/client", "/var/run/docker.sock:/var/run/docker.sock", "/usr/bin/docker-credential-ecr-login:/usr/bin/docker-credential-ecr-login"]
    shm_size = 0
    network_mtu = 0
EOF

# 4.1. 플레이스홀더 치환
sed -i "s/__HOSTNAME__/${HOSTNAME}/g" "$TARGET_DIR/config.toml"

# 5. 생성한 파일들의 소유권을 ec2-user로 변경
sudo chown -R ec2-user:ec2-user "$TARGET_DIR"

# 6. Docker Compose 실행
echo "5. Launching GitLab Runner container..."
cd "$TARGET_DIR"
sudo docker compose up -d

echo "==================== [Setup Finished] ===================="
```

## Spot Fleet

Launch Template에서 `Create Fleet from template`로 생성합니다.

### Launch parameters

User data와 Launch Template 설정을 그대로 사용해야 하므로 `Use a launch template`을 선택합니다.

- Launch Template 버전을 명확히 지정합니다.
- 실수로 `$Latest`가 바뀌어 다른 설정이 배포되지 않도록 운영 버전을 고정합니다.

### Additional request detail

기본값을 적용합니다.

### Target capacity

러너 여유분을 고려해 넉넉하게 잡습니다. 예시는 3대입니다.

### Persistence

매우 중요합니다.

- `Maintain target capacity`를 켜서 목표 인스턴스 수가 유지되도록 합니다.
- `Interrupt behavior`는 `terminate`로 설정해 중단된 Spot 인스턴스가 자동 정리되도록 합니다.
- `Capacity rebalance`는 `Launch only`로 켜서 중단 가능성이 있는 인스턴스가 생기면 대체 인스턴스를 먼저 띄우도록 합니다.

이 설정을 빼면 Spot 중단 이후 러너 인스턴스가 모두 사라질 수 있습니다.

### Network

애플리케이션이 사용하는 VPC를 선택합니다. Private Subnet을 사용하고, 필요한 내부 서비스와 Registry 접근 경로를 확인합니다.

### Availability Zone

Fleet이 사용할 수 있는 AZ를 넉넉하게 선택합니다. 선택 가능한 AZ가 많을수록 Spot 수급 실패 가능성이 줄어듭니다.

### Instance type requirements

운영 단순성을 우선하면 `Manually select instance types`를 사용합니다.

예시:

- `c5.4xlarge`

비용과 수급 안정성을 더 중요하게 보면 여러 유사 타입을 함께 넣는 방식도 고려합니다.

### Allocation strategy

기본 권장값은 `Price capacity optimized`입니다. 가격 최우선 운영이 필요하면 `Lowest price`를 선택할 수 있지만, 수급 안정성은 떨어질 수 있습니다.

## IAM Role

### Trusted policy

아래 예시는 계정 ID와 Role 이름을 제거한 템플릿입니다.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    },
    {
      "Sid": "AllowDeployRoleWithAnyInstance",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::<ACCOUNT_ID>:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringLike": {
          "aws:PrincipalArn": "arn:aws:iam::<ACCOUNT_ID>:role/<DEPLOY_ROLE_NAME>"
        }
      }
    }
  ]
}
```

### Permission policy

러너가 수행하는 job에 맞춰 최소 권한을 부여합니다.

- ECR image pull만 필요하면 read 계열 권한만 부여합니다.
- ECR image push가 필요하면 upload, put image 권한을 추가합니다.
- Secrets Manager 또는 SSM Parameter Store에서 값을 읽는다면 필요한 secret/parameter ARN만 허용합니다.
- CloudWatch Logs, S3 cache, KMS 등을 사용한다면 리소스 단위로 권한을 제한합니다.
