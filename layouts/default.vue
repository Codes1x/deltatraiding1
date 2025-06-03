<script setup lang="ts">
// Создаем реактивную переменную для ширины окна
const maxWidth = ref(0);

onMounted(() => {
    // Получаем текущую ширину окна
    maxWidth.value = window.innerWidth;

});
</script>

<template>
    <Suspense>
        <template #default>
            <div class="content" :style="{ maxWidth: maxWidth + 'px' }">
                <ClientOnly>
                    <div class="page">
                        <slot />
                    </div>
                    <MainMenu :style="{ maxWidth: maxWidth + 'px' }" />
                </ClientOnly>
            </div>
        </template>
        <template #fallback>
            <div class="loading">Загрузка...</div>
        </template>
    </Suspense>


</template>

<style lang="css">
/* Сбрасываем стили для body и html */
html,
body {
    margin: 0;
    padding: 0;
    height: 100%;
}

.loading-screen {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 18px;
}
</style>
