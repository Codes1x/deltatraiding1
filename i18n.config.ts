import en from './lang/en.json'
import ru from './lang/ru.json'
export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'ru',
    messages: {
        ru, en
    }
}));