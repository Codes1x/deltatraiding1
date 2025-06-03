<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSubscribesStore } from '~/stores/subscribes'
import type { IProduct } from '~/types/products'
const localePath = useLocalePath()
const subscribesStore = useSubscribesStore()

const props = defineProps<{
    product: IProduct,
    expiresAt: string,
    isConfigured: boolean,
    unConfiguredId: number
    isPaid: boolean
}>()
const currentBalance = computed(() => {
    return subscribesStore.getTSwithVPS.find(ts => ts.tradingSystem.id === props.unConfiguredId)?.tradingSystem.account_balance;
});
const currentProfit = computed(() => {
    return subscribesStore.getTSwithVPS.find(ts => ts.tradingSystem.id === props.unConfiguredId)?.tradingSystem.profit_all_percent;
});
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
                    {{ product.name }}

                </div>

                <div class="trade__item-name">
                    <span>
                        <svg width=" 8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M4 2.2V4L5.2 4.6M7 4C7 5.65685 5.65685 7 4 7C2.34315 7 1 5.65685 1 4C1 2.34315 2.34315 1 4 1C5.65685 1 7 2.34315 7 4Z"
                                stroke="#B2E500" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        {{ $t('to') }} {{ expiresAt ? expiresAt : '' }}
                    </span>
                </div>
                <div class="trade__item-money">
                    $ {{ currentBalance ? currentBalance.toFixed(2) : 0 }}
                </div>

                <div class="trade__item-profit">
                    {{ $t('Profit') }} {{ currentProfit ? currentProfit.toFixed(2) : 0 }}%
                </div>

                <div v-if="!isConfigured && isPaid" class="trade__item-key">
                    <NuxtLink :to="localePath(`/buy?id=${unConfiguredId}&step=2`)">
                        {{ $t('Configure') }}
                    </NuxtLink>
                </div>

                <div v-if="!isPaid" class="trade__item-key">
                    <NuxtLink :to="localePath(`/buy/invoice?id=${unConfiguredId}`)">
                        {{ $t('Buy') }}
                    </NuxtLink>
                </div>

                <!-- <div class="trade__item-key">
          2r4v4rbcn29r....w8rcyb
          <button class="copy">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M2.2 6.2C1.82725 6.2 1.64087 6.2 1.49385 6.1391C1.29783 6.05791 1.14209 5.90217 1.0609 5.70615C1 5.55913 1 5.37275 1 5V2.28C1 1.83196 1 1.60794 1.08719 1.43681C1.16389 1.28628 1.28628 1.16389 1.43681 1.08719C1.60794 1 1.83196 1 2.28 1H5C5.37275 1 5.55913 1 5.70615 1.0609C5.90217 1.14209 6.05791 1.29783 6.1391 1.49385C6.2 1.64087 6.2 1.82725 6.2 2.2M5.08 9H7.72C8.16804 9 8.39206 9 8.56319 8.91281C8.71372 8.83611 8.83611 8.71372 8.91281 8.56319C9 8.39206 9 8.16804 9 7.72V5.08C9 4.63196 9 4.40794 8.91281 4.23681C8.83611 4.08628 8.71372 3.96389 8.56319 3.88719C8.39206 3.8 8.16804 3.8 7.72 3.8H5.08C4.63196 3.8 4.40794 3.8 4.23681 3.88719C4.08628 3.96389 3.96389 4.08628 3.88719 4.23681C3.8 4.40794 3.8 4.63196 3.8 5.08V7.72C3.8 8.16804 3.8 8.39206 3.88719 8.56319C3.96389 8.71372 4.08628 8.83611 4.23681 8.91281C4.40794 9 4.63196 9 5.08 9Z"
                stroke="#B2E500" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div> -->
            </div>
        </div>

        <div class="trade__item-right">
            <TradeSettingsItemAction />
        </div>
    </div>



</template>

<style lang="css" scoped>
.trade__item {
    background-color: rgba(217, 217, 217, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: space-between;
    border-radius: 5px;
    min-height: 90px;
}

.trade__item-left {
    display: flex;
    gap: 13px;
    margin-top: 12px;
    margin-left: 10px;
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
    margin-bottom: 12px;
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
    font-size: 10px;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 10px;
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
    align-items: center;
    justify-content: end;
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