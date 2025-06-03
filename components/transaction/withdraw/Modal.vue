<script setup lang="ts">
import { useWebAppClipboard, useWebAppViewport } from 'vue-tg'
import { useTgWebAppStore } from '@/stores/tgWebApp'
import { useWithdrawStore } from '~/stores/withdraw'
import type { DropdownItem } from '~/types/replenishment'

const clipboard = useWebAppClipboard()
const appViewport = useWebAppViewport()
const localePath = useLocalePath()

const tgWebAppStore = useTgWebAppStore()
const withdrawStore = useWithdrawStore()

const userBalance = computed(() => tgWebAppStore.getUserBalance)

const emit = defineEmits(['close'])

const toAddress = ref()
const amount = ref(0)
const secretCode = ref()
const responseError = ref('')
const responseSuccess = ref('')

const selectedItem = ref<DropdownItem>();

const errors = ref({
  toAddress: {
    status: false,
    message: ''
  },
  amount: {
    status: false,
    message: ''
  },
  secretCode: {
    status: false,
    message: ''
  }
})

// Слушаем изменения выбранного значения
const onUpdateSelectedItem = (item: DropdownItem) => {
  selectedItem.value = item;
};

const handleSend = async () => {
  resetErrors();

  // Проверка формы
  const isValid = validateForm();

  // Если форма не валидна, не отправляем данные
  if (!isValid) {
    return;
  }

  responseError.value = ''
  responseSuccess.value = ''
  try {
    const payload = {
      amount: amount.value.toString(),
      address: toAddress.value.toString(),
      token: selectedItem.value ? selectedItem.value.value.toString() : '',
      secret_code: Number(secretCode.value)
    }

    const response = await withdrawStore.sendWithdraw(payload)
    if (response.success) {
      responseSuccess.value = 'The transfer was successfully sent'
    } else {
      console.log('error message', response)
      responseError.value = 'Transfer error, try again later'
    }

  } catch (error) {

    console.log('handleSend ', error)
  } finally {
    const fetchBalance = await tgWebAppStore.fetchUserBalance();
  }
}

const setFromClipboard = () => {
  toAddress.value = clipboard.readTextFromClipboard()
}

const handleCodeInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  secretCode.value = validateInput(target.value);
};
// Валидация ввода (обработка только цифр, длина от 4 до 8)
const validateInput = (value: string) => {
  // Удаляем нецифровые символы
  const sanitizedValue = value.replace(/\D/g, '');
  // Ограничиваем длину
  return sanitizedValue.slice(0, 8);
};

// Метод для проверки формы
const validateForm = () => {
  const balance = parseFloat(userBalance.value?.main || '0').toFixed(2);

  let isValid = true;

  // Проверка на сумму
  if (amount.value < 1) {
    errors.value.amount.message = 'You have not specified the amount';
    isValid = false;
  }

  // Проверка на достаточность средств
  if (parseFloat(balance) < amount.value) {
    errors.value.amount.message = 'You have insufficient funds on your account, replenish your balance';
    isValid = false;
  }

  // Проверка на секретный код
  if (!secretCode.value) {
    errors.value.secretCode.message = 'You didnt specify a secret code';
    isValid = false;
  }

  // Проверка на адрес получателя
  if (!toAddress.value) {
    errors.value.toAddress.message = 'You did not specify the recipients address';
    isValid = false;
  }

  return isValid;
}

const resetErrors = () => {
  errors.value = {
    toAddress: {
      status: false,
      message: ''
    },
    amount: {
      status: false,
      message: ''
    },
    secretCode: {
      status: false,
      message: ''
    }
  }
}

// Функция корректировки отступа для input при появлении клавиатуры
const adjustInputPadding = (event: FocusEvent) => {
  const input = event.target as HTMLInputElement;
  const parent = input.closest('.deposit__form-group') as HTMLElement;
  if (parent) {
    const isKeyboardOpen = window.visualViewport?.height! < appViewport.viewportHeight.value;
    parent.style.paddingBottom = isKeyboardOpen ? "350px" : "0px";
  }
};

onMounted(() => {
  // console.log('appViewport:', appViewport.viewportHeight.value);
  document.addEventListener('focusin', adjustInputPadding);
  document.addEventListener('focusout', adjustInputPadding);
  appViewport.onViewportChanged(adjustInputPadding); // Подписка на изменения viewport
});

onBeforeUnmount(() => {
  document.removeEventListener('focusin', adjustInputPadding);
  document.removeEventListener('focusout', adjustInputPadding);

  document.querySelectorAll('.deposit__form-group').forEach((parent) => {
    (parent as HTMLElement).style.paddingBottom = "0px"; // Сброс отступов
  });
});


</script>

<template>
  <div class="deposit__modal" @click.self="emit('close')">
    <div class="deposit__modal-content">
      <h2>{{ $t('transfer') }}</h2>
      <div class="deposit__form">
        <div class="deposit__modal-dropdown">
          <TransactionDepositTokens v-model="selectedItem" @update:model-value="onUpdateSelectedItem" />
        </div>

        <div class="deposit__modal-desc">
          <p>
            {{ $t('Select the token you want to withdraw') }}
            <span>BEP20</span>.
          </p>
        </div>

        <div class="deposit__form-group_wrapper">
          <div class="deposit__form-group" @click="setFromClipboard">
            <img src="/icons/wallet.svg" alt="wallet icon" class="icon" >
            <input v-model="toAddress" type="text" :placeholder="$t('Address')" :title="$t('adress')" >
          </div>
          <p v-show="errors.toAddress.message.length > 0" class="hint error">
            {{ $t(errors.toAddress.message) }}
          </p>
        </div>

        <div class="deposit__form-group_wrapper">
          <div class="deposit__form-group">
            <img src="/icons/amount.svg" alt="amount icon" class="icon" >
            <input v-model="amount" type="number" :placeholder="$t('Amount')" :title="$t('Amount')" >
          </div>
          <p v-show="errors.amount.message.length > 0" class="hint error">
            {{ $t(errors.amount.message) }}
          </p>
        </div>



        <div class="deposit__form-group_wrapper">
          <div class="deposit__form-group">
            <img src="/icons/password.svg" alt="password icon" class="icon" >
            <input v-model="secretCode" type="password" :placeholder="$t('secret code')" minlength="4" maxlength="8"
              pattern="\d{4,8}" :title="$t('Please enter a code with 4 to 8 digits')" @input="handleCodeInput" >
          </div>
          <p v-show="errors.secretCode.message.length > 0" class="hint error">
            {{ $t(errors.secretCode.message) }}
          </p>
        </div>
        <div class="transfer-profile">
          <NuxtLink :to="localePath('/profile')">{{ $t('Create code') }}</NuxtLink>
        </div>

      </div>

      <div class="deposit__form-status">
        <p v-if="responseSuccess.length > 0" class="success">
          {{ $t(responseSuccess) }}
        </p>

        <p v-if="responseError.length > 0" class="error">
          {{ $t(responseError) }}
        </p>
      </div>



      <div class="deposit__modal-action">
        <button class="deposit__save-btn" @click="handleSend">
          {{ $t('Get a wallet address') }}
        </button>
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
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.deposit__form-group {
  position: relative;
  max-width: 100%;

}

.deposit__form-group_wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.deposit__form-group_wrapper p.error {
  font-size: 14px;
  color: red;
}

.deposit__form-group input {
  padding: 15px 15px 15px 60px;
  font-size: 12px;
  max-width: 100%;
  box-sizing: border-box;
}

.deposit__form-group input::-ms-reveal {
  filter: invert(50%);
}

.deposit__form-group .icon {
  top: 50%;
  transform: translateY(-50%);
  left: 20px;
  position: absolute;
}

.deposit__modal-action {
  margin: 0 13px;
}

.deposit__save-btn {
  margin-top: 20px;
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
  font-size: 18px;
  text-align: center;
  color: #fff;
}

.deposit__form-status {
  margin: 1rem 13px;
}

.deposit__form-status p {
  font-size: 15px;
  text-align: center;
}

.deposit__form-status p.success {
  color: green;
}

.deposit__form-status p.error {
  color: red;
}
</style>
