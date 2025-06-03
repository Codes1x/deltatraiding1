<script setup lang="ts">
import type { IRobotServer } from '@/types/robot'
const props = defineProps<{
    hostInfo: IRobotServer;
}>()

const isShowHostInfo = ref(false)
const showHostInfo = () => {
    isShowHostInfo.value = !isShowHostInfo.value
}

</script>

<template>
    <div class="trade-settings-info">
        <p>{{ $t('VPS desc') }}</p>
        <div class="trade-host-info">
            <button class="profile__code-btn mx-auto my-0" @click="showHostInfo">
                <span>VPS</span>
            </button>
            <Transition>
                <div v-show="isShowHostInfo" class="trade-host-info__inputs">
                    <TradeSettingsShowHideInput :label-text="'HOST'" :input-text="hostInfo.hostname" />
                    <TradeSettingsShowHideInput :label-text="'Username'" :input-text="hostInfo.username" />
                    <TradeSettingsShowHideInput :label-text="'Password'" :input-text="hostInfo.password" />
                    <template v-if="hostInfo.web_rdp_url">
                        <a :href="hostInfo.web_rdp_url" target="_blank" class="btn-green">{{ $t('Connect') }}</a>
                    </template>
                    <template v-else>
                        <button class="btn-green" disabled>{{ $t('Connect') }}</button>
                    </template>
                </div>
            </Transition>

        </div>


    </div>
</template>

<style lang="css" scoped>
.trade-settings-info p {
    font-family: "Nunito Sans", sans-serif;
    font-weight: 300;
    font-size: 15px;
    line-height: 120%;
    color: #b2b3c2;
    padding: 5px 10px 15px 10px;
}

.trade-host-info__inputs {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
</style>