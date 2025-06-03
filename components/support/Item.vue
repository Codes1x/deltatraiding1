<script setup lang="ts">
import type { ITicket } from '~/types/tickets';

const localePath = useLocalePath()

defineProps<{
    ticket: ITicket
}>()
</script>

<template>
    <div class="support__item">
        <span>{{ ticket.subject }} {{ ticket.id }}</span>
        <NuxtLink :to="localePath(`/ticket/${ticket.id}`)">
            <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M9.15375 9.56913H3.65375M3.56909 9.86063L1.23417 16.8353C1.05074 17.3833 0.95902 17.6572 1.02484 17.8259C1.082 17.9725 1.20476 18.0835 1.35625 18.1258C1.53068 18.1745 1.79415 18.0559 2.32108 17.8188L19.0325 10.2987C19.5469 10.0672 19.804 9.9515 19.8835 9.79073C19.9526 9.65107 19.9526 9.48719 19.8835 9.34752C19.804 9.18676 19.5469 9.07104 19.0325 8.83959L2.31525 1.31685C1.78991 1.08045 1.52724 0.962244 1.35298 1.01073C1.20164 1.05284 1.07889 1.16363 1.02153 1.30987C0.955484 1.47827 1.04622 1.75164 1.22769 2.2984L3.56974 9.35466C3.60091 9.44856 3.61649 9.49551 3.62265 9.54354C3.62811 9.58615 3.62805 9.62929 3.62248 9.67188C3.61621 9.71989 3.6005 9.7668 3.56909 9.86063Z"
                    stroke="#B2E500" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </NuxtLink>
    </div>
</template>

<style lang="css" scoped>
.support__item {
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(217, 217, 217, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.support__item span {
    font-size: 15px;
}

.support__item a {
    background-color: transparent;
    outline: none;
    border: none;
    cursor: pointer;
    transition: ease-in-out 0.2s;
}

.support__item a:hover {
    opacity: 0.8;
}
</style>