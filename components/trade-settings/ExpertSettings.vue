<script setup lang="ts">
import { useRobotStore } from '@/stores/robot'
import type { IOption } from '~/types/common'
import type { IEnumItem } from '~/types/robot'
const robotStore = useRobotStore()

const isShowSettings = ref(false)
const showExpertSettings = () => {
    isShowSettings.value = !isShowSettings.value
}

const selectedItem = ref<IOption>()
const dropdownItems = ref<IOption[]>([])
const title = ref('Risk, %')

const onUpdateSelectedItem = (item: IOption) => {
    selectedItem.value = item
    //console.log('onUpdateSelectedItem', selectedItem.value, item)
}

const isLoading = ref(false)
const saveLotRiskSettings = async () => {
    if (selectedItem.value) {
        if (selectedItem.value.value) {
            try {
                isLoading.value = true
                const payload = {
                    lotRisk: selectedItem.value.value
                }
                const response = await robotStore.setRobotExpertSetting(payload)
                await saveAndCheck()

            } catch (error) {
                console.error('saveLotRiskSettings ', error)
            } finally {
                isLoading.value = false
            }
        }
    }
}

const saveAndCheck = async () => {
    for (let i = 0; i < 3; i++) { // 3 попытки обновить настройки с паузой
        await new Promise(resolve => setTimeout(resolve, 15000))
        const response = await robotStore.fetchRobotExpertSettings()

        if (response?.value === selectedItem.value?.value) {
            return
        }
    }
    console.warn("Настройки не обновились после 3 попыток")
}
const isDataLoaded = ref(false)
const fetchData = async () => {
    try {
        isDataLoaded.value = false
        const response = await robotStore.fetchRobotExpertSettings()
        // console.log('response ', response, response?.enum)
        if (!Array.isArray(response?.enum) || !response?.enum.every(item => Array.isArray(item) && item.length === 2)) {
            console.warn("Некорректный формат response.enum", response);
            return;
        }

        dropdownItems.value = response.enum.map(item => ({
            label: String(item[1]), // Приводим к строке для надежности
            value: Number(item[0])  // Приводим к числу для надежности
        }))

        selectedItem.value = { label: response.value.toString(), value: response.value }
        // console.log('fetchData ', response, dropdownItems.value)
    } catch (error) {
        console.error('fetchData fetchRobotExpertSettings ', error)
    } finally {
        isDataLoaded.value = true
    }
}
onMounted(fetchData)
</script>

<template>
    <div class="trade-settings-risk">

        <div v-if="isDataLoaded" class="trade-risk-info">
            <button class="profile__code-btn mx-auto my-0" @click="showExpertSettings">
                <span>{{ $t('Trading settings') }}</span>
            </button>
            <Transition>
                <div v-show="isShowSettings">
                    <div class="trade-risk-info__inputs">
                        <span>{{ title }}</span>
                        <CommonDropdown v-model="selectedItem" :items="dropdownItems"
                            @update:model-value="onUpdateSelectedItem" />
                    </div>
                    <button class="btn-green" :disabled="isLoading" @click="saveLotRiskSettings">
                        {{ isLoading ? $t('Saving') : $t('Save') }}
                        <CommonSpinner v-show="isLoading" class="btn-green__spinner" />
                    </button>
                </div>
            </Transition>

        </div>
        <div v-else>
            <CommonLoader :small="true" />
        </div>
    </div>
</template>

<style lang="css" scoped>
.trade-settings-risk {
    padding-bottom: 20px;
}

.trade-risk-info__inputs {
    display: flex;
    align-items: center;
    gap: 12px;
}

.trade-risk-info__inputs span {
    font-size: 21px;
    padding-top: 4px;
}

.btn-green__spinner {
    margin-left: 5px;
}
</style>