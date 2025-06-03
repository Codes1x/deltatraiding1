<script setup lang="ts">
import { useTgWebAppStore } from '@/stores/tgWebApp'

const tgWebApp = useTgWebAppStore()
const mainStats = computed(() => tgWebApp.getMainStats)
const inviting = ref(false)
</script>

<template>
  <div class="home__referrals">
    <div class="home__referrals-text">
      <div class="top">{{ $t('Your referrals') }}</div>
      <div class="count">
        <span>{{ mainStats?.referrals_count ?? 0 }} </span>
        {{ $t('referrals') }}
      </div>
    </div>


    <button class="home__referrals-btn" @click="inviting = !inviting">
      {{ $t('Invite friends') }}
    </button>

    <!-- Окно приглашения -->
    <FriendsInvite :class="{ active: inviting }" :is-active="inviting" @close="inviting = false" />
  </div>
</template>

<style scoped>
.home__referrals {
  margin-top: 10px; /* Уменьшен отступ */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
}

.home__referrals-text .top {
  font-size: 20px;
  font-weight: 300;
}

.home__referrals-text .count {
  font-size: 15px;
  font-weight: bold;
}

.home__referrals-text .count span {
  font-size: 20px;
}

.home__referrals-btn {

  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;

  padding: 0.5rem 1rem;

  background-color: #95b71d;
  border: none;
  outline: none;
  cursor: pointer;
  transition: ease-in-out 0.2s;
  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.home__referrals-btn:hover {
  opacity: 0.75;
}
</style>
