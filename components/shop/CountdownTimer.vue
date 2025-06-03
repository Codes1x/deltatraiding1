<script setup>
import { ref, computed, onMounted, onUnmounted, defineEmits } from 'vue';

const props = defineProps({
    duration: { type: Number, required: true },
    productId: { type: [Number, String], default: null }
});

const emit = defineEmits(['finished']);

const timeLeft = ref(props.duration);
const timer = ref(null);
const isFinished = ref(false);

// Setup process stages
const setupStages = ref([
    { id: 1, name: 'Создание торговой системы', completed: false, inProgress: true },
    { id: 2, name: 'Проверка данных для подключения к биржевому счету', completed: false, inProgress: false },
    { id: 3, name: 'Запуск VPS и торговой системы', completed: false, inProgress: false }
]);

const currentStage = ref(1);
const setupCompleted = ref(false);

// Percentage of total completion
const percentage = computed(() => ((props.duration - timeLeft.value) / props.duration) * 100);

// Format time as MM:SS
const formattedTime = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60).toString().padStart(2, '0');
    const seconds = (timeLeft.value % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
});

// Handle stage transitions based on timer
const updateStages = () => {
    // First stage: 0-33% of time
    if (percentage.value >= 0 && percentage.value < 33 && currentStage.value === 1) {
        setupStages.value[0].inProgress = true;
    } 
    // Complete first stage and start second: 33-66% of time
    else if (percentage.value >= 33 && percentage.value < 66 && currentStage.value === 1) {
        setupStages.value[0].completed = true;
        setupStages.value[0].inProgress = false;
        setupStages.value[1].inProgress = true;
        currentStage.value = 2;
    } 
    // Complete second stage and start third: 66-100% of time
    else if (percentage.value >= 66 && percentage.value < 100 && currentStage.value === 2) {
        setupStages.value[1].completed = true;
        setupStages.value[1].inProgress = false;
        setupStages.value[2].inProgress = true;
        currentStage.value = 3;
    }
};

const navigateToRobot = () => {
    if (props.productId) {
        navigateTo(`/trade/robot?id=${props.productId}`);
    } else {
        navigateTo('/trade');
    }
};

const start = () => {
    if (timer.value || isFinished.value) return;
    timer.value = setInterval(() => {
        if (timeLeft.value > 0) {
            timeLeft.value--;
            updateStages();
        } else {
            clearInterval(timer.value);
            timer.value = null;
            isFinished.value = true;
            
            // Complete all stages when timer finishes
            setupStages.value.forEach(stage => {
                stage.completed = true;
                stage.inProgress = false;
            });
            setupCompleted.value = true;
            
            // Emit event but don't navigate immediately - let user see the success screen
            emit('finished', props.productId);
        }
    }, 1000);
};

onMounted(start);

onUnmounted(() => {
    if (timer.value) clearInterval(timer.value);
});
</script>

<template>
    <div class="setup-container">
        <!-- Header section -->
        <div class="setup-header">
            <h2>Настройка</h2>
        </div>

        <!-- Loading section with timer (shown during countdown) -->
        <div v-if="!setupCompleted" class="setup-loading">
            <div class="progress-bar-container">
                <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: `${percentage}%` }"/>
                </div>
                <span class="timer">{{ formattedTime }}</span>
            </div>
            <p class="setup-description">
                Настраиваем вашу торговую систему, проверяем данные от счета и создаем VPS сервер.
                <br>Этот процесс может занять минуту или больше.
            </p>
        </div>

        <!-- Progress stages list -->
        <div class="setup-stages">
            <div 
                v-for="stage in setupStages" 
                :key="stage.id" 
                class="stage-item"
                :class="{
                    'stage-completed': stage.completed,
                    'stage-in-progress': stage.inProgress && !stage.completed
                }"
            >
                <!-- Status icon (spinner, checkmark, or pending) -->
                <div class="stage-icon">
                    <div v-if="stage.completed" class="icon-check">✓</div>
                    <div v-else-if="stage.inProgress" class="icon-spinner"/>
                    <div v-else class="icon-pending"/>
                </div>
                <span class="stage-name">{{ stage.name }}</span>
            </div>
        </div>

        <!-- Success message (shown after completion) -->
        <div v-if="setupCompleted" class="setup-success">
            <div class="success-icon">
                <div class="checkmark">✓</div>
            </div>
            <h3>Поздравляем! Активация Торговой системы прошла успешно</h3>
            <button class="success-button" @click="navigateToRobot">
                Мои Торговые Системы
            </button>
        </div>
    </div>
</template>

<style scoped>
.setup-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 20px;
    color: #fff;
    background-color: #171d25;
}

.setup-header {
    text-align: center;
    margin-bottom: 20px;
}

.setup-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-bottom: 30px;
}

.setup-loading p {
    margin: 10px 0;
    color: #d9d9d9;
    text-align: center;
}

.progress-bar-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 15px 0;
    padding: 0 15px;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background-color: #2a2e39;
    border-radius: 4px;
    overflow: hidden;
    max-width: 280px;
}

.progress-fill {
    height: 100%;
    background-color: #95b71d;
    transition: width 0.3s ease;
}

.timer {
    margin-top: 8px;
    font-size: 14px;
    color: #d9d9d9;
}

.setup-description {
    text-align: center;
    font-size: 14px;
    color: #a0a0a0;
    line-height: 1.5;
    padding: 0 15px;
}

.setup-stages {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 10px;
    width: 100%;
}

.stage-item {
    display: flex;
    align-items: center;
    gap: 15px;
}

.stage-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #2a2e39;
}

.icon-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top-color: #95b71d;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.icon-check {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: #95b71d;
    border-radius: 50%;
    color: #fff;
    font-size: 14px;
}

.icon-pending {
    width: 8px;
    height: 8px;
    background-color: #666;
    border-radius: 50%;
}

.stage-name {
    font-size: 14px;
    color: #d9d9d9;
}

.stage-completed .stage-name {
    color: #95b71d;
}

.stage-in-progress .stage-name {
    color: #fff;
    font-weight: 500;
}

.setup-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    text-align: center;
    width: 100%;
}

.success-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: rgba(149, 183, 29, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
}

.checkmark {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #95b71d;
    color: #fff;
    font-size: 32px;
}

.success-button {
    margin-top: 25px;
    padding: 12px 24px;
    background-color: transparent;
    border: 1px solid #95b71d;
    border-radius: 8px;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.success-button:hover {
    background-color: rgba(149, 183, 29, 0.2);
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>