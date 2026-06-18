import { defineConfig, HeadConfig, MarkdownOptions } from 'vitepress'

/**
 * This is for base url.
 */
const GITHUB_BASE_REPOSITORY_NAME = '/'
const SITE_URL = 'https://blog.echo-youn.com'
const SITE_TITLE = 'Echo Youn'
const SITE_DESCRIPTION = '개발, 운영, 인프라, Java, Spring, Kotlin 메모를 정리한 기술 블로그'
const LOGO_PATH = 'https://user-images.githubusercontent.com/39899731/201515448-b438b045-21ba-4028-8915-e2d7a9706d0e.png'

// https://vitepress.dev/reference/site-config#markdown
const markdownOptions: MarkdownOptions = {
    lineNumbers: true,
    image: {
        lazyLoading: true
    },
}

const getCanonicalPath = (page: string) => page
    .replace(/(^|\/)index\.md$/, '$1')
    .replace(/\.md$/, '')

const headConfig: HeadConfig[] = [
    ['link', { rel: 'icon', href: LOGO_PATH }], // <link rel="icon" href="LOGO_PATH" />
    ['meta', { name: 'author', content: 'Echo Youn' }],
    ['meta', { name: 'robots', content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' }],
    ['meta', { property: 'og:site_name', content: SITE_TITLE }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: LOGO_PATH }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: LOGO_PATH }],
    ['script', { src: 'https://www.googletagmanager.com/gtag/js?id=G-SCG97TK6W1', async: 'true' }],
    ['script', {}, `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-SCG97TK6W1');`],
    ['script', {async: 'true', src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4911149630505567', crossorigin: 'anonymous'}],
    ['script', {}, `(adsbygoogle = window.adsbygoogle || []).push({});`]
]

const config = defineConfig({
    lang: 'ko-KR',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    head: headConfig,
    base: GITHUB_BASE_REPOSITORY_NAME,
    markdown: markdownOptions,
    appearance: 'dark',
    sitemap: {
        hostname: SITE_URL,
    },
    transformHead(context) {
        const canonicalUrl = new URL(getCanonicalPath(context.page), SITE_URL).href
        const pageTitle = context.pageData.title || SITE_TITLE
        const pageDescription = context.pageData.description || SITE_DESCRIPTION

        return [
            ['link', { rel: 'canonical', href: canonicalUrl }],
            ['meta', { property: 'og:url', content: canonicalUrl }],
            ['meta', { property: 'og:title', content: pageTitle }],
            ['meta', { property: 'og:description', content: pageDescription }],
            ['meta', { name: 'description', content: pageDescription }],
            ['meta', { name: 'twitter:title', content: pageTitle }],
            ['meta', { name: 'twitter:description', content: pageDescription }],
        ]
    },
    themeConfig: {
        sidebar: [
            {
                text: 'Home',
                items: [
                    { text: 'Home', link: '/' },
                    { text: 'Clean Code로 가독성 높은 코드 작성하는 법', link: '/clean-code' }
                ],
                collapsed: true
            },
            {
                text: 'sql',
                items: [
                    // { text: 'Index', link: '/sql/' },
                    // { text: 'About Index', link: '/sql/about-index' },
                    { text: 'MySQL 실행 계획(Explain) 분석 및 쿼리 튜닝하는 법 #1', link: '/sql/mysql-explain-01' },
                    { text: 'MySQL 실행 계획(Explain) 분석 및 쿼리 튜닝하는 법 #2', link: '/sql/mysql-explain-02' },
                    { text: 'MySQL Collation 설정 및 변경할 때 주의할 점', link: '/sql/collation' },
                    { text: 'MySQL Exchange Partition으로 대용량 테이블 관리하는 법', link: '/sql/mysql-exchange-partition' },
                ],
                collapsed: true
            },
            {
                text: 'Home Network',
                items: [
                    { text: 'Home Network', link: '/home-network/' },
                    { text: 'Nginx Proxy Manager 도입 및 역방향 프록시 구성기', link: '/home-network/nginx-proxy-manager' },
                    { text: 'Certbot으로 무료 SSL 인증서 발급 및 자동 갱신하는 법', link: '/home-network/certbot' },
                    { text: 'Cloudflare에서 Origin Server TLS 인증서 발급 및 적용하는 법', link: '/home-network/cloudflare-tls' },
                    { text: 'Minio 오브젝트 스토리지 구축 및 도입기', link: '/home-network/minio' },
                    { text: 'Portainer 설치 및 도커 컨테이너 편리하게 관리하는 법', link: '/home-network/portainer' },
                    { text: 'Node Exporter 설치 및 시스템 메트릭 수집하는 법', link: '/home-network/node-exporter' },
                    { text: '라즈베리파이 OS 백업 없이 버전 업그레이드하는 법', link: '/home-network/migration-raspberry' },
                    { text: '우분투 기반 개발 환경 및 홈 서버 구축기', link: '/home-network/dev-env' },
                ],
                collapsed: true
            },
            {
                text: 'Cloud',
                items: [
                    { text: 'AWS vs GCP vs Azure 나에게 맞는 클라우드 서비스 선택할 때 고려할 점', link: '/cloud/comparision' },
                    {
                        text: 'AWS',
                        link: '/cloud/aws/',
                        items: [
                            { text: 'Resource', link: '/cloud/aws/resources/' },
                            { text: 'AWS OpenSearch Service 검색 엔진 도입 및 인덱스 설계기', link: '/cloud/aws/opensearch-search-index-design' },
                            { text: 'AWS EC2 Spot Fleet으로 GitLab Runner 저렴하게 구축하는 법', link: '/cloud/aws/gitlab-runner-spot-fleet' }
                        ]
                    }
                ],
                collapsed: true
            },
            {
                text: 'Docker',
                items: [
                    // { text: 'Index', link: '/docker/' },
                    { text: '도커 이미지 조회가 느릴 때 쓰지 않는 리소스 정리하는 법', link: '/docker/docker-image-prune' },
                    { text: '내 컴퓨터 도커(Docker) 리소스 상태 및 상세 정보 확인하는 법', link: '/docker/docker-info' },
                    { text: '우분투(Ubuntu) 환경에 도커(Docker) 최신 버전 설치하는 법', link: '/docker/docker-install-on-ubuntu' },
                    { text: '라즈베리파이에 쿠버네티스 minikube 설치 및 구동하는 법', link: '/docker/minikube' }
                ],
                collapsed: true
            },
            {
                text: 'Kotlin',
                items: [
                    { text: 'Index', link: '/kotlin/' },
                    { text: '코틀린 소스코드 CLI 환경에서 컴파일하고 실행하는 법', link: '/kotlin/compile' },
                    { text: '코틀린 Loop 반복문 효율적으로 사용하는 법', link: '/kotlin/loop' },
                    { text: '코틀린에서 Statement와 Expression 구분할 때 알아야 할 점', link: '/kotlin/statement-expression' },
                    { text: '코틀린 함수 오버로딩(Overloading) 올바르게 구현하는 법', link: '/kotlin/overloading' },
                    { text: '코틀린 확장 함수(Extensions) 구현 및 활용하는 법', link: '/kotlin/method-extension' },
                    { text: '코틀린에서 varargs 가변 인자 정의하고 사용할 때 주의할 점', link: '/kotlin/varargs' },
                    { text: '코틀린 중위 호출(infix)과 구조 분해 선언 활용하는 법', link: '/kotlin/infix-call-destructuring-declaration' },
                    { text: '코틀린 인터페이스(Interface) 설계하고 다중 구현하는 법', link: '/kotlin/interface' },
                    { text: '상속으로 인한 취약한 베이스 클래스(Fragile Base Class) 문제 해결법', link: '/kotlin/fragile-base-class' },
                    { text: '코틀린 스마트 캐스트(Smart Cast) 동작 원리와 안전하게 변환하는 법', link: '/kotlin/smart-casting' },
                    { text: '코틀린 data class의 숨겨진 기능과 유용하게 활용하는 법', link: '/kotlin/data-class' },
                    { text: '코틀린에서 object 키워드로 스레드 안전한 싱글톤 구현하는 법', link: '/kotlin/singleton-object' },
                    { text: '코틀린 람다(Lambda) 표현식과 익명 함수 작성할 때의 꿀팁', link: '/kotlin/lambda' },
                    { text: '코틀린 Sequence로 대용량 데이터 Lazy 처리하여 성능 개선하는 법', link: '/kotlin/lazy-collection' },
                    { text: '코틀린 함수형 인터페이스(SAM) 변환 및 자바 상호 운용할 때 유의사항', link: '/kotlin/SAM' },
                    { text: '코틀린 범위 지정 함수 apply, with, run, let, also 상황별 올바른 사용법', link: '/kotlin/with-apply' },
                    { text: '코틀린 Null Safety 메커니즘을 이해하고 예방하는 법', link: '/kotlin/null-safety'},
                    { text: '코틀린 lateinit과 lazy로 프로퍼티 지연 초기화할 때 차이점', link: '/kotlin/lateinit'},
                    { text: '코틀린 원시 타입(Primitive Type)이 객체로 박싱되는 시점과 성능 최적화하는 법', link: '/kotlin/primitive-type'},
                    { text: '코틀린 불변/가변 컬렉션 구분하고 안전하게 조작하는 법', link: '/kotlin/collection'},
                    { text: '코틀린 산술 연산자 오버로딩 정의하고 커스텀 클래스에 적용하는 법', link: '/kotlin/arithmetic-operator-overloading' },
                    { text: '코틀린 고차 함수(Higher-Order Function)와 inline 함수 최적화할 때의 꿀팁', link: '/kotlin/higher-order-function' },
                    { text: '코틀린 제네릭(Generics)의 공변성(out)과 반공변성(in) 쉽게 이해하는 법', link: '/kotlin/generics' },
                    { text: '코틀린 커스텀 어노테이션 정의하고 리플렉션 활용하는 법', link: '/kotlin/annotation-reflection' },
                    { text: '코틀린 타입 안전한 빌더로 가독성 높은 DSL 설계하는 법', link: '/kotlin/dsl' },
                    { text: '코틀린 코루틴(Coroutine)의 async와 await로 동시성 제어하는 법', link: '/kotlin/coroutine-async-await' },
                    { text: 'KDoc과 Dokka를 활용하여 코틀린 프로젝트 문서화하는 법', link: '/kotlin/kdoc' },
                    { text: '현업에서 활용하는 강력한 코틀린 에코시스템 도입기', link: '/kotlin/eco-system' },
                    { text: '코틀린 코루틴 채널(Channel)을 활용한 비동기 데이터 스트림 처리법', link: '/kotlin/channel' }
                ],
                collapsed: true
            },
            {
                text: 'etc',
                items: [
                    // { text: 'Index', link: '/etc/' },
                    { text: 'Vim(비주얼 에디터)에서 텍스트 복사, 잘라내기, 붙여넣기 완벽 마스터하는 법', link: '/etc/vim-copy-paste' },
                    { text: '팀 협업을 위한 깃 커밋 메시지 규약(Git Convention) 작성법', link: '/etc/git-convention' },
                    { text: '바닐라 자바스크립트로 반응형 웹 탭 메뉴 간단하게 만드는 법', link: '/etc/tab-menu' },
                    { text: 'GitHub SSH 키 생성하고 여러 계정 등록하여 연동하는 법', link: '/etc/git-ssh' },
                    { text: 'Windows 10에 IIS 웹 서버 설치하고 로컬 호스팅하는 법', link: '/etc/windows-iis' },
                    { text: 'SSMS 엑셀 가져오기/내보내기 작업 시 발생하는 오류 해결법', link: '/etc/ssms-tasking' },
                    { text: 'git branch 명령어 실행 시 뷰어가 종료되지 않는 페이저(Pager) 이슈 해결법', link: '/etc/git-branch-pager' },
                    { text: '우분투 한영 전환 시 비주얼 스튜디오 코드(VS Code) 단축키 충돌 해결법', link: '/etc/linux-vsc-alt-r' },
                    { text: '사내 VPN 환경에서 WSL2 네트워크 접속 불가능할 때 MTU 조정 해결법', link: '/etc/wsl-vpn-mtu' },
                    { text: 'DBeaver 대용량 조회 시 발생하는 힙 메모리 부족(Heap Space) 해결법', link: '/etc/dbeaver-heap' },
                    { text: 'Minio 도입기', link: '/home-network/minio' },
                    { text: 'Certbot으로 무료 SSL 인증서 발급 및 자동 갱신하는 법', link: '/home-network/certbot' },
                    { text: '우분투 기반 개발 환경 및 홈 서버 구축기', link: '/home-network/dev-env' },
                    { text: '라즈베리파이 OS 백업 없이 버전 업그레이드하는 법', link: '/home-network/migration-raspberry' },
                    {
                        text: 'TIL',
                        items: [
                            { text: '기능이 넘쳐나는 API가 좋을까? 요구사항에 딱 맞는 API가 좋을까?', link: '/etc/til/api-design' }
                        ]
                    },
                    { text: 'Node Exporter 설치 및 시스템 메트릭 수집하는 법', link: '/home-network/node-exporter' },
                    { text: 'Cloudflare에서 Origin Server TLS 인증서 발급 및 적용하는 법',  link: '/home-network/cloudflare-tls' },
                    { text: 'Nginx Proxy Manager 도입 및 역방향 프록시 구성기', link: '/home-network/nginx-proxy-manager' },
                    { text: 'Portainer 설치 및 도커 컨테이너 편리하게 관리하는 법', link: '/home-network/portainer' },
                ],
                collapsed: true
            },
            {
                text: 'Java',
                items: [
                    // { text: 'Index', link: '/java/' },
                    { text: '자바 XML 파서 의존성 충돌로 인한 Xerces Hell 극복 및 해결법', link: '/java/xerces-hell' },
                    { text: 'JVM 힙(Heap) 메모리 구조와 가비지 컬렉션(GC) 동작 원리 쉽게 이해하는 법', link: '/java/jvm-heap-GC' },
                    { text: 'JVM에서 객체 헤더 크기를 획기적으로 줄여주는 Compact Object Headers 도입기', link: '/java/jvm-compact-object-headers' },
                    { text: 'Jackson이나 Gson에서 특정 JSON 필드를 동적으로 제외하는 법', link: '/java/field-exclude' },
                    { text: '메이븐(Maven) 및 그레이들(Gradle)의 깨진 로컬 캐시 안전하게 비우는 법', link: '/java/maven-gradle-cache' }
                ],
                collapsed: true,
            },
            {
                text: 'Spring',
                items: [
                    { text: '스프링 시큐리티(Spring Security) 아키텍처 이해하고 커스텀 필터 구현하는 법', link: '/spring/spring-security' },
                    { text: '스프링 DispatcherServlet의 동작 과정과 서블릿 기반 요청 처리하는 법', link: '/spring/dispatcher-servlet' },
                    { text: '스프링 컨텍스트 외부에서 요청을 제어하는 웹 필터(Web Filter) 활용하는 법', link: '/spring/web-filter' },
                    { text: '스프링 인터셉터(HandlerInterceptor)로 공통 비즈니스 로직 가로채는 법', link: '/spring/interceptor' },
                    { text: '스프링 부트 2.7.x에서 3.2.x 버전으로 마이그레이션할 때 주의할 점', link: '/spring/spring-3-2' },
                    { text: '스프링 부트 3 환경에서 4 버전으로 원활하게 마이그레이션하는 법', link: '/spring/spring-boot-4-migration' },
                    { text: '스프링 부트에 로컬 캐시 라이브러리인 카페인 캐시(Caffeine) 도입기', link: '/spring/local-cache-caffeine' },
                    { text: '스프링 부트 환경에 분산 환경을 위한 Redis 원격 캐시 도입기', link: '/spring/remote-cache-redis' },
                    { text: '스프링 부트에서 GlobalExceptionHandler로 예외 통합 처리하는 법', link: '/spring/global-exception-handler' },
                    { text: 'Jasypt를 사용하여 설정 파일의 민감한 프로퍼티 암호화하는 법', link: '/spring/jasypt' },
                    {
                        text: 'JPA',
                        link: '/spring/jpa/',
                        items: [
                            { text: '스프링 데이터 JPA 환경에서 하이버네이트(Hibernate) 2차 캐시 적용하는 법', link: '/spring/jpa/hibernate-jpa' },
                            { text: 'Transactional', link: '/coming-soon' },
                            { text: 'Dirty check', link: '/coming-soon' },
                            { text: 'Reader DB', link: '/coming-soon' },
                            { text: 'Transactional propagation', link: '/coming-soon' },
                            { text: 'Envers', link: '/coming-soon' },
                            { text: 'Persistent context', link: '/coming-soon' },
                            { text: 'Entity graph', link: '/coming-soon' },
                        ]
                    }
                ],
                collapsed: true
            },
            {
                text: 'Nodejs',
                items: [
                    { text: '사내 보안망 환경에서 npm install 시 발생하는 TLS/SSL 인증서 오류 해결법', link: '/nodejs/npm-tls-issue' },
                ],
                collapsed: true
            },
            {
                text: 'Ansible',
                items: [
                    { text: '리눅스 및 macOS 환경에 앤서블(Ansible) 설치하는 법', link: '/ansible/installation' },
                    { text: '앤서블(Ansible) 관리를 위한 호스트 인벤토리(Inventory) 설정법', link: '/ansible/inventory' },
                    { text: '앤서블(Ansible) 플레이북과 핵심 모듈 활용하여 배포하는 법', link: '/ansible/playbook-modules' },
                    { text: '서버 프로비저닝 자동화를 위한 앤서블(Ansible) 플레이북 작성 실습기', link: '/ansible/practice' },
                ],
                collapsed: true
            },
            {
                text: 'Kubernetes',
                items: [
                    { text: 'AWS EKS 클러스터에 헬름 차트로 프로메테우스 모니터링 구축기', link: '/kubernetes/prometheus-eks-helm' },
                ],
                collapsed: true
            }
        ],
        logo: LOGO_PATH,
        nav: [
            { text: 'Home', link: '/' }
        ],
        docFooter: {
            prev: '이전 페이지',
            next: '다음 페이지'
        },
        footer: {
            message: 'Email: echo.youn@kakao.com',
            copyright: 'no copy right on this documents'
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/echo-youn/echo-log' },
            // { icon: 'twitter', link: '...' },
            // // You can also add custom icons by passing SVG as string:
            // {
            //   icon: {
            //     svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Dribbble</title><path d="M12...6.38z"/></svg>'
            //   },
            //   link: '...'
            // }
        ],
        editLink: {
            pattern: 'https://github.com/echo-youn/echo-log/edit/main/docs/:path',
            text: 'Edit this page on GitHub'
        },
        lastUpdated: {
            text: 'Updated Date'
        },
        search: {
            provider: 'local',
            // options: {
            //     appId: 'KUIWK09R9Y',
            //     apiKey: 'e7c343fceec7677429432debe8d5ad53',
            //     indexName: 'vitepress'
            // }
        }
    },
    lastUpdated: true,
    cleanUrls: true
})

export default config
