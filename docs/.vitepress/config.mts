import { defineConfig, HeadConfig, MarkdownOptions } from 'vitepress'

/**
 * This is for base url.
 */
const GITHUB_BASE_REPOSITORY_NAME = '/'
const LOGO_PATH = 'https://user-images.githubusercontent.com/39899731/201515448-b438b045-21ba-4028-8915-e2d7a9706d0e.png'

// https://vitepress.dev/reference/site-config#markdown
const markdownOptions: MarkdownOptions = {
    lineNumbers: true,
    image: {
        lazyLoading: true
    },
}

const headConfig: HeadConfig[] = [
    ['link', { rel: 'icon', href: LOGO_PATH }], // <link rel="icon" href="LOGO_PATH" />
    ['script', { src: 'https://www.googletagmanager.com/gtag/js?id=G-SCG97TK6W1', async: 'true' }],
    ['script', {}, `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-SCG97TK6W1');`],
    ['script', {async: 'true', src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4911149630505567', crossorigin: 'anonymous'}]
]

const config = defineConfig({
    lang: 'ko-KR',
    title: 'Echo Youn',
    description: `Echo's extra-ordinary journey`,
    head: headConfig,
    base: GITHUB_BASE_REPOSITORY_NAME,
    markdown: markdownOptions,
    appearance: 'dark',
    themeConfig: {
        sidebar: [
            {
                text: 'Home',
                items: [
                    { text: 'Home', link: '/' },
                    { text: 'Clean Code', link: '/clean-code' }
                ],
                collapsed: true
            },
            {
                text: 'sql',
                items: [
                    // { text: 'Index', link: '/sql/' },
                    // { text: 'About Index', link: '/sql/about-index' },
                    { text: 'Explain #1', link: '/sql/mysql-explain-01' },
                    { text: 'Explain #2', link: '/sql/mysql-explain-02' },
                    { text: 'Collation', link: '/sql/collation' },
                    { text: 'Exchange Partition', link: '/sql/mysql-exchange-partition' },
                ],
                collapsed: true
            },
            {
                text: 'Cloud',
                items: [
                    { text: '클라우드 비교', link: '/cloud/comparision' },
                    {
                        text: 'AWS',
                        link: '/cloud/aws/',
                        items: [
                            { text: 'Resource', link: '/cloud/aws/resources/' }
                        ]
                    }
                ],
                collapsed: true
            },
            {
                text: 'Docker',
                items: [
                    // { text: 'Index', link: '/docker/' },
                    { text: '도커 이미지 조회가 느릴 때', link: '/docker/docker-image-prune' },
                    { text: '도커 정보 보기', link: '/docker/docker-info' },
                    { text: '우분투에 도커 설치하기', link: '/docker/docker-install-on-ubuntu' },
                    { text: '라즈베리파이에 minikube 설치', link: '/docker/minikube' }
                ],
                collapsed: true
            },
            {
                text: 'Kotlin',
                items: [
                    { text: 'Index', link: '/kotlin/' },
                    { text: '컴파일', link: '/kotlin/compile' },
                    { text: '반복문', link: '/kotlin/loop' },
                    { text: 'Statement & Expression', link: '/kotlin/statement-expression' },
                    { text: '오버로딩', link: '/kotlin/overloading' },
                    { text: '확장 메서드', link: '/kotlin/method-extension' },
                    { text: '가변인자', link: '/kotlin/varargs' },
                    { text: '중위 호출 및 구조 분해 선언', link: '/kotlin/infix-call-destructuring-declaration' },
                    { text: '인터페이스', link: '/kotlin/interface' },
                    { text: '취약한 베이스 클래스', link: '/kotlin/fragile-base-class' },
                    { text: '스마트 캐스팅', link: '/kotlin/smart-casting' },
                    { text: '데이터 클래스', link: '/kotlin/data-class' },
                    { text: '싱글톤 객체', link: '/kotlin/singleton-object' },
                    { text: '람다', link: '/kotlin/lambda' },
                    { text: 'lazy-collection', link: '/kotlin/lazy-collection' },
                    { text: '함수형 인터페이스(SAM)', link: '/kotlin/SAM' },
                    { text: 'with apply', link: '/kotlin/with-apply' },
                    { text: 'null safety', link: '/kotlin/null-safety'},
                    { text: 'lateInit', link: '/kotlin/lateinit'},
                    { text: 'primitive type', link: '/kotlin/primitive-type'},
                    { text: 'collection', link: '/kotlin/collection'},
                    { text: '산술 연산자 오버로딩', link: '/kotlin/arithmetic-operator-overloading' },
                    { text: '고차 함수', link: '/kotlin/higher-order-function' },
                    { text: '제네릭스', link: '/kotlin/generics' },
                    { text: '어노테이션과 리플렉션', link: '/kotlin/annotation-reflection' },
                    { text: 'DSL', link: '/kotlin/dsl' },
                    { text: '코루틴과 Async & Await', link: '/kotlin/coroutine-async-await' },
                    { text: '코틀린 문서화(케이독)', link: '/kotlin/kdoc' },
                    { text: '코틀린 에코시스템 소개', link: '/kotlin/eco-system' },
                    { text: 'Channel', link: '/kotlin/channel' }
                ],
                collapsed: true
            },
            {
                text: 'etc',
                items: [
                    // { text: 'Index', link: '/etc/' },
                    { text: 'Vim 복사 붙여넣기', link: '/etc/vim-copy-paste' },
                    { text: 'Git convention', link: '/etc/git-convention' },
                    { text: 'Javascript로 탭메뉴 만들기', link: '/etc/tab-menu' },
                    { text: 'Github SSH 키 사용하기', link: '/etc/git-ssh' },
                    { text: 'Windows IIS 설치', link: '/etc/windows-iis' },
                    { text: 'SSMS 엑셀 태스킹 오류', link: '/etc/ssms-tasking' },
                    { text: 'git branch pager 이슈', link: '/etc/git-branch-pager' },
                    { text: '우분투 한/영키 비주얼스튜디오 버그', link: '/etc/linux-vsc-alt-r' },
                    { text: 'DBeaver 힙 메모리 부족', link: '/etc/dbeaver-heap' },
                    { text: 'Minio 도입기', link: '/etc/minio' },
                    { text: 'Certbot으로 인증서 적용 및 자동갱신 등록', link: '/etc/certbot' },
                    { text: '개발환경 구축 일기', link: '/etc/dev-env' },
                    { text: '라즈베리파이 버전 업그레이드', link: '/etc/migration-raspberry' },
                    {
                        text: 'TIL',
                        items: [
                            { text: '기능이 넘쳐나는 API가 좋을까? 요구사항에 딱 맞는 API가 좋을까?', link: '/etc/til/api-design' }
                        ]
                    },
                    { text: 'node exporter 추가', link: '/etc/node-exporter' },
                    { text: 'Cloudflare에서 Origin Server TLS 인증서 발급받고 적용하기',  link: '/etc/cloudflare-tls' },
                ],
                collapsed: true
            },
            {
                text: 'Java',
                items: [
                    // { text: 'Index', link: '/java/' },
                    { text: 'Xerces 지옥 벗어나기', link: '/java/xerces-hell' },
                    { text: 'Jvm Heap & GC', link: '/java/jvm-heap-GC' },
                    { text: '필드 동적으로 제외시키기', link: '/java/field-exclude' },
                    { text: '자바 의존성 로컬 캐시 비우기', link: '/java/maven-gradle-cache' }
                ],
                collapsed: true,
            },
            {
                text: 'Spring',
                items: [
                    { text: 'Spring Security', link: '/spring/spring-security' },
                    { text: 'Servlet', link: '/spring/dispatcher-servlet' },
                    { text: 'Web filter', link: '/spring/web-filter' },
                    { text: 'Interceptor', link: '/spring/interceptor' },
                    { text: '스프링부트 2.7.5에서 3.2로 업데이트', link: '/spring/spring-3-2' },
                    { text: '카페인 캐시 적용', link: '/spring/local-cache-caffeine' },
                    { text: '레디스 캐시 적용', link: '/spring/remote-cache-redis' },
                    { text: 'GlobalExceptionHandler', link: '/spring/global-exception-handler' },
                    { text: '프로퍼티 암호로 관리하기 Jasypt', link: '/spring/jasypt' },
                    {
                        text: 'JPA',
                        link: '/spring/jpa/',
                        items: [
                            { text: 'Hibernate and jpa', link: '/spring/jpa/hibernate-jpa' },
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
                    { text: 'Node TLS issue', link: '/nodejs/npm-tls-issue' },
                ],
                collapsed: true
            },
            {
                text: 'Ansible',
                items: [
                    { text: 'Installation', link: '/ansible/installation' },
                    { text: 'Inventory', link: '/ansible/inventory' },
                    { text: 'Playbook & Modules', link: '/ansible/playbook-modules' },
                    { text: 'Practice', link: '/ansible/practice' },
                ],
                collapsed: true
            },
            {
                text: 'Kubernetes',
                items: [
                    { text: 'AWS EKS 에 Prometheus 헬름차트로 구성', link: '/kubernetes/prometheus-eks-helm' },
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
