<script setup lang="ts">
const emits = defineEmits(['deposit', 'withdraw', 'transfer'])
</script>

<template>
    <div class="transaction__buttons">
        <button class="icon__button" @click="emits('deposit')">
            <span class="icon">
                <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M18 17V11M15 14H21M21 6H1M21 8V4.2C21 3.0799 21 2.51984 20.782 2.09202C20.5903 1.7157 20.2843 1.40974 19.908 1.21799C19.4802 1 18.9201 1 17.8 1H4.2C3.0799 1 2.51984 1 2.09202 1.21799C1.7157 1.40973 1.40973 1.71569 1.21799 2.09202C1 2.51984 1 3.0799 1 4.2V11.8C1 12.9201 1 13.4802 1.21799 13.908C1.40973 14.2843 1.71569 14.5903 2.09202 14.782C2.51984 15 3.0799 15 4.2 15H11"
                        stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </span>

            {{ $t('deposit') }}
        </button>

        <button class="icon__button" @click="emits('withdraw')">
            <span class="icon">
                <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M15.0001 14H21.0001M21.0001 6H1.00006M21.0001 9.5V4.2C21.0001 3.0799 21.0001 2.51984 20.7821 2.09202C20.5903 1.7157 20.2844 1.40974 19.908 1.21799C19.4802 1 18.9202 1 17.8001 1H4.20006C3.07996 1 2.5199 1 2.09208 1.21799C1.71576 1.40973 1.4098 1.71569 1.21805 2.09202C1.00006 2.51984 1.00006 3.0799 1.00006 4.2V11.8C1.00006 12.9201 1.00006 13.4802 1.21805 13.908C1.40979 14.2843 1.71576 14.5903 2.09208 14.782C2.5199 15 3.07996 15 4.20006 15H11.0001"
                        stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </span>

            {{ $t('withdraw') }}
        </button>

        <button class="icon__button" @click="emits('transfer')">
            <span class="icon">
                <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M21.0001 8.00003H1.00006M10.0001 17L17.8001 17C18.9202 17 19.4802 17 19.908 16.782C20.2844 16.5903 20.5903 16.2843 20.7821 15.908C21.0001 15.4802 21.0001 14.9201 21.0001 13.8V6.20003C21.0001 5.07993 21.0001 4.51987 20.7821 4.09205C20.5903 3.71573 20.2844 3.40977 19.908 3.21802C19.4802 3.00003 18.9202 3.00003 17.8001 3.00003H16.0001M10.0001 17L12.0001 19M10.0001 17L12.0001 15M6.00006 17H4.20006C3.07996 17 2.5199 17 2.09208 16.782C1.71576 16.5903 1.40979 16.2843 1.21805 15.908C1.00006 15.4802 1.00006 14.9201 1.00006 13.8V6.20003C1.00006 5.07993 1.00006 4.51987 1.21805 4.09205C1.4098 3.71573 1.71576 3.40976 2.09208 3.21802C2.5199 3.00003 3.07996 3.00003 4.20006 3.00003H12.0001M12.0001 3.00003L10.0001 5.00003M12.0001 3.00003L10.0001 1.00003"
                        stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </span>

            {{ $t('transfer') }}
        </button>
    </div>
</template>

<style lang="css" scoped>
.transaction__buttons {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 45px;
}

.icon__button {
    transition: 0.2s ease-in all;
}

.icon__button:hover .icon svg path {
    stroke: #95b71d;
}
</style>