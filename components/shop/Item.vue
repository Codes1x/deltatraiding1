<script setup lang="ts">
import { useTgWebAppStore } from '@/stores/tgWebApp'

import type { IProduct } from '~/types/products'

const webAppStore = useTgWebAppStore()
const productsStore = useProductsStore()
const localePath = useLocalePath()

const props = defineProps<{
  product: IProduct
}>()

const router = useRouter()

// userBalance
const userBalance = computed(() => {
  return webAppStore.getUserBalance
})

const isDisabled = ref(false)

const isDescShow = ref(false)
const toggleDesc = () => {
  isDescShow.value = !isDescShow.value
}

</script>

<template>
  <div class="shop__item">
    <div class="shop__item-content">
      <div class="left">
        <div class="image">
          <template v-if="product.product_icon && product.product_icon.length > 0">
            <img :src="product.product_icon" :alt="product.name" >
          </template>
          <template v-else>
            <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18.5 18V11M10.5 18V8M2.5 18L2.5 14M11.9067 3.0275L17.0751 4.96567M9.29877 3.40092L3.70023 7.59983M19.5607 4.43934C20.1464 5.02513 20.1464 5.97487 19.5607 6.56066C18.9749 7.14645 18.0251 7.14645 17.4393 6.56066C16.8536 5.97487 16.8536 5.02513 17.4393 4.43934C18.0251 3.85355 18.9749 3.85355 19.5607 4.43934ZM3.56066 7.43934C4.14645 8.02513 4.14645 8.97487 3.56066 9.56066C2.97487 10.1464 2.02513 10.1464 1.43934 9.56066C0.853553 8.97487 0.853553 8.02513 1.43934 7.43934C2.02513 6.85355 2.97487 6.85355 3.56066 7.43934ZM11.5607 1.43934C12.1464 2.02513 12.1464 2.97487 11.5607 3.56066C10.9749 4.14645 10.0251 4.14645 9.43934 3.56066C8.85355 2.97487 8.85355 2.02513 9.43934 1.43934C10.0251 0.853553 10.9749 0.853553 11.5607 1.43934Z"
                stroke="white" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </template>
        </div>
        <div class="text">
          {{ product.name }}
          <span>{{ product.duration }}</span>
        </div>
      </div>

      <div class="right">
        <div class="text">
          <div class="price">$ {{ parseInt(product.price).toFixed(2) }}</div>
          <!-- <span>income {{ product.duration }}%</span> -->
        </div>

        <NuxtLink :to="localePath({ path: '/buy', query: { id: product.id } })">
          {{ $t('Buy') }}
        </NuxtLink>
      </div>
    </div>

    <div class="shop__item-info">
      <div v-show="isDescShow">
        <p v-html="product.description"/>
      </div>

      <div class="shop__item-info__toggle" @click="toggleDesc">
        <span class="icon" :class="{ 'rotate': isDescShow }">
          <svg width="9" height="5" viewBox="0 0 9 5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.74746 0.232761C8.5875 0.0836789 8.37111 0 8.14556 0C7.92001 0 7.70362 0.0836789 7.54366 0.232761L4.47866 3.06631L1.45634 0.232761C1.29638 0.0836789 1.07999 0 0.854442 0C0.628891 0 0.412504 0.0836789 0.252541 0.232761C0.172519 0.307172 0.109004 0.395701 0.0656599 0.493242C0.0223156 0.590782 0 0.695404 0 0.801071C0 0.906738 0.0223156 1.01136 0.0656599 1.1089C0.109004 1.20644 0.172519 1.29497 0.252541 1.36938L3.87249 4.76323C3.95185 4.83826 4.04628 4.8978 4.15032 4.93844C4.25436 4.97908 4.36595 5 4.47866 5C4.59136 5 4.70295 4.97908 4.80699 4.93844C4.91103 4.8978 5.00546 4.83826 5.08483 4.76323L8.74746 1.36938C8.82748 1.29497 8.89099 1.20644 8.93434 1.1089C8.97768 1.01136 9 0.906738 9 0.801071C9 0.695404 8.97768 0.590782 8.93434 0.493242C8.89099 0.395701 8.82748 0.307172 8.74746 0.232761Z"
              fill="#95B71D" />
          </svg>

        </span>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.shop__item {
  display: flex;
  flex-direction: column;
  background-color: rgba(217, 217, 217, 0.05);
  padding: 0;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  align-items: center;
}

.shop__item-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 12px 10px;
}

.shop__item .left {
  display: flex;
  gap: 14px;
  margin-left: 10px;
}

.shop__item .left .text {
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: bold;
  justify-content: center;
}

.shop__item .left .text span {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.5);
}

.shop__item .image {
  width: 40px;
  height: 40px;
  background-color: rgba(217, 217, 217, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
}

.shop__item .image svg {
  width: 60%;
  height: 60%;
}

.shop__item .right {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-right: 10px;
}

.shop__item .right .text {
  font-size: 14px;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  gap: -1px;
}

.shop__item .right .text .price span {
  color: #ffffff;
}

.shop__item .right .text span {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}

.shop__item .right a {
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;

  background-color: #95b71d;
  outline: none;
  border: none;
  border-radius: 3px;
  width: 85px;
  height: 35px;
  transition: ease-in-out 0.2s;
  cursor: pointer;
}

.shop__item .right a:hover {
  opacity: 0.7;
}

.shop__item .right a:disabled {
  background-color: #525252;
  cursor: auto;
}

.shop__item-info {
  width: 100%;
}

.shop__item-info p {
  font-family: "Nunito Sans", sans-serif;
  font-weight: 300;
  font-size: 15px;
  line-height: 120%;
  color: #b2b3c2;
  padding: 5px 10px 15px 10px;
}

.shop__item-info__toggle {
  height: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.24);
  position: relative;
}

.shop__item-info__toggle .icon svg {
  width: 9px;
  height: 5px;
}

.shop__item-info__toggle .icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 5px;
}

.shop__item-info__toggle .icon.rotate {
  transform: translate(-50%, -50%) scaleY(-1);
}
</style>
