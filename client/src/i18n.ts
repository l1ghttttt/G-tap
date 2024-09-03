import translationEN from "./locales/en.json";
import translationRU from "./locales/ru.json";
import i18next from "i18next";
import {initReactI18next} from "react-i18next";

// @ts-ignore
const tg = window["Telegram"]['WebApp'];

const currentLang = tg?.initDataUnsafe?.user?.language_code !== 'ru' ? 'en' : 'ru';

//console.log('дефолтный язык: ', currentLang);

const resources = {
    en: {
        translation: translationEN,
    },
    ru: {
        translation: translationRU,
    },
};

i18next
    .use(initReactI18next)
    .init({
        resources,
        lng: currentLang,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    })

export default i18next