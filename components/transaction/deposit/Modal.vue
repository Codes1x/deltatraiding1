<script setup lang="ts">
import { useReplenishmentStore } from '~/stores/replenishment';
import useClipboard from 'vue-clipboard3'
import type { DropdownItem } from '~/types/replenishment';
import { formatRemainingTime } from '~/utils/functions';

const { toClipboard } = useClipboard()
const replenishmentStore = useReplenishmentStore()
const emit = defineEmits(['close'])

const selectedItem = ref<DropdownItem>();

const depositAddress = computed(() => replenishmentStore.getDepositAddress)
// Слушаем изменения выбранного значения
const onUpdateSelectedItem = (item: DropdownItem) => {
  selectedItem.value = item;
  replenishmentStore.resetDepositAddres();
};

const isCopiedAddress = ref(false)
const copyToClipboardAddress = async () => {
  if (!depositAddress.value.address) {
    return
  }
  try {
    await toClipboard(depositAddress.value.address)
    isCopiedAddress.value = true
    setTimeout(() => {
      isCopiedAddress.value = true
      setTimeout(() => {
        isCopiedAddress.value = false
      }, 2000)
    }, 0)

  } catch (error) {
    console.error('Не удалось скопировать текст:', error)
  }
}

// get address
const handleGetDepositAddress = async () => {
  try {
    if (selectedItem.value?.value) {
      const payload = {
        token: selectedItem.value.value
      }
      const response = await replenishmentStore.fetchDepositAddress(payload)
      console.log('Получен адрес:', response)
    }
  } catch (error) {
    console.log('handleGetDepositAddress ', error)
  }
}

// clear token
const clearToken = async () => {
  await replenishmentStore.resetDepositAddres()
  emit('close')
}
</script>

<template>
  <div class="deposit__modal" @click.self="emit('close')">
    <div class="deposit__modal-content">
      <h2>{{ $t('deposit') }}</h2>
      <div class="deposit__form">
        <button class="deposit__form-address" @click="copyToClipboardAddress">
          <img src="/icons/user.svg" alt="user icon" class="icon" >
          <span>{{ depositAddress.address ?? 'address' }}</span>
        </button>
        <p v-show="isCopiedAddress" class="deposit__form-copied">{{ $t('copied') }}</p>
      </div>

      <div class="deposit__modal-dropdown">
        <TransactionDepositTokens v-model="selectedItem" @update:model-value="onUpdateSelectedItem" />
      </div>

      <div class="deposit__modal-desc">
        <p>
          {{ $t('Select the token you want to deposit') }}
          <span>BEP20</span>.
        </p>
      </div>

      <div v-if="depositAddress.address" class="deposit__info">
        <div class="deposit__info-qr">
          <img :src="`data:image/png;base64,${depositAddress.qr_code}`" alt="QR Code" class="qr-code" >
        </div>

        <div v-if="depositAddress.expiration_time > 0" class="deposit__info-estimate">
  {{ formatRemainingTime(depositAddress.expiration_time) }}
</div>

      </div>

      <div class="deposit__modal-action">

        <button v-if="!depositAddress.qr_code" class="deposit__save-btn" @click="handleGetDepositAddress">
          {{ $t('Get a wallet address') }}
        </button>

        <div v-if="depositAddress.qr_code" class="deposit__actions single-button-container">
          <button class="deposit__save-btn" @click="emit('close')">
            {{ $t('Back') }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.deposit__modal {
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

.deposit__modal.active {
  display: flex;
}

.deposit__modal-content {
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -35px 65px 0 rgba(0, 0, 0, 0.27);
  background: #171722;
  /* padding: 16px 13px 20px 13px; */
  width: 100%;
  padding-bottom: 20px;
}

.deposit__modal-content h2 {
  margin: 16px auto;
  font-weight: 700;
  font-size: 20px;
  text-align: center;
  color: #fff;
}

.deposit__modal-dropdown {
  display: flex;
  justify-content: center;
  margin: 14px auto;
}

.deposit__form {
  margin: 0 13px;
}

.deposit__form-group {
  position: relative;
  max-width: 100%;
}

.deposit__form-address {
  position: relative;
  max-width: 100%;

  padding: 15px 15px 15px 60px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  max-width: 100%;
  box-sizing: border-box;

  background-color: rgba(217, 217, 217, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 3px;

  outline: none;
  width: 100%;

  display: flex;
  align-items: center;
}

.deposit__form-group input {
  padding: 15px 15px 15px 60px;
  font-size: 15px;
  max-width: 100%;
  box-sizing: border-box;
}

.deposit__form-group .icon,
.deposit__form-address .icon {
  top: 50%;
  transform: translateY(-50%);
  left: 20px;
  position: absolute;
}

.deposit__form-copied {
  margin: 1rem auto;
  color: rgba(255, 255, 255, 0.75);
  font-size: 15px;
  text-align: center;
}

.deposit__modal-desc {
  margin: 14px 13px 30px 13px;
  font-size: 15px;
  color: #fff;
  text-align: center;
}

.deposit__modal-desc span {
  color: #95b71d;
}

.deposit__modal-action {
  margin: 0 13px;
}

.deposit__save-btn {
  height: 50px;
  background-color: #95b71d;
  border: none;
  outline: none;
  cursor: pointer;
  transition: ease-in-out 0.2s;
  border-radius: 5px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.deposit__info {
  margin: 1rem auto;
}

.deposit__info-qr {
  backdrop-filter: blur(9.889423370361328px);
  box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.25);
  background: rgba(255, 255, 255, 0.03);
  border: 0.82px solid rgba(255, 255, 255, 0.03);
  border-radius: 7px;
  padding: 6px 12px;
  width: 100%;
  max-width: 150px;
  height: auto;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.deposit__info-qr img {
  width: 100%;
}

.deposit__info-estimate {
  margin-top: 1rem;
  font-weight: 400;
  font-size: 16px;
  text-align: center;
  color: #fff;
}

.deposit__actions {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* This will not have an effect if only one button remains, but keep for consistency or future use */
}

.single-button-container {
  margin-top: 1rem; /* Add some top margin to push the single button down slightly */
}
</style>
