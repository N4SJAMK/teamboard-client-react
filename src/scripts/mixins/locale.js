import Settings from '../stores/settings';

import Translations from '../translations';

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

        componentDidMount() {
            Settings.addChangeListener(() => {
                this.setState({ locale: Settings.getLocale() })
            });
        },

        componentWillUnmount() {
            Settings.removeChangeListener(() => {
                this.setState({ locale: Settings.getLocale() })
            });
        },

        locale(id) {
            if(!this.state.translations[id]) {
                return id;
            }

            return this.state.translations[id][this.state.locale]
        }
    }
}
