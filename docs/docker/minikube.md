# 라즈베리파이에 쿠버네티스 minikube 설치 및 구동하는 법


1. docker 설치 
2. minikube 설치 [minikube start](https://minikube.sigs.k8s.io/docs/start/?arch=%2Flinux%2Farm64%2Fstable%2Fbinary+download)


## Docker 설치

apt repository 설치
```aiignore shell
# [Docker 설치](https://docs.docker.com/engine/install/debian/#installation-methods)
$ sudo apt update
$ sudo apt install vim
$ sudo apt install ca-certificates curl # docker 설치를 위한 패키지
$ sudo install -m 0755 -d /etc/apt/keyrings
$ sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
$ sudo chmod a+r /etc/apt/keyrings/docker.asc 

$ echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
$ sudo apt-get update
```

docker package 설치
```aiignore shell
$ sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

$ sudo usermod -aG docker $USER
```

## minikube 설치


```aiignore
$ curl -LO https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-arm64
 % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
$ sudo install minikube-linux-arm64 /usr/local/bin/minikube && rm minikube-linux-arm64
```

cluter 시작
```aiignore
# --listen-address=0.0.0.0 옵션 추가시 remote access 가능
$ minikube start
😄  minikube v1.35.0 on Raspbian 12.10 (arm64)
✨  Automatically selected the docker driver. Other choices: none, ssh
📌  Using Docker driver with root privileges
👍  Starting "minikube" primary control-plane node in "minikube" cluster
🚜  Pulling base image v0.0.46 ...
💾  Downloading Kubernetes v1.32.0 preload ...
    > gcr.io/k8s-minikube/kicbase...:  452.84 MiB / 452.84 MiB  100.00% 12.71 M
    > preloaded-images-k8s-v18-v1...:  314.92 MiB / 314.92 MiB  100.00% 8.42 Mi

🔥  Creating docker container (CPUs=2, Memory=2200MB) ...
🐳  Preparing Kubernetes v1.32.0 on Docker 27.4.1 ...
    ▪ Generating certificates and keys ...
    ▪ Booting up control plane ...
    ▪ Configuring RBAC rules ...
🔗  Configuring bridge CNI (Container Networking Interface) ...
🔎  Verifying Kubernetes components...
    ▪ Using image gcr.io/k8s-minikube/storage-provisioner:v5
🌟  Enabled addons: storage-provisioner, default-storageclass
💡  kubectl not found. If you need it, try: 'minikube kubectl -- get pods -A'
🏄  Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default

$ minikube kubectl -- get pods -A
NAMESPACE     NAME                               READY   STATUS    RESTARTS   AGE
kube-system   coredns-668d6bf9bc-mzrbz           1/1     Running   0          4m12s
kube-system   etcd-minikube                      1/1     Running   0          4m23s
kube-system   kube-apiserver-minikube            1/1     Running   0          4m23s
kube-system   kube-controller-manager-minikube   1/1     Running   0          4m23s
kube-system   kube-proxy-56drc                   1/1     Running   0          4m12s
kube-system   kube-scheduler-minikube            1/1     Running   0          4m23s
kube-system   storage-provisioner                1/1     Running   0          4m8s

$ minikube dashboard

```

kubectl 설치
```aiignore
## kubectl 설치
$ curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl"
$ sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
$ kubectl version --client
Client Version: v1.33.0
Kustomize Version: v5.6.0

$ kubectl get pods -A
NAMESPACE     NAME                               READY   STATUS    RESTARTS   AGE
kube-system   coredns-668d6bf9bc-mzrbz           1/1     Running   0          7m24s
kube-system   etcd-minikube                      1/1     Running   0          7m35s
kube-system   kube-apiserver-minikube            1/1     Running   0          7m35s
kube-system   kube-controller-manager-minikube   1/1     Running   0          7m35s
kube-system   kube-proxy-56drc                   1/1     Running   0          7m24s
kube-system   kube-scheduler-minikube            1/1     Running   0          7m35s
kube-system   storage-provisioner                1/1     Running   0          7m20s

```
