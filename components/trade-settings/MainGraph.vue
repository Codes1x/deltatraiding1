<script setup lang="ts">
import { ref, computed } from 'vue'
import TestGraph from './TestGraph.vue'
import { useRobotStore } from '@/stores/robot'

interface DropdownItem {
  label: string
  value: string
}

const timeFrameItems: DropdownItem[] = [
  { label: '1m', value: '1' },
  { label: '5m', value: '5' },
  { label: '15m', value: '15' },
  { label: '30m', value: '30' },
  { label: '1h', value: '60' },
  { label: '4h', value: '240' },
  { label: '1d', value: '1440' },
  { label: '1w', value: '10080' },
  { label: '1M', value: '43200' }
]

const robotStore = useRobotStore()

// Получаем список символов из стора
const symbolList = computed(() => {
  const list = robotStore.getSymbolList || ['BTCUSD']
  return list
})

// Выбранный символ
const selectedSymbol = ref(symbolList.value[0] || 'BTCUSD')

// Выбранный таймфрейм
const selectedTimeFrame = ref('1')

function handleTimeframeChange(timeframe: string) {
  selectedTimeFrame.value = timeframe
}
</script>

<template>
  <div class="main-graph">
    <div class="trade-graph__header">
      Trading graph
      <span>Work</span>
    </div>

    <div class="trade-graph__card">
      <div class="trade-graph__top">
        <div class="left">
          <CommonDropdown
            v-model="selectedTimeFrame"
            :items="timeFrameItems"
            class="trade-dropdown"
            @update:model-value="handleTimeframeChange"
          />
          
          <CommonDropdown
            v-if="symbolList && symbolList.length > 1"
            v-model="selectedSymbol"
            :items="symbolList.map(symbol => ({ label: symbol, value: symbol }))"
            class="trade-dropdown"
          />
          <span v-else>{{ selectedSymbol }}</span>
        </div>
      </div>

      <TestGraph
        :symbol="selectedSymbol"
        :timeframe="selectedTimeFrame"
      />
    </div>
  </div>
</template>

<style scoped>
.main-graph {
  width: 100%;
}

.trade-graph__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #171D25;
  color: #fff;
  font-size: 14px;
}

.trade-graph__header span {
  background-color: #95B71D;
  color: #fff;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.trade-graph__card {
  background-color: #161A1E;
  border-radius: 8px;
  overflow: hidden;
}

.trade-graph__top {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  border-bottom: 1px solid #2A2E39;
}

.left {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #fff;
}

.trade-dropdown {
  min-width: 80px;
}
</style>
