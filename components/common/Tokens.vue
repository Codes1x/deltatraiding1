<script setup lang="ts">

interface DropdownItem {
    label: string;
    value: string;
    icon: string;
}

// Пропсы компонента
const props = defineProps({
    modelValue: { // Значение, передаваемое родителем
        type: Object as () => DropdownItem,
        default: () => ({ label: '', value: '' }),
    }
});

// Эмит события для отправки выбранного значения
const emit = defineEmits<{
    (e: 'update:modelValue', value: DropdownItem): void; // Эмитим весь объект
}>();

// Состояние для отслеживания открытия/закрытия меню
const isOpen = ref(false);

// Ссылка на dropdown для проверки кликов вне компонента
const dropdownRef = ref<HTMLElement | null>(null);

// Выбранное значение
// const selectedValue = ref<DropdownItem | null>(null);
// Состояние для выбранного значения
const selectedValue = ref(props.modelValue || ''); // Если modelValue не передано, то по умолчанию ''

// Метод для открытия/закрытия меню
const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

// Метод для выбора элемента
const selectItem = (item: DropdownItem) => {
    selectedValue.value = item;
    console.log('selectedValue ', selectedValue.value)
    emit('update:modelValue', item); // Эмитим выбранный объект
    isOpen.value = false;
};

// Закрытие меню при клике вне компонента
const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        isOpen.value = false;
    }
};

const items = [
    { label: 'USDT', value: 'USDT', icon: '/icons/usdt.svg' },
    { label: 'USDC', value: 'USDC', icon: '/icons/usdc.svg' }
]

// Регистрируем и удаляем обработчик события на монтировании и размонтировании компонента
onMounted(() => {

    // Если modelValue не передано, выбираем первый элемент из списка items
    if (!props.modelValue.value && items.length > 0) {
        selectedValue.value = items[0];
        emit('update:modelValue', items[0]); // Устанавливаем значение по умолчанию
    } else {
        selectedValue.value = props.modelValue;
    }

    document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<template>
    <div ref="dropdownRef" class="tokens-dropdown" :class="{ open: isOpen }">
        <!-- Заголовок и кнопка для открытия меню -->
        <button class="dropdown__label" @click="toggleDropdown">
            <img :src="selectedValue.icon" :alt="`icon ${selectedValue.label}`" class="dropdown__item-img" >

            {{ selectedValue.label || 'Token' }}

            <svg width="7" height="6" viewBox="0 0 7 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.5" d="M3.5 6L0.468912 0.749999L6.53109 0.75L3.5 6Z" fill="#00E5CF" />
            </svg>
        </button>

        <!-- Выпадающее меню -->
        <div v-if="isOpen" class="dropdown__menu">
            <ul>
                <li v-for="item in items" :key="item.value" class="dropdown__item" @click="selectItem(item)">
                    <img :src="item.icon" :alt="`icon ${item.label}`" class="dropdown__item-img" >

                    {{ item.label }}
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.tokens-dropdown {
    position: relative;
    display: flex;
    width: auto;
    border: 1px solid #fff;
    border-radius: 18px;
}

.tokens-dropdown.open {
    border: 1px solid #fff;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    /* border: 1px solid #fff;
    border-top-left-radius: 18px;
    border-top-right-radius: 18px; */
    backdrop-filter: blur(30px);
    /* border-bottom: none;
    border-left: 1px solid #fff;
    border-right: 1px solid #fff;
    border-top: 1px solid #fff; */
    /* box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25); */
    background: rgba(217, 217, 217, 0.05);
    box-shadow: 7px 10px 4px 0 rgba(0, 0, 0, 0.25);
}

.tokens-dropdown.open .dropdown__label {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    border-bottom: none;
}

.tokens-dropdown.open .dropdown__menu {
    border: 1px solid #fff;
    border-bottom-left-radius: 18px;
    border-bottom-right-radius: 18px;
    backdrop-filter: blur(30px);
    /* box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25); */
    background: #21212b;
    box-shadow: 7px 10px 4px 0 rgba(0, 0, 0, 0.25);

    border-top: 1px dashed #fff;
    border-left: 1px solid #fff;
    border-right: 1px solid #fff;
    border-bottom: 1px solid #fff;
}

.dropdown__label {
    font-size: 15px;
    font-weight: 300;
    padding: 10px 15px;
    display: flex;
    gap: 11px;
    align-items: center;

    text-transform: capitalize;
    border-radius: 18px;
    border: none;
    backdrop-filter: blur(12.100000381469727px);
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    background: rgba(217, 217, 217, 0.05);
}

.dropdown__menu {
    position: absolute;
    top: 100%;
    width: 100%;
    left: -1px;

    z-index: 10;
}

.dropdown__menu {
    border-top: 1px dashed #fff;
}

.dropdown__menu ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.dropdown__item {
    padding: 4px 15px;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.4);
    /* background-color: white; */
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: start;
}

.dropdown__item:hover,
.dropdown__item.active {
    /* background-color: #f9f9f9; */
    color: #65BE5D;
}

.dropdown__item-img {
    width: 14px;
    height: 14px;
}
</style>
