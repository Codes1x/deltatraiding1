<script setup lang="ts">
import { useRobotStore } from '@/stores/robot';
import { useSubscribesStore } from '~/stores/subscribes';
import { useTgWebAppStore } from '@/stores/tgWebApp'; // Added import for tgWebAppStore

const subscribesStore = useSubscribesStore();
const robotStore = useRobotStore();
const tgWebAppStore = useTgWebAppStore(); // Initialize tgWebAppStore

const route = useRoute()

// Получаем параметр id из route.params
const productId = parseInt(route.query.id as string, 10) || 0;
console.log('Robot page - productId from query:', route.query.id, 'parsed as:', productId);
const VPSData = computed(() => robotStore.getRobotVPSInfo)
const _StatsData = computed(() => robotStore.getRobotStats)

const currentOrders = computed(() => robotStore.getWSOrders)

const isHistoryOrders = ref(false)


const isDataLoaded = ref(false)
const subscribeProduct = ref()

const toggleHistoryOrders = () => {
    isHistoryOrders.value = !isHistoryOrders.value
}

const fetchSubscribe = async () => {
    if (productId) {
        console.log('Fetching subscribe for productId:', productId);
        try {
            const payload = { id: productId }
            const response = await subscribesStore.fetchSubscribeByID(payload)
            
            if (response) {
                subscribeProduct.value = response
                console.log('Subscribe product data received:', subscribeProduct.value);
            } else {
                console.error('No data received for product ID:', productId);
                // Можно добавить сообщение пользователю о том, что данные не найдены
            }
        } catch (error) {
            console.error('Error fetching subscribe data:', error);
            // Можно добавить обработку ошибок для пользователя
        }
    } else {
        console.error('ProductID is missing or invalid:', productId);
    }
}

const fetchData = async () => {
    isDataLoaded.value = false;
    let successfulSetup = true; // Флаг для отслеживания успеха операций

    // получаем продукт
    await fetchSubscribe()
        .catch(error => {
            console.error('[robot.vue] Ошибка при вызове fetchSubscribe:', error);
            successfulSetup = false; // Отмечаем, что произошла ошибка
        });

    // Продолжаем, только если fetchSubscribe был успешен и данные подписки есть
    if (successfulSetup && subscribeProduct.value) {
        const apiKey = tgWebAppStore.accessToken || '';
        const telegramUser = tgWebAppStore.user;
        let accountNumber = 0;

        if (telegramUser && typeof telegramUser.id === 'number') {
            accountNumber = telegramUser.id;
            console.log(`[robot.vue] Используем Telegram User ID как account_num: ${accountNumber}`);
        } else {
            console.error('[robot.vue] Ошибка: Telegram User ID не найден или некорректен. tgWebAppStore.user:', telegramUser);
            successfulSetup = false;
        }

        if (!apiKey) {
            console.error('[robot.vue] Ошибка: API ключ (Telegram JWT token) отсутствует.');
            successfulSetup = false;
        } else if (accountNumber === 0 && successfulSetup) { // Проверяем accountNumber только если предыдущие шаги успешны
             console.error('[robot.vue] Ошибка: account_num не может быть установлен (Telegram User ID отсутствует или некорректен).');
             successfulSetup = false;
        }

        // Продолжаем, только если все предыдущие шаги были успешны
        if (successfulSetup) {
            const payload = {
                product_id: productId,
                account_num: accountNumber,
                api_key: apiKey
            };
            console.log('[robot.vue] Вызов fetchRobotInfo с payload:', payload);
            
            await robotStore.fetchRobotInfo(payload)
                .then(() => {
                    // Успешно получили информацию о роботе, теперь подключаемся
                    console.log('[robot.vue] fetchRobotInfo успешно выполнен. Подключение к WebSocket...');
                    try {
                        robotStore.connect(); // connect может быть синхронным и выбросить ошибку
                    } catch (connectError) {
                        console.error('[robot.vue] Ошибка при вызове robotStore.connect():', connectError);
                        successfulSetup = false;
                    }
                })
                .catch(error => {
                    console.error('[robot.vue] Ошибка при вызове fetchRobotInfo:', error);
                    successfulSetup = false;
                });
        }
    } else if (successfulSetup) { // successfulSetup все еще true, но subscribeProduct.value отсутствует
        console.warn('[robot.vue] subscribeProduct.value отсутствует после fetchSubscribe (без ошибок). Пропуск логики робота.');
    }
    // Если successfulSetup стал false на каком-то этапе, здесь можно добавить доп. логику,
    // например, показать сообщение пользователю, что инициализация не удалась.

    isDataLoaded.value = true; // Устанавливаем в любом случае, чтобы убрать лоадер
}
onMounted(fetchData)
onUnmounted(() => {
    robotStore.disconnect()
})
</script>

<template>
    <section class="trade-robot">
        <TradeSettingsHeader />
        <div v-if="isDataLoaded">

            <div v-if="subscribeProduct && subscribeProduct.product" class="trade-robot__item">
                <TradeSettingsItem 
                    :product="subscribeProduct.product" 
                    :expires-at="subscribeProduct.expires_at || ''"
                    :is-configured="!!subscribeProduct.is_configured" 
                    :un-configured-id="subscribeProduct.id || 0"
                    :is-paid="!!subscribeProduct.paid_for" 
                />
            </div>

            <div v-if="VPSData">
                <TradeSettingsVps :vps-data="VPSData" />
                <TradeSettingsInfo :host-info="VPSData" />
                <TradeSettingsExpertSettings />
            </div>

            <TradeSettingsAutotrading />

            <TradeSettingsProfitGraph />

            <TradeSettingsStats />

            <TradeSettingsMainGraph />

            <div class="trade-graph__header">
                <button class="tab-header" :class="{ 'active': !isHistoryOrders }" @click="toggleHistoryOrders">
                    {{ $t('Orders') }}
                </button>
                <button class="tab-header" :class="{ 'active': isHistoryOrders }" @click="toggleHistoryOrders">
                    {{ $t('History') }}
                </button>
            </div>

            <div v-if="!isHistoryOrders">
                <div v-if="currentOrders.length > 0" class="trade-robot__list">
                    <TradeSettingsOrderItem v-for="order in currentOrders" :key="order.order_id" :order />
                </div>
            </div>

            <div v-else>
                <TradeSettingsOrdersHistory />
            </div>

        </div>
        <div v-else class="trade-robot__item">
            <CommonLoader />
        </div>

    </section>
</template>

<style lang="css" scoped>
.trade-robot {
    padding: 0 13px;
}

.trade-robot__item {
    margin: 30px auto;
}

.trade-robot__list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.trade-graph__header {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 10px;
}

.tab-header {
    background: none;
    padding: 0.5rem 1rem;
    color: rgba(255, 255, 255, 0.7);
    border: none;
    box-shadow: none;
}

.tab-header.active {
    color: #95B71D;
}
</style>