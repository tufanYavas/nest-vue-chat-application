import { createI18n } from 'vue-i18n';
import * as en from './en.json';
import * as tr from './tr.json';

const defaultLang = 'en';
const langs = {
	en,
	tr,
};

const i18n = createI18n({
	legacy: false,
	locale: defaultLang,
	globalInjection: true,
	messages: langs,
});

type languages = keyof typeof langs;

const userLanguage: languages = (navigator.language || navigator.userLanguage).substring(0, 2) as languages;
const language = i18n.global.availableLocales.includes(userLanguage) ? userLanguage : defaultLang;
i18n.global.locale.value = language;
export default i18n;
