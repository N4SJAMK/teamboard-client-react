import SettingsStore from '../stores/settings';

/**
 *
 */
export default function() {
	return {
        getInitialState() {
    		return { locale: SettingsStore.getLocale() }
    	},

		componentDidMount() {
            return SettingsStore.addChangeListener(() => {
	            this.setState({ locale: SettingsStore.getLocale() });
	        });
		},

		componentWillUnmount() {
            return SettingsStore.removeChangeListener(() => {
	            this.setState({ locale: SettingsStore.getLocale() });
	        });
		}
	}
}
