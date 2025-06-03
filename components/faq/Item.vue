<script setup lang="ts">
import type { IFaq } from '~/types/faq';

defineProps<{ item: IFaq }>()

</script>

<template>
    <div class="faq__item">
        <div class="title">
            <span>
                {{ item.id }}. {{ item.question }}
            </span>
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 0.999999L7 7L1 1" stroke="#B2E500" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </div>
        <div class="text" v-html="item.answer"/>
    </div>
</template>

<style lang="css" scoped>
.faq__item {
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(217, 217, 217, 0.05);
    overflow: hidden;
    height: auto;
    box-sizing: border-box;
    border-radius: 5px;
    transition: ease-in-out 0.2s;

}

.faq__item.active>.text {
    height: auto;
    padding: 5px 15px 18px 15px;
}

.faq__item .title svg {
    width: 16px;
    height: 8px;
    min-width: 16px;
    transform: rotate(0deg);
}

.faq__item.active .title svg {
    transform: rotate(180deg);
}

.faq__item .text {
    font-size: 15px;
    font-weight: 300;

    height: 0;
    padding: 0;
}

.faq__item .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    cursor: pointer;
}

.faq__item .title span {
    font-size: 15px;
    font-weight: bold;
}

.faq__item .title svg {
    transition: ease-in-out 0.2s;
}
</style>