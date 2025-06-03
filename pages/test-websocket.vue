<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRobotStore } from '~/stores/robot'

const robotStore = useRobotStore()
const productId = ref('351')
const apiKey = ref('ee7f3565-299d-4d2b-83aa-6a17c1f055d5')
const accountNum = ref('102723')
const wsStatus = ref('Не подключен')
const candlesCount = ref(0)
const log = ref<string[]>([])

const isConnecting = ref(false)
const isConnected = computed(() => robotStore.getWsStatus)

// Получаем количество свечей
const candles = computed(() => {
  const wsCandles = robotStore.getWSCandles
  candlesCount.value = wsCandles.length
  return wsCandles
})

// Функция для логирования сообщений
function addLog(message: string) {
  log.value.unshift(`[${new Date().toLocaleTimeString()}] ${message}`) // Новые логи сверху
  if (log.value.length > 30) {
    log.value.pop()
  }
}

// Функция для установки соединения с WebSocket
async function connectWebSocket() {
  if (isConnecting.value || isConnected.value) return
  
  isConnecting.value = true
  wsStatus.value = 'Подключение...'
  addLog('Начинаем подключение...')
  
  try {
    addLog(`Инициализация робота: P_ID: ${productId.value}, Acc: ${accountNum.value}, Key: ${apiKey.value.substring(0,3)}***`)
    await robotStore.fetchRobotInfo({
       product_id: parseInt(productId.value),
       account_num: parseInt(accountNum.value),
       api_key: apiKey.value
    })
    addLog(`Робот инициализирован: P_ID: ${robotStore.robot.product_id}, Acc: ${robotStore.robot.account_num}, Sym: ${robotStore.robot.symbol}`)
    
    if (!robotStore.robot.product_id) {
      wsStatus.value = 'Ошибка инициализации'
      addLog('Ошибка: Не удалось инициализировать данные робота.')
      isConnecting.value = false
      return
    }
    
    addLog(`Подключение к WS: wss://forex-robothub1.ntxpro.ai/ws/v1/web-client/${robotStore.robot.product_id}`)
    robotStore.connect()
    wsStatus.value = 'Ожидание ответа от WS...'

  } catch (error: any) {
    wsStatus.value = `Ошибка: ${error.message}`
    addLog(`Критическая ошибка при подключении: ${error.message}`)
    console.error('Ошибка подключения к WebSocket:', error)
  } finally {
    isConnecting.value = false // Сбрасываем только если не было успешного isConnected
  }
}

// Функция для разрыва соединения
function disconnectWebSocket() {
  robotStore.disconnect()
  wsStatus.value = 'Отключено пользователем'
  addLog('Соединение закрыто пользователем.')
}

const robotInfoForDisplay = computed(() => {
  if (!robotStore.robot || !robotStore.robot.product_id) return {
    status: "Нет данных. Подключитесь."
  }
  return {
    product_id: robotStore.robot.product_id,
    account_num: robotStore.robot.account_num,
    symbol: robotStore.robot.symbol || 'EURUSD (ожидается)',
    symbols_list: robotStore.robot.symbols_list,
    api_key_status: robotStore.robot.api_key ? 'Установлен (***' + robotStore.robot.api_key.slice(-3) + ')' : 'Не установлен',
    ws_assigned_symbol: robotStore.getWSRobotInfo?.data?.account_info?.symbol || "Нет данных от WS",
  }
})

const currentSymbol = computed(() => robotStore.getSymbol || 'EURUSD (дефолт)')

// Наблюдаем за статусом подключения из стора
watch(() => robotStore.isConnected, (newStatus, oldStatus) => {
  if (newStatus) {
    wsStatus.value = 'Соединение установлено'
    addLog('WS соединение успешно установлено.')
  } else {
    // Если статус был true, а стал false, и это не отключение пользователем
    if (oldStatus && wsStatus.value !== 'Отключено пользователем' && !wsStatus.value.startsWith('Ошибка')) {
      wsStatus.value = 'Отключено сервером'
      addLog('WS соединение было потеряно или закрыто сервером.')
    }
  }
});

watch(candles, (newVal) => {
    if (newVal.length > 0) {
        addLog(`Получено/обновлено свечей: ${newVal.length}. Первая: ${newVal[0].time}, последняя: ${newVal[newVal.length -1].time}`)
    }
});
</script>

<template>
  <div class="test-page-container">
    <div class="test-page">
      <h1>Тестирование WebSocket</h1>
      
      <div class="connection-form card">
        <div class="form-group">
          <label for="productId">ID продукта:</label>
          <input id="productId" v-model="productId" type="text"/>
        </div>
        <div class="form-group">
          <label for="accountNum">Номер аккаунта:</label>
          <input id="accountNum" v-model="accountNum" type="text"/>
        </div>
        <div class="form-group">
          <label for="apiKey">API ключ:</label>
          <input id="apiKey" v-model="apiKey" type="password" />
        </div>
        
        <div class="buttons">
          <button 
            @click="connectWebSocket" 
            :disabled="isConnecting || isConnected"
            class="connect-btn"
          >
            {{ isConnecting ? 'Подключаемся...' : 'Подключиться' }}
          </button>
          
          <button 
            @click="disconnectWebSocket" 
            :disabled="!isConnected && !isConnecting"
            class="disconnect-btn"
          >
            Отключиться
          </button>
        </div>
      </div>
      
      <div class="status-panel card">
        <h3>Статус и информация</h3>
        <div class="status-item">
          <strong>Статус соединения:</strong> 
          <span :class="{ 'connected': isConnected, 'disconnected': !isConnected, 'error': wsStatus.startsWith('Ошибка') }">
            {{ wsStatus }}
          </span>
        </div>
        <div class="status-item">
          <strong>Активный символ:</strong> {{ currentSymbol }}
        </div>
        <div class="status-item">
          <strong>Всего свечей:</strong> {{ candlesCount }}
        </div>
              
        <div class="status-item robot-info-block" v-if="robotStore.robot.product_id">
          <strong>Данные для WS (из store):</strong>
          <pre>{{ JSON.stringify(robotInfoForDisplay, null, 2) }}</pre>
        </div>
      </div>
      
      <div class="log-panel card">
        <h3>Лог событий</h3>
        <div class="log-container">
          <p v-for="(message, index) in log" :key="index">{{ message }}</p>
        </div>
      </div>
      
      <div v-if="candles.length > 0" class="candles-preview card">
        <h3>Предпросмотр последних 5 свечей</h3>
        <pre>{{ JSON.stringify(candles.slice(-5), null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.test-page-container {
  background-color: #1E1E1E; /* Темный фон для всей страницы */
  color: #E0E0E0; /* Светлый текст по умолчанию */
  min-height: 100vh;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.test-page {
  max-width: 900px;
  margin: 0 auto;
}

h1 {
  color: #95B71D; /* Акцентный цвет для заголовка */
  text-align: center;
  margin-bottom: 30px;
}

.card {
  background: #282A36; /* Темно-серый фон для карточек */
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.card h3 {
  color: #95B71D;
  margin-top: 0;
  margin-bottom: 15px;
  border-bottom: 1px solid #44475A;
  padding-bottom: 10px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #F8F8F2; /* Очень светлый текст для лейблов */
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #44475A; /* Темная рамка */
  border-radius: 4px;
  font-size: 16px;
  background-color: #1E1E1E; /* Очень темный фон для инпутов */
  color: #F8F8F2; /* Светлый текст в инпутах */
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #95B71D;
  box-shadow: 0 0 0 2px rgba(149, 183, 29, 0.5);
}

.buttons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

button {
  padding: 12px 25px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.connect-btn {
  background: #95B71D;
  color: #282A36; /* Темный текст на светлой кнопке */
}
.connect-btn:hover:not(:disabled) {
  background: #A8C93A;
}

.disconnect-btn {
  background: #F23645;
  color: white;
}
.disconnect-btn:hover:not(:disabled) {
  background: #FF5555;
}

.status-item {
  margin-bottom: 12px;
  font-size: 15px;
}
.status-item strong {
  color: #8BE9FD; /* Голубой для ключей статуса */
}

.connected {
  color: #50FA7B; /* Ярко-зеленый */
  font-weight: bold;
}

.disconnected {
  color: #FFB86C; /* Оранжевый */
  font-weight: bold;
}

.error {
  color: #FF5555; /* Ярко-красный */
  font-weight: bold;
}

.log-container {
  max-height: 250px;
  overflow-y: auto;
  border: 1px solid #44475A;
  border-radius: 4px;
  padding: 15px;
  background: #1E1E1E;
  color: #F8F8F2;
  font-size: 14px;
  line-height: 1.6;
}

.log-container p {
  margin: 0 0 8px 0;
  font-family: 'Consolas', 'Monaco', monospace;
  word-break: break-all;
}

.candles-preview pre,
.robot-info-block pre {
  background-color: #1E1E1E;
  color: #F8F8F2;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #44475A;
  overflow-x: auto;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  white-space: pre-wrap;
  word-break: break-all;
}

</style> 