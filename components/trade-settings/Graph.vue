<script setup lang="ts">
import Apexchart from "vue3-apexcharts";
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  productId: {
    type: [String, Number],
    required: true,
  },
});

const totalProfitValue = ref('$0');
const profitPercentage = ref('+0.00%');
const series = ref([
  {
    name: "series-1",
    data: [] as number[], // Added type for data
  },
]);

const chartOptions = ref({
  chart: {
    id: "trade-chart",
    type: "line",
    stacked: false,
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    }
  },
  colors: ['#B2E500'],
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  grid: {
    show: false,
  },
  tooltip: {
    enabled: false,
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    show: false,
    labels: {
      show: false
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    // Categories can be dynamic or removed if not needed / part of series data
    // categories: [] as (string | number)[], // Added type for categories
  },
});

const getCacheKey = () => `graphData_${props.productId}`;

const loadData = () => {
  if (typeof window !== 'undefined' && localStorage) {
    const cachedData = localStorage.getItem(getCacheKey());
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        totalProfitValue.value = parsedData.totalProfitValue || '$0';
        profitPercentage.value = parsedData.profitPercentage || '+0.00%';
        series.value = parsedData.series || [{ name: "series-1", data: [] }];
        // if (parsedData.categories) { // Check if categories exist before assigning
        //   chartOptions.value.xaxis.categories = parsedData.categories;
        // }
        return true;
      } catch (e) {
        console.error('Error parsing cached graph data:', e);
        localStorage.removeItem(getCacheKey()); // Clear corrupted cache
      }
    }
  }
  return false;
};

const saveData = (dataToCache: any) => { // Added type for dataToCache
  if (typeof window !== 'undefined' && localStorage) {
    try {
      localStorage.setItem(getCacheKey(), JSON.stringify(dataToCache));
    } catch (e) {
      console.error('Error saving graph data to cache:', e);
    }
  }
};

// Placeholder for fetching data from API
const fetchData = async () => {
  console.log(`Fetching data for productId: ${props.productId}`);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500)); 

  // Using previous static values as placeholder for fetched data
  const mockApiData = {
    totalProfitValue: '$834,012',
    profitPercentage: '+11.73%',
    series: [
      {
        name: "series-1",
        data: [30, 40, 35, 30, 40, 35, 30, 40],
      },
    ],
    // categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998] // if categories are dynamic
  };

  totalProfitValue.value = mockApiData.totalProfitValue;
  profitPercentage.value = mockApiData.profitPercentage;
  series.value = mockApiData.series;
  // if (mockApiData.categories) { // Check if categories exist before assigning
  //  chartOptions.value.xaxis.categories = mockApiData.categories;
  // }
  
  saveData(mockApiData);
};

onMounted(() => {
  if (!loadData()) {
    fetchData(); // Fetch data if not found in cache
  }
});

// Watch for productId changes to reload data if necessary
watch(() => props.productId, (newProductId, oldProductId) => {
  if (newProductId !== oldProductId && newProductId !== undefined) { // Added check for undefined newProductId
    if (!loadData()) {
      fetchData();
    }
  }
}, { immediate: false }); // 'immediate: false' because onMounted handles initial load

</script>

<template>
  <div class="trade-graph">
    <div class="trade-graph__header">
      {{ $t('Trading graph') }}

      <span>{{ $t('Works') }}</span>
    </div>

    <div class="trade-graph__card">
      <div class="trade-graph__top">
        <div class="left">
          {{ $t('Total Profit') }}
        </div>
        <div class="left">
          <div class="price">
            <span>$</span>{{ totalProfitValue.replace('$', '') }}
          </div>
          <div class="profit">
            {{ profitPercentage }}
          </div>
        </div>
      </div>

      <div class="trade-graph__chart">
        <apexchart height="60" :options="chartOptions" :series="series" />
      </div>

      <div class="trade-graph__stat-logo">
        <div class="image">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.33742 10.0839L11.9984 5.42485L16.6613 10.0877L19.3718 7.37529L11.9984 0L4.625 7.37339L7.33742 10.0839Z"
              fill="#F3BA2F" />
            <path d="M0 11.9998L2.71143 9.28842L5.42286 11.9998L2.71143 14.7113L0 11.9998Z" fill="#F3BA2F" />
            <path
              d="M7.34121 13.9145L12.0022 18.5755L16.665 13.9126L19.3775 16.6212L19.3756 16.6231L12.0022 23.9984L4.62879 16.6269L4.625 16.6231L7.34121 13.9145Z"
              fill="#F3BA2F" />
            <path d="M18.5781 12.001L21.2896 9.28955L24.001 12.001L21.2896 14.7124L18.5781 12.001Z" fill="#F3BA2F" />
            <path
              d="M14.7545 11.9983L12.0041 9.24609L9.97028 11.2799L9.73524 11.5131L9.25379 11.9945L9.25 11.9983L9.25379 12.004L12.0041 14.7524L14.7545 12.0002L14.7564 11.9983H14.7545Z"
              fill="#F3BA2F" />
          </svg>
        </div>
        <div class="text">
          {{ $t('Stats Tracking:') }}
          <span>{{ $t('From Binance') }}</span>
        </div>
      </div>


      <div class="trade-graph__buttons">
        <button class="buy">
          {{ $t('Buy') }}
        </button>
        <button class="sell">
          {{ $t('Sell') }}
        </button>
      </div>
    </div>
    <div class="trade-graph__header">
      {{ $t('Trading graph') }}
    </div>

    <div class="transaction__history-items">
      <TransactionHistoryItem />

      <TransactionHistoryItem :status="1" />
      <TransactionHistoryItem :status="1" />
    </div>
  </div>
</template>

<style lang="css" scoped>
.trade-graph {
  padding: 12px;
}

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
}

.trade-graph__card {
  background-color: rgba(217, 217, 217, 0.05);
  padding: 2px 7px;
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
  margin: 20px 0;
}

.trade-graph__stat-logo {
  display: flex;
  align-items: center;
  gap: 12px;
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
</style>