<script setup lang="ts">
import { useToast } from "vue-toastification";
import { useRobotStore } from '@/stores/robot'
import { useSubscribesStore } from '~/stores/subscribes'

const subscribesStore = useSubscribesStore()

const localePath = useLocalePath()
const robotStore = useRobotStore()
const toast = useToast();
const { t } = useI18n();

const props = defineProps<{
    robotId?: number
}>()
const isAutoTrade = computed(() => {
    return subscribesStore.getTSwithVPS.find(ts => ts.tradingSystem.id === props.robotId)?.tradingSystem.auto_trade;
});
const isLoading = ref(false)

const handleTradeToggle = async (play: boolean, stop: boolean) => {
    if (props.robotId) {
        await updateRobotSettingsOnce(play, stop, props.robotId);
    }
}

const updateRobotSettingsOnce = async (play: boolean, stop: boolean, product_id: number) => {
    try {

        isLoading.value = true;

        const payload = { stop, play, product_id }
        await robotStore.setRobotSettingOnce(payload)

        if (play) {
            toast.success(t("The trading system has been launched"))
        }
        if (stop) {
            toast.success(t("Pause is on"))
        }
        updateSubscribeAutoTradeStatus(play, stop)

    } catch (error) {
        console.error('updateRobotSettings error:', error)
        toast.error(t("Failed to update settings")); // Уведомление об ошибке
    } finally {
        isLoading.value = false; // Скрываем индикатор загрузки
    }
}

const updateSubscribeAutoTradeStatus = (play: boolean, stop: boolean) => {
    if (props.robotId) {
        const payload = { robotId: props.robotId, auto_trade: play ? true : false }
        subscribesStore.updateAutoTradeStatusByID(payload)
    }
}
</script>
<template>
    <div class="trade__item-buttons-block">

        <div class="trade__item-buttons">
            <button v-if="!isLoading" class="item-button play" :class="{ 'active': isAutoTrade }"
                @click="handleTradeToggle(true, false)">
                <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M1 2.65592C1 1.89749 1 1.51827 1.15814 1.30922C1.2959 1.12711 1.50647 1.01442 1.73441 1.00081C1.99606 0.985188 2.31159 1.19554 2.94265 1.61625L11.1549 7.09107C11.6763 7.43869 11.937 7.6125 12.0279 7.83158C12.1073 8.02311 12.1073 8.23837 12.0279 8.42991C11.937 8.64898 11.6763 8.8228 11.1549 9.17042L2.94265 14.6452C2.31159 15.0659 1.99606 15.2763 1.73441 15.2607C1.50647 15.2471 1.2959 15.1344 1.15814 14.9523C1 14.7432 1 14.364 1 13.6056V2.65592Z"
                        stroke="#878787" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </button>
            <button v-if="!isLoading" class="item-button pause" :class="{ 'active': !isAutoTrade }"
                @click="handleTradeToggle(false, true)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M6.25 10.1V5.9M9.75 10.1V5.9M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z"
                        stroke="#878787" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </button>
            <CommonLoader v-else :small="true" class="loader" />
        </div>


        <NuxtLink :to="localePath(`/trade/robot?id=${robotId}`)" class="item-button">

            <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.5 6H13.5M1 1H16M6 11H11" stroke="#95B71D" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </NuxtLink>
    </div>
</template>

<style lang="css">
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
    padding: 8px;

    cursor: pointer;
}

.trade__item-buttons-block .item-button svg {
    width: 40px;
    height: 40px;
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

.trade__item-buttons {
    display: flex;
    align-items: center;
    min-width: 104px;
}

.trade__item-buttons>.loader {
    padding: 0.5rem 1rem;
}
</style>