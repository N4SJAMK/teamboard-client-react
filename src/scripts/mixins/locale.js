import Settings      from '../stores/settings';
import Translations  from '../translations';
/**
 *
 */
export default function() {
	return {
		getInitialState() {
			return {
				locale: Settings.getLocale(),
				translations: Translations
			}
		},

		onLocaleChange() {
			this.setState({ locale: Settings.getLocale() });
		},

		componentDidMount() {
			Settings.addChangeListener(this.onLocaleChange);
		},

		componentWillUnmount() {
			Settings.removeChangeListener(this.onLocaleChange);
		},

		locale(id) {
			// If translation for text is not found return ID
			// this fixes localization if text is localized twice for some reason
			if(!this.state.translations[id]) {
				return id;
			}

			// If translation is undefined or empty
			if(!this.state.translations[id][this.state.locale] ||
				this.state.translations[id][this.state.locale] === '') {

				// In production mode return english translation
				if(process.NODE_ENV === 'production') {
					return this.state.translations[id]['en'];
				}

				// In development return ID
				return id;
			}

			return this.state.translations[id][this.state.locale];
		}
	}
}
