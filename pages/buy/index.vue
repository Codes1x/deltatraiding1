<script setup lang="ts">
import { useWebAppViewport } from 'vue-tg'
import useClipboard from 'vue-clipboard3'
import { useProductsStore } from '@/stores/products';
import { useBrokersStore } from '@/stores/brokers';
import type { IProduct } from '~/types/products';
import type { IBroker, IBrokerSimple } from '~/types/brokers';
import type { ISubscribesResponseArray } from '~/types/subscribes';
import { useRouter } from 'vue-router'

const appViewport = useWebAppViewport()

const _localePath = useLocalePath()
const tgWebAppStore = useTgWebAppStore()
const productStore = useProductsStore()
const subscribesStore = useSubscribesStore()
const brokersStore = useBrokersStore()
const { toClipboard } = useClipboard()
// get current step

const router = useRouter()

const route = useRoute()
// Получаем параметр id из route.params
const productId = parseInt(route.query.id as string, 10) || 0;

// Получаем query-параметр step из route.query
const stepParam = ref(route.query.step ? Number(route.query.step) : 1);

const selectedProduct = ref<IProduct>()
const unconfiguredProduct = ref<ISubscribesResponseArray>()
const isDataLoaded = ref(false)
const step = ref(1)
const responsePurchaseId = ref()
// userBalance
const userBalance = computed(() => {
    return tgWebAppStore.getUserBalance
})

const brokerList = ref<IBroker[]>([])
const brokerAccont = ref('')
const brokerPassword = ref('')
const _currentBrokerId = ref(0)

const isUncofiguredProduct = ref(false)

const isLoading = ref(false)
const isBuyLoading = ref(false)

const getProduct = async () => {
    // если step передан, то направляем на настройку

    if (productId) {

        if (stepParam.value && stepParam.value === 2) {
            isUncofiguredProduct.value = true
            const unconfiguredProductResponse = await subscribesStore.fetchUnconfiguredSubscribeByID(productId) as ISubscribesResponseArray
            // console.log('unconfiguredProductResponse ', productId, unconfiguredProductResponse)
            unconfiguredProduct.value = unconfiguredProductResponse
            if (unconfiguredProduct.value) {
                // console.log("unconfiguredProduct.value ", unconfiguredProduct.value)
                fetchBrokersList(unconfiguredProduct.value?.product.slug)
                step.value = 2
            }
        }

        if (stepParam.value && stepParam.value === 1) {
            isUncofiguredProduct.value = false
            const result = productStore.productByID(parseInt(productId.toString()))
            // console.log('result ', result)
            if (result) {
                selectedProduct.value = result[0]
                fetchBrokersList(selectedProduct.value.slug)
            }
        }

        // console.log('stepParam.value selectedProduct.value', selectedProduct.value, stepParam.value, productId) // NaN

    }
}

const fetchBrokersList = async (slug: string) => {
    try {
        if (slug) {
            // сперва получаем id broker по slug
            const payload = { product_slug: slug };
            const responseBrokerPrepare = await brokersStore.fetchBrokers(payload) as IBrokerSimple[];
            // console.log('responseBrokerPrepare ', responseBrokerPrepare);

            if (responseBrokerPrepare.length > 0) {
                brokerList.value = [];

                // Используем for...of, чтобы можно было использовать await внутри
                for (const broker of responseBrokerPrepare) {
                    const payloadBroker = {
                        product_slug: slug,
                        broker: broker.id,  // Правильное обращение к id
                        cent: false
                    };

                    const responseBrokerByID = await brokersStore.fetchBrokersByID(payloadBroker) as IBroker[];

                    // Добавляем broker_id в каждый объект
                    for (const brokerData of responseBrokerByID) {
                        brokerData.broker_id = broker.id;
                    }

                    brokerList.value.push(...responseBrokerByID); // Добавляем данные в массив
                }

                //console.log('responseBrokerByID ', brokerList.value);
            }
        }
    } catch (error) {
        console.error('fetchBrokersList ', error);
    }
}

const saveRobotSettings = () => {
    // console.log('saveRobotSettings', {
    //     isUnconfiguredProduct: isUncofiguredProduct.value,
    //         unconfiguredProduct: unconfiguredProduct.value,
    //             selectedProduct: selectedProduct.value
    // });

    if (isUncofiguredProduct.value && unconfiguredProduct.value) {
        // console.log('!isUncofiguredProduct.value', isUncofiguredProduct.value);

        if (productId && unconfiguredProduct.value?.product.slug) {
            setRobotSetting(productId, unconfiguredProduct.value.product.slug);
        } else {
            console.warn('Ошибка: unconfiguredProduct не содержит productId или slug', productId, unconfiguredProduct.value);
        }
    } else if (!isUncofiguredProduct.value && selectedProduct.value) {
        // console.log('isUncofiguredProduct.value', isUncofiguredProduct.value);

        if (responsePurchaseId.value?.purchase_id && selectedProduct.value?.slug) {
            setRobotSetting(responsePurchaseId.value?.purchase_id, responsePurchaseId.value.product.slug);
        } else {
            console.warn('Ошибка: selectedProduct не содержит id или slug', responsePurchaseId.value);
        }
    } else {
        console.warn('Ни одно из условий не выполнено', {
            isUncofiguredProduct: isUncofiguredProduct.value,
            unconfiguredProduct: unconfiguredProduct.value,
            selectedProduct: selectedProduct.value
        });
    }
};

const setRobotSetting = async (purchaseId: number, productSlug: string) => {
    // console.log('set robot', purchaseId, productSlug)
    resetErrorsConnection()
    const isValid = validateConnection()

    if (isValid) {
        isLoading.value = true
        try {
            const payload = {
                account_num: parseInt(brokerAccont.value),
                account_password: brokerPassword.value,
                broker_id: Number(brokerList.value[0].broker_id),
                broker_server_name: brokerList.value[0].name,
                product_slug: productSlug,
                purchase_id: purchaseId
            }

            const responseSetRobotSetting = await productStore.robotSetting(payload)

            console.log('responseSetRobotSetting ', responseSetRobotSetting)

            // Check if the response has a message property
            if (responseSetRobotSetting && typeof responseSetRobotSetting === 'object' && 'message' in responseSetRobotSetting) {
                const message = responseSetRobotSetting.message as string;
                // Сохраняем сообщение, но не устанавливаем флаг завершения, чтобы таймер отображался
                finishRobotSettingMessage.value = message.includes('настроена') 
                    ? "Your trading system is already set up" 
                    : "Set up your trading system";
            } else {
                finishRobotSettingMessage.value = "Error during setup, please contact support";
            }

        } catch (error) {
            console.warn('setRobotSetting ', error)
            finishRobotSettingMessage.value = "Error during setup, please contact support";
        } finally {
            isLoading.value = false
        }

        handleSetStep3()
    }
}

const selectedOptionBalance = ref(true);
const selectedOptionInvoice = ref();

const error = ref({
    isAgree: '',
    balance: ''
})

const handleSetStep2 = async () => {

    resetErrorsBuy()

    if (!isAgree.value) {
        error.value.isAgree = 'You have not confirmed your risk acceptance';
        return;
    }

    if (!userBalance.value || !selectedProduct.value?.price) {
        console.warn("Нет данных о балансе или цене продукта");
        return;
    }

    const balance = Math.floor(Number(userBalance.value.main) * 100); // Переводим в копейки
    const price = Math.floor(Number(selectedProduct.value?.price) * 100); // Переводим в копейки

    if (balance < price) {
        console.warn("Недостаточно средств на балансе", balance / 100, price / 100);
        error.value.balance = 'Not enough funds on the balance sheet';
        return;
    }


    if (selectedOptionBalance.value) {
        isBuyLoading.value = true
        try {
            const payload = {
                product_id: selectedProduct.value.id,
                pay_from_balance: true
            }
            const response = await productStore.buyProduct(payload)
            responsePurchaseId.value = response
            // console.log('response buy by balance ', response, responsePurchaseId.value, responsePurchaseId.value.purchase_id)
            step.value = 2
        } catch (error) {
            console.error('hancleSetStep2 ', error)
        } finally {
            isBuyLoading.value = false
        }
    }

    if (selectedOptionInvoice.value) {

        step.value = 4
    }
}

const handleSetStep3 = () => {
    // Всегда сбрасываем флаг, чтобы показывать таймер при переходе на шаг 3
    isFinishRobotSetting.value = false;
    
    if (isUncofiguredProduct.value && unconfiguredProduct.value) {
        startCheckingStatus(productId)
    }
    if (!isUncofiguredProduct.value) {
        startCheckingStatus(responsePurchaseId.value.purchase_id)
    }

    step.value = 3
}


const callCount = ref(0); // Счетчик вызовов

const isFinishRobotSetting = ref(false)
const finishRobotSettingMessage = ref('')

const checkRobotStatus = async (checkProductID: number) => {
    console.log('checkRobotStatus checkProductID', checkProductID, selectedProduct.value)
    if (selectedProduct.value?.id) {
        try {
            const payload = {
                product_id: checkProductID
            }
            const _response = await productStore.fetchRobotStatus(payload)
            
            // Не останавливаем интервал здесь, пусть таймер отработает до конца
            // Интервал будет остановлен автоматически, когда счетчик достигнет 5 вызовов
        } catch (error) {
            console.error('checRobotStatus', error)
        }
    }

    // Увеличиваем счетчик вызовов
    callCount.value += 1;

    // Если счетчик достиг 5, останавливаем интервал
    if (callCount.value >= 5) {
        stopCheckingStatus();
    }
}
const intervalId = ref<ReturnType<typeof setInterval> | null>(null); // ID интервала
const timeOut = ref(60) // Таймер на 60 секунд
// Запуск интервала
const startCheckingStatus = (product_id: number) => {
    callCount.value = 0;  // Сброс счетчика
    stopCheckingStatus(); // Убеждаемся, что предыдущий интервал остановлен
    intervalId.value = setInterval(() => checkRobotStatus(product_id), 20000); // 60000 мс = 1 минута
    // console.log('intervalId.value ', intervalId.value)
};

// Остановка интервала
const stopCheckingStatus = () => {
    if (intervalId.value) {
        clearInterval(intervalId.value);
        intervalId.value = null;
    }
};

const isAgree = ref(false)
// buy product
const buyByBalance = () => {
    selectedOptionInvoice.value = false
    selectedOptionBalance.value = true
}

const invoiceData = ref()
const buyByInvoice = async () => {
    selectedOptionBalance.value = false
    isBuyLoading.value = true
    try {
        const payload = {
            product_id: parseInt(productId.toString()),
            pay_from_balance: false
        }

        const responseBuyProductByInvoice = await productStore.buyProduct(payload)
        invoiceData.value = responseBuyProductByInvoice
        console.log('responseBuyProductByInvoice ', responseBuyProductByInvoice)
    } catch {
        console.error('response buy product by invoice error ', isAgree)
    } finally {
        isBuyLoading.value = false
    }
}

const isCopiedAddress = ref(false)
const copyToClipboardAddress = async () => {
    if (!invoiceData.value.address) {
        return
    }
    try {
        await toClipboard(invoiceData.value.address)
        isCopiedAddress.value = true
        setTimeout(() => {
            isCopiedAddress.value = true
            setTimeout(() => {
                isCopiedAddress.value = false
            }, 2000)
        }, 0)

    } catch (error) {
        console.error('Не удалось скопировать текст:', error)
    }
}

const errorsConnection = ref({
    brokerAccont: '',
    brokerPassword: '',
    brokerList: '',
    selectedProduct: '',
    unconfiguredProduct: ''
})

const validateConnection = () => {
    // console.log('validateConnection ', brokerPassword.value.length < 1)
    let isValid = true;

    if (brokerAccont.value.length < 1) {
        errorsConnection.value.brokerAccont = 'You have not specified an account number'
        isValid = false;
    }

    if (brokerPassword.value.length < 1) {
        errorsConnection.value.brokerPassword = 'You have not specified a password'
        isValid = false;
    }

    if (brokerList.value && brokerList.value?.length < 1) {
        errorsConnection.value.brokerList = 'Broker is not specified, please contact support'
        isValid = false;
    }



    if (!productId && !unconfiguredProduct.value) {
        errorsConnection.value.unconfiguredProduct = 'Product not specified, contact support'
        // console.log("unconfiguredProduct not specified, contact support")
        isValid = false;
    }

    if (!isUncofiguredProduct.value && !selectedProduct.value?.id) {

        errorsConnection.value.selectedProduct = 'Product not specified, contact support'
        // console.log("Product not specified, contact support", selectedProduct.value)
        isValid = false;
    }

    return isValid
}

const resetErrorsConnection = () => {
    errorsConnection.value.brokerAccont = '';
    errorsConnection.value.brokerPassword = '';
    errorsConnection.value.brokerList = '';
    errorsConnection.value.selectedProduct = '';
}

const resetErrorsBuy = () => {
    error.value.isAgree = ''
    error.value.balance = ''
}

// ***** //
const defaultReferralLink = 'https://office.fixoneglobal.com/register?referral=720'
const referrerLink = ref<string>('')
const fetchReferrerLink = async () => {
    try {
        const fetchReferrerLinkResponse = await brokersStore.fetchReferrer()

        if (brokersStore.getReferrerLink === '') {
            referrerLink.value = defaultReferralLink
        } else {
            referrerLink.value = brokersStore.getReferrerLink
        }
        console.log('fetchReferrerLinkResponse', fetchReferrerLinkResponse)
        console.log('referrerLink.value ', referrerLink.value)
    } catch {
        console.error('fetchReferrerLink ', fetchReferrerLink)
    }
}

const fetchData = () => {
    isDataLoaded.value = true
    appViewport.onViewportChanged(adjustModalPadding);
    getProduct()
    fetchReferrerLink()
    isDataLoaded.value = false
}

// добавление для вирт.клавиатуры
const adjustModalPadding = () => {
    document.querySelectorAll('input').forEach((input) => {
        const parent = input.closest('.deposit__form-group') as HTMLElement;
        if (parent) {
            const viewportHeight = window.visualViewport?.height || 0;
            parent.style.paddingBottom = viewportHeight < appViewport.viewportHeight.value ? "360px" : "0px";
        }
    });
};

const redirectProductId = computed(() => {
    return isUncofiguredProduct.value ? productId : responsePurchaseId.value?.purchase_id;
});

// Функция для проверки валидности ID продукта
const isValidProductId = (id: number | string | null | undefined): boolean => {
    if (id === null || id === undefined) return false;
    const parsed = parseInt(String(id), 10);
    return !isNaN(parsed) && parsed > 0;
};

const finishCount = () => {
    console.log('finishCount redirectProductId:', redirectProductId.value);
    
    // После завершения таймера устанавливаем флаг, чтобы показать сообщение об успехе
    isFinishRobotSetting.value = true;
    
    // Используем таймаут, чтобы дать возможность увидеть экран успеха
    setTimeout(() => {
        // Дополнительная проверка валидности ID
        const validId = isValidProductId(redirectProductId.value);
        
        if (validId) {
            console.log('Redirecting to product page with ID:', redirectProductId.value);
            // Используем router.push с объектом маршрута для безопасной навигации
            router.push({
                path: '/trade/robot',
                query: { id: redirectProductId.value.toString() } // Явно конвертируем в строку
            });
        } else {
            // Если по какой-то причине ID нет или он невалидный, перейдем на общую страницу
            console.error('Ошибка: отсутствует корректный redirectProductId для перехода на страницу продукта:', redirectProductId.value);
            router.push('/trade');
        }
    }, 2000); // Задержка в 2 секунды для показа экрана успеха
}

onMounted(fetchData)

// Очистка интервала при уходе со страницы
onUnmounted(() => {
    stopCheckingStatus();
    document.querySelectorAll('input').forEach((input) => {
        const parent = input.closest('.deposit__form-group') as HTMLElement;
        if (parent) {
            parent.style.paddingBottom = "0px";
        }
    });
});
</script>

<template>
    <section class="steps">
        <div v-if="!isDataLoaded">

            <div v-if="step === 1" class="step buy">
                <h2>{{ $t('Payment') }}</h2>
                <ShopProduct :product="selectedProduct!" />

                <h3>{{ $t('Select a payment method') }}</h3>


                <div class="steps-payment">
                    <div class="steps-payment__option">
                        <label class="switch">
                            <input v-model="selectedOptionBalance" type="checkbox" @change="buyByBalance">
                            <span class="slider round" />
                        </label>
                        <p>{{ $t('Payment from internal balance') }}</p>
                    </div>

                    <div class="steps-payment__option">
                        <label class="switch">
                            <input v-model="selectedOptionInvoice" type="checkbox" @change="buyByInvoice">
                            <span class="slider round" />
                        </label>
                        <p>{{ $t('Payment by invoice') }}</p>
                    </div>
                </div>


                <div v-if="selectedOptionInvoice" class="buy-invoice">
                    <div class="deposit__form">
                        <button class="deposit__form-address" @click="copyToClipboardAddress">
                            <img src="/icons/user.svg" alt="user icon" class="icon" >
                            <span>{{ invoiceData.invoice.address ? invoiceData.invoice.address : 'address' }}</span>
                        </button>
                        <p v-show="isCopiedAddress" class="deposit__form-copied">{{ $t('copied') }}</p>
                    </div>

                    <div v-if="invoiceData.invoice.address" class="deposit__info">
                        <div class="deposit__info-qr">
                            <img :src="`data:image/png;base64,${invoiceData.invoice.qr_code}`" alt="QR Code"
                                class="qr-code" >
                        </div>

                        <div class="deposit__info-estimate">
                            {{ calculateRemainingHours(invoiceData.invoice.expiration_time) }} {{ $t('hours') }}
                        </div>
                    </div>
                </div>

                <div class="steps-checkbox">
                    <label class="switch">
                        <input v-model="isAgree" type="checkbox">
                        <span class="slider round" />
                    </label>
                    <p>
                        {{ $t('I accept risks') }}
                    </p>
                </div>

                <p v-if="error.isAgree.length > 0" class="error">
                    {{ $t(error.isAgree) }}
                </p>

                <p v-if="error.balance.length > 0" class="error">
                    {{ $t(error.balance) }}
                </p>

                <div class="step-action">
                    <button @click="handleSetStep2">
                        {{ $t('Confirm purchase') }}
                        <CommonSpinner v-show="isBuyLoading" />
                    </button>
                </div>
            </div>

            <div v-if="step === 2" class="step connection">
                <h2>{{ $t('Connection') }}</h2>

                <div class="connection-link">
                    {{ $t('If you don\'t have an account, register and create one with one of the recommended brokers')
                    }}
                    <a :href="referrerLink" target="_blank">{{ $t('Register with a broker') }}</a>
                </div>

                <div class="connection-form">
                    <div class="deposit__form-group_wrapper">
                        {{ $t('Account Number:') }}
                        <div class="deposit__form-group">
                            <img src="/icons/wallet.svg" alt="wallet icon" class="icon" >
                            <input v-model="brokerAccont" type="number" :placeholder="$t('broker Accont')"
                                :title="$t('broker Accont')" >
                        </div>
                        <p v-if="errorsConnection.brokerAccont.length > 0" class="error">
                            {{ $t(errorsConnection.brokerAccont) }}
                        </p>
                    </div>

                    <div class="deposit__form-group_wrapper">
                        {{ $t('Broker Account Password:') }}
                        <div class="deposit__form-group">
                            <img src="/icons/password.svg" alt="password icon" class="icon" >
                            <input v-model="brokerPassword" type="password" :placeholder="$t('Password')"
                                :title="$t('password Accont')" >
                        </div>
                        <p v-if="errorsConnection.brokerPassword.length > 0" class="error">
                            {{ $t(errorsConnection.brokerPassword) }}
                        </p>
                    </div>

                    <div class="deposit__form-group_wrapper">
                        {{ $t('Select Server:') }}
                        <div class="deposit__form-group">
                            <!-- <input type="text" placeholder="Address" v-model="brokerList" :value="brokerList.name"
                                title="broker Accont" /> -->
                            <span v-if="brokerList.length > 0">{{ brokerList[0].name }}</span>
                        </div>
                        <p class="form-info">{{ $t('If there is no broker or') }}</p>
                    </div>
                    <p v-if="errorsConnection.brokerList.length > 0" class="error">
                        {{ $t(errorsConnection.brokerList) }}
                    </p>

                </div>

                <div class="step-action">
                    <button @click="saveRobotSettings">
                        {{ $t('Save Settings') }}
                        <CommonSpinner v-show="isLoading" />
                    </button>
                </div>
            </div>

            <div v-if="step === 3" class="step setting">
                <h2>{{ $t('Settings') }}</h2>

                <div class="setting-content">
                    <div v-if="!isFinishRobotSetting" class="setting-loading">
                        <h3>{{ $t('Wait...') }}</h3>
                        <ShopCountdownTimer 
                            :duration="timeOut" 
                            :product-id="redirectProductId"
                            @finished="finishCount"
                        />
                        <p class="setting-description">{{ $t('Set up your trading system') }}</p>
                        <p class="setting-subdescription">{{ $t('This process may take a minute or more.') }}</p>
                    </div>
                    <div v-else class="setup-success">
                        <div class="success-icon">
                            <div class="checkmark">✓</div>
                        </div>
                        <h3>{{ $t('Congratulations! Activation of the Trading system was successful') }}</h3>
                        <button class="success-button" @click="() => {
                            if (isValidProductId(redirectProductId.value)) {
                                router.push({ path: '/trade/robot', query: { id: redirectProductId.value.toString() } });
                            } else {
                                router.push('/trade');
                            }
                        }">
                            {{ $t('My Trading Systems') }}
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="step === 4" class="step setting">
                <div class="setting-content">
                    <div class="setup-success">
                        <div class="success-icon">
                            <div class="checkmark">✓</div>
                        </div>
                        <h3>{{ $t('Your trading systems') }}</h3>
                        <button class="success-button" @click="() => {
                            if (isValidProductId(redirectProductId.value)) {
                                router.push({ path: '/trade/robot', query: { id: redirectProductId.value.toString() } });
                            } else {
                                router.push('/trade');
                            }
                        }">
                            {{ $t('My Trading Systems') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </section>
</template>

<style lang="css">
.step {
    margin: 1rem 13px;

    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.step-action button {
    width: 100%;
    display: flex;
    gap: 0.5rem;
}



.steps-payment__option {
    display: flex;
    gap: 1rem;
}

.steps-payment {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.steps-payment__option p {
    font-size: 15px;
    color: #fff;
    width: 70%;
}

.steps-checkbox {
    margin-top: 1rem;
    display: flex;
    gap: 1rem;
}

.steps-checkbox p {
    font-size: 15px;
    color: #fff;
    width: 70%;
}

.steps-action {
    margin: 1rem auto;
}

.step-action button {
    height: 50px;
    background-color: #95b71d;
    border: none;
    outline: none;
    cursor: pointer;
    transition: ease-in-out 0.2s;
    border-radius: 5px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
}

.connection-link {
    margin: 1rem;
}

.connection-link a {
    color: #95b71d;
    font-size: 16px;
}

.connection-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1rem 0;
}

.deposit__form-group {
    position: relative;
    max-width: 100%;

}

.deposit__form-group_wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.deposit__form-group_wrapper p.error {
    font-size: 14px;
    color: red;
}

.deposit__form-group input {
    padding: 15px 15px 15px 60px;
    font-size: 12px;
    max-width: 100%;
    box-sizing: border-box;
}

.deposit__form-group input::-ms-reveal {
    filter: invert(50%);
}

.deposit__form-group .icon {
    top: 50%;
    transform: translateY(-50%);
    left: 20px;
    position: absolute;
}

.setting {
    margin: 1rem 13px;
}

.setting-content {
    margin: 1rem auto;
}

.setting-content h3 {
    font-size: 14px;
    font-weight: bold;
}

.setting-content p {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.7);
    width: 90%;
    margin: 1rem 0;
}

.form-info {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
}

.buy-invoice {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
}

.deposit__form {}

.deposit__form-group {
    position: relative;
    max-width: 100%;
}

.deposit__form-address {
    position: relative;
    max-width: 100%;

    padding: 15px 15px 15px 60px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    max-width: 100%;
    box-sizing: border-box;

    background-color: rgba(217, 217, 217, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 3px;

    outline: none;
    width: 100%;

    display: flex;
    align-items: center;
}

.deposit__form-group input {
    padding: 15px 15px 15px 60px;
    font-size: 12px;
    max-width: 100%;
    box-sizing: border-box;
}

.deposit__form-group .icon,
.deposit__form-address .icon {
    top: 50%;
    transform: translateY(-50%);
    left: 20px;
    position: absolute;
}

.deposit__form-copied {
    margin: 1rem auto;
    color: rgba(255, 255, 255, 0.75);
    font-size: 14px;
    text-align: center;
}

.deposit__info-estimate {
    margin-top: 1rem;
    font-weight: 400;
    font-size: 18px;
    text-align: center;
    color: #fff;
}

.error {
    font-size: 14px;
    color: red;
    text-align: center;
}

.success {
    font-size: 14px;
    color: green;
    text-align: center;
}

/* Стили для экрана успеха, скопированные из CountdownTimer.vue */
.setup-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    text-align: center;
    width: 100%;
    min-height: 60vh;
    background-color: #171d25;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.setup-success h3 {
    font-weight: bold;
    font-size: 20px;
    color: white;
    margin: 15px 0;
    text-align: center;
}

.success-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: rgba(149, 183, 29, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
}

.checkmark {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #95b71d;
    color: #fff;
    font-size: 32px;
}

.success-button {
    margin-top: 25px;
    padding: 12px 24px;
    background-color: transparent;
    border: 1px solid #95b71d;
    border-radius: 8px;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
    width: 100%;
    max-width: 250px;
}

.success-button:hover {
    background-color: rgba(149, 183, 29, 0.2);
}

/* Стили для экрана загрузки */
.setting-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    background-color: #171d25;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.setting-loading h3 {
    font-weight: 600;
    font-size: 18px;
    color: white;
    margin-bottom: 15px;
}

.setting-description {
    text-align: center;
    font-size: 16px;
    color: #d9d9d9;
    margin-top: 15px;
}

.setting-subdescription {
    text-align: center;
    font-size: 14px;
    color: #a0a0a0;
    margin-top: 8px;
}
</style>