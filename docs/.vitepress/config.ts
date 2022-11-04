import { defineConfig } from 'vitepress'

/**
 * This is for base url.
 */
const GITHUB_BASE_REPOSITORY_NAME = '/echo-log/'

const config = defineConfig({
    title: 'Echo Youn',
    description: `Play Aroung
    Description
    A
    B
    C
    D`,
    base: GITHUB_BASE_REPOSITORY_NAME,
    themeConfig: {
        sidebar: [
            {
                text: 'Home',
                items: [
                    { text: 'Home', link : '/' },
                    { text: 'Clean Code', link: '/clean-code'}
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
                    { text: 'Explain #2', link: '/sql/mysql-explain-02' }
                ],
                collapsible: true,
                collapsed: true
            },
            {
                text: 'Cloud',
                items: [
                    { text: '클라우드 비교', link: '/cloud/comparision' },
                    { text: 'AWS', link: '/cloud/aws/', items: [{ text: 'Resource', link: '/cloud/aws/resources/' }]}
                ],
                collapsible: true,
                collapsed: true
            },
            {
                text: 'Docker',
                items: [
                    { text: 'Index', link: '/docker/' },
                    { text: 'docker images 조회가 느릴 때', link: '/docker/docker-image-prune' }
                ],
                collapsible: true,
                collapsed: true
            },
            {
                text: 'etc',
                items: [
                    { text: 'Index', link: '/etc/'},
                    { text: 'Vim-copy-paste', link: '/etc/vim-copy-paste'}
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
            appId: '',
            apiKey: '',
            indexName: 'vitepress'
        }
    },
    lastUpdated: true
})

export default config
