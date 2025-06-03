<script setup lang="ts">
import { usePurchasesStore } from '~/stores/purchases';

const purchasesStore = usePurchasesStore()
const purchases = computed(() => purchasesStore.getPurchases)
</script>

<template>
    <div class="invoices">
        <h3>{{ $t('Invoices') }}</h3>
        <TransactionInvoice v-for="purchase in purchases.results" :key="purchase.id" :invoice="purchase" />
    </div>
</template>

<style lang="css" scoped>
.invoices {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0 10px;
}
</style>