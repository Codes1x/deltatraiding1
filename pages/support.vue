<script setup lang="ts">
import { useTicketsStore } from '~/stores/tickets';

const ticketsStore = useTicketsStore()
const ticketsList = computed(() => ticketsStore.getTickets)
const isNewModalShow = ref(false)
const isDataLoaded = ref(false)

const showModal = () => {
    isNewModalShow.value = !isNewModalShow.value
    console.log('isNewModalShow.value ', isNewModalShow.value)
}
/** Fetch data */

const fetchData = async () => {
    try {
        isDataLoaded.value = false
        await ticketsStore.fetchTickets()
    } catch (error) {
        console.error('fetchData tickets ', error)
    } finally {
        isDataLoaded.value = true
    }
}
onMounted(fetchData)
</script>

<template>
    <section class="support">
        <SupportHeader />
        <SupportCreate @new-ticket="showModal" />

        <div v-if="isDataLoaded" class="support__items">

            <SupportItem v-for="ticket in ticketsList" :key="ticket.id" :ticket />
        </div>
        <div v-else class="support__items">
            <CommonLoader :small="true" />
        </div>
        <!-- Окно приглашения -->
        <SupportNewModal :class="{ active: isNewModalShow }" @close="showModal" />
    </section>
</template>

<style lang="css" scoped>
.support__items {
    padding: 0 13px;
    display: flex;
    flex-direction: column;
    gap: 11px;
}
</style>