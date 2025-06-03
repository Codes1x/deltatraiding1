<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTransactionsStore } from '~/stores/transactions';
import type { ITransactionsResponse } from '~/types/transactions';

interface DropdownItem {
  label: string;
  value: string;
}

const transactionStore = useTransactionsStore();
const transactions = computed(() => {
  const results = transactionStore.getTransactions.results;

  if (selectedItem.value.value === 'date') {
    return results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  if (selectedItem.value.value === 'incoming') {
    return results.filter((transaction) => transaction.amount.includes('+'));
  }

  if (selectedItem.value.value === 'outgoing') {
    return results.filter((transaction) => transaction.amount.includes('-'));
  }

  return results;
});

// Группировка транзакций по датам
const groupedTransactions = computed(() => {
  return transactions.value.reduce((groups, transaction) => {
    const date = new Date(transaction.created_at).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    }); // Например, "12 января"
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction); // Добавляем отдельную транзакцию
    return groups;
  }, {} as Record<string, typeof transactions.value>);
});

const dropdownItems = [
  { label: 'Date', value: 'date' },
  { label: 'Incoming', value: 'incoming' },
  { label: 'Outgoing', value: 'outgoing' },
];

const selectedItem = ref<DropdownItem>({ label: 'Date', value: 'date' });

// Слушаем изменения выбранного значения
const onUpdateSelectedItem = (item: DropdownItem) => {
  // console.log('item ', item)
  selectedItem.value = item;
};

// Пагинация
const page = ref(1)
const isLoading = ref(false)
const transactionsPagination = computed(() => transactionStore.getTransactions)
const nextPage = () => {
  if (transactionsPagination.value?.next) {
    page.value++
    fetchTransactionsByPage()
  }
}

const prevPage = () => {
  if (transactionsPagination.value?.previous) {
    page.value--
    fetchTransactionsByPage()
  }
}

const fetchTransactionsByPage = async () => {
  try {
    isLoading.value = true
    const payload = {
      page: page.value
    }
    const response = await transactionStore.fetchTransactions(payload) as ITransactionsResponse
    // transactionLastWeek.value = response
    // console.log('Transactions last week:', transactionLastWeek.value)
  } catch (error) {
    console.error('Failed to fetch transactions last week:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchTransactionsByPage();
});
</script>

<template>
  <div class="transaction__history">

    <div class="transaction__history-order">
      <CommonDropdown v-model="selectedItem" :items="dropdownItems" @update:model-value="onUpdateSelectedItem" />
    </div>

    <div v-for="(transactions, date) in groupedTransactions" :key="date">
      <div class="transaction__history-category">
        {{ date }}
      </div>

      <div v-if="!isLoading" class="transaction__history-items">
        <TransactionHistoryItem v-for="transaction in transactions" :key="transaction.id" :transaction="transaction" />
      </div>
      <div v-else>
        <CommonLoader />
      </div>

    </div>
    <div class="pagination">
      <button :disabled="!transactionsPagination?.previous" class="btn-green small" @click="prevPage">
        {{ $t('prev') }}
      </button>
      {{ page }} / {{ transactionsPagination?.count }}
      <button :disabled="!transactionsPagination?.next" class="btn-green small" @click="nextPage">
        {{ $t('next') }}
      </button>
    </div>
  </div>
</template>


<style lang="css" scoped>
.transaction__history-order {
  margin: 8px 0;
}

.transaction__history-category {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  padding: 13px;
}

.transaction__history-items {
  padding: 0 14px 20px 14px;
  gap: 8px;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-direction: column;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1.5rem 0;
  padding: 0 1.2rem;
}
</style>