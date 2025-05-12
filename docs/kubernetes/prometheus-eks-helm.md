# 프로메테우스 EKS에 헬름차트로 구성

- AWS EKS

필요 사항
- kubectl
- helm

생성되는 리소스
- Ingress (AWS alb)
- Service (AWS target group)
- Namespace (monitoring)
- Secrets (annotation based config)
- daemonset (Node Exporter)
- Prometheus 관련 pods (Prometheus, kube state metrics, Grafana, Operator, Alertmanager)
- CRB (Cluster Role Binding)
- CRD (Custom Resource Definition)

## 1. kubectl 네임스페이스 생성

```
## context 확인
$ kubectl config current-context
...

$ kubectl config set-context [context]
...

# 'prometheus' 네임스페이스 생성
$ kubectl create ns monitoring

# 'prometheus' 네임스페이스로 current context 변경
$ kubectl config set-context --current --namespace=monitoring
```

## 2. prom repo 추가
```
# 'prometheus-community' repo 추가
$ helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
"prometheus-community" has been added to your repositories

# 'kube-state-metrics' repo 추가 (Optional)
$ helm repo add kube-state-metrics https://kubernetes.github.io/kube-state-metrics

# repo가 추가되었는지 확인
$ helm repo list
NAME                    URL                                             
prometheus-community    https://prometheus-community.github.io/helm-charts
...

# 최신 차트가 적용되도록 local repository를 업데이트
$ helm repo update prometheus-community
...Successfully got an update from the "prometheus-community" chart repository
Update Complete. ⎈Happy Helming!⎈

```

## 3. 차트 설정
```aiignore
## values.yaml
$ helm show values prometheus-community/kube-prometheus-stack

## grafana.adminUser, grafana.adminPassword 수정
grafana:
  ...
  adminUser: admin
  adminPassword: prom-operator
  
## grafana aws alb 생성
grafana:
  annoations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internal # internet-facing, internal
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTP": 80}, {"HTTPS": 443}]'
    alb.ingress.kubernetes.io/ssl-redirect: '443'
    alb.ingress.kubernetes.io/subnets: subnet-xxxxxxxxxx, subnet-xxxxxxxxxxxx # subnets
    alb.ingress.kubernetes.io/security-groups: sg-xxxxxxxxxxxxxx # security group
    alb.ingress.kubernetes.io/load-balancer-name: alb-name # ALB 이름
    alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:ap-northeast-2:xxxxxx:certificate/aaaa-bbb-cc-dd # 인증서
    alb.ingress.kubernetes.io/tags: Name=alb-name, Departure=Test
    alb.ingress.kubernetes.io/healthcheck-port: traffic-port
    alb.ingress.kubernetes.io/healthcheck-protocol: HTTP
    alb.ingress.kubernetes.io/healthcheck-path: /metrics
    alb.ingress.kubernetes.io/healthcheck-timeout-seconds: '10'
    alb.ingress.kubernetes.io/healthcheck-interval-seconds: '60'
    alb.ingress.kubernetes.io/healthy-threshold-count: '2'
    alb.ingress.kubernetes.io/unhealthy-threshold-count: '10'
    alb.ingress.kubernetes.io/success-codes: '200-299'

## grafana ingress 생성
grafana:
  ingress:
    enabled: true
    ingressClassName: alb

## prometheus annotation-based 허용
prometheus:
  prometheusSpec:
    serviceMonitorSelectorNilUsesHelmValues: false
    podMonitorSelectorNilUsesHelmValues: false

## kube-state-metrics 로그 남기기
kubelet:
  serviceMonitor:
     cAdvisorMetricRelabelings:
#      - sourceLabels: [__name__]
#        action: drop
#        regex: 'container_spec.*'
```

## 4. 헬름 차트 설치
```aiignore
helm install [RELEASE_NAME] prometheus-community/kube-prometheus-stack -f values.yaml
```

## 5. 어노테이션 기반 target 추가
```aiignore
prometheus.io/scrape: true
```

```aiignore
## prometheus.additional-scrape-config.yaml

apiVersion: v1
kind: Secret
metadata:
  name: additional-scrape-configs
  namespace: monitoring
type: Opaque
stringData:
  additional-scrape-configs.yaml: |
    - job_name: 'annotation-scrape'
      kubernetes_sd_configs:
        - role: pod
      relabel_configs:
        - action: keep
          source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
          regex: true
        - action: replace
          source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
          target_label: __metrics_path__
          regex: (.+)
        - action: replace
          source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
          target_label: __address__
          regex: (.+):(?:\d+);(\d+)
          replacement: $1:$2
        - action: replace
          source_labels: [__meta_kubernetes_namespace]
          target_label: kubernetes_namespace
        - action: replace
          source_labels: [__meta_kubernetes_pod_name]
          target_label: kubernetes_pod_name
        - action: replace
          target_label: cluster_name
          replacement: custom-label-value
 
$ kubectl apply -f prometheus-additional-scrape-config.yaml
```

```aiignore
## values.yaml
prometheus:
  prometheusSpec:
    additionalScrapeConfigsSecret:
      enabled: true
      name: additional-scrape-configs
      key: additional-scrape-configs.yaml

## (optional) 헬름 upgrade
helm upgrade [RELEASE_NAME] prometheus-community/kube-prometheus-stack -f values.yaml
```


## (Optional) 삭제 방법
```
helm uninstall [RELEASE_NAME]

kubectl delete crd alertmanagerconfigs.monitoring.coreos.com
kubectl delete crd alertmanagers.monitoring.coreos.com
kubectl delete crd podmonitors.monitoring.coreos.com
kubectl delete crd probes.monitoring.coreos.com
kubectl delete crd prometheusagents.monitoring.coreos.com
kubectl delete crd prometheuses.monitoring.coreos.com
kubectl delete crd prometheusrules.monitoring.coreos.com
kubectl delete crd scrapeconfigs.monitoring.coreos.com
kubectl delete crd servicemonitors.monitoring.coreos.com
kubectl delete crd thanosrulers.monitoring.coreos.com
```
