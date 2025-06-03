<script setup lang="ts">
import type { IProduct } from '@/types/products'
const localePath = useLocalePath()

const productsStore = useProductsStore()
const allProducts = computed(() => productsStore.getAllProducts)
const tradingSystems = computed(() => productsStore.getTradingSystems)
const isLoading = ref(false)
const fetchAllProducts = async () => {
  try {
    isLoading.value = true
    await productsStore.fetchAllProducts()
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    isLoading.value = false
  }
  //console.log(allProducts.value) // Здесь вы всё равно можете использовать .value для дебага
}

onBeforeMount(fetchAllProducts)
</script>

<template>
  <div class="shop">
    <div class="shop__light">
      <div class="light left" />
      <div class="light right" />
    </div>

    <div class="shop__header">
      <NuxtLink :to="localePath('/')" class="back">
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 13L1 7L7 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </NuxtLink>

      <div class="title">{{ $t('Buy Trading system') }}</div>

      <div />
    </div>
    <div>
      <div v-if="isLoading">
        <CommonLoader />
      </div>
      <div v-else class="shop__items">
        <!-- Проверка наличия продуктов -->
        <p v-if="tradingSystems?.length === 0">{{ $t('No products available.') }}</p>

        <!-- Вывод списка продуктов -->
        <ShopItem v-for="product in tradingSystems" :key="product.id" :product />
      </div>

    </div>
  </div>
</template>

<style scoped>
.shop__light .light {
  width: 60vw;
  height: 55vw;
  border-radius: 100%;
  position: absolute;
  top: -40vw;
  filter: blur(15vw);
}

.shop__light .left {
  background-color: #f89900;
  left: 0;
}

.shop__light .right {
  background-color: #878787;
  right: 0;
}

.shop__header {
  z-index: 999;
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 25px 15px;
  align-items: center;
  border-bottom: 1px rgba(255, 255, 255, 0.3) dashed;
}

.shop__header .back {
  background-color: transparent;
  outline: none;
  border: none;
  cursor: pointer;
  display: flex;
  padding-top: 5px;
}

.shop__header .title {
  font-size: 20px;
  font-weight: bold;
}

.shop__items {
  margin: 25px 13px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
