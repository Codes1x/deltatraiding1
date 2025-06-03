<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFriendsStore } from '~/stores/friends'
import { useSubscribesStore } from '~/stores/subscribes'
import { useProductsStore } from '~/stores/products'

const localePath = useLocalePath()
const friendsStore = useFriendsStore()
const subscribesStore = useSubscribesStore()
const productsStore = useProductsStore()

const inviting = ref(false)
const pack = ref(false)
const referralsList = ref([])

const isDataLoaded = ref(false)
const isReferralProgram = ref(false)
// Проверка, есть ли рефералы
const isValidReferralsList = computed(() => {
  return Array.isArray(referralsList.value) && referralsList.value.length > 0
})
const isReferralProgramBuyed = computed(() => subscribesStore.getSubscribedReferralProgram)
// Функция для загрузки списка рефералов
const fetchAllUserReferrals = async () => {
  try {
    const payload = { max_level: 5 }
    const response = await friendsStore.fetchAllUserReferrals(payload)

    // Проверяем, что response содержит массив рефералов
    if (Array.isArray(response)) {
      referralsList.value = response // Присваиваем данные в реактивную переменную
    } else {
      console.warn('Invalid referrals response:', response)
    }
  } catch (error) {
    console.error('Failed to fetch referrals:', error)
  }
}
// 

const fetchReferralProduct = async () => {
  try {

    const response = await productsStore.fetchAllProducts()
  } catch (error) {
    console.error('fetchReferralProduct', error)
  }
}
// Функция для проверки куплен ли Пакет расширенной рефпрограммы
const isReferralProgramLoading = ref(false);
const fetchSubscribedProducts = async () => {
  // console.log('isReferralProgramBuyed ', isReferralProgramBuyed.value.length)
  // Removed: if (isReferralProgramBuyed.value.length > 0) { return }
  try {
    isReferralProgramLoading.value = true
    // const response = await productsStore.fetchAllProducts()
    await subscribesStore.fetchSubsribes() // Ensure we await the promise
    // console.log('subscribesStore.getSubscribedReferralProgram.length', subscribesStore.getSubscribedReferralProgram.length)
  } catch (error) {
    console.error('fetchProducts friends.vue', error)
  }
  finally {
    isReferralProgramLoading.value = false
  }
}

const fetchData = async () => {
  try {
    isDataLoaded.value = false
    // Загружаем список рефералов при монтировании
    fetchAllUserReferrals()
    fetchSubscribedProducts()
    fetchReferralProduct()

  } catch (error) {
    console.error('fetchData friends.vue', error)
  } finally {
    isDataLoaded.value = true
  }
}


onBeforeMount(fetchData)
</script>

<template>
  <section class="friends">
    <!-- Световой эффект -->
    <div class="friends__light">
      <div class="light" />
    </div>

    <!-- Шапка -->
    <div class="friends__header">
      <NuxtLink :to="localePath('/')" class="back">
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 13L1 7L7 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </NuxtLink>

      <div class="title">{{ $t('My friends') }}</div>

      <div />
    </div>

    <div v-if="isDataLoaded">
      <!-- Счётчик друзей -->
      <div class="friends__count">
        {{ $t('Friends list') }}
        <span>{{ referralsList?.length ?? 0 }} {{ $t('peoples') }}</span>
      </div>

      <!-- Список друзей -->
      <div>
        <!-- Если список валидный -->
        <div v-if="isValidReferralsList" class="friends__list">
          <FriendsLevel v-for="(referral, referral_index) in referralsList" :key="referral_index" :referral />
        </div>

        <!-- Если список пуст -->
        <!-- <div v-else class="friends__list">{{ $t('Referrals not added yet') }}</div> -->
      </div>

      <!-- Кнопки -->
      <div class="friends__buttons">
        <button class="friends__invite-btn" @click="inviting = !inviting">
          {{ $t('Invite friends') }}
        </button>
        <div v-show="!isReferralProgramLoading" class="friends__gradient-box">
          <button class="friends__partnership" :disabled="isReferralProgramBuyed.length > 0" @click="pack = !pack">
            {{ isReferralProgramBuyed?.length
              ? $t('Buy partnership has already been purchased')
              : $t('Buy partnership pack') }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="loader">
      <CommonLoader />
    </div>

    <!-- Окно приглашения -->
    <FriendsInvite :class="{ active: inviting }" :is-active="inviting" @close="inviting = false" />

    <FriendsPack :class="{ active: pack }" @close="pack = false" />
  </section>
</template>

<style scoped>
.friends__light .light {
  width: 70vw;
  height: 50vw;
  border-radius: 100%;
  position: absolute;
  top: -40vw;
  left: 13vw;
  background-color: #f89900;
  filter: blur(15vw);
}

.friends__header {
  z-index: 999;
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 25px 15px;
  align-items: center;
  border-bottom: 1px rgba(255, 255, 255, 0.3) dashed;
}

.friends__header .back {
  background-color: transparent;
  outline: none;
  border: none;
  cursor: pointer;
  display: flex;
  padding-top: 5px;
}

.friends__header .title {
  font-size: 20px;
  font-weight: bold;
}

.friends__count {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  padding: 20px 12px 10px 12px;
}

.friends__count span {
  color: rgba(255, 255, 255, 0.5);
}

.friends__list {
  background-color: rgba(217, 217, 217, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 15px;
  margin: 0 10px 20px 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  border-radius: 10px;
}

.friends__buttons {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 14px;
}

.friends__invite-btn {
  background-color: #95b71d;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 16px;
  border-radius: 10px;
  font-size: 15px;
  transition: ease-in-out 0.2s;
}

.friends__invite-btn:hover {
  opacity: 0.8;
}

.friends__gradient-box {
  background: linear-gradient(to right, #b2e500, white);
  padding: 2px;
  border-radius: 10px;
}

.friends__gradient-box button {
  background-color: #171722;
  width: 100%;
  padding: 13px;
  border-radius: 9px;
  border: none;
  cursor: pointer;
  transition: ease-in-out 0.2s;
}

.friends__gradient-box button:hover {
  opacity: 0.8;
}

.friends__gradient-box button:disabled {
  background-color: #676799;
  cursor: not-allowed;
}

.loader {
  margin: 1rem auto;
}
</style>
