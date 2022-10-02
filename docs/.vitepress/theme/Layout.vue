<script lang="ts" setup>
    import DefaultTheme from 'vitepress/theme'
    
    const { Layout } = DefaultTheme
</script>
    
<template>
    <h1>custom Layout?</h1>
    <Layout>
        <template #aside-outline-before>
            My custom sidebar top content
        </template>
        <template #doc-after>
            after doc
        </template>
        <template #nav-bar-title-before>
            lol
        </template>
        <template #nav-bar-content-before>
            lllll
        </template>
        <template #nav-bar-content-after>
            lllll222222222222
        </template>
        <template #nav-screen-content-before>
            kk
        </template>
        <template #nav-screen-content-after>
            xx
        </template>
        <template #aside-ads-before>
            ads?
        </template>
        <template #nav-search>
            hi
        </template>
    </Layout>

    <Content/>
</template>