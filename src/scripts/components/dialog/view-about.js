import React	    from 'react/addons';
import Dialog	    from '../../components/dialog';
import UserStore    from '../../stores/user';
import api		    from '../../utils/api';
import localeMixin  from '../../mixins/locale';

export default React.createClass({
	mixins: [
		localeMixin()
	],

	getInitialState() {
		return {
			clientVersion: process.env.VERSION || 'unknown',
			apiVersion:    null,
			imgVersion:    null
		}
	},

	componentWillMount(){
		let token = UserStore.getToken();

		if(this.state.clientVersion === 'unknown') {
			this.setState({
				clientVersion: this.locale('ABOUT_UNKNOWN')
			});
		}

		api.queryApiVersion({ token }).then((res) => {
			let api = res.version;
			if(api === 'unknown') {
				api = this.locale('ABOUT_UNKNOWN');
			}
			if(api === 'error') {
				api = this.locale('ABOUT_ERROR');
			}
			this.setState({
				apiVersion: api
			});
		}, (err) => {
			this.setState({
				apiVersion: this.locale('ABOUT_ERROR')
			});
		});

		api.queryImgVersion({ token }).then((res) => {
			let img = res.version;
			if(img === 'unknown') {
				img = this.locale('ABOUT_UNKNOWN');
			}
			if(img === 'error') {
				img = this.locale('ABOUT_ERROR');
			}
			this.setState({
				imgVersion: img
			});
		}, (err) => {
			this.setState({
				imgVersion: this.locale('ABOUT_ERROR')
			});
		});
	},

	close(event) {
		event.preventDefault();
		return this.props.onDismiss();
	},

	render() {
		return (
			<Dialog className="dialog-about"
					onDismiss={this.props.onDismiss}>
				<section className="dialog-header">
					{this.locale('ABOUT_TITLE')}
				</section>
				<section className="dialog-content">
					<div className="description-area">
						{this.locale('ABOUT_DESCRIPTION')}
					</div>
					<hr className="divider" />
					<div className="aboutTable">
						<div className="aboutTableRow">
							<div className="aboutTableCell-left">
								{this.locale('ABOUT_DEVELOPERS')}
							</div>
							<div className="aboutTableCell">
								<a target="_blank" href="http://n4sjamk.github.io/">
									n4sjamk.github.io
								</a>
							</div>
						</div>
						<div className="aboutTableRow">
							<div className="aboutTableCell-left">
								{this.locale('ABOUT_HOMEPAGE')}
							</div>
							<div className="aboutTableCell">
								<a target="_blank" href="http://n4sjamk.github.io/contriboard">
									n4sjamk.github.io/contriboard
								</a>
							</div>
						</div>
					</div>
					<div className="versionTable">
						<div className="versionTableRow">
							<div className="versionTableCell-left">
								{this.locale('ABOUT_CLIENT')}
							</div>
							<div className="versionTableCell">{this.state.clientVersion}</div>
						</div>
						<div className="versionTableRow">
							<div className="versionTableCell-left">
								{this.locale('ABOUT_API')}
							</div>
							<div className="versionTableCell">{this.state.apiVersion}</div>
						</div>
						<div className="versionTableRow">
							<div className="versionTableCell-left">
								{this.locale('ABOUT_IMG')}
							</div>
							<div className="versionTableCell">{this.state.imgVersion}</div>
						</div>
					</div>
				</section>
				<section className="dialog-footer">
					<button className="btn-primary" onClick={this.close}>
						{this.locale('CLOSEBUTTON')}
					</button>
				</section>
			</Dialog>
		);
	}
});
