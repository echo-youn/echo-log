<template>
    <div ref="comment"></div>
</template>

<script setup lang="ts">
import { defineComponent, onMounted, onUpdated, ref } from 'vue'
const props = defineProps({
    url: String || null
})

const comment = ref(null)

const utterances = document.createElement('script');
    utterances.type = 'text/javascript';
    utterances.async = true;
    utterances.crossOrigin = 'anonymous';
    utterances.src = 'https://utteranc.es/client.js';

    utterances.setAttribute('issue-term', 'url'); // pathname|url|title|og:title 중 택 1
    utterances.setAttribute('theme', 'github-dark'); // theme 설정
    utterances.setAttribute('repo', `echo-youn/echo-log`); // 사용할 repository

onMounted(() => {
    console.log(props.url + '2')
    comment._value.appendChild(utterances)
})

onUpdated(() => {
    console.log(props.url)
    comment._value.appendChild(utterances)
})
</script>

<style>

</style>