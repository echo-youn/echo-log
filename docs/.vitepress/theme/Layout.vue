<script lang="ts" setup>
import { onUpdated } from '@vue/runtime-core'
import DefaultTheme from 'vitepress/theme'
import Utterance from './Utterance.vue'

onUpdated(() => {
  console.log(123)
})

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #doc-after>
      <ClientOnly>
        <Utterance />
      </ClientOnly>
    </template>
    <!-- EMPTY -->
  </Layout>
  <!-- this is where markdown content will be rendered -->
  <!-- <Content /> -->
</template>
