<script setup>
import { ref } from "vue";

const props = defineProps({
    modelValue: {
        type: String,
        required: true,
    },
    options: {
        type: Array,
        required: true,
    },
    name: {
        type: String,
        required: true,
    }
});

const emit = defineEmits(["update:modelValue"]);

const onChange = (value) => {
    emit("update:modelValue", value);
};
</script>

<template>
    <div class="payment-method">
        <label v-for="option in options" :key="option.value">
            <input type="radio" :name="name" :value="option.value" :checked="modelValue === option.value"
                @change="onChange(option.value)" >
            <span>{{ option.label }}</span>
        </label>
    </div>
</template>

<style lang="css">
.payment-method {
    margin: 1rem auto;
    display: flex;
    gap: 1rem;
    justify-content: start;
}

.payment-method label {
    display: flex;
}
</style>