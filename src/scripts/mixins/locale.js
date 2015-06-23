import Settings from '../stores/settings';

export default function(...settings){
	return {
		componentDidMount() {
			this.settingArray=new Array();
			return settings.forEach((setting) => {
				this.settingArray[setting]=Settings.getSetting(setting)
			});
		}
	}
}