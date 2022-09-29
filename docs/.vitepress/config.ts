import { defineConfigWithTheme } from 'vitepress'

/**
 * This is for base url.
 */
const GITHUB_BASE_REPOSITORY_NAME = '/echo-log/'

const config = defineConfigWithTheme({
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
            }
        ],
        setTitle: 'My Custom Title',
        logo: '/image.png',
        nav: [
            { text: 'Home', link: '/' }
        ],
        footer: {
            message: 'Hi',
            copyright: 'No Copy right'
        }
    }
})

export default config