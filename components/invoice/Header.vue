<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
    <div class="faq__light">
        <div class="light" />
    </div>

    <div class="faq__header">
        <NuxtLink :to="localePath('/')" class="back">
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 13L1 7L7 1" stroke="white" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </NuxtLink>

        <div class="title">
            {{ $t('Payment by invoice') }}
        </div>

        <div />
    </div>
</template>

<style lang="css" scoped>
.faq__light .light {
    width: 70vw;
    height: 50vw;
    border-radius: 100%;
    position: absolute;
    top: -40vw;
    left: 13vw;
    background-color: #B2E500;
    filter: blur(15vw);
}

.faq__header {
    z-index: 999;
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 25px 15px;
    align-items: center;
    border-bottom: 1px rgba(255, 255, 255, 0.3) dashed;
}

.faq__header .back {
    background-color: transparent;
    outline: none;
    border: none;
    cursor: pointer;
    display: flex;
    padding-top: 5px;
}

.faq__header .title {
    font-size: 20px;
    font-weight: bold;
}
</style>