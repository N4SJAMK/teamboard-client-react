import flux   from '../utils/flux';
import Action from '../actions';

import Translations from '../translations';

/**
 *
 */
export default flux.store({
	getSetting(name) {
		return JSON.parse(localStorage.getItem(name));
	},

	getLocale() {
		if(localStorage.getItem('locale')) {
			return Translations[localStorage.getItem('locale')];
		} else {
			let locale = window.navigator.userLanguage || navigator.language

			// Fix invalid locale codes here
			switch(locale) {
				case 'fi': {break;}
				case 'se': {break;}
				case 'ru': {break;}
				default  : {locale = 'en';}
			}

			localStorage.setItem('locale', locale);

			return Translations[locale];
		}
	},

	handlers: {
		[Action.Settings.Edit](payload) {
			localStorage.setItem(payload.key, payload.value);
		}
	}
});
