# Cloudflare에서 Origin Server TLS 인증서 발급

## 네임서버를 Cloudflare로 등록
Origin Server 인증서란 Cloudflare와 Origin Server와 통신함에 있어서 암호화하는 인증서를 말한다.

Cloudflare 계정에 접속하여 `Account Home`에 접속한다.

그 후 `Domains` 탭에서 `Onboard a domain`을 눌러 네임서버를 연결할 도메인을 입력한다.

안내로 cloudflare의 네임서버 주소들을 알려주는데, 도메인 공급업체에 가서, 이를 네임서버로 설정한다.

시간이 지나면 Cloudflare에서 설정을 인식하여 `Active` 상태로 변경된다.

## TLS 인증서 발급
네임서버가 등록이 됐다면, 도메인을 선택한 뒤 `SSL/TLS` 메뉴로 간다.

`Origin Server`를 선택한 뒤 `Create Certificates` 버튼을 눌러 인증서를 생성한다.

Private 키가 없다면 아래 를 선택해 만든다.

**Private key type** - RSA (2048)

만약 기존에 있는 Private 키를 사용하고자 한다면 `Use my private key and CSR`를 눌러 Private 키로 만든 `CSR`을 넣는다.

와일드 카드 인증서를 만들고 인증서 기간을 선택한 뒤 `Create` 버튼을 누른다.

## 인증서 등록
위 방법대로 인증서를 발급받으면 `...BEGIN CERTIFICATE...` 로 시작하는 `Origin Certificate(example.com.pem)`과 `...BEGIN PRIVATE KEY...`로 시작하는 `Private Key(example.com.key)`가 발급된다.

이 둘 중 가장 중요한것은 `Private Key`이므로 노출되어선 안된다. 그리고 해당 창에서 벗어나면 다시는 볼 수 없기때문에 안전한곳에 보관해야한다.

`Origin Certificate`는 인증서 체인을 작성할때 사용된다.

참고로 2025.09의 Cloudflare의 RSA 루트 인증서는 다음과 같다.

```text [origin_ca_rsa_root.pem]
-----BEGIN CERTIFICATE-----
MIIEADCCAuigAwIBAgIID+rOSdTGfGcwDQYJKoZIhvcNAQELBQAwgYsxCzAJBgNV
BAYTAlVTMRkwFwYDVQQKExBDbG91ZEZsYXJlLCBJbmMuMTQwMgYDVQQLEytDbG91
ZEZsYXJlIE9yaWdpbiBTU0wgQ2VydGlmaWNhdGUgQXV0aG9yaXR5MRYwFAYDVQQH
Ew1TYW4gRnJhbmNpc2NvMRMwEQYDVQQIEwpDYWxpZm9ybmlhMB4XDTE5MDgyMzIx
MDgwMFoXDTI5MDgxNTE3MDAwMFowgYsxCzAJBgNVBAYTAlVTMRkwFwYDVQQKExBD
bG91ZEZsYXJlLCBJbmMuMTQwMgYDVQQLEytDbG91ZEZsYXJlIE9yaWdpbiBTU0wg
Q2VydGlmaWNhdGUgQXV0aG9yaXR5MRYwFAYDVQQHEw1TYW4gRnJhbmNpc2NvMRMw
EQYDVQQIEwpDYWxpZm9ybmlhMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKC
AQEAwEiVZ/UoQpHmFsHvk5isBxRehukP8DG9JhFev3WZtG76WoTthvLJFRKFCHXm
V6Z5/66Z4S09mgsUuFwvJzMnE6Ej6yIsYNCb9r9QORa8BdhrkNn6kdTly3mdnykb
OomnwbUfLlExVgNdlP0XoRoeMwbQ4598foiHblO2B/LKuNfJzAMfS7oZe34b+vLB
yrP/1bgCSLdc1AxQc1AC0EsQQhgcyTJNgnG4va1c7ogPlwKyhbDyZ4e59N5lbYPJ
SmXI/cAe3jXj1FBLJZkwnoDKe0v13xeF+nF32smSH0qB7aJX2tBMW4TWtFPmzs5I
lwrFSySWAdwYdgxw180yKU0dvwIDAQABo2YwZDAOBgNVHQ8BAf8EBAMCAQYwEgYD
VR0TAQH/BAgwBgEB/wIBAjAdBgNVHQ4EFgQUJOhTV118NECHqeuU27rhFnj8KaQw
HwYDVR0jBBgwFoAUJOhTV118NECHqeuU27rhFnj8KaQwDQYJKoZIhvcNAQELBQAD
ggEBAHwOf9Ur1l0Ar5vFE6PNrZWrDfQIMyEfdgSKofCdTckbqXNTiXdgbHs+TWoQ
wAB0pfJDAHJDXOTCWRyTeXOseeOi5Btj5CnEuw3P0oXqdqevM1/+uWp0CM35zgZ8
VD4aITxity0djzE6Qnx3Syzz+ZkoBgTnNum7d9A66/V636x4vTeqbZFBr9erJzgz
hhurjcoacvRNhnjtDRM0dPeiCJ50CP3wEYuvUzDHUaowOsnLCjQIkWbR7Ni6KEIk
MOz2U0OBSif3FTkhCgZWQKOOLo1P42jHC3ssUZAtVNXrCk3fw9/E15k8NPkBazZ6
0iykLhH1trywrKRMVw67F44IE8Y=
-----END CERTIFICATE-----
```

이때 순서는 다음과 같다

1. 서버 인증서
2. 체인 인증서
3. 루트 인증서

이 점을 유념하고 순서대로 붙여넣는다.

