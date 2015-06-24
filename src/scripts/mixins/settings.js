import Settings from '../stores/settings';

export default function(...settings){
	return {
		componentWillMount() {
			this.settingArray = [];
			settings.forEach((setting) => {
				this.settingArray[setting] = Settings.getSetting(setting);
			});

		}
	}
}
