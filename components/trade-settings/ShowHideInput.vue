<script setup lang="ts">
import { useWebAppViewport } from 'vue-tg'
const appViewport = useWebAppViewport()
defineProps<{
    labelText: string;
    inputText: string
}>()

const showPassword = ref(false)
const toggleShow = () => {
    showPassword.value = !showPassword.value;
}

// Функция корректировки отступа для input при появлении клавиатуры
const adjustInputPadding = () => {
    const form = document.querySelector('.control') as HTMLElement;
    if (form) {
        form.style.paddingBottom = window.visualViewport?.height! < appViewport.viewportHeight.value ? "350px" : "0px";
    }
};

onMounted(() => {
    appViewport.onViewportChanged(adjustInputPadding);
    adjustInputPadding();
})

onBeforeUnmount(() => {
    const form = document.querySelector('.control') as HTMLElement;
    if (form) form.style.paddingBottom = "0px";
});
</script>

<template>
    <div class="vps__form-group">
        <label for="hostname">{{ labelText ? labelText : 'label' }}:</label>
        <div class="control">
            <input :type="showPassword ? 'text' : 'password'" class="input" :value="inputText" readonly >

            <button class="vps__form-input-button" @click="toggleShow">
                <span class="icon" :class="{ 'active': !showPassword }">
                    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M1.26387 8.71318C1.12769 8.49754 1.05959 8.38972 1.02147 8.22342C0.992842 8.0985 0.992842 7.9015 1.02147 7.77658C1.05959 7.61028 1.12769 7.50246 1.26387 7.28682C2.38928 5.50484 5.73915 1 10.8442 1C15.9492 1 19.299 5.50484 20.4244 7.28682C20.5606 7.50246 20.6287 7.61028 20.6668 7.77658C20.6955 7.9015 20.6955 8.0985 20.6668 8.22342C20.6287 8.38972 20.5606 8.49754 20.4244 8.71318C19.299 10.4952 15.9492 15 10.8442 15C5.73915 15 2.38928 10.4952 1.26387 8.71318Z"
                            stroke="#B2E500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                            d="M10.8442 11C12.501 11 13.8442 9.65685 13.8442 8C13.8442 6.34315 12.501 5 10.8442 5C9.1873 5 7.84415 6.34315 7.84415 8C7.84415 9.65685 9.1873 11 10.8442 11Z"
                            stroke="#B2E500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </span>
            </button>
        </div>

    </div>
</template>

<style lang="css" scoped>
.vps__form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.vps__form-group .control {
    position: relative;
}

.vps__form-group label {
    font-weight: 300;
    font-size: 12px;
    line-height: 120%;
    color: #fff;
}

.vps__form-input-button {
    position: absolute;
    right: 13px;
    top: 55%;
    transform: translateY(-45%);
    background: transparent;
    border: none;
    box-shadow: none;
}

.vps__form-input-button span img.active {
    opacity: 0.5;
}
</style>