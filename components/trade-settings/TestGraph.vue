<script setup lang="ts">
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRobotStore } from '@/stores/robot'
import { createChart, CandlestickSeries, type ISeriesApi, type CandlestickData, type Time } from 'lightweight-charts'
import type { ICandle } from '~/types/websocket'

const props = defineProps({
  symbol: {
    type: String,
    default: 'BTCUSD'
  },
  timeframe: {
    type: String,
    default: '1'
  }
})

const robotStore = useRobotStore()
const chartContainer = ref<HTMLElement | null>(null)
const chart = ref<ReturnType<typeof createChart> | null>(null)
const candleSeries = ref<ISeriesApi<'Candlestick'> | null>(null)

// Трансформирует свечи из формата WebSocket в формат для графика
function transformCandles(candles: ICandle[]): CandlestickData[] {
  return candles.map(candle => ({
    time: candle.time as Time,
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close
  }))
}

function initChart() {
  if (!chartContainer.value) return

  // Создаем график
  chart.value = createChart(chartContainer.value, {
    width: chartContainer.value.clientWidth,
    height: 400,
    layout: { 
      background: { color: '#161A1E' },
      textColor: '#D9D9D9'
  },
  grid: {
      vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
      horzLines: { color: 'rgba(42, 46, 57, 0.5)' }
    },
    timeScale: { 
      timeVisible: true,
      secondsVisible: false,
      borderColor: 'rgba(197, 203, 206, 0.8)',
  },
    rightPriceScale: {
      borderColor: 'rgba(197, 203, 206, 0.8)',
    },
  })

  // Добавляем серию свечей
  candleSeries.value = chart.value.addSeries(CandlestickSeries, {
    upColor: '#95B71D',
    downColor: '#F23645',
    borderVisible: false,
    wickUpColor: '#95B71D',
    wickDownColor: '#F23645'
  })

  // Адаптивный размер
  const resizeObserver = new ResizeObserver(() => {
    if (chart.value && chartContainer.value) {
      chart.value.applyOptions({ 
        width: chartContainer.value.clientWidth 
      })
    }
  })

  if (chartContainer.value) {
    resizeObserver.observe(chartContainer.value)
  }

  // Очищаем при удалении компонента
  onBeforeUnmount(() => {
    chart.value?.remove()
    resizeObserver.disconnect()
  })
}

// Получить данные свечей из хранилища
const candles = computed(() => robotStore.getWSCandles)

// Отправить запрос на получение свечей при изменении символа или таймфрейма
function fetchCandlesData() {
  if (!robotStore.isConnected) {
    // Если нет подключения, подключаемся
    robotStore.connect()
  } else {
    // Иначе просто запрашиваем свечи
    robotStore.fetchCandles({
      timeframe: props.timeframe,
      symbol: props.symbol
    })
  }
}

// Следим за изменениями в свечах и обновляем график
watch(candles, (newCandles) => {
  console.log('Получены новые свечи:', newCandles.length)

  if (!newCandles || newCandles.length === 0) return
  if (!candleSeries.value) return

  const candleData = transformCandles(newCandles)
  
  // Устанавливаем данные на график
  try {
    candleSeries.value.setData(candleData)
  } catch (error) {
    console.error('Ошибка обновления графика:', error)
  }
}, { deep: true })

// Инициализация
onMounted(() => {
  initChart()
  fetchCandlesData()
})
</script>

<template>
  <div class="chart-container">
    <div ref="chartContainer" class="lightweight-chart"/>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}

.lightweight-chart {
  width: 100%;
  height: 400px;
}
</style>
