import { defineConfig } from 'vitepress'

/**
 * This is for base url.
 */
const GITHUB_BASE_REPOSITORY_NAME = '/echo-log/'

const config = defineConfig({
    title: 'VitePress',
    description: 'Play Aroung',
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
                    { text: 'About Index', link: '/sql/about-index' }
                ],
                collapsible: true,
                collapsed: true
            },
            {
                text: 'AWS',
                items: [
                    { text: 'AWS TO AWS', link : '/aws/' }, // End with slash for bind with index of directory.
                    { text: 'AWS ASSO', link: '/aws/solution-architect-associate/' }
                ],
                collapsible: true,
                collapsed: true
            }
        ],
        siteTitle: 'Echo Youn',
        logo: '/favicon.png',
        nav: [
            { text: 'Home', link: '/' }
        ],
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
        footer: {
            message: 'Hi',
            copyright: 'No Copy right'
        },
        algolia: {
            appId: '',
            apiKey: '',
            indexName: 'vitepress'
        }
    },
    lastUpdated: true
})

export default config