<script setup lang="ts">
import { useTgWebAppStore } from '@/stores/tgWebApp'
import { formatSum } from '@/utils/functions'
const tgWebAppStore = useTgWebAppStore()
const userBalance = computed(() => tgWebAppStore.getUserBalance)
</script>

<template>
  <div class="home__balance">
    <div class="home__sum">
      {{ userBalance ? parseFloat(userBalance.main).toFixed(2) : 0 }}
    </div>
    {{ $t('Main balance') }}
  </div>

  <HomeActions />
</template>

<style scoped>
.home__balance {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(255, 255, 255, 0.3);
  font-size: 16px;
  font-weight: normal;
}

.home__sum {
  color: white;
  margin-top: 15px;
  font-size: 40px;
  font-weight: bold;
  position: relative;
  z-index: 99;
}

.home__sum span {
  font-size: 20px;
}
</style>
