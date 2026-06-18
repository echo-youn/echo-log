# 사내 VPN 환경에서 WSL2 네트워크 접속 불가능할 때 MTU 조정 해결법

회사 VPN에 연결한 상태에서 WSL을 사용하다 보면 Windows 브라우저나 터미널에서는 정상인데 WSL 안에서만 네트워크가 이상하게 느려지거나 일부 요청이 멈추는 경우가 있다.

대표적인 증상은 다음과 같다.

- `curl` 요청이 TLS handshake 근처에서 멈춘다.
- `git clone`, `git fetch`, `npm install`, `docker pull`이 간헐적으로 실패한다.
- DNS 조회는 되는데 HTTPS 요청만 느리거나 timeout이 난다.
- 작은 요청은 성공하지만 큰 응답을 받는 요청에서 멈춘다.
- VPN을 끄면 WSL 네트워크가 정상으로 돌아온다.

이런 경우 원인 중 하나가 MTU(Maximum Transmission Unit) 크기 문제일 수 있다.

## MTU란?

MTU는 네트워크 인터페이스가 한 번에 보낼 수 있는 최대 패킷 크기다.

일반적인 이더넷 환경에서는 MTU가 보통 `1500`이다. 그런데 VPN을 사용하면 원래 패킷 위에 VPN 터널링을 위한 헤더가 추가된다. IPsec, OpenVPN, WireGuard 같은 방식은 내부 패킷을 한 번 더 감싸서 전송하기 때문에 실제로 사용할 수 있는 payload 크기가 줄어든다.

문제는 WSL의 `eth0` 인터페이스가 여전히 MTU `1500`으로 동작하는 경우다. VPN 터널이 감당할 수 있는 크기보다 큰 패킷이 나가면 중간에서 fragmentation이 필요하거나 "packet too big" 신호가 돌아와야 한다.

하지만 방화벽, VPN 장비, 사내 네트워크 정책 때문에 Path MTU Discovery에 필요한 ICMP 응답이 막혀 있으면 클라이언트는 패킷이 왜 사라지는지 모른다. 이 상태를 MTU black hole이라고 부르기도 한다.

결과적으로 연결은 된 것처럼 보이지만 큰 패킷이 오가는 순간 요청이 멈춘다.

## 현재 MTU 확인

WSL에서 현재 인터페이스 MTU를 확인한다.

```sh
ip link show eth0
```

예시는 다음과 같다.

```text
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP mode DEFAULT group default qlen 1000
```

`mtu 1500`으로 되어 있고 VPN 연결 중에만 네트워크가 불안정하다면 MTU를 낮춰볼 만하다.

`ifconfig`가 설치되어 있다면 다음으로도 확인할 수 있다.

```sh
ifconfig eth0
```

## 임시로 MTU 낮추기

먼저 임시로 MTU를 낮춰서 증상이 사라지는지 확인한다.

```sh
sudo ip link set dev eth0 mtu 1400
```

또는 `ifconfig`를 사용한다.

```sh
sudo /sbin/ifconfig eth0 mtu 1400
```

다시 확인한다.

```sh
ip link show eth0
```

문제가 되던 명령을 다시 실행해 본다.

```sh
curl -v https://example.com
git fetch
npm install
```

`1400`에서도 문제가 있으면 `1380`, `1360`, `1300`처럼 조금 더 낮춰본다. 너무 낮게 잡으면 패킷이 잘게 쪼개져 성능이 떨어질 수 있으므로, 안정적으로 동작하는 가장 큰 값을 찾는 것이 좋다.

## 부팅 시 자동 적용

임시 설정은 WSL을 재시작하면 사라진다. 매번 설정하기 귀찮으므로 `/etc/wsl.conf`에 boot command를 등록한다.

```ini
# /etc/wsl.conf
[boot]
command = /sbin/ifconfig eth0 mtu 1400
```

요즘 배포판에서는 `ifconfig`가 기본 설치되어 있지 않을 수 있다. 그 경우 `ip` 명령을 사용하는 편이 낫다.

```ini
# /etc/wsl.conf
[boot]
command = /sbin/ip link set dev eth0 mtu 1400
```

`[boot] command`는 WSL 인스턴스가 시작될 때 root 사용자로 실행된다. 따라서 `sudo`를 붙일 필요가 없다.

설정 후 Windows PowerShell에서 WSL을 완전히 종료한다.

```powershell
wsl --shutdown
```

다시 WSL을 실행하고 MTU가 적용되었는지 확인한다.

```sh
ip link show eth0
```

## wsl.conf 수정 예시

파일을 연다.

```sh
sudo vi /etc/wsl.conf
```

내용을 추가한다.

```ini
[boot]
command = /sbin/ip link set dev eth0 mtu 1400
```

Windows PowerShell에서 WSL을 재시작한다.

```powershell
wsl --shutdown
```

Ubuntu를 다시 실행한 뒤 확인한다.

```sh
ip link show eth0
```

## MTU 값 찾기

대부분의 VPN 환경에서는 `1400` 정도로 낮추면 해결되는 경우가 많다. 그래도 환경마다 터널링 방식과 네트워크 장비가 다르기 때문에 정답은 아니다.

대략적인 테스트는 `ping`으로 해볼 수 있다.

```sh
ping -M do -s 1372 8.8.8.8
```

IPv4에서 ICMP payload 크기에 IP header 20 bytes와 ICMP header 8 bytes가 붙으므로, `1372 + 28 = 1400`이다.

성공하면 조금씩 키워본다.

```sh
ping -M do -s 1382 8.8.8.8
ping -M do -s 1392 8.8.8.8
```

실패하면 줄인다.

```sh
ping -M do -s 1352 8.8.8.8
```

다만 ICMP가 막힌 네트워크에서는 이 테스트 자체가 실패할 수 있다. 그런 경우에는 실제 문제가 발생하던 `curl`, `git`, `npm`, `docker` 명령으로 확인하는 편이 더 현실적이다.

## 왜 Windows는 되는데 WSL만 안 될까?

WSL 2는 Windows 안에서 별도의 가상화된 Linux 환경으로 동작한다. 네트워크도 Windows host와 완전히 같은 인터페이스를 그대로 쓰는 것이 아니라, WSL VM의 가상 네트워크 인터페이스를 거친다.

VPN 클라이언트가 Windows 네트워크에는 적절한 MTU, route, DNS, proxy 설정을 반영하더라도 WSL 내부 인터페이스까지 항상 같은 방식으로 맞춰주지는 않는다.

그래서 Windows의 브라우저, PowerShell, IntelliJ는 정상인데 WSL의 `curl`, `git`, `npm`만 실패하는 상황이 생길 수 있다.

## 다른 원인과 구분하기

VPN 환경에서 WSL 네트워크가 이상하다고 항상 MTU 문제는 아니다.

DNS 문제라면 보통 hostname resolve부터 실패한다.

```sh
nslookup example.com
dig example.com
```

proxy 문제라면 회사 proxy가 필요한데 WSL에 `HTTP_PROXY`, `HTTPS_PROXY`, `NO_PROXY`가 전달되지 않았을 수 있다.

```sh
env | grep -i proxy
```

route 문제라면 사내망 대역으로 가는 route가 WSL에 없을 수 있다.

```sh
ip route
```

MTU 문제는 DNS와 TCP 연결 초반은 되는 것처럼 보이다가, 큰 payload가 오가는 순간 멈추는 패턴이 많다.

## 정리

VPN을 켠 상태에서 WSL 안의 HTTPS, Git, npm, Docker 요청이 간헐적으로 멈춘다면 WSL `eth0`의 MTU를 낮춰본다.

우선 임시로 확인한다.

```sh
sudo ip link set dev eth0 mtu 1400
```

효과가 있으면 `/etc/wsl.conf`에 영구 적용한다.

```ini
[boot]
command = /sbin/ip link set dev eth0 mtu 1400
```

기존 방식으로는 다음처럼 작성할 수도 있다.

```ini
[boot]
command = /sbin/ifconfig eth0 mtu 1400
```

설정 후에는 Windows PowerShell에서 WSL을 재시작한다.

```powershell
wsl --shutdown
```

MTU 값은 `1400`부터 시작하고, 환경에 따라 더 낮은 값으로 조정한다.

## References

- [Advanced settings configuration in WSL](https://learn.microsoft.com/en-us/windows/wsl/wsl-config)
