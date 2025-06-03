<script setup lang="ts">
import { useRobotStore } from '@/stores/robot'
const robotStore = useRobotStore();

const ordersHistory = computed(() => robotStore.getOrdersHistory)
const ordersHistoryItems = computed(() => robotStore.getOrdersHistory?.items)
const ordersHistoryPagination = computed(() => robotStore.getOrdersHistory?.pagination)
const limit = 5
const page = ref(1)
const isDataLoaded = ref(false)
const fetchHistoryData = async () => {
    try {
        isDataLoaded.value = false

        const payload = {
            page: page.value,
            size: limit
        }

        const responseHistoryData = await robotStore.fetchRobotOrdersHistory(payload)
    } catch (error) {
        console.error('fetchHistoryData ', error)
    } finally {
        isDataLoaded.value = true
    }
}

const nextPage = () => {
    if (ordersHistoryPagination.value?.has_next) {
        page.value++
        fetchHistoryData()
    }
}

const prevPage = () => {
    if (ordersHistoryPagination.value?.has_prev) {
        page.value--
        fetchHistoryData()
    }
}

onMounted(fetchHistoryData)
</script>

<template>
    <div v-if="isDataLoaded">

        <div v-if="ordersHistory && ordersHistory?.pagination.page_count > 0" class="transaction__history-items">
            <TradeSettingsOrdersHistoryItem v-for="item in ordersHistoryItems" :key="item.id" :order="item" />
        </div>
        <div class="pagination">
            <button :disabled="!ordersHistoryPagination?.has_prev" class="btn-green small" @click="prevPage">
                {{ $t('prev') }}
            </button>
            {{ page }} / {{ ordersHistoryPagination?.page_count }}
            <button :disabled="!ordersHistoryPagination?.has_next" class="btn-green small" @click="nextPage">
                {{ $t('next') }}
            </button>
        </div>
    </div>
    <div v-else>
        <CommonLoader />
    </div>
</template>

<style class="css" scoped>
.transaction__history-items {

    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.5rem;
}
</style>