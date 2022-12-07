import { defineConfig } from 'vitepress'

/**
 * This is for base url.
 */
const GITHUB_BASE_REPOSITORY_NAME = '/'
const LOGO_PATH = 'https://user-images.githubusercontent.com/39899731/201515448-b438b045-21ba-4028-8915-e2d7a9706d0e.png'

const config = defineConfig({
    title: 'Echo Youn',
    description: `Echo's extra-ordinary journey`,
    base: GITHUB_BASE_REPOSITORY_NAME,
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
                collapsible: true,
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
                collapsible: true,
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
                collapsible: true,
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
                collapsible: true,
                collapsed: true
            },
            {
                text: 'Kotlin',
                items: [
                    { text: 'Index', link: '/kotlin/' },
                    { text: '컴파일', link: '/kotlin/compile' },
                    { text: '반복문', link: '/kotlin/loop' },
                    { text: 'Statement & Expression', link: '/kotlin/statement-&-expression' },
                    { text: '오버로딩', link: '/kotlin/overloading' },
                    { text: '확장 메서드', link: '/kotlin/method-extension' },
                    { text: '가변인자', link: '/kotlin/varargs' },
                    { text: '중위 호출 및 구조 분해 선언', link: '/kotlin/infix-call-destructuring-declaration' },
                    { text: '인터페이스', link: '/kotlin/interface' },
                ],
                collapsed: true,
                collapsible: true
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
                ],
                collapsible: true,
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
                collapsible: true
            },
            {
                text: 'Spring Boot',
                items: [
                    { text: 'Index', link: '/springBoot/' },
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
                collapsible: true,
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
    cleanUrls: 'without-subfolders'
})

export default config
