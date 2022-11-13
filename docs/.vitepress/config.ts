import { defineConfig } from 'vitepress'

/**
 * This is for base url.
 */
const GITHUB_BASE_REPOSITORY_NAME = '/echo-log/'

const config = defineConfig({
    title: 'Echo Youn',
    description: `Echo's extra-ordinary journey`,
    base: GITHUB_BASE_REPOSITORY_NAME,
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
                    { text: '도커 정보 보기', link: '/docker/docker-info' }
                ],
                collapsible: true,
                collapsed: true
            },
            {
                text: 'etc',
                items: [
                    { text: 'Index', link: '/etc/' },
                    { text: 'Vim 복사 붙여넣기', link: '/etc/vim-copy-paste' },
                    { text: 'Git convention', link: '/etc/git-convention' }
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
        logo: '/favicon.png',
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
    lastUpdated: true
})

export default config
