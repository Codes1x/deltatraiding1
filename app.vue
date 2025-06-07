<script setup lang="ts">
import { onMounted } from 'vue'
import { useTgWebAppStore } from '@/stores/tgWebApp'
import { useWebAppViewport } from 'vue-tg'

const tgWebAppStore = useTgWebAppStore()
const tgWebAppViewport = useWebAppViewport()

onMounted(async () => {
  await tgWebAppStore.initializeApp()
})

// Expand viewport - can be called early
tgWebAppViewport.expand()

const retryInitialization = async () => {
  // Reset error before retrying might be good depending on UX preference
  // tgWebAppStore.initializationError = null;
  await tgWebAppStore.initializeApp()
}
</script>

<template>
  <div>
    <div v-if="tgWebAppStore.isLoading" class="app-status-overlay app-loading">
      <div class="loading-message">Загрузка приложения...</div>
      <div class="progress-bar-container-global">
        <div class="progress-bar-global">
          <div class="progress-fill-global" :style="{ width: tgWebAppStore.loadingProgressPercentage + '%' }" />
        </div>
      </div>
    </div>
    <div v-else-if="tgWebAppStore.initializationError" class="app-status-overlay app-error">
      <p>Error initializing application:</p>
      <pre>{{ tgWebAppStore.initializationError }}</pre>
      <button @click="retryInitialization">Retry</button>
    </div>
    <NuxtLayout v-else>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style scoped>
.app-status-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  background-color: #000000; /* Устанавливаем фон на черный */
  color: #ffffff; /* Оставляем цвет текста белым для контраста */
}

.app-loading {
  /* Specific styles for loading state if needed */
}

.app-error {
  background-color: rgba(255, 0, 0, 0.8); /* Example error state styling */
  color: white;
}

.loading-message {
  font-size: 1.2em;
  margin-bottom: 20px; /* Отступ снизу от сообщения до прогресс-бара */
}

.error-details {
  margin-top: 10px;
  padding: 10px;
  background-color: rgba(0,0,0,0.1);
  border-radius: 5px;
  max-width: 80%;
  overflow-x: auto;
  white-space: pre-wrap; /* Ensures long error messages wrap */
  word-break: break-all;
}

.app-error button {
  padding: 10px 20px;
  margin-top: 15px;
  font-size: 1em;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f0f0f0;
}

.app-error button:hover {
  background-color: #e0e0e0;
}

/* Стили для кастомного прогресс-бара, адаптированные из CountdownTimer.vue */
.progress-bar-container-global {
    width: 70%; /* Сделаем его поменьше, как в первоначальном запросе */
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px; /* Отступ сверху, если сообщение выше */
}

.progress-bar-global {
    width: 100%;
    height: 8px; /* Высота как в CountdownTimer */
    background-color: #333333; /* Слегка осветлим фон трека для лучшего контраста с черным оверлеем */
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill-global {
    height: 100%;
    background-color: #95b71d; /* Цвет заполнения как в CountdownTimer */
    /* width is now controlled by style binding */
    transition: width 0.3s ease-in-out; /* Плавный переход для ширины */
}

/* @keyframes indeterminateAnimation is no longer needed */
</style>
