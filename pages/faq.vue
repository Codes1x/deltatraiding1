<script setup lang="ts">
import { useFaqStore } from '~/stores/faq';

const questions = ref([
    {
        id: 1,
        show: false,
    },
    {
        id: 2,
        show: false,
    },
    {
        id: 3,
        show: false,
    },
    {
        id: 4,
        show: false,
    },
    {
        id: 5,
        show: false,
    }
]);

const activeItem = ref(0)
const showItem = (id: number) => {
    if (activeItem.value === id) {
        activeItem.value = 0;
    } else {
        activeItem.value = id;
    }
}

const faqStore = useFaqStore();
const faqList = computed(() => faqStore.getFaq);
const isDataLoaded = ref(false);
const fetchFaq = async () => {
    try {
        isDataLoaded.value = false;
        await faqStore.fetchAllFaqs();
        isDataLoaded.value = true;
    } catch (error) {
        console.error('Failed to fetch faq:', error);
    }
}
onBeforeMount(fetchFaq)
</script>

<template>
    <section class="faq">
        <FaqHeader />
        <div v-if="isDataLoaded" class="faq__items">
            <FaqItem v-for="item in faqList" :key="item.id" :item :class="{ 'active': item.id === activeItem }"
                @click="showItem(item.id)" />
        </div>
        <div v-else>
            <CommonLoader />
        </div>
    </section>
</template>

<style scoped>
.faq__items {
    padding: 35px 13px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}
</style>