<script setup lang="ts">
import type { IReferral } from '~/types/friends'

defineProps<{
  referral: IReferral
}>()


</script>

<template>
  <div class="friends__item">
    <div class="friends__item-avatar">
      <img src="https://www.w3schools.com/howto/img_avatar.png" alt="" >
    </div>
    <div class="friends__item-text">
      <span class="name">{{ referral.username }}</span>
      <div class="bottom">
        <span class="money">
          $ {{ referral.balance ? parseFloat(referral.balance).toFixed(2) : 0 }}
        </span>
        <!-- <span>3 systems</span> 
                <span>72 referrals</span> -->
      </div>
    </div>

    <button class="friends__open">
      <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L7 7L0.999999 13" stroke="#919186" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>
</template>

<style lang="css" scoped>
.friends__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.friends__item-avatar {
  max-width: 44px;
  max-height: 44px;
  border-radius: 100%;
  overflow: hidden;
}

.friends__item-avatar img {
  width: 100%;
  height: 100%;
}

.friends__item-text {
  width: 100%;
}

.friends__item-text .name {
  font-size: 16px;
  font-weight: 500;
}

.friends__item-text .bottom {
  display: flex;
  align-items: center;
  gap: 15px;
}

.friends__item-text .bottom span {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.3);
}

.friends__item-text .bottom .money {
  color: #b2e500;
  font-size: 16px;
}

.friends__open {
  background-color: transparent;
  outline: none;
  border: none;
  cursor: pointer;
  transition: ease-in-out 0.2s;
}

.friends__open svg path {
  transition: ease-in-out 0.2s;
}

.friends__open:hover svg path {
  stroke: #b2e500;
}
</style>
