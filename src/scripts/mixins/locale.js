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
			if(!this.state.translations[id]) {
				return id;
			}

			return this.state.translations[id][this.state.locale]
		}
	}
}
