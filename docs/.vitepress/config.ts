import { defineConfig } from 'vitepress'

const config = defineConfig({
    title: 'VitePress',
    description: 'Play Aroung',
    base: '/echo-log/',
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