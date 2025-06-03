<script setup lang="ts">
import type { IPurchase } from '~/types/purchases';

defineProps<{
    invoice: IPurchase
}>()
</script>
<template>
    <div class="invoice">
        <h4>{{ $t('Invoice') }}</h4>
        <p><span>{{ $t('Product') }}:</span> {{ invoice.product.name }} </p>
        <p><span>{{ $t('Price') }}:</span> {{ parseFloat(invoice.product.price).toFixed(2) }} </p>
        <p><span>{{ $t('Expires') }}:</span> {{ invoice.expires_at }} </p>
    </div>
</template>
<style lang="css" scoped>
.invoice {

    background-color: rgba(217, 217, 217, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    padding: 8px 10px;


}

.invoice h4 {
    font-size: 14px;
    font-weight: bold;
    color: #ddd;
}

.invoice p {
    font-size: 12px;
    font-weight: bold;
    color: #65BE5D;

    span {
        color: rgba(255, 255, 255, 0.5);
        font-size: 12px;
        font-weight: 300;
    }
}
</style>