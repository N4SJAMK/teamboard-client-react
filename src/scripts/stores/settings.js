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
            return localStorage.getItem('locale');
        } else {
            let locale = window.navigator.userLanguage || navigator.language

            // Fix invalid locale codes here
            if(!(locale in ['en', 'fi', 'se', 'ru'])) {
                locale = 'en';
            }

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
