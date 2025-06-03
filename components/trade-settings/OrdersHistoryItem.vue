<script setup lang="ts">
import { ORDER_TYPES_READEBLE } from '@/utils/constants';
import type { IOrderHistoryItem } from '~/types/robot';
const { locale } = useI18n()

const props = defineProps<{
    order: IOrderHistoryItem
}>()

const orderType = computed(() => {
    return ORDER_TYPES_READEBLE[props.order.deal_type] || 'Unknown';
});
</script>

<template>
    <div class="transaction__history-item" :class="{ danger: order.profit.toString().includes('-') }">
        <div class="left">
            <div class="image">
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.5"
                        d="M6.6 10L9 7.75M9 7.75L11.4 10M9 7.75V13M17 4.75H1M3.8 11.5H3.56C2.66392 11.5 2.21587 11.5 1.87362 11.3365C1.57256 11.1927 1.32779 10.9632 1.17439 10.681C1 10.3601 1 9.94008 1 9.1V3.4C1 2.55992 1 2.13988 1.17439 1.81901C1.32779 1.53677 1.57256 1.3073 1.87362 1.16349C2.21587 1 2.66392 1 3.56 1H14.44C15.3361 1 15.7841 1 16.1264 1.16349C16.4274 1.3073 16.6722 1.53677 16.8256 1.81902C17 2.13988 17 2.55992 17 3.4V9.1C17 9.94008 17 10.3601 16.8256 10.681C16.6722 10.9632 16.4274 11.1927 16.1264 11.3365C15.7841 11.5 15.3361 11.5 14.44 11.5H14.2"
                        stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
            <div class="text">
                {{ orderType }}
                <span>{{ order.symbol }}</span>
            </div>
        </div>

        <div class="right">
            <span class="amount">{{ order.profit.toFixed(2) }}</span>

            <span class="date">{{ formatDate(order.time.toString(), locale) }}</span>
        </div>
    </div>
</template>

<style lang="css" scoped>
.transaction__history-item {
    display: flex;
    justify-content: space-between;
    background-color: rgba(217, 217, 217, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 5px;
    padding: 8px 10px;
}

.transaction__history-item .left {
    display: flex;
    gap: 14px;
}

.transaction__history-item.danger .right span.amount {
    color: #BE5D5D;
}

.transaction__history-item .right span.amount {
    color: #65BE5D;
}

.transaction__history-item .right {
    display: flex;
    flex-direction: column;
    font-size: 16px;
    font-weight: bold;

    align-items: end;
}

.transaction__history-item .right span.date {
    color: rgba(255, 255, 255, 0.5);
    font-size: 13px;
}

.transaction__history-item .image {
    width: 34px;
    height: 34px;
    min-width: 34px;
    background-color: rgba(217, 217, 217, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    border: 1px solid rgba(255, 255, 255, 0.05)
}

.transaction__history-item .text {
    display: flex;
    flex-direction: column;
    font-size: 15px;
    font-weight: bold;
}

.transaction__history-item .text span {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
}
</style>