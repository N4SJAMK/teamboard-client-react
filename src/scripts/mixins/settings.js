import Settings from '../stores/settings';

export default function(...settings){
	return {
		componentWillMount() {
			this.settingArray=new Array();
			settings.forEach((setting) => {
				this.settingArray[setting]=Settings.getSetting(setting)
			});

		}
	}
}