<script setup lang="ts">
import { useSubscribesStore } from '~/stores/subscribes'
import type { ISubscribesResponseArray, ITSWithVPS } from '~/types/subscribes'
import { computed, onMounted } from 'vue'

const subscribesStore = useSubscribesStore()

const subscribesList = computed<ISubscribesResponseArray[]>(() => subscribesStore.getAllSubscribes)
const subscribesVPS_TS_List = computed<ITSWithVPS[]>(() => subscribesStore.getTSwithVPS)
const subscribesReferrals = computed(() => subscribesStore.getSubscribedReferralProgram)

onMounted(() => {
  console.time('subscribesVPS_TS_List')
  void subscribesVPS_TS_List.value // "void" явно говорит линтеру: побочный эффект
  console.timeEnd('subscribesVPS_TS_List')
})

</script>

<template>
  <div v-if="subscribesList.length" class="trade__items">
    <div
      v-for="itemTS in subscribesVPS_TS_List"
      :key="itemTS.tradingSystem.id"
      class="trade__items-item"
    >
      <TradeSystemsItem
        :product="itemTS.tradingSystem.product"
        :expires-at="itemTS.tradingSystem.expires_at"
        :is-configured="itemTS.tradingSystem.is_configured"
        :un-configured-id="itemTS.tradingSystem.id"
        :is-paid="itemTS.tradingSystem.paid_for"
      />
      <div class="trade__item-vps">
        <TradeSystemsItemVPS
          v-for="vpsItem in itemTS.vps"
          :key="vpsItem.id"
          :product="vpsItem.product"
          :expires-at="vpsItem.expires_at"
          :is-paid="vpsItem.paid_for"
        />
      </div>
    </div>
  </div>

  <div v-if="subscribesReferrals.length" class="trade__items">
    <TradeSystemsItemReferral
      v-for="item in subscribesReferrals"
      :key="item.id"
      :product="item.product"
      :expires-at="item.expires_at"
      :is-paid="item.paid_for"
    />
  </div>
</template>


<style lang="css" scoped>
.trade__items {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 30px 15px;
}

.trade__items-item {
    background-color: rgba(217, 217, 217, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 5px;
}

.trade__item-vps {
    margin-top: 0.5rem;
    position: relative;
}

.trade__item-vps::before {
    content: "";
    position: absolute;
    top: 0;
    left: 20%;
    width: 60%;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.05);
}
</style>