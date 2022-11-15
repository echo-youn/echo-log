<template>
    <div ref="comment"></div>
</template>

<script setup lang="ts">
import { defineComponent, onMounted, onUpdated, ref } from 'vue'
const props = defineProps({
    url: String || null
})

const comment = ref(null)

onMounted(() => {
    // SSR 마운트시, link-text에 이벤트를 등록하기 위해서 검색한다.
    let classes = document.getElementsByClassName('link-text')

    for(let i in classes) {
        if(typeof classes[i] != 'function' && typeof classes[i] != 'number') {
            // Client Side에서 동작할 함수.
            classes[i].addEventListener('click', (e) => {
                const utterances = document.createElement('script');
                utterances.type = 'text/javascript';
                utterances.async = true;
                utterances.crossOrigin = 'anonymous';
                utterances.src = 'https://utteranc.es/client.js';

                utterances.setAttribute('issue-term', 'url'); // pathname|url|title|og:title 중 택 1
                utterances.setAttribute('theme', 'github-dark'); // theme 설정
                utterances.setAttribute('repo', `echo-youn/echo-log`); // 사용할 repository
                
                // 메뉴 이동(클릭)시 마다 댓글 node를 찾아서 있으면 없애고 다시 로딩한다.
                if(document.getElementsByClassName("utterances")[0]) {
                    comment._value.removeChild(document.getElementsByClassName("utterances")[0])
                }
                
                comment._value.appendChild(utterances)
            })
        }
    }
})
</script>

<style>

</style>