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
                    { text: 'Home', link : '/' }
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
                text: 'AWS',
                items: [
                    { text: 'Index', link: '/aws/' },
                    { text: 'Resources', link: '/aws/resources/' }
                ],
                collapsible: true,
                collapsed: true
            }
        ],
        logo: '/favicon.png',
        nav: [
            { text: 'Home', link: '/' }
        ],
        footer: {
            message: 'Hi',
            copyright: 'No Copy right'
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
            { icon: 'twitter', link: '...' },
            // You can also add custom icons by passing SVG as string:
            {
              icon: {
                svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Dribbble</title><path d="M12...6.38z"/></svg>'
              },
              link: '...'
            }
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
