<script setup lang="ts">
import { useSubscribesStore } from '~/stores/subscribes'
const subscribesStore = useSubscribesStore()

const subscribesList = ref([])
const isDataLoaded = ref(false)
const fetchSubscribes = async () => {
    isDataLoaded.value = false
    try {
        const response = await subscribesStore.fetchSubsribes()
    } catch (error) {
        console.error('Failed to fetch subscribes:', error)
    } finally {
        isDataLoaded.value = true
    }
}

onBeforeMount(fetchSubscribes)
</script>

<template>
    <section class="trade">
        <TradeSystemsHeader />

        <TradeSystemsList />
    </section>
</template>
