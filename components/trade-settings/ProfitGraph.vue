<script setup lang="ts">
import { useRobotStore } from '@/stores/robot'
import type { IProfitChart } from '~/types/websocket'

const robotStore = useRobotStore()
const robotProduct = computed(() => robotStore.getRobotInfo.product_id)

// Форматирование дат
const getFormattedDate = (date: Date) => date.toISOString().split('T')[0]

const currentDate = getFormattedDate(new Date()) // Текущая дата
const pastDate = getFormattedDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) // 30 дней назад

// Реактивные переменные
const isDataLoaded = ref(false)
const categories = ref<string[]>([]) // Даты (X)
const seriesData = ref<number[]>([]) // Баланс (Y)
const amountAll = ref(0)
const percentAll = ref(0)
// Запрос данных
const fetchProfitChart = async () => {
  isDataLoaded.value = false
  try {
    const payload = {
      product_id: robotProduct.value.toString(),
      start_date: pastDate,
      end_date: currentDate
    }
    const response: IProfitChart[] = await robotStore.fetchRobotProfit(payload) as IProfitChart[]

    if (response?.length) {
      categories.value = response.map(item => item.date) // Даты на оси X
      seriesData.value = response.map(item => item.account_balance) // Баланс на оси Y

      amountAll.value = response.length ? response[response.length - 1].amount_all : 0

      percentAll.value = response.length ? response[response.length - 1].percent_all : 0

    }
  } catch (error) {
    console.error("Ошибка при загрузке данных графика:", error)
  } finally {
    isDataLoaded.value = true
  }
}


// Опции графика (реактивно обновляются)
const chartOptions = computed(() => ({
  chart: {
    id: "trade-chart",
    type: "line",
    stacked: false,
    zoom: { enabled: false },
    toolbar: { show: false },
    height: "150px", // Число, без кавычек
    offsetX: 0 // Убираем возможное смещение
  },
  colors: ['#B2E500'],
  stroke: { curve: 'smooth', width: 2 },
  grid: { show: false },
  tooltip: { enabled: false },
  dataLabels: { enabled: false },
  xaxis: {
    type: 'category',
    labels: { show: false },
    axisBorder: { show: false },
    axisTicks: { show: false },
    tickPlacement: 'on',
    categories: categories.value, // Динамически обновляется
    range: undefined
  },
  yaxis: {
    labels: { show: false } // Если не нужен Y, тоже скрываем
  },
}))

// Данные для графика (реактивные)
const series = computed(() => [{ name: "Balance", data: seriesData.value }])

// Загружаем данные при монтировании
onMounted(fetchProfitChart)
</script>

<template>
  <div v-if="seriesData.length > 0" class="trade-graph">
    <div class="trade-graph__header">
      {{ $t('Trading graph') }}

      <span>{{ $t('Work') }}</span>
    </div>

    <div class="trade-graph__card">
      <div class="trade-graph__top">
        <div class="left">
          {{ $t('Total Profit') }}
        </div>
        <div class="left">
          <div class="price">
            <span>$</span>{{ amountAll.toFixed(2) }}
          </div>
          <div class="profit">
            +{{ percentAll.toFixed(2) }}%
          </div>
        </div>
      </div>

      <div class="trade-graph__chart">
        <ApexChart type="line" :options="chartOptions" :series="series" />
      </div>


      <div class="trade-graph__stat-logo">

        <div class="text">
          {{ $t('Stats Tracking:') }}
        </div>
        <div class="fixone-image">
          <img src="/public/icons/fixone-light-logo.svg" alt="FIXONE GLOBAL TRADING" width="30" height="30" >
          <div class="fixone">
            <p class="name">FIXONE</p>
            <p class="small">GLOBAL TRADING</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <CommonLoader :small="true" class="trade-graph__loader" />
  </div>


</template>

<style lang="css" scoped>
.trade-graph__header {
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  gap: 35px;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 10px;
}

.trade-graph__header span {
  background-color: #95B71D;
  font-size: 10px;
  padding: 5px 10px;
  border-radius: 3px;
}

.trade-graph__card {
  background-color: rgba(217, 217, 217, 0.05);
  padding: 2px 7px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 5px;
  position: relative;
}

.trade-graph__top {
  padding: 24px 15px 0 20px;
  display: flex;
  justify-content: space-between;
}

.trade-graph__top .left {
  color: rgba(255, 255, 255, 0.65);
  font-size: 16px;

  display: flex;
  gap: 6px;
  align-items: end;
}

.trade-graph__top .left .price {
  font-size: 20px;
  display: flex;
}

.trade-graph__top .left .price span {
  color: #B2E500;
  font-size: 13px;
}

.trade-graph__top .left .profit {
  font-size: 12px;
  color: #B2E500;
}

.trade-graph__chart {
  margin: 0 auto;
}

.trade-graph__stat-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  position: absolute;
  left: 16px;
  bottom: 16px;
}

.trade-graph__stat-logo .image svg {
  height: 28px;
}

.trade-graph__stat-logo .text {
  display: flex;
  flex-direction: column;
  font-size: 16px;
  color: #BEC2DA;
}

.trade-graph__stat-logo .text span {
  color: rgba(190, 194, 218, 0.85);
  font-size: 12px;
}

.trade-graph__buttons {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
}

.trade-graph__buttons .buy,
.sell {
  flex: 1 0 auto;
  outline: none;
  border: none;
  border-radius: 3px;
  font-size: 12px;
  padding: 11px;
}

.trade-graph__buttons .buy {
  background-color: #95B71D;
}

.trade-graph__buttons .sell {
  background-color: #BE5D5D;
}

.transaction__history-items {
  padding: 0 20px 20px 20px;
  gap: 8px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.fixone-image {
  display: flex;
  align-items: center;
  gap: 4px;
}

.fixone-image img {
  width: 30px;
  height: 30px;
}

.fixone {
  display: flex;
  flex-direction: column;
}

.fixone .name {
  font-size: 14px;
}

.fixone .small {
  font-size: 8px;
}

.trade-graph__loader {
  margin-top: 1rem;
}
</style>
