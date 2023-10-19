import { createI18n } from 'vue-i18n';
import * as en from './en.json';
import * as tr from './tr.json';

const langs = {
	en,
	tr,
};

export default createI18n({
	legacy: false,
	locale: 'en',
	globalInjection: true,
	messages: langs,
});
