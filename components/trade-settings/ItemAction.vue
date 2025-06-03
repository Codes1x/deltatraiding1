<script setup lang="ts">
import { useToast } from "vue-toastification";
import { useRobotStore } from '@/stores/robot';

const robotStore = useRobotStore()
const toast = useToast();
const { t } = useI18n();

const isAutoTrade = computed(() => robotStore.getWSRobotInfo.data?.robot_settings?.auto_trade ?? false)
const isStopTrade = computed(() => robotStore.getWSRobotInfo.data?.robot_settings?.stop_trade ?? false)
const allOrdersCount = computed(() => robotStore.getWSRobotInfo.data?.orders?.length ?? 0)

const isLoading = ref(false)

const handleTradeToggle = async (play: boolean, stop: boolean) => {
    isLoading.value = true;
    await updateRobotSettings(play, stop);
}

const updateRobotSettings = async (play: boolean, stop: boolean) => {
    try {
        const payload = { stop, play }
        await robotStore.setRobotSetting(payload)

        if (play) {
            toast.success(t("The trading system has been launched"))
        }
        if (stop) {
            toast.success(t("Pause is on"))
        }

    } catch (error) {
        console.error('updateRobotSettings error:', error)
        isLoading.value = false;
    }
}

watch([isStopTrade, isAutoTrade], ([newStop, newPlay]) => {
    isLoading.value = false
});
</script>

<template>
    <div class="trade-trading">
        <div v-if="!isLoading" class="trade__item-buttons-block">
            <button class="item-button play" :class="{ active: isAutoTrade === 1 }"
                @click="handleTradeToggle(true, false)">
                <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M1 2.65592C1 1.89749 1 1.51827 1.15814 1.30922C1.2959 1.12711 1.50647 1.01442 1.73441 1.00081C1.99606 0.985188 2.31159 1.19554 2.94265 1.61625L11.1549 7.09107C11.6763 7.43869 11.937 7.6125 12.0279 7.83158C12.1073 8.02311 12.1073 8.23837 12.0279 8.42991C11.937 8.64898 11.6763 8.8228 11.1549 9.17042L2.94265 14.6452C2.31159 15.0659 1.99606 15.2763 1.73441 15.2607C1.50647 15.2471 1.2959 15.1344 1.15814 14.9523C1 14.7432 1 14.364 1 13.6056V2.65592Z"
                        stroke="#878787" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </button>
            <button class="item-button pause" :class="{ active: isStopTrade === 1 }"
                @click="handleTradeToggle(false, true)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z"
                        stroke="#878787" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path
                        d="M5.2 6.32C5.2 5.92796 5.2 5.73194 5.2763 5.58221C5.34341 5.45049 5.45049 5.34341 5.58221 5.2763C5.73194 5.2 5.92796 5.2 6.32 5.2H9.68C10.072 5.2 10.2681 5.2 10.4178 5.2763C10.5495 5.34341 10.6566 5.45049 10.7237 5.58221C10.8 5.73194 10.8 5.92796 10.8 6.32V9.68C10.8 10.072 10.8 10.2681 10.7237 10.4178C10.6566 10.5495 10.5495 10.6566 10.4178 10.7237C10.2681 10.8 10.072 10.8 9.68 10.8H6.32C5.92796 10.8 5.73194 10.8 5.58221 10.7237C5.45049 10.6566 5.34341 10.5495 5.2763 10.4178C5.2 10.2681 5.2 10.072 5.2 9.68V6.32Z"
                        stroke="#878787" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </button>
        </div>
        <div v-else class="trade-loader">
            <CommonLoader :small="true" />
        </div>
    </div>
</template>

<style lang="css" scoped>
.trade-loader {
    padding-left: 1rem;
}

.trade__item-buttons-block {
    /* background-color: rgba(217, 217, 217, 0.05); */
    display: flex;
    /* border-radius: 4px; */
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

.trade__item-buttons-block .item-button svg {
    width: 32px;
    height: 32px;
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