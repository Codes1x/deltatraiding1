<script setup lang="ts">
import useClipboard from 'vue-clipboard3'
import ShopPurchaseSetup from '~/components/shop/PurchaseSetup.vue'
import { usePurchasesStore } from '~/stores/purchases'
import { useSubscribesStore } from '~/stores/subscribes'

const { toClipboard } = useClipboard()
const route = useRoute()

const subscribesStore = useSubscribesStore()
const purchasesStore = usePurchasesStore()

// Получаем параметр id из route.params
const productId = parseInt(route.query.id as string, 10) || 0;
const invoiceData = ref()

// Check if we're already in setup process
const inSetupProcess = computed(() => purchasesStore.getSetupStatus);
const currentPurchase = computed(() => purchasesStore.getCurrentSetupPurchase);

// Default product name to display
const defaultProductName = 'Торговая система';

const isCopiedAddress = ref(false)
const copyToClipboardAddress = async () => {
    if (!invoiceData.value.invoice.address) {
        return
    }
    try {
        await toClipboard(invoiceData.value.invoice.address)
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

const isDataLoaded = ref(false)
const fetchInvoiceData = async () => {
    if (productId) {
        try {
            isDataLoaded.value = false
            const response = await subscribesStore.fetchUnconfiguredSubscribeByID(productId)
            invoiceData.value = response

        } catch (error) {
            console.error('fetchInvoiceData ', error)
        } finally {
            isDataLoaded.value = true
        }
    }
}

// Handle payment success
const handlePaymentSuccess = async () => {
    try {
        await purchasesStore.handlePaymentSuccess(productId);
    } catch (error) {
        console.error('Ошибка при обработке оплаты:', error);
        // Show error notification
    }
}

// Handle setup completion
const handleSetupFinished = (purchasedProductId: number | string) => {
    // Update store to mark setup as complete
    purchasesStore.completeSetup(purchasedProductId);
    
    // Delay navigation so user can see success screen
    setTimeout(() => {
        if (purchasedProductId) {
            navigateTo(`/trade/robot?id=${purchasedProductId}`);
        } else {
            navigateTo('/trade');
        }
    }, 5000); // 5 second delay before redirecting
}

onMounted(() => {
    // If we're not already in setup, fetch invoice data
    if (!inSetupProcess.value) {
        fetchInvoiceData();
    }
})
</script>

<template>
    <section class="faq">
        <InvoiceHeader />

        <!-- Setup process after payment -->
        <div v-if="inSetupProcess" class="setup-process">
            <ShopPurchaseSetup 
                :product-id="currentPurchase?.id || productId" 
                :product-name="defaultProductName" 
                @finished="handleSetupFinished"
            />
        </div>

        <!-- Payment interface -->
        <div v-else-if="isDataLoaded" class="buy-invoice">
            <div class="buy-invoice__product">
                <ShopProduct :product="invoiceData.product!" />
            </div>

            <div class="deposit__form">
                <button class="deposit__form-address invoice" @click="copyToClipboardAddress">
                    <img src="/icons/user.svg" alt="user icon" class="icon" >
                    <span>{{ invoiceData.invoice.address ? invoiceData.invoice.address : 'address' }}</span>
                </button>
                <p v-show="isCopiedAddress" class="deposit__form-copied">{{ $t('copied') }}</p>
            </div>

            <p class="buy-invoice__standart">
                {{ $t('Standart') }} {{ invoiceData.invoice.standart }}
            </p>

            <div v-if="invoiceData.invoice.address" class="deposit__info">
                <div class="deposit__info-qr">
                    <img :src="`data:image/png;base64,${invoiceData.invoice.qr_code}`" alt="QR Code" class="qr-code" >
                </div>

                <div class="deposit__info-estimate">
                    {{ calculateRemainingHours(invoiceData.invoice.expiration_time) }} {{ $t('hours') }}
                </div>
            </div>

            <!-- For development/testing: Button to simulate successful payment -->
            <button class="simulate-payment-btn" @click="handlePaymentSuccess">
                ДЕМО: Симулировать успешную оплату
            </button>
        </div>

        <div v-else class="buy-invoice">
            <CommonLoader />
        </div>
    </section>
</template>

<style lang="css" scoped>
.buy-invoice {
    padding: 35px 0;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.buy-invoice__product {
    padding: 0 13px 0.5rem;
}

.buy-invoice__standart {
    text-align: center;
    padding: 0 13px 0.5rem;
}

.setup-process {
    height: calc(100vh - 60px);
    width: 100%;
}

.simulate-payment-btn {
    margin: 20px auto;
    padding: 10px 15px;
    background-color: #95b71d;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}
</style>