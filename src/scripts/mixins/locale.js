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
        }
    }
}
