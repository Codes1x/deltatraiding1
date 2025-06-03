<script setup lang="ts">
import { ref } from 'vue';
import type { IReferral } from '~/types/friends';
const props = defineProps<{
    referral: IReferral
}>()

const showSubReferral = ref(false)
const toggleSubReferral = () => {
    // console.log('showSubReferral ', showSubReferral.value)
    showSubReferral.value = !showSubReferral.value
}
</script>

<template>
    <div class="level" :class="`level-${referral.level}`">
        <div class="friends__item">
            <div class="friends__item-avatar">
                <img src="https://www.w3schools.com/howto/img_avatar.png" alt="" >
            </div>
            <div class="friends__item-text">
                <span class="name">{{ referral.full_name }}</span>
                <div class="bottom">
                    <span class="money">{{ $t('number of sales') }}: {{ referral.purchased_trading_systems }}</span>
                    <span>{{ $t('Invited') }}: {{ referral.invited_count }}</span>
                </div>
            </div>

            <button v-if="referral.sub_referrals.length > 0" class="friends__open" @click="toggleSubReferral">
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L7 7L0.999999 13" stroke="#919186" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </button>
        </div>
        <div v-if="referral.sub_referrals.length > 0 && showSubReferral" class="subreferral">
            <FriendsLevel v-for="(subReferral, subReferralIndex) in referral.sub_referrals" :key="subReferralIndex"
                :referral="subReferral" />
        </div>
    </div>
</template>

<style lang="css" scoped>
.level {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.level.level-2,
.level.level-3,
.level.level-4,
.level.level-5 {
    margin-left: 1rem;
}

.subreferral {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

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
    font-size: 14px;
    color: rgba(255, 255, 255, 0.3);
}

.friends__item-text .bottom .money {
    color: #b2e500;
    font-size: 14px;
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
