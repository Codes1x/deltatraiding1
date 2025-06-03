<script setup lang="ts">
import { useTgWebAppStore } from '@/stores/tgWebApp'
const tgWebAppStore = useTgWebAppStore()
const userBalance = computed(() => tgWebAppStore.getUserBalance)
</script>

<template>
  <div class="transaction-balance">
    <div class="transaction-balance__item">
      <h5>${{ userBalance ? parseFloat(userBalance.main).toFixed(2) : 0 }}</h5>
      <p>{{ $t('Main balance') }}</p>
    </div>

    <div class="transaction-balance__item">
      <h5>${{ userBalance ? parseFloat(userBalance.hold).toFixed(2) : 0 }}</h5>
      <p>{{ $t('Hold balance') }}</p>
    </div>

  </div>
</template>

<style lang="css" scoped>
.transaction-balance {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 30px;
  max-width: 90%;
  margin: 12px auto 32px;
}

.transaction-balance__item {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
}

.transaction-balance__item h5 {
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  color: #fff;
  font-size: 17px;
  text-align: center;
}

.transaction-balance__item p {
  font-family: var(--font-family);
  font-weight: 300;
  font-size: 14px;
  text-align: center;
  color: #fff;
  opacity: 0.2;
  text-align: center;
}
</style>
