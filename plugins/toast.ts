import { defineNuxtPlugin } from '#app';
import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(Toast, {
        position: POSITION.BOTTOM_RIGHT,
        timeout: 3000,
        maxToasts: 1, // Ограничиваем количество одновременно отображаемых уведомлений
        closeOnClick: true,
        pauseOnFocusLoss: false,
        pauseOnHover: false,
        transition: "Vue-Toastification__fade",
        toastDefaults: {
            // Настройки для всех уведомлений
            success: {
                style: { fontSize: '14px', maxWidth: '250px', padding: '8px' }
            },
            error: {
                style: { fontSize: '14px', maxWidth: '250px', padding: '8px', background: '#ff4d4f', color: 'white' }
            }
        }
    });
});
