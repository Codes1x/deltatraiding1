<script setup lang="ts">

interface DropdownItem {
    label: string;
    value: string;
}

// Пропсы компонента
const props = defineProps({
    items: {
        type: Array as () => DropdownItem[],
        required: true,
    },
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
// const selectedValue = ref<string | null>(null);

// Метод для открытия/закрытия меню
const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

// Метод для выбора элемента
const selectItem = (item: DropdownItem) => {
    selectedValue.value = item;
    emit('update:modelValue', item); // Эмитим выбранный объект
    isOpen.value = false;
};

// Закрытие меню при клике вне компонента
const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        isOpen.value = false;
    }
};

// Состояние для выбранного значения
const selectedValue = ref(props.modelValue || ''); // Если modelValue не передано, то по умолчанию ''

// Слушаем изменения prop `modelValue`, чтобы синхронизировать его с selectedValue
watch(() => props.modelValue, (newValue) => {
    selectedValue.value = newValue;
});

// Регистрируем и удаляем обработчик события на монтировании и размонтировании компонента
onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<template>
    <div ref="dropdownRef" class="dropdown" :class="{ open: isOpen }">
        <!-- Заголовок и кнопка для открытия меню -->
        <button class="dropdown__label" @click="toggleDropdown">
            {{ selectedValue.label ? $t(selectedValue.label) : $t('Select value') }}

            <svg width="9" height="5" viewBox="0 0 9 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M8.74746 0.232761C8.5875 0.0836789 8.37111 0 8.14556 0C7.92001 0 7.70362 0.0836789 7.54366 0.232761L4.47866 3.06631L1.45634 0.232761C1.29638 0.0836789 1.07999 0 0.854442 0C0.628891 0 0.412504 0.0836789 0.252541 0.232761C0.172519 0.307172 0.109004 0.395701 0.0656599 0.493242C0.0223156 0.590782 0 0.695404 0 0.801071C0 0.906738 0.0223156 1.01136 0.0656599 1.1089C0.109004 1.20644 0.172519 1.29497 0.252541 1.36938L3.87249 4.76323C3.95185 4.83826 4.04628 4.8978 4.15032 4.93844C4.25436 4.97908 4.36595 5 4.47866 5C4.59136 5 4.70295 4.97908 4.80699 4.93844C4.91103 4.8978 5.00546 4.83826 5.08483 4.76323L8.74746 1.36938C8.82748 1.29497 8.89099 1.20644 8.93434 1.1089C8.97768 1.01136 9 0.906738 9 0.801071C9 0.695404 8.97768 0.590782 8.93434 0.493242C8.89099 0.395701 8.82748 0.307172 8.74746 0.232761Z"
                    fill="#95B71D" />
            </svg>
        </button>

        <!-- Выпадающее меню -->
        <div v-if="isOpen" class="dropdown__menu">
            <ul>
                <li v-for="item in props.items" :key="item.value" class="dropdown__item"
                    :class="{ active: item.value === selectedValue.value }" @click="selectItem(item)">
                    {{ $t(item.label) }}
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.dropdown {
    position: relative;
    display: inline-block;
    width: 40%;
    padding: 12px 8px 8px 8px;
    margin-left: 12px;
}

.dropdown.open {
    border: 1px solid #fff;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    backdrop-filter: blur(30px);
    border-bottom: none;
    border-left: 1px solid #fff;
    border-right: 1px solid #fff;
    border-top: 1px solid #fff;
    /* box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25); */
    background: rgba(217, 217, 217, 0.05);
    box-shadow: 7px 10px 4px 0 rgba(0, 0, 0, 0.25);
}

.dropdown.open .dropdown__menu {
    border: 1px solid #fff;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
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
    font-size: 18px;
    font-weight: 300;
    display: flex;
    gap: 11px;
    align-items: center;
    box-shadow: none;
    background: transparent;
    border: none;
    text-transform: capitalize;
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
    padding: 8px;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.4);
    /* background-color: white; */
    font-size: 18px;
}

.dropdown__item:hover,
.dropdown__item.active {
    /* background-color: #f9f9f9; */
    color: #65BE5D;
}
</style>
