<script setup lang="ts">
import { useSubscribesStore } from '~/stores/subscribes'
const subscribesStore = useSubscribesStore()


const fetchSubscribedProducts = async () => {
  try {

    // const response = await productsStore.fetchAllProducts()
    subscribesStore.fetchSubsribes()


    // console.log('subscribesStore.getSubscribedReferralProgram.length', subscribesStore.getSubscribedReferralProgram.length)
  } catch (error) {
    console.error('fetchProducts friends.vue', error)
  }
}
onMounted(fetchSubscribedProducts)
</script>

<template>
  <div class="home">
    <div class="home__light">
      <div class="light left" />
      <div class="light right" />
    </div>

    <HomeHeader />
    <HomeBalance />
 

    <HomeStatistic />
    <HomeReferrals />

  </div>
</template>

<style scoped>
.home {
  padding-bottom: 70px; /* Отступ для нижнего меню */
}

.home__light .light {
  width: 60vw;
  height: 55vw;
  border-radius: 100%;
  position: absolute;
  top: -40vw;
  filter: blur(15vw);
}

.home__light .left {
  background-color: #f89900;
  left: 0;
}

.home__light .right {
  background-color: #b2e500;
  right: 0;
}

.loader {
  margin: 1rem auto;
}
</style>
