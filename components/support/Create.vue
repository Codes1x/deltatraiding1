<script setup lang="ts">
const emits = defineEmits(['new-ticket'])
</script>

<template>
    <div class="support__create">
        <span>{{ $t('Create new ticket') }}</span>
        <button class="support__create-btn" @click="emits('new-ticket')">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 1V15M1 8H15" stroke="white" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </button>
    </div>
</template>

<style lang="css" scoped>
.support__create {
    display: flex;
    padding: 35px 15px;
    justify-content: space-between;
    align-items: center;
}

.support__create span {
    font-size: 16px;
}

.support__create-btn {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #95B71D;
    border-radius: 5px;
    outline: none;
    border: none;
    cursor: pointer;
    transition: ease-in-out 0.2s;
}

.support__create-btn :hover {
    opacity: 0.8;
}
</style>