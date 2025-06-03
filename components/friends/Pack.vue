<script setup lang="ts">
import { useTgWebAppStore } from '@/stores/tgWebApp'

const tgWebAppStore = useTgWebAppStore()
const productsStore = useProductsStore()
const router = useRouter()
const localePath = useLocalePath()
const emit = defineEmits(['close'])

const referralProduct = computed(() => productsStore.getReferralPrograms[0])

// userBalance
const userBalance = computed(() => {
  return tgWebAppStore.getUserBalance
})

const priceResult = () => {
  if (!referralProduct.value?.price) return { integerPart: "0", fractionalPart: "00" };

  const [integerPart, fractionalPart = ""] = referralProduct?.value?.price?.split(".");

  return { integerPart, fractionalPart }
}


const successText = ref('')
const errorText = ref('')

const buyProduct = async () => {
  try {
    if (!referralProduct.value) {
      console.warn("Нет данных о продукте для покупки");
      return;
    }

    if (!userBalance.value || !referralProduct.value?.price) {
      console.warn("Нет данных о балансе или цене продукта");
      return;
    }

    if (Number(userBalance.value.main) < Number(referralProduct.value.price)) {
      console.warn("Недостаточно средств на балансе");
      errorText.value = 'Not enough funds on the balance sheet';
      return;
    }


    const payload = { product_id: referralProduct?.value?.id, pay_from_balance: true };
    const response = await productsStore.buyProduct(payload);
    const fetchBalance = await tgWebAppStore.fetchUserBalance();

    console.log("Продукт успешно куплен:", referralProduct?.value?.name);
    successText.value = 'The product has been successfully purchased'

    // Задержка перед переходом
    setTimeout(() => {
      router.push(localePath('/trade'));
      return;
    }, 5000); // Задержка в 5 секунд

  } catch (error) {
    console.error("Произошла ошибка при покупке продукта:", error);
    errorText.value = 'There was an error when purchasing the product'
  }
};
// console.log('referralProduct', referralProduct)

</script>

<template>
  <div class="friends__invite" @click.self="emit('close')">

    <div class="friends__invite-content">
      <div class="friends__invite-line">{{ $t('Buy partnership pack') }}</div>

      <div class="pack-desc" v-html="referralProduct ? referralProduct?.description : ''" />

      <div class="friends__invite-price">$ {{ parseInt(priceResult().integerPart) }}.<span>{{
        priceResult().fractionalPart.slice(0, 2) }}</span>
      </div>

      <p v-if="errorText.length > 0" class="error">
        {{ $t(errorText) }}
      </p>

      <p v-if="successText.length > 0" class="success">
        {{ $t(successText) }}
      </p>

      <div class="friends__invite-buttons">
        <button class="friends__invite-copy" @click="buyProduct">
          {{ $t('Buy partnership pack') }}
        </button>
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
  padding: 0 1px;
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
  /* padding: 25px 0; */
  /* max-height: 80vh;
  overflow-y: auto; */
}

.friends__invite-content p {

  font-weight: 300;
  font-size: 15px;
  text-align: center;
  color: #fff;
  width: 90%;
  margin: 0 auto;
}

.friends__invite-price {
  font-weight: 600;
  font-size: 30px;
  color: #676799;
  text-align: center;
  margin-top: 28px;
}

.friends__invite-price span {
  color: #676799;
  font-size: 21px;
}

.friends__invite-line {
  font-family: "Suisse Intl", sans-serif;
  font-size: 20px;
  text-align: center;
  color: #fff;
  padding: 30px 0;
}

.friends__invite-buttons {
  display: flex;
  justify-content: center;
  padding: 35px 25px 25px;
}

.friends__invite-copy {
  background-color: #95b71d;
  border: none;
  font-size: 15px;
  padding: 13px;
  border-radius: 10px;
  cursor: pointer;
  transition: ease-in-out 0.2s;
  width: 100%;
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

.friends__invite-gradient-box button {
  font-size: 15px;
  padding: 13px;
  background-color: #101010;
  width: 100%;
  border-radius: 9px;
  cursor: pointer;
  transition: ease-in-out 0.2s;
}

.friends__invite-gradient-box button:hover {
  opacity: 0.8;
}

.error {
  margin: 1rem auto;
  font-size: 14px;
  color: red;
  text-align: center;
}

.success {
  margin: 1rem auto;
  font-size: 14px;
  color: green;
  text-align: center;
}

.pack-desc {
  font-size: 14px;
  max-height: 50dvh;
  overflow-y: auto;
  padding: 0 0.8rem;
}

.pack-desc p {
  font-size: 14px;
}
</style>
