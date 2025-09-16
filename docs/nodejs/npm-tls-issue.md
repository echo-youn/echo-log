# npm tls issue

npm 사용 중 `@confluentinc/kafka-javascript` 의존성을 추가해야할 일이 있었다.

해당 모듈은 `KafkaJS`와 `node-librdkafka`를 래핑하는 모듈이었는데, `KafkaJS`의 편의성 (Promise)과 `librdkafka`의 성능을 고루 갖춘 모듈이었다.

여기서 `node-librdkafka`는 `librdkafka`를 사용하는데 C++로 구현되어, 노드로 변환하는 모듈이다.

`librdkafka`는 흔한 OS와 node 버전은 지원하지만 그렇지 않은 경우 해당 환경에서 C++로 직접 빌드해 사용해야한다.

다행히 직접 빌드해 사용하지는 않는 환경이어서 `pre-build` 모듈을 사용 할 수 있었다.

여기서 문제가 발생하는데, `librdkafka`에서 `pre-build` 모듈을 배포할때, Github의 Release에 파일을 올려놓고 `npm install`시 해당 파일을 다운로드 받아 `npm install`을 진행하게 된다.

이때 회사 인증서 이슈가 발생해 다운로드가 안되는 상황에 직면했다.

# 현상 및 원인

## npm  install 시 멈춤 현상

먼저 `npm install` 시 빌드가 매우 오래걸린다고 생각될 만큼 특정 구간에서 멈추는 현상이 있었다.
```shell
$ npm i
npm warn deprecated npmlog@5.0.1: This package is no longer supported.
npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
npm warn deprecated are-we-there-yet@2.0.0: This package is no longer supported.
npm warn deprecated gauge@3.0.2: This package is no longer supported.
npm warn deprecated mkdirp@0.3.5: Legacy versions of mkdirp are no longer supported. Please update to mkdirp 1.x. (Note that the API surface has changed to use Promises in 1.x.)
npm warn deprecated uuid@1.4.2: Please upgrade  to version 7 or higher.  Older versions may use Math.random() in certain circumstances, which is known to be problematic.  See https://v8.dev/blog/math-random for details.
npm warn deprecated coffee-script@1.7.1: CoffeeScript on NPM has moved to "coffeescript" (no hyphen)
⠸ ## 무한루프
```

자세하게 파악하기 위해 `verbose` 옵션을 붙여 로깅해보기로 했다.

```shell
$ npm -dd i
/v24.3.0/bin/node /home/echo/.nvm/versions/node/v24.3.0/bin/npm
npm info using npm@11.4.2
npm info using node@v24.3.0
npm warn -dd is not a valid single-hyphen cli flag and will be removed in the future
npm verbose title npm i
npm verbose argv "--loglevel" "verbose" "i"
npm verbose logfile logs-max:10 dir:/home/echo/.npm/_logs/2025-09-16T00_20_18_710Z-
npm verbose logfile /home/echo/.npm/_logs/2025-09-16T00_20_18_710Z-debug-0.log
npm verbose reify failed optional dependency /home/echo/VSC/project-name/project-name2/node_modules/fsevents
npm verbose reify failed optional dependency /home/echo/VSC/project-name/project-name2/node_modules/@msgpackr-extract/msgpackr-extract-win32-x64
npm verbose reify failed optional dependency /home/echo/VSC/project-name/project-name2/node_modules/@msgpackr-extract/msgpackr-extract-linux-arm64
npm verbose reify failed optional dependency /home/echo/VSC/project-name/project-name2/node_modules/@msgpackr-extract/msgpackr-extract-linux-arm
npm verbose reify failed optional dependency /home/echo/VSC/project-name/project-name2/node_modules/@msgpackr-extract/msgpackr-extract-darwin-x64
npm verbose reify failed optional dependency /home/echo/VSC/project-name/project-name2/node_modules/@msgpackr-extract/msgpackr-extract-darwin-arm64
npm http cache zod@https://repo/repository/inface/zod/-/zod-3.24.2.tgz 0ms (cache hit)
npm http cache zip-stream@https://repo.com/repository/inface/zip-stream/-/zip-stream-6.0.1.tgz 0ms (cache hit)
npm http cache yocto-queue@https://repo.com/repository/inface/yocto-queue/-/yocto-queue-0.1.0.tgz 0ms (cache hit)
npm http cache yargs@https://repo.com/repository/inface/yargs/-/yargs-17.7.2.tgz 0ms (cache hit)
... 생략
npm warn deprecated coffee-script@1.7.1: CoffeeScript on NPM has moved to "coffeescript" (no hyphen)
npm info run @confluentinc/kafka-javascript@1.4.1 install node_modules/@confluentinc/kafka-javascript node-pre-gyp install --fallback-to-build
npm info run cpu-features@0.0.10 install node_modules/cpu-features node buildcheck.js > buildcheck.gypi && node-gyp rebuild
npm info run dtrace-provider@0.8.8 install node_modules/dtrace-provider node-gyp rebuild || node suppress-error.js
npm info run msgpackr-extract@3.0.3 install node_modules/msgpackr-extract node-gyp-build-optional-packages
npm info run ssh2@1.16.0 install node_modules/ssh2 node install.js
npm info run msgpackr-extract@3.0.3 install { code: 0, signal: null }
npm info run dtrace-provider@0.8.8 install { code: 0, signal: null }
npm info run ssh2@1.16.0 install { code: 0, signal: null }
npm info run cpu-features@0.0.10 install { code: 0, signal: null }
⠙ ## 무한루프

## 또는 아래 에러 발생
npm error path /home/echo/VSC/project-name/project-name2/node_modules/@confluentinc/kafka-javascript
npm error command failed
npm error command sh -c node-pre-gyp install --fallback-to-build
npm error make: Entering directory '/home/echo/VSC/project-name/project-name2/node_modules/@confluentinc/kafka-javascript/build'
npm error   CXX(target) Release/obj.target/confluent-kafka-javascript/src/binding.o
npm error make: Leaving directory '/home/echo/VSC/project-name/project-name2/node_modules/@confluentinc/kafka-javascript/build'
npm error Failed to execute '/home/echo/.nvm/versions/node/v20.19.2/bin/node /home/echo/.nvm/versions/node/v20.19.2/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js build --fallback-to-build --module=/home/echo/VSC/project-name/project-name2/node_modules/@confluentinc/kafka-javascript/build/Release/confluent-kafka-javascript.node --module_name=confluent-kafka-javascript --module_path=/home/echo/VSC/project-name/project-name2/node_modules/@confluentinc/kafka-javascript/build/Release --napi_version=9 --node_abi_napi=napi --napi_build_version=0 --node_napi_label=node-v115' (1)
npm error node-pre-gyp info it worked if it ends with ok
npm error node-pre-gyp info using node-pre-gyp@1.0.11
npm error node-pre-gyp info using node@20.19.2 | linux | x64
npm error node-pre-gyp info check checked for "/home/echo/VSC/project-name/project-name2/node_modules/@confluentinc/kafka-javascript/build/Release/confluent-kafka-javascript.node" (not found)
npm error node-pre-gyp http GET https://github.com/confluentinc/confluent-kafka-javascript/releases/download/v1.4.1/confluent-kafka-javascript-v1.4.1-node-v115-linux-glibc-x64.tar.gz
npm error node-pre-gyp ERR! install request to https://github.com/confluentinc/confluent-kafka-javascript/releases/download/v1.4.1/confluent-kafka-javascript-v1.4.1-node-v115-linux-glibc-x64.tar.gz failed, reason: self-signed certificate in certificate chain
npm error node-pre-gyp WARN Pre-built binaries not installable for @confluentinc/kafka-javascript@1.4.1 and node@20.19.2 (node-v115 ABI, glibc) (falling back to source compile with node-gyp)
npm error node-pre-gyp WARN Hit error request to https://github.com/confluentinc/confluent-kafka-javascript/releases/download/v1.4.1/confluent-kafka-javascript-v1.4.1-node-v115-linux-glibc-x64.tar.gz failed, reason: self-signed certificate in certificate chain
npm error gyp info it worked if it ends with ok
npm error gyp info using node-gyp@10.1.0
npm error gyp info using node@20.19.2 | linux | x64

```

`verbose` 로그로도 큰 수확을 얻진 못했지만 특정 모듈을 설치할때 문제가 발생하는것은 파악했다.

결국 `@confluentinc/kafka-javascript`를 직접 빌드해서 사용해보기로 했다.

깃헙 레파지토리에서 복제받아, 빌드를 진행해봤다.

```shell
/confluent-kafka-javascript$ npm run -dd install
npm verbose cli /home/echo/.nvm/versions/node/v24.3.0/bin/node /home/echo/.nvm/versions/node/v24.3.0/bin/npm
npm info using npm@11.4.2
npm info using node@v24.3.0
npm warn -dd is not a valid single-hyphen cli flag and will be removed in the future
npm verbose title npm run install
npm verbose argv "run" "--loglevel" "verbose" "install"
npm verbose logfile logs-max:10 dir:/home/echo/.npm/_logs/2025-09-16T00_25_50_935Z-
npm verbose logfile /home/echo/.npm/_logs/2025-09-16T00_25_50_935Z-debug-0.log

> @confluentinc/kafka-javascript@1.4.1 install
> node-pre-gyp install --fallback-to-build

node-pre-gyp info it worked if it ends with ok
node-pre-gyp verb cli [
node-pre-gyp verb cli   '/home/echo/.nvm/versions/node/v24.3.0/bin/node',
node-pre-gyp verb cli   '/home/echo/.nvm/versions/node/v24.3.0/bin/node-pre-gyp',
node-pre-gyp verb cli   'install',
node-pre-gyp verb cli   '--fallback-to-build'
node-pre-gyp verb cli ]
node-pre-gyp info using node-pre-gyp@0.17.0
node-pre-gyp info using node@24.3.0 | linux | x64
node-pre-gyp verb command install []
node-pre-gyp WARN Using needle for node-pre-gyp https download
node-pre-gyp info check checked for "/home/echo/VSC/confluent-kafka-javascript/build/Release/confluent-kafka-javascript.node" (not found)
node-pre-gyp http GET https://github.com/confluentinc/confluent-kafka-javascript/releases/download/v1.4.1/confluent-kafka-javascript-v1.4.1-node-v137-linux-glibc-x64.tar.gz
node-pre-gyp WARN Pre-built binaries not installable for @confluentinc/kafka-javascript@1.4.1 and node@24.3.0 (node-v137 ABI, glibc) (falling back to source compile with node-gyp) 
node-pre-gyp WARN Hit error self-signed certificate in certificate chain
node-pre-gyp verb command build [ 'rebuild' ]
gyp info it worked if it ends with ok
gyp verb cli [
gyp verb cli '/home/echo/.nvm/versions/node/v24.3.0/bin/node',
gyp verb cli '/home/echo/.nvm/versions/node/v24.3.0/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js',
gyp verb cli 'clean'
gyp verb cli ]
... 이하 생략
```

로그를 보면 `self-signed certificate...` 로그를 발견하고, 인증서 관련 이슈로 해결 방안을 설정했다.

# 해결 방안

## NODE_TLS_REJECT_UNAUTHORIZED 환경 변수 설정

구글에 npm 인증서 관련 문서로 검색하면 상당수가 `NODE_TLS_REJECT_UNAUTHORIZED` 변수를 `0`으로 설정하라는 조언이 쏟아진다.

나도 이를 적용해보았으나, 해결방법이 되지는 못했다.

그리고 이는 해결한것이라기 보다는 임시방편에 불가하다는 하늘을 손바닥으로 가리는 듯한 느낌이어서 인증서를 적용하는 방안을 찾아보았다.


## NODE_EXTRA_CA_CERTS 설정

노드에 `NODE_EXTRA_CA_CERTS` 변수를 사용하는데, 여기에 회사에서 만든 사설 인증서 경로를 입력해 주면 된다.

```
$ NODE_EXTRA_CA_CERTS=/path/to/self-signed-certification.pem
```

## NODE_EXTRA_CERTS 설정
```shell
$ NODE_EXTRA_CERTS=/path/to/self-signed-certification.pem
```

## npm config 변경
```shell
$ npm config set strict-ssl false -g
```

## SASS_REJECT_UNAUTHORIZED 환경 변수 설정
`SASS_REJECT_UNAUTHORIZED=0`으로 설정

위 설정들을 다 한 뒤, 컴퓨터를 재시작하여야 적용 되는 사례도 있다.

## librdkafka pre-built 사용

1. Install a recent version of python, a C++ compiler that supports C++20 or above. It's best to grab a fairly recent version of gcc or clang.
2. Install librdkafka. There are many ways to do this depending on your target machine. The easiest way is to grab it from your package manager, or if not available, you might need to build it from source. Example installation for Debian/Ubuntu based platforms:
```shell
sudo mkdir -p /etc/apt/keyrings
wget -qO - https://packages.confluent.io/deb/7.8/archive.key | gpg --dearmor | sudo tee /etc/apt/keyrings/confluent.gpg > /dev/null
sudo apt-get update
sudo apt install librdkafka-dev
```
3. Once librdkafka is installed, you need to set some environment variables. An example of this for a Unix-like platform is shown below:
```shell
export CKJS_LINKING=dynamic
export BUILD_LIBRDKAFKA=0
```
4. Now you can run npm install as usual, and it will build the library for you, linking it against the librdkafka installed in the system.
```
$ npm install @confluentinc/kafka-javascript
```


# Refs


