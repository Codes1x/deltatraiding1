<script setup lang="ts">
import { useWebAppViewport } from 'vue-tg'
const brokersStore = useBrokersStore()
const appViewport = useWebAppViewport()

const referrerLink = ref('')
const error = ref('')
const success = ref(false)
const isDataLoaded = ref(false)

const saveBrokerLink = async () => {
  // console.log('saveBrokerLink')
  if (referrerLink.value.length < 5) {
    error.value = 'Please input referrer link'
    return
  } else {
    error.value = ''
    success.value = false
    try {
      const payload = { link: referrerLink.value }
      const saveBrokerLinkResponse = await brokersStore.changeReferrerLink(payload)
      success.value = true

      setTimeout(() => {
        success.value = false;
      }, 3000);
    } catch (error) {
      console.log('saveBrokerLink ', error)
    }
  }

}

const fetchReferralLink = async () => {
  isDataLoaded.value = false
  try {
    const fetchReferralLinkResponse = await brokersStore.fetchReferral()

    referrerLink.value = brokersStore.getReferralLink
    // console.log('referrerLink.value ', referrerLink.value)
  } catch (error) {
    console.error('fetchReferralLink ', fetchReferralLink)
  } finally {
    isDataLoaded.value = true

  }
}

// Функция корректировки отступа для input при появлении клавиатуры
const adjustInputPadding = () => {
  const form = document.querySelector('.profile__form') as HTMLElement;
  if (form) {
    form.style.paddingBottom = window.visualViewport?.height! < appViewport.viewportHeight.value ? "350px" : "0px";
  }
};

onMounted(() => {
  fetchReferralLink()
  appViewport.onViewportChanged(adjustInputPadding);
  adjustInputPadding();
})

onBeforeUnmount(() => {
  const form = document.querySelector('.profile__form') as HTMLElement;
  if (form) form.style.paddingBottom = "0px";
});
</script>

<template>
  <div class="profile__form">
    <div class="profile__form-group">
      <svg width="22" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M3.65304 14.9507C4.1397 13.8042 5.27594 13 6.6 13H11.4C12.7241 13 13.8603 13.8042 14.347 14.9507M12.2 7C12.2 8.76731 10.7673 10.2 9 10.2C7.23269 10.2 5.8 8.76731 5.8 7C5.8 5.23269 7.23269 3.8 9 3.8C10.7673 3.8 12.2 5.23269 12.2 7ZM17 9C17 13.4183 13.4183 17 9 17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9Z"
          stroke="#B2E500" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <input v-model="referrerLink" type="text" :placeholder="$t('Referral link')">
      <p v-if="error.length > 1" class="error">
        {{ $t(error) }}
      </p>
      <p v-if="success" class="success">
        {{ $t('saved') }}
      </p>
    </div>
    <div class="profile__form-group">
      <button class="friends__invite-copy" @click="saveBrokerLink">
        {{ $t('Save') }}
      </button>
    </div>

  </div>
</template>

<style lang="css" scoped>
.profile__form {
  display: flex;
  gap: 15px;
  flex-direction: column;
  margin: 40px 0;
}

.profile__form-group {
  position: relative;
  max-width: 100%;
  padding: 0 13px;
}

.profile__form-group input {
  padding: 15px 15px 15px 60px;
  font-size: 12px;
  max-width: 100%;
  box-sizing: border-box;
}

.profile__form-group svg {
  top: 13px;
  left: 32px;
  position: absolute;

  width: 22px;
  height: 22px;
}


.friends__invite-copy {
  background-color: #95b71d;
  font-size: 15px;
  padding: 13px;
  border-radius: 10px;
  cursor: pointer;
  transition: ease-in-out 0.2s;
  border: none;
  width: 100%;
}

.friends__invite-copy:hover {
  opacity: 0.8;
}

.error {
  margin: 1rem auto;
  font-size: 14px;
  color: red;
  text-align: center;
  padding: 0 13px;
}

.success {
  margin: 1rem auto;
  font-size: 14px;
  color: green;
  text-align: center;
}
</style>