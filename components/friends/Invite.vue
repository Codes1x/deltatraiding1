<script setup lang="ts">
import { useFriendsStore } from '@/stores/friends'
import { useTgWebAppStore } from '@/stores/tgWebApp'
import useClipboard from 'vue-clipboard3'
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'

const { toClipboard } = useClipboard()

// Props
const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
})

// Stores
const friendsStore = useFriendsStore()
const tgWebAppStore = useTgWebAppStore()

// Reactive state
const { referralLinkTG, referralLinkWeb } = storeToRefs(friendsStore)
const emit = defineEmits(['close'])
const isDataLoaded = ref(false)
const isCopiedTG = ref(false)
const isCopiedWeb = ref(false)

const fetchReferralLinks = async () => {
  // Keep isDataLoaded false initially to show loading or prevent interaction
  // isDataLoaded.value = false; // Consider if you want a loading state visual
  console.log('🔄 Запуск fetchReferralLinks()...')
  try {
    await friendsStore.fetchReferralLink()
    console.log('✅ Ссылки успешно загружены из friendsStore')
    // Only set isDataLoaded to true after links are successfully fetched
    // and referralLinkTG.value and referralLinkWeb.value are populated.
    // This prevents the modal from showing stale or no data.
    if (referralLinkTG.value && referralLinkWeb.value) {
        isDataLoaded.value = true
        console.log('📦 isDataLoaded = true (links available)')
    } else {
        isDataLoaded.value = false; // Ensure it's false if links are not there
        console.warn('⚠️ Ссылки не были загружены, isDataLoaded = false')
    }
  } catch (error) {
    console.error('❌ Ошибка загрузки реферальных ссылок:', error)
    isDataLoaded.value = false // Ensure it's false on error
  }
  // Removed finally block for isDataLoaded, moved logic into try/catch
}

// Watch for accessToken from Telegram WebApp
watch(
  () => tgWebAppStore.accessToken,
  async (token) => {
    if (token && props.isActive) { // Also check if modal is intended to be active
      console.log('🟢 Токен доступен и модальное окно активно, загружаем ссылки...')
      await fetchReferralLinks()
    } else if (!token) {
      console.warn('⏳ Ожидаем accessToken от Telegram...')
    }
  },
  { immediate: true }
)

// Watch for isActive prop changes
watch(
  () => props.isActive,
  async (newIsActive) => {
    if (newIsActive) {
      console.log('🚀 Модальное окно активировано (isActive=true). Обновляем ссылки и сбрасываем состояние.')
      isCopiedTG.value = false
      isCopiedWeb.value = false
      // isDataLoaded.value = false; // Reset to show loading, if desired
      if (tgWebAppStore.accessToken) { // Check if token exists before fetching
        await fetchReferralLinks()
      } else {
        console.warn('⏳ Ожидаем accessToken от Telegram для загрузки ссылок при активации модального окна.')
        isDataLoaded.value = false // Don't show content if no token
      }
    } else {
      console.log('🚪 Модальное окно деактивировано (isActive=false).')
      // Optionally reset isDataLoaded if you want the modal to always show loading on open
      // isDataLoaded.value = false;
    }
  }
)

// Ссылка для Telegram
const officialDeltaTradeBot = computed(() => {
  const url = `https://t.me/share/url?url=${referralLinkTG.value}&text=DeltaTrade`
  // console.log('🔗 officialDeltaTradeBot URL:', url) // Reduced logging verbosity
  return url
})

const copyToClipboard = async () => {
  console.log('📋 Копирование TG ссылки...')
  console.log('🔍 referralLinkTG:', referralLinkTG.value)

  if (!referralLinkTG.value?.trim()) {
    console.warn('⚠️ Ссылка Telegram пуста или не загружена')
    return
  }

  try {
    await toClipboard(referralLinkTG.value)
    console.log('✅ Скопировано в буфер обмена (TG):', referralLinkTG.value)
    isCopiedTG.value = true
    setTimeout(() => (isCopiedTG.value = false), 3000)
  } catch (err) {
    console.error('❌ Ошибка копирования TG ссылки:', err)
  }
}

const copyToClipboardWeb = async () => {
  console.log('📋 Копирование WEB ссылки...')
  console.log('🔍 referralLinkWeb:', referralLinkWeb.value)

  if (!referralLinkWeb.value?.trim()) {
    console.warn('⚠️ Ссылка Web отсутствует или пуста')
    return
  }

  try {
    await toClipboard(referralLinkWeb.value)
    console.log('✅ Скопировано в буфер обмена (Web):', referralLinkWeb.value)
    isCopiedWeb.value = true
    setTimeout(() => (isCopiedWeb.value = false), 3000)
  } catch (err) {
    console.error('❌ Ошибка копирования Web ссылки:', err)
  }
}
</script>

<template>
  <div v-if="isDataLoaded" class="friends__invite" @click.self="emit('close')">
    <div class="friends__invite-content">
      <div class="friends__invite-avatars__wrapper">
        <div class="friends__invite-avatars">
          <div class="avatar">
            <img src="https://www.w3schools.com/howto/img_avatar.png" alt="">
          </div>
          <div class="avatar">
            <img src="https://www.w3schools.com/howto/img_avatar.png" alt="">
          </div>
          <div class="avatar">
            <img src="https://www.w3schools.com/howto/img_avatar.png" alt="">
          </div>
        </div>
      </div>

      <div class="friends__invite-line">{{ $t('Invite a friend') }}</div>

      <div class="friends__invite-buttons">
        <button class="friends__invite-copy" @click="copyToClipboard">
          {{ isCopiedTG ? $t('Copied') : $t('Copy TG link') }}
        </button>

        <button class="friends__invite-copy" @click="copyToClipboardWeb">
          {{ isCopiedWeb ? $t('Copied') : $t('Copy Web link') }}
        </button>

        <div class="friends__invite-gradient-box">
          <NuxtLink :to="officialDeltaTradeBot">
            {{ $t('Send a Telegram') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.friends__invite {
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(7.7px);
  z-index: 999;
  align-items: center;
  justify-content: end;

  box-sizing: border-box;
  flex-direction: column;
  display: none;
}

.friends__invite.active {
  display: flex;
}

.friends__invite-content {
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  /* backdrop-filter: blur(30px); */
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  border-top: 1px solid rgba(217, 217, 217, 0.25);
  border-left: 1px solid rgba(217, 217, 217, 0.25);
  border-right: 1px solid rgba(217, 217, 217, 0.25);
  width: 100%;
  background-color: rgba(217, 217, 217, 0.05);
  position: relative;
}

.friends__invite-avatars__wrapper {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
}

.friends__invite-avatars {
  display: flex;
  width: 100px;
  height: 50px;
  position: relative;
}

.friends__invite-avatars .avatar {
  width: 44px;
  height: 44px;
  border: 1px solid #525252;
  border-radius: 100%;
  overflow: hidden;

  position: absolute;
}

.friends__invite-avatars .avatar:nth-child(2) {
  left: 28px;
}

.friends__invite-avatars .avatar:nth-child(3) {
  left: 59px;
}

.friends__invite-avatars .avatar img {
  width: 100%;
  height: 100%;
}

.friends__invite-line {
  font-size: 20px;
  padding: 50px 0 30px;
  text-align: center;
}

.friends__invite-line {
  font-size: 20px;
  padding: 30px 0;
}

.friends__invite-buttons {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 25px 25px;
}

.friends__invite-copy {
  background-color: #95b71d;
  font-size: 15px;
  padding: 13px;
  border-radius: 10px;
  cursor: pointer;
  transition: ease-in-out 0.2s;
  border: none;
}

.friends__invite-copy:hover {
  opacity: 0.8;
}

.friends__invite-gradient-box {
  width: 100%;
  background: linear-gradient(to right, #b2e500, #00bfff);
  padding: 2px;
  border-radius: 10px;
  box-sizing: border-box;
}

.friends__invite-gradient-box a {
  font-size: 13px;
  padding: 13px;
  background-color: #101010;

  border-radius: 9px;
  cursor: pointer;
  transition: ease-in-out 0.2s;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
}

.friends__invite-gradient-box a:hover {
  opacity: 0.8;
}
</style>
