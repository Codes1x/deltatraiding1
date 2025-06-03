<script setup lang="ts">
import { ref, onMounted } from 'vue';
import CountdownTimer from './CountdownTimer.vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  productId: {
    type: [Number, String],
    required: true
  },
  productName: {
    type: String,
    default: 'Торговая система'
  }
});

const emit = defineEmits(['finished']);
const setupComplete = ref(false);
const setupDuration = ref(120); // 2 minutes setup time

// After setup completion, wait before auto-navigating
const handleSetupFinished = (productId) => {
  setupComplete.value = true;
  
  // Emit finished event to parent component
  emit('finished', productId);
};

// Manual navigation from button click
const navigateToRobot = (productId) => {
  if (productId) {
    navigateTo(`/trade/robot?id=${productId}`);
  } else {
    navigateTo('/trade');
  }
};

// Optionally fetch product details on mount
onMounted(async () => {
  // You could fetch additional product info here if needed
  console.log(`Setting up product ${props.productId}: ${props.productName}`);
});
</script>

<template>
  <div class="purchase-setup">
    <!-- CountdownTimer component handles all the setup UI stages -->
    <CountdownTimer 
      :duration="setupDuration" 
      :product-id="productId"
      @finished="handleSetupFinished"
    />
  </div>
</template>

<style scoped>
.purchase-setup {
  width: 100%;
  height: 100%;
  background-color: #171d25;
  color: #fff;
}
</style> 