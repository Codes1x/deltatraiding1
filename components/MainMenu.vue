<script setup>
const localePath = useLocalePath()
</script>

<template>
  <div class="menu">
    <div class="menu__items">
      <NuxtLink class="menu__item" :to="localePath('/friends')" exact-active-class="active">
        <span class="icon">
          <svg width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.5"
              d="M15 1.46776C16.4817 2.20411 17.5 3.73314 17.5 5.5C17.5 7.26686 16.4817 8.79589 15 9.53224M17 14.7664C18.5115 15.4503 19.8725 16.565 21 18M1 18C2.94649 15.5226 5.58918 14 8.5 14C11.4108 14 14.0535 15.5226 16 18M13 5.5C13 7.98528 10.9853 10 8.5 10C6.01472 10 4 7.98528 4 5.5C4 3.01472 6.01472 1 8.5 1C10.9853 1 13 3.01472 13 5.5Z"
              stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>

        {{ $t('nav_friends') }}
      </NuxtLink>

      <NuxtLink class="menu__item" :to="localePath('/transaction')" exact-active-class="active">
        <span class="icon">
          <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.5" d="M13 11.5L1 11.5M1 11.5L4 8.5M1 11.5L4 14.5M1 4L13 4M13 4L10 1M13 4L10 7"
              stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>

        {{ $t('nav_transactions') }}
      </NuxtLink>

      <NuxtLink class="menu__item home" :to="localePath('/')" exact-active-class="active">
        <span class="icon">
          <svg width="21" height="14" viewBox="0 0 21 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 5.28571H1M9.55 8.71429H4.8M1 3.74286L1 10.2571C1 11.2172 1 11.6973 1.20709 12.064C1.38925 12.3865 1.67991 12.6488 2.03742 12.8132C2.44385 13 2.9759 13 4.04 13L16.96 13C18.0241 13 18.5562 13 18.9626 12.8132C19.3201 12.6488 19.6108 12.3865 19.7929 12.064C20 11.6973 20 11.2172 20 10.2571V3.74286C20 2.78277 20 2.30272 19.7929 1.93602C19.6108 1.61345 19.3201 1.3512 18.9626 1.18685C18.5562 1 18.0241 1 16.96 1L4.04 1C2.9759 1 2.44385 1 2.03742 1.18685C1.67991 1.3512 1.38925 1.61345 1.20709 1.93602C1 2.30272 1 2.78277 1 3.74286Z"
              stroke="#B2E500" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>

        {{ $t('nav_home') }}
      </NuxtLink>

      <NuxtLink class="menu__item" :to="localePath('/shop')" exact-active-class="active">
        <span class="icon">
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.5" d="M1 7.66667L1 16M11 7.66667L11 16M6 1L6 16M16 1V16" stroke="white" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>

        {{ $t('nav_shop') }}
      </NuxtLink>

      <NuxtLink class="menu__item" :to="localePath('/trade')" exact-active-class="active">
        <span class="icon">
          <svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16.5588 16V9.82353M9.5 16V7.17647M2.44117 16L2.44117 12.4706M10.7412 2.78897L15.3016 4.49912M8.44009 3.11846L3.5002 6.82338M17.4947 4.03471C18.0116 4.55158 18.0116 5.38959 17.4947 5.90647C16.9778 6.42334 16.1398 6.42334 15.6229 5.90647C15.1061 5.38959 15.1061 4.55158 15.6229 4.03471C16.1398 3.51784 16.9778 3.51784 17.4947 4.03471ZM3.37705 6.68177C3.89392 7.19864 3.89392 8.03665 3.37705 8.55352C2.86018 9.07039 2.02217 9.07039 1.5053 8.55352C0.988428 8.03665 0.988428 7.19864 1.5053 6.68177C2.02217 6.1649 2.86018 6.1649 3.37705 6.68177ZM10.4359 1.38765C10.9527 1.90452 10.9527 2.74254 10.4359 3.25941C9.919 3.77628 9.08099 3.77628 8.56412 3.25941C8.04725 2.74254 8.04725 1.90452 8.56412 1.38765C9.08099 0.870782 9.919 0.870782 10.4359 1.38765Z"
              stroke="#878787" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>

        {{ $t('nav_systems') }}
      </NuxtLink>
    </div>

    <div class="menu__bg" />
  </div>
</template>

<style>
.menu {
  width: 100%;
  margin-top: 20px;
  position: fixed;
  bottom: 0;
  z-index: 1;
}

.menu__items {
  width: 100%;
  bottom: 27px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 15px;
  z-index: 1;
}

.menu__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: ease-in-out 0.2s;
  gap: 2px;
  text-decoration: none;
  min-width: 60px;
  width: 60px;
}

.menu__item.home .icon {
  width: 50px;
  height: 50px;
}

.menu__item.home .icon svg {
  width: 32px;
  height: 26px;
}

.menu__item .icon {
  background-color: #171722;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
}

.menu__item .icon svg {
  width: 24px;
  height: 18px;
}

.menu__item {
  color: rgba(255, 255, 255, 0.5);
  background-color: transparent;
  outline: none;
  border: none;
  font-size: 13px;
  font-weight: 700;
  line-height: 15px;
}

.menu__item svg path {
  stroke: white;
  opacity: 0.5;
  transition: ease-in-out 0.2s;
}

.menu__item:hover {
  color: rgba(255, 255, 255);
}

.menu__item.active {
  color: rgba(255, 255, 255);
}

.menu__item.active svg path {
  stroke: #B2E500;
  opacity: 1;
}

.menu__bg {
  width: 100%;
  min-height: 65px;
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(7px);
}
</style>