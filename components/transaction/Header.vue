<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
    <div class="transaction__light">
        <div class="light left" />
        <div class="light right" />
    </div>

    <div class="transaction__header">
        <NuxtLink :to="localePath('/')" class="back">
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 13L1 7L7 1" stroke="white" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </NuxtLink>

        <div class="title">
            {{ $t('nav_transactions') }}
        </div>

        <div />
    </div>
</template>

<style lang="css" scoped>
.transaction__light .light {
    width: 60vw;
    height: 55vw;
    border-radius: 100%;
    position: absolute;
    top: -40vw;
    filter: blur(15vw);
}

.transaction__light .left {
    background-color: #5A5A5A;
    left: 0;
}

.transaction__light .right {
    background-color: #B2E500;
    right: 0;
}

.transaction__header {
    z-index: 999;
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 25px 15px;
    align-items: center;
    border-bottom: 1px rgba(255, 255, 255, 0.3) dashed;
}

.transaction__header .back {
    background-color: transparent;
    outline: none;
    border: none;
    cursor: pointer;
    display: flex;
    padding-top: 5px;
}

.transaction__header .title {
    font-size: 24px;
    font-weight: bold;
}
</style>