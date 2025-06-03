<script setup lang="ts">
import type { IStats } from '~/types/stats';
import { useTgWebAppStore } from '@/stores/tgWebApp'

const tgWebApp = useTgWebAppStore();

const statsCurrent = computed(() => tgWebApp.getMainStats)

const isDataLoaded = ref(false);

const fetchStatsData = async () => {

  try {
    const response = await tgWebApp.fetchStatsOptimized() as IStats;
    return response;
  } catch (error) {
    console.error("fetchStatsData ", error);
    return null;
  }
};

const fetchData = async () => {
  isDataLoaded.value = false;
  await fetchStatsData()
  isDataLoaded.value = true;

};
onMounted(fetchData)
</script>


<template>
  <div v-if="isDataLoaded" class="home__statistic">

    <div class="home__statistic-head">
      {{ $t('Summary') }}
    </div>

    <div class="home__statistic-items">
      <div class="home__statistic-item">
        <div class="image">
          <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5 8V12M17 6V10M16 1C18.4487 1 19.7731 1.37476 20.4321 1.66544C20.5199 1.70415 20.5638 1.72351 20.6904 1.84437C20.7663 1.91682 20.9049 2.12939 20.9405 2.22809C21 2.39274 21 2.48274 21 2.66274V13.4111C21 14.3199 21 14.7743 20.8637 15.0079C20.7251 15.2454 20.5914 15.3559 20.3319 15.4472C20.0769 15.5369 19.562 15.438 18.5322 15.2401C17.8114 15.1017 16.9565 15 16 15C13 15 10 17 6 17C3.55129 17 2.22687 16.6252 1.56788 16.3346C1.48012 16.2958 1.43624 16.2765 1.3096 16.1556C1.23369 16.0832 1.09512 15.8706 1.05947 15.7719C1 15.6073 1 15.5173 1 15.3373L1 4.58885C1 3.68009 1 3.2257 1.13628 2.99214C1.2749 2.75456 1.40859 2.64412 1.66806 2.55281C1.92314 2.46305 2.43803 2.56198 3.46783 2.75985C4.18862 2.89834 5.04348 3 6 3C9 3 12 1 16 1ZM13.5 9C13.5 10.3807 12.3807 11.5 11 11.5C9.61929 11.5 8.5 10.3807 8.5 9C8.5 7.61929 9.61929 6.5 11 6.5C12.3807 6.5 13.5 7.61929 13.5 9Z"
              stroke="#B2E500" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

        </div>
        <div class="price">
          <span class="text">{{ $t('Profit') }}</span>
          <div class="sum">
            <span>$</span> {{ statsCurrent?.all_time ? statsCurrent?.all_time.amount : 0 }}
          </div>
        </div>
      </div>

      <div class="home__statistic-item">
        <div class="image">
          <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19 9H1M14 1V5M6 1V5M7 15L9 17L13.5 12.5M5.8 21H14.2C15.8802 21 16.7202 21 17.362 20.673C17.9265 20.3854 18.3854 19.9265 18.673 19.362C19 18.7202 19 17.8802 19 16.2V7.8C19 6.11984 19 5.27976 18.673 4.63803C18.3854 4.07354 17.9265 3.6146 17.362 3.32698C16.7202 3 15.8802 3 14.2 3H5.8C4.11984 3 3.27976 3 2.63803 3.32698C2.07354 3.6146 1.6146 4.07354 1.32698 4.63803C1 5.27976 1 6.11984 1 7.8V16.2C1 17.8802 1 18.7202 1.32698 19.362C1.6146 19.9265 2.07354 20.3854 2.63803 20.673C3.27976 21 4.11984 21 5.8 21Z"
              stroke="#B2E500" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

        </div>
        <div class="price">
          <span class="text">{{ $t('Daily profit') }}</span>
          <div class="sum">
            <span>$</span> {{ statsCurrent?.today ? statsCurrent?.today.amount : 0 }}
          </div>
        </div>
      </div>

      <div class="home__statistic-item">
        <div class="image">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12.5295 7.35186C11.9571 7.75995 11.2566 8 10.5 8C8.567 8 7 6.433 7 4.5C7 2.567 8.567 1 10.5 1C11.753 1 12.8522 1.65842 13.4705 2.64814M5 19.0872H7.61029C7.95063 19.0872 8.28888 19.1277 8.61881 19.2086L11.3769 19.8789C11.9753 20.0247 12.5988 20.0388 13.2035 19.9214L16.253 19.3281C17.0585 19.1712 17.7996 18.7854 18.3803 18.2205L20.5379 16.1217C21.154 15.5234 21.154 14.5524 20.5379 13.9531C19.9832 13.4134 19.1047 13.3527 18.4771 13.8103L15.9626 15.6449C15.6025 15.9081 15.1643 16.0498 14.7137 16.0498H12.2855L13.8311 16.0498C14.7022 16.0498 15.4079 15.3633 15.4079 14.5159V14.2091C15.4079 13.5055 14.9156 12.892 14.2141 12.7219L11.8286 12.1417C11.4404 12.0476 11.0428 12 10.6431 12C9.67833 12 7.93189 12.7988 7.93189 12.7988L5 14.0249M19 5.5C19 7.433 17.433 9 15.5 9C13.567 9 12 7.433 12 5.5C12 3.567 13.567 2 15.5 2C17.433 2 19 3.567 19 5.5ZM1 13.6L1 19.4C1 19.9601 1 20.2401 1.10899 20.454C1.20487 20.6422 1.35785 20.7951 1.54601 20.891C1.75992 21 2.03995 21 2.6 21H3.4C3.96005 21 4.24008 21 4.45399 20.891C4.64215 20.7951 4.79513 20.6422 4.89101 20.454C5 20.2401 5 19.9601 5 19.4V13.6C5 13.0399 5 12.7599 4.89101 12.546C4.79513 12.3578 4.64215 12.2049 4.45399 12.109C4.24008 12 3.96005 12 3.4 12L2.6 12C2.03995 12 1.75992 12 1.54601 12.109C1.35785 12.2049 1.20487 12.3578 1.10899 12.546C1 12.7599 1 13.0399 1 13.6Z"
              stroke="#B2E500" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="price">
          <span class="text">{{ $t('Partner profit') }}</span>
          <div class="sum">
            <span>$</span> 0
          </div>
        </div>
      </div>

      <div class="home__statistic-item">
        <div class="image">
          <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19 9H1M14 1V5M6 1V5M7 15L9 17L13.5 12.5M5.8 21H14.2C15.8802 21 16.7202 21 17.362 20.673C17.9265 20.3854 18.3854 19.9265 18.673 19.362C19 18.7202 19 17.8802 19 16.2V7.8C19 6.11984 19 5.27976 18.673 4.63803C18.3854 4.07354 17.9265 3.6146 17.362 3.32698C16.7202 3 15.8802 3 14.2 3H5.8C4.11984 3 3.27976 3 2.63803 3.32698C2.07354 3.6146 1.6146 4.07354 1.32698 4.63803C1 5.27976 1 6.11984 1 7.8V16.2C1 17.8802 1 18.7202 1.32698 19.362C1.6146 19.9265 2.07354 20.3854 2.63803 20.673C3.27976 21 4.11984 21 5.8 21Z"
              stroke="#B2E500" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="price">
          <span class="text">{{ $t('Month profit') }}</span>
          <div class="sum">
            <span>$</span> {{ statsCurrent?.days_30 ? statsCurrent?.days_30.amount : 0 }}
          </div>
        </div>
      </div>

      <div class="home__statistic-item">
        <div class="image">
          <svg width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15 1.46776C16.4817 2.20411 17.5 3.73314 17.5 5.5C17.5 7.26686 16.4817 8.79589 15 9.53224M17 14.7664C18.5115 15.4503 19.8725 16.565 21 18M1 18C2.94649 15.5226 5.58918 14 8.5 14C11.4108 14 14.0535 15.5226 16 18M13 5.5C13 7.98528 10.9853 10 8.5 10C6.01472 10 4 7.98528 4 5.5C4 3.01472 6.01472 1 8.5 1C10.9853 1 13 3.01472 13 5.5Z"
              stroke="#B2E500" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="price">
          <span class="text">{{ $t('Referrals') }}</span>
          <div class="sum">
            {{ statsCurrent?.referrals_count ? statsCurrent.referrals_count : 0 }}
          </div>
        </div>
      </div>


      <div class="home__statistic-item">
        <div class="image">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19 7L12.5515 11.6061C12.3555 11.746 12.2576 11.816 12.1527 11.8371C12.0602 11.8557 11.9643 11.8478 11.8762 11.8142C11.7762 11.7762 11.691 11.691 11.5208 11.5208L8.47921 8.47921C8.30896 8.30896 8.22383 8.22383 8.12382 8.18577C8.03566 8.15221 7.9398 8.14427 7.84732 8.16288C7.74241 8.18399 7.64445 8.25396 7.44853 8.39391L1 13M5.8 19H14.2C15.8802 19 16.7202 19 17.362 18.673C17.9265 18.3854 18.3854 17.9265 18.673 17.362C19 16.7202 19 15.8802 19 14.2V5.8C19 4.11984 19 3.27976 18.673 2.63803C18.3854 2.07354 17.9265 1.6146 17.362 1.32698C16.7202 1 15.8802 1 14.2 1H5.8C4.11984 1 3.27976 1 2.63803 1.32698C2.07354 1.6146 1.6146 2.07354 1.32698 2.63803C1 3.27976 1 4.11984 1 5.8V14.2C1 15.8802 1 16.7202 1.32698 17.362C1.6146 17.9265 2.07354 18.3854 2.63803 18.673C3.27976 19 4.11984 19 5.8 19Z"
              stroke="#B2E500" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="price">
          <span class="text">{{ $t('My systems') }}</span>
          <div class="sum">
            {{ statsCurrent?.robots_count ? statsCurrent.robots_count : 0 }}
          </div>
        </div>
      </div>

    </div>

  </div>
  <div v-else class="loader">
    <CommonLoader />
  </div>
</template>

<style scoped>
.home__statistic {
  margin-top: 0px; /* Уменьшен отступ для поднятия блока */
  padding: 14px;
}

.home__statistic-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.home__statistic-dot {
  width: 20px;
  height: 3px;
  background-color: #D9D9D9;
}

.home__statistic-dot.active {
  background-color: #95B71D;
}

.home__statistic-head {
  font-weight: 300;
  font-size: 20px;
  margin-top: 15px;
  margin-bottom: 10px;
}

.home__statistic-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  max-width: 100%;
}

.home__statistic-item {
  background-color: rgba(217, 217, 217, 0.05);
  border-radius: 10px;
  width: 48%;
  display: flex;
  align-items: center;
  gap: 12px;
  box-sizing: border-box;
  min-height: 66px;
  padding: 6px 12px;
  flex-grow: 1;
  overflow: hidden;
}

.home__statistic-item .image {
  background-color: rgba(255, 255, 255, 0.05);
  width: 47px;
  min-width: 47px;
  height: 47px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.home__statistic-item .price {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.home__statistic-item .price .text {
  font-size: 14px;
  opacity: 0.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.home__statistic-item .price .sum {
  font-size: 20px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.home__statistic-item .price .sum span {
  font-size: 14px;
}

.loader {
  margin: 1rem auto;
}
</style>