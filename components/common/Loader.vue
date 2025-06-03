<script setup lang="ts">
defineProps<{
    small?: boolean
}>()
</script>

<template>
    <div class="loader" :class="{ 'small': small }">
        <div class="spinner"/>
    </div>
</template>

<style scoped>
.loader {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    position: relative;
    width: 50px;
    height: 50px;
    background-color: transparent;
}

.loader.small {
    width: 1.5rem;
    height: 1.5rem;
}

.spinner {
    border: 5px solid transparent;
    border-top: 5px solid #95b71d;
    border-radius: 50%;
    width: 100%;
    height: 100%;
    animation: spin 1.2s linear infinite;
}

.loader.small .spinner {
    border: 2px solid transparent;
    border-top: 2px solid #95b71d;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>