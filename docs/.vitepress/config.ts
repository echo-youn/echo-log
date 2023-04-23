import { defineConfig, MarkdownOptions } from 'vitepress'

/**
 * This is for base url.
 */
const GITHUB_BASE_REPOSITORY_NAME = '/'
const LOGO_PATH = 'https://user-images.githubusercontent.com/39899731/201515448-b438b045-21ba-4028-8915-e2d7a9706d0e.png'

// https://vitepress.dev/reference/site-config#markdown
const markdownOptions: MarkdownOptions = {
    lineNumbers: true,
}

const config = defineConfig({
    lang: 'ko-KR',
    title: 'Echo Youn',
    description: `Echo's extra-ordinary journey`,
    base: GITHUB_BASE_REPOSITORY_NAME,
    markdown: markdownOptions,
    head: [
        ['link', { rel: 'icon', href: LOGO_PATH }], // <link rel="icon" href="LOGO_PATH" />
    ],
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
                    { text: 'Index', link: '/sql/' },
                    { text: 'About Index', link: '/sql/about-index' },
                    { text: 'Explain #1', link: '/sql/mysql-explain-01' },
                    { text: 'Explain #2', link: '/sql/mysql-explain-02' },
                    { text: 'Collation', link: '/sql/collation' }
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
                    { text: 'Index', link: '/docker/' },
                    { text: '도커 이미지 조회가 느릴 때', link: '/docker/docker-image-prune' },
                    { text: '도커 정보 보기', link: '/docker/docker-info' },
                    { text: '우분투에 도커 설치하기', link: '/docker/docker-install-on-ubuntu' }
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
                    { text: 'Index', link: '/etc/' },
                    { text: 'Vim 복사 붙여넣기', link: '/etc/vim-copy-paste' },
                    { text: 'Git convention', link: '/etc/git-convention' },
                    { text: 'Javascript로 탭메뉴 만들기', link: '/etc/tab-menu' },
                    { text: 'Github SSH 키 사용하기', link: '/etc/git-ssh' },
                    { text: 'Windows IIS 설치', link: '/etc/windows-iis' },
                    { text: 'SSMS 엑셀 태스킹 오류', link: '/etc/ssms-tasking' },
                    { text: 'git branch pager 이슈', link: '/etc/git-branch-pager' },
                    { text: '우분투 한/영키 비주얼스튜디오 버그', link: '/etc/linux-vsc-alt-r' },
                    { text: 'DBeaver 힙 메모리 부족', link: '/etc/dbeaver-heap' },
                    {
                        text: 'TIL',
                        items: [
                            { text: '기능이 넘쳐나는 API가 좋을까? 요구사항에 딱 맞는 API가 좋을까?', link: '/etc/til/api-design' }
                        ]
                    }
                ],
                collapsed: true
            },
            {
                text: 'Java',
                items: [
                    { text: 'Index', link: '/java/' },
                    { text: 'Xerces 지옥 벗어나기', link: '/java/xerces-hell' },
                    { text: 'Jvm Heap & GC', link: '/java/jvm-heap-GC' },
                ],
                collapsed: true,
            },
            {
                text: 'Spring Boot',
                items: [
                    { text: 'Index', link: '/springBoot/' },
                    { text: 'Spring Security', link: '/springBoot/spring-security' },
                    { text: 'Servlet', link: '/springBoot/dispatcher-servlet' },
                    { text: 'Web filter', link: '/springBoot/web-filter' },
                    { text: 'Interceptor', link: '/springBoot/interceptor' },
                    {
                        text: 'JPA',
                        link: '/springBoot/jpa/',
                        items: [
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
            message: 'Hi',
            copyright: 'No Copy right'
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
        lastUpdatedText: 'Updated Date',
        algolia: {
            appId: 'KUIWK09R9Y',
            apiKey: 'e7c343fceec7677429432debe8d5ad53',
            indexName: 'vitepress'
        }
    },
    lastUpdated: true,
    cleanUrls: true
})

export default config
