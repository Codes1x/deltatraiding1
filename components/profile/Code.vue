<script setup lang="ts">
import { useCodeStore } from '@/stores/code';
import { useWebAppViewport } from 'vue-tg'
import { ref } from 'vue';
const localePath = useLocalePath()
const appViewport = useWebAppViewport()
// Используем store
const codeStore = useCodeStore();

// Управление формой и данными
const isShowForm = ref(false);
const isShowDesc = ref(false);
const code = ref('');
const confirmCode = ref('');
const error = ref('');
const isLoading = ref(false);
const isCodeSet = computed(() => codeStore.getIsCodeSet);

// Переключение формы
const createCode = () => {
  isShowForm.value = !isShowForm.value;
};

const showDesc = () => {
  isShowDesc.value = !isShowDesc.value;
};
// Валидация ввода (обработка только цифр, длина от 4 до 8)
const validateInput = (value: string) => {
  // Удаляем нецифровые символы
  const sanitizedValue = value.replace(/\D/g, '');
  // Ограничиваем длину
  return sanitizedValue.slice(0, 8);
};

const checkCode = () => {
  if (code.value === '' || confirmCode.value === '') {
    error.value = 'Please enter a code and confirm code'
    return;
  }
  if (code.value.length < 4 || confirmCode.value.length < 4) {
    error.value = 'Code and confirm code must be at least 4 digit'
    return;
  }
  if (code.value.length > 8 || confirmCode.value.length > 8) {
    error.value = 'Code and confirm code must be no more than 8 digits'
    return;
  }

  if (code.value === confirmCode.value) {
    setCode();
  } else {
    error.value = 'Code and confirm code is not confirm'
  }
}
// Обработчики ввода
const handleCodeInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  code.value = validateInput(target.value);
};

const handleConfirmCodeInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  confirmCode.value = validateInput(target.value);
};

const setCode = async () => {
  try {
    isLoading.value = true;
    const payload = {
      secret_code: code.value,
    }
    const response = await codeStore.setCode(payload);
  } catch (error) {
    console.error('setCode', error)
  } finally {
    isLoading.value = false;
  }
}

// Функция корректировки отступа для input при появлении клавиатуры
const adjustInputPadding = () => {
  document.querySelectorAll('input').forEach((input) => {
    const parent = input.closest('.profile__form') as HTMLElement;
    if (parent) {
      parent.style.paddingBottom = window.visualViewport?.height! < appViewport.viewportHeight.value ? "350px" : "0px";
    }
  });
};

onMounted(() => {
  appViewport.onViewportChanged(adjustInputPadding);
  adjustInputPadding();
})

onBeforeUnmount(() => {
  document.querySelectorAll('input').forEach((input) => {
    const parent = input.closest('.profile__form') as HTMLElement;
    if (parent) {
      parent.style.paddingBottom = "0px";
    }
  });
});
</script>

<template>
  <div class="profile__code">
    <div class="profile__code-head">
      {{ $t('Transfer Security Code') }}
      <div class="line" />
    </div>

    <!-- Форма -->
    <div v-if="isShowForm" class="profile__code-items">
      <!-- Поле для ввода нового кода -->
      <div class="profile__form">
        <div class="profile__form-group">
          <img src="/icons/password.svg" alt="password icon" class="icon" >
          <input v-model="code" type="text" :placeholder="$t('Enter new code')" minlength="4" maxlength="8"
            pattern="\d{4,8}" title="Please enter a code with 4 to 8 digits" @input="handleCodeInput" >
        </div>
      </div>

      <!-- Поле для подтверждения нового кода -->
      <div class="profile__form">
        <div class="profile__form-group">
          <img src="/icons/password.svg" alt="password confirm icon" class="icon" >
          <input v-model="confirmCode" type="text" :placeholder="$t('Confirm new code')" minlength="4" maxlength="8"
            pattern="\d{4,8}" title="Please enter a code with 4 to 8 digits" @input="handleConfirmCodeInput" >
        </div>
      </div>
      <p v-if="error" class="error">
        {{ $t(error) }}
      </p>
      <button class="profile__save-btn" @click="checkCode">Save</button>
    </div>

    <!-- Описание -->
    <div v-if="isShowDesc" class="profile__code-desc">
      <p>{{ $t('The security code has already been created') }}</p>
      <p>
        {{ $t('To change the security code, contact') }} <NuxtLink :to="localePath('/support')">{{ $t('nav_support') }}
        </NuxtLink>
      </p>
    </div>

    <!-- Кнопка переключения формы -->
    <button v-if="isCodeSet" class="profile__code-btn" @click="showDesc">
      <span>{{ $t('Code created') }}</span>
    </button>

    <button v-else class="profile__code-btn" @click="createCode">
      <span> {{ isShowForm ? $t('Cancel') : $t('Create code') }}</span>
    </button>
  </div>
</template>


<style lang="css" scoped>
.profile__code {
  padding: 0 13px;
}

.profile__code-head {
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  gap: 13px;
  align-items: center;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 25px;
  padding: 0 13px;
}

.profile__code-head .line {
  width: 50%;
  text-align: right;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
}

.profile__code-items {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.profile__code-item {
  font-size: 15px;
  font-weight: 300;
  display: flex;
  justify-content: space-between;
}

.profile__code-item span {
  color: rgba(255, 255, 255, 0.5);
}

.profile__form {
  display: flex;
  gap: 15px;
  flex-direction: column;
}

.profile__form-group {
  position: relative;
  max-width: 100%;
}

.profile__form-group input {
  padding: 15px 15px 15px 60px;
  font-size: 14px;
  max-width: 100%;
  box-sizing: border-box;

}

.profile__form-group .icon {
  top: 17px;
  left: 20px;
  position: absolute;
}

.profile__code-btn {
  height: 50px;
  max-height: 50px;
  width: 100%;
  padding: 16px 24px;


  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  background-color: transparent;
  border: 2px solid transparent;
  border-radius: 10px;
  background: linear-gradient(#eee, #eee 0) padding-box,
    linear-gradient(to right, #B2E500, #fff) border-box;

  font-family: var(--font-family);
  font-weight: 500;
  font-size: 15px;
  line-height: 185%;
  text-align: center;
  color: #fff;
  position: relative;
  margin: 22px auto 29px auto;
}

.profile__code-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #171722;
  border-radius: 8px;
  z-index: 1;
}

.profile__code-btn span {
  position: relative;
  z-index: 2;
}

.profile__save-btn {
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

.error {
  color: red;
  font-size: 14px;
  text-align: center;
}

.profile__code-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  margin-top: 20px;
}
</style>