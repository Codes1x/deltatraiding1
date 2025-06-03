<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { IProduct } from '~/types/products'
const localePath = useLocalePath()

defineProps<{
  product: IProduct,
  expiresAt: string
}>()

</script>

<template>
  <div class="trade__item">
    <div class="trade__item-left">
      <div class="trade__item-image">
        <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M18.5 18V11M10.5 18V8M2.5 18L2.5 14M11.9067 3.0275L17.0751 4.96567M9.29877 3.40092L3.70023 7.59983M19.5607 4.43934C20.1464 5.02513 20.1464 5.97487 19.5607 6.56066C18.9749 7.14645 18.0251 7.14645 17.4393 6.56066C16.8536 5.97487 16.8536 5.02513 17.4393 4.43934C18.0251 3.85355 18.9749 3.85355 19.5607 4.43934ZM3.56066 7.43934C4.14645 8.02513 4.14645 8.97487 3.56066 9.56066C2.97487 10.1464 2.02513 10.1464 1.43934 9.56066C0.853553 8.97487 0.853553 8.02513 1.43934 7.43934C2.02513 6.85355 2.97487 6.85355 3.56066 7.43934ZM11.5607 1.43934C12.1464 2.02513 12.1464 2.97487 11.5607 3.56066C10.9749 4.14645 10.0251 4.14645 9.43934 3.56066C8.85355 2.97487 8.85355 2.02513 9.43934 1.43934C10.0251 0.853553 10.9749 0.853553 11.5607 1.43934Z"
            stroke="white" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>

      <div class="trade__item-text">
        <div class="trade__item-name">
          {{ product.name }} {{ product.name_related_trading_system ? product.name_related_trading_system : '' }}
        </div>

        <div class="trade__item-profit">

          <span>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 2.2V4L5.2 4.6M7 4C7 5.65685 5.65685 7 4 7C2.34315 7 1 5.65685 1 4C1 2.34315 2.34315 1 4 1C5.65685 1 7 2.34315 7 4Z"
                stroke="#B2E500" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            {{ $t('to') }} {{ expiresAt ? expiresAt : '' }}
          </span>

        </div>
      </div>
    </div>

    <div class="trade__item-right">

      <div class="trade__item-money">
        $ {{ product.price ? parseInt(product.price).toFixed(2) : 0 }}
      </div>

    </div>
  </div>



</template>

<style lang="css" scoped>
.trade__item {
  /* background-color: rgba(217, 217, 217, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05); */
  display: flex;
  justify-content: space-between;
  border-radius: 5px;
  padding: 12px 10px;
}

.trade__item-left {
  display: flex;
  gap: 13px;
  align-items: center;
  /* margin-top: 12px;
  margin-left: 10px; */
}

.trade__item-image {
  width: 34px;
  height: 34px;
  background-color: rgba(217, 217, 217, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
}

.trade__item-name {
  font-size: 12px;
  font-weight: bold;
  /* margin-bottom: 12px; */
  display: flex;
  gap: 10px;
  align-items: center;
}

.trade__item-name span {
  display: flex;
  align-items: center;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  gap: 4px;
}

.trade__item-money {
  font-size: 14px;
  font-weight: 400;
}

.trade__item-money span {
  font-size: 10px;
}

.trade__item-profit {

  /* margin-bottom: 10px; */
}

.trade__item-profit span {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.trade__item-key {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 10px;
}

.trade__item-key .copy {
  outline: none;
  border: none;
  background-color: transparent;
  cursor: pointer;
}

.trade__item-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: end;
}

.trade__item-menu-btn {
  outline: none;
  border: none;
  background-color: transparent;
  margin-top: 19px;
  margin-right: 14px;
  cursor: pointer;
}

.trade__item-buttons-block {
  background-color: rgba(217, 217, 217, 0.05);
  display: flex;
  border-radius: 4px;
  overflow: hidden;
}

.trade__item-buttons-block .item-button {
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  outline: none;
  padding: 10px;

  cursor: pointer;
}

.trade__item-buttons-block .item-button.active.play {
  svg path {
    stroke: #B2E500;
  }
}

.trade__item-buttons-block .item-button.active.pause {
  svg path {
    stroke: #F89900;
  }
}

.trade__item-buttons-block .item-button.active.stop {
  svg path {
    stroke: #BE5D5D;
  }
}
</style>