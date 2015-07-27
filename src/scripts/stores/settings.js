import flux   from '../utils/flux';
import Action from '../actions';

/**
 *
 */
export default flux.store({
	getSetting(name) {
		return JSON.parse(localStorage.getItem(name));
	},

	checkLocale(locale) {
		// Return only valid locales
		if([ 'en', 'fi', 'se', 'ru', 'dk', 'jp' ].indexOf(locale) === -1) {
			return 'en';
		}
		return locale;
	},

	getLocale() {
		if(localStorage.getItem('locale')) {
			return this.checkLocale(localStorage.getItem('locale'));
		} else {
			let locale = this.checkLocale(window.navigator.userLanguage || navigator.language)

			localStorage.setItem('locale', locale);

			return locale;

		}
	},

	handlers: {
		[Action.Settings.Edit](payload) {
			localStorage.setItem(payload.key, payload.value);
		}
	}
});
