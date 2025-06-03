<script setup lang="ts">
import { useTgWebAppStore } from '@/stores/tgWebApp'
const localePath = useLocalePath()

const tgWebAppStore = useTgWebAppStore()
const userData = computed(() => tgWebAppStore.getUser)
const menu = ref(false)
</script>

<template>
  <div v-if="userData" class="home__header">
    <div v-if="userData" class="home__header-avatar">
      <img :src="userData.photo_url" :alt="userData.username" >
    </div>

    <div class="home__header-logo">
      <img src="/icons/logo.svg" alt="delta trade" >
    </div>
    <div />

    <div class="home__header-menu-background" :class="{ active: menu }" @click="menu = false" />



    <div class="home__header-menu" :class="{ active: menu }">


      <div class="home__header-menu-items">
        <ProfileLangSwitcher />

        <NuxtLink :to="localePath('/profile')" class="menu__item">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3.65304 14.9507C4.1397 13.8042 5.27594 13 6.6 13H11.4C12.7241 13 13.8603 13.8042 14.347 14.9507M12.2 7C12.2 8.76731 10.7673 10.2 9 10.2C7.23269 10.2 5.8 8.76731 5.8 7C5.8 5.23269 7.23269 3.8 9 3.8C10.7673 3.8 12.2 5.23269 12.2 7ZM17 9C17 13.4183 13.4183 17 9 17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9Z"
              stroke="#B2E500" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          {{ $t('nav_account') }}
        </NuxtLink>

        <NuxtLink :to="localePath('/support')" class="menu__item">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.4 11.4L4.93979 13.891C4.59663 14.2384 4.42504 14.4121 4.27756 14.4244C4.14961 14.435 4.02433 14.3836 3.94077 14.2861C3.84444 14.1738 3.84444 13.9296 3.84444 13.4412V12.1933C3.84444 11.7552 3.48566 11.4382 3.05216 11.3747V11.3747C2.00299 11.221 1.17902 10.397 1.02534 9.34784C1 9.17484 1 8.96841 1 8.55555V4.84C1 3.49587 1 2.82381 1.26158 2.31042C1.49168 1.85883 1.85883 1.49168 2.31042 1.26158C2.82381 1 3.49587 1 4.84 1H10.76C12.1041 1 12.7762 1 13.2896 1.26158C13.7412 1.49168 14.1083 1.85883 14.3384 2.31042C14.6 2.82381 14.6 3.49587 14.6 4.84V8.2M14.6 17L12.8589 15.7895C12.6141 15.6193 12.4917 15.5343 12.3586 15.4739C12.2404 15.4204 12.1161 15.3814 11.9885 15.3579C11.8447 15.3314 11.6956 15.3314 11.3975 15.3314H9.96C9.06392 15.3314 8.61587 15.3314 8.27362 15.157C7.97256 15.0036 7.72779 14.7589 7.57439 14.4578C7.4 14.1156 7.4 13.6675 7.4 12.7714V10.76C7.4 9.86392 7.4 9.41587 7.57439 9.07362C7.72779 8.77256 7.97256 8.52779 8.27362 8.37439C8.61587 8.2 9.06392 8.2 9.96 8.2H14.44C15.3361 8.2 15.7841 8.2 16.1264 8.37439C16.4274 8.52779 16.6722 8.77256 16.8256 9.07362C17 9.41587 17 9.86392 17 10.76V12.9314C17 13.6769 17 14.0497 16.8782 14.3437C16.7158 14.7358 16.4043 15.0472 16.0123 15.2096C15.7183 15.3314 15.3455 15.3314 14.6 15.3314V17Z"
              stroke="#B2E500" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          {{ $t('nav_support') }}
        </NuxtLink>

        <NuxtLink :to="localePath('/faq')" class="menu__item">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7 5.7162C7.15103 5.28688 7.44912 4.92486 7.84149 4.69426C8.23385 4.46367 8.69517 4.37937 9.14373 4.45631C9.59229 4.53325 9.99915 4.76646 10.2922 5.11463C10.5853 5.4628 10.7457 5.90347 10.7451 6.35858C10.7451 7.64334 8.81793 8.28571 8.81793 8.28571M8.84278 10.8571H8.85135M6.91429 14.8857L8.16572 16.5543C8.35182 16.8024 8.44487 16.9265 8.55894 16.9709C8.65886 17.0097 8.76971 17.0097 8.86963 16.9709C8.98371 16.9265 9.07676 16.8024 9.26286 16.5543L10.5143 14.8857C10.7656 14.5507 10.8912 14.3832 11.0444 14.2553C11.2488 14.0848 11.49 13.9641 11.749 13.903C11.9433 13.8571 12.1526 13.8571 12.5714 13.8571C13.7696 13.8571 14.3686 13.8571 14.8412 13.6614C15.4713 13.4004 15.9719 12.8998 16.2328 12.2698C16.4286 11.7972 16.4286 11.1981 16.4286 10V5.11429C16.4286 3.67415 16.4286 2.95408 16.1483 2.40402C15.9018 1.92018 15.5084 1.5268 15.0245 1.28027C14.4745 1 13.7544 1 12.3143 1H5.11429C3.67415 1 2.95408 1 2.40402 1.28027C1.92018 1.5268 1.5268 1.92018 1.28027 2.40402C1 2.95408 1 3.67415 1 5.11429V10C1 11.1981 1 11.7972 1.19574 12.2698C1.45672 12.8998 1.95731 13.4004 2.58739 13.6614C3.05994 13.8571 3.65901 13.8571 4.85714 13.8571C5.27593 13.8571 5.48532 13.8571 5.67958 13.903C5.93859 13.9641 6.17981 14.0848 6.38414 14.2553C6.53738 14.3832 6.66302 14.5507 6.91429 14.8857Z"
              stroke="#B2E500" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          {{ $t('nav_faq') }}
        </NuxtLink>

        <!-- <a href="JavaScript:void(0)" class="menu__item">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12.5556 13.4444L17 9M17 9L12.5556 4.55556M17 9H6.33333M6.33333 1H5.26667C3.77319 1 3.02646 1 2.45603 1.29065C1.95426 1.54631 1.54631 1.95426 1.29065 2.45603C1 3.02646 1 3.77319 1 5.26667V12.7333C1 14.2268 1 14.9735 1.29065 15.544C1.54631 16.0457 1.95426 16.4537 2.45603 16.7094C3.02646 17 3.77319 17 5.26667 17H6.33333"
              stroke="#B2E500" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          {{ $t('nav_logout') }}
        </a> -->
      </div>

      <button class="home__header-menu-btn" @click="menu = !menu">
        <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 7H16M1 1H19M7 13H13" stroke="#95B71D" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.home__header {
  position: relative;
  z-index: 999;
  display: flex;
  justify-content: space-between;
  margin: 20px;
  align-items: center;
}

.home__header-logo {
  z-index: 999;
  display: flex;
  align-items: center;
}

.home__header-avatar {
  width: 40px;
  height: 40px;
  overflow: hidden;
  border-radius: 100%;
}

.home__header-avatar img {
  max-width: 100%;
  max-height: 100%;
}

.home__header-menu-background {
  position: fixed;
  width: 100%;
  height: 100vh;
  z-index: 1000;
  background-color: rgba(15, 15, 15, 0.7);
  backdrop-filter: blur(7.7px);
  top: 0;
  left: 0;
  display: none;
}

.home__header-menu-background.active {
  display: block;
}

.home__header-menu {
  z-index: 1010;
  position: absolute;
  top: 0%;
  /* transform: translateY(0%); */
  right: -10px;
  padding: 16px;
}

.home__header-menu.active {
  background-color: rgba(217, 217, 217, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  width: 216px;
  display: flex;
  align-items: start;
  border-radius: 20px;
  justify-content: space-between;
  backdrop-filter: blur(30px);
}

.home__header-menu.active .home__header-menu-items {
  display: flex;
}

.home__header-menu-items {
  padding: 0 0 30px 10px;
  display: none;
  flex-direction: column;
  width: 100%;
  gap: 37px;
}

.home__header-menu-items a {
  width: 100%;
  display: flex;
  text-decoration: none;
  color: #fff;
  gap: 16px;
  font-size: 20px;
  font-weight: 300;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  transition: ease-in-out 0.2s;
}

.home__header-menu-items a:hover {
  opacity: 0.7;
}

.home__header-menu-items a svg path {
  stroke: #b2e500;
}

.home__header-menu-items a svg {
  width: 25px;
  height: 25px;
}

.home__header-menu-btn {
  background-color: transparent;
  outline: none;
  border: none;
  cursor: pointer;
}
</style>
