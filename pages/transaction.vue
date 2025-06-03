<script setup lang="ts">
import { usePurchasesStore } from '~/stores/purchases';
import { useTransactionsStore } from '~/stores/transactions';
import type { ITransactionsResponse } from '~/types/transactions';

const purchasesStore = usePurchasesStore()
const transactionStore = useTransactionsStore()
const isDeposit = ref(false)
const isTransfer = ref(false)
const isWithdraw = ref(false)

const isDataLoaded = ref(false)

const fetchPurchases = async () => {
  isDataLoaded.value = false
  try {
    const payload = {
      page: 1,
      page_size: 10,
    }
    await purchasesStore.fetchAllPurchases(payload)
  } catch (error) {
    console.error('Failed to fetch purchases:', error)
  }
  isDataLoaded.value = true
}

const transactionLastWeek = ref([])
const fetchTransactionsLastWeek = async () => {
  try {
    isDataLoaded.value = false
    const payload = {
      page: 1
      //created_at_after: '2024-12-19',
      // created_at_before: '2024-12-12',
      // transaction_type: 'purchase'
    }
    const response = await transactionStore.fetchTransactions(payload) as ITransactionsResponse
    transactionLastWeek.value = response
    console.log('Transactions last week:', transactionLastWeek.value)
  } catch (error) {
    console.error('Failed to fetch transactions last week:', error)
  } finally {
    isDataLoaded.value = true
  }
}

onBeforeMount(fetchTransactionsLastWeek)
</script>

<template>
  <section class="transaction">
    <TransactionHeader />

    <TransactionBalance />

    <TransactionButtons @deposit="isDeposit = !isDeposit" @withdraw="isWithdraw = !isWithdraw"
      @transfer="isTransfer = !isTransfer" />

    <TransactionHistory v-if="isDataLoaded" />

    <div v-else class="transaction__loader">
      <CommonLoader />
    </div>
    <!-- Окно приглашения -->
    <TransactionDepositModal :class="{ active: isDeposit }" @close="isDeposit = false" />
    <TransactionWithdrawModal :class="{ active: isWithdraw }" @close="isWithdraw = false" />
    <TransactionTransferModal :class="{ active: isTransfer }" @close="isTransfer = false" />
  </section>
</template>

<style scoped>
.transaction__loader {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}
</style>
