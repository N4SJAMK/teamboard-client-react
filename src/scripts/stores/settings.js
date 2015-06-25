import flux   from '../utils/flux';
import Action from '../actions';
import Translations from '../translations';
/**
 *
 */
export default flux.store({
	getSetting(name) {
		if(name !== 'locale')
			return JSON.parse(localStorage.getItem(name));
		else return this.getLocale();
	},

	getLocale(){
		if(localStorage.getItem('locale'))
			return Translations[localStorage.getItem('locale')];
		else {
			let match = false;
			for (let language in Translations) {
				if(language === window.navigator.language)
					match = true;
			}
			return !match ? Translations.ru : Translations[window.navigator.language];
		}
	},

	handlers: {
		[Action.Settings.Edit](payload) {
			localStorage.setItem(payload.key, payload.value);
		}
	}
});
