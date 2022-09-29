import { defineConfigWithTheme } from 'vitepress'
import fs from 'fs'

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
        setTitle: 'My Custom Title',
        logo: '/favicon.png',
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