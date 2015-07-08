import React	 from 'react/addons';
import Dialog	 from '../../components/dialog';
import UserStore from '../../stores/user';
import api		 from '../../utils/api';

import settingsMixin  from '../../mixins/settings';

export default React.createClass({
    mixins: [ settingsMixin() ],

    propTypes: {
        onDismiss: React.PropTypes.func.isRequired
    },

    getInitialState() {
	return {
        infoReceived:   false,
        clientVersion:  process.env.VERSION || 'unknown',
        apiVersion:     null,
        imgVersion:     null
        }
    },

    componentWillMount(){
        let token = UserStore.getToken();

        api.queryApiVersion({ token }).then((res) => {
            this.state.apiVersion = res.version || 'unknown';
            this.setState({infoReceived : true});
        }, (err) => {
            this.state.apiVersion = 'error';
            this.setState({infoReceived : true});
        });

        api.queryImgVersion({ token }).then((res) => {
        this.state.imgVersion = res.version || 'unknown';
            this.setState({infoReceived : true});
        }, (err) => {
            this.state.imgVersion = 'error';
            this.setState({infoReceived : true});
        });
    },

    shouldComponentUpdate(){
        if(!this.state.apiVersion || !this.state.imgVersion){
            return false;
        }
        return true;
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
                    {this.state.locale.ABOUT_TITLE}
                </section>
                <section className="dialog-content">
                    <div className="description-area">
                        {this.state.locale.ABOUT_ABOUT}
                    </div>
                    <hr className="divider" />
                    <div className="aboutTable">
                        <div className="aboutTableRow">
                            <div className="aboutTableCell-left">{this.state.locale.ABOUT_DEVS}</div>
                            <div className="aboutTableCell">
                                <a target="_blank" href="http://n4sjamk.github.io/">n4sjamk.github.io</a>
                            </div>
                        </div>
                        <div className="aboutTableRow">
                            <div className="aboutTableCell-left">{this.state.locale.ABOUT_HOMEPAGE}</div>
                            <div className="aboutTableCell">
                                <a target="_blank" href="http://n4sjamk.github.io/contriboard">n4sjamk.github.io/contriboard</a>
                            </div>
                        </div>
                    </div>
                    <div className="versionTable">
                        <div className="versionTableRow">
                            <div className="versionTableCell-left">{this.state.locale.ABOUT_CLIENT}</div>
                            <div className="versionTableCell">{this.state.clientVersion}</div>
                        </div>
                        <div className="versionTableRow">
                            <div className="versionTableCell-left">{this.state.locale.ABOUT_API}</div>
                            <div className="versionTableCell">{this.state.apiVersion}</div>
                        </div>
                        <div className="versionTableRow">
                            <div className="versionTableCell-left">{this.state.locale.ABOUT_IMG}</div>
                            <div className="versionTableCell">{this.state.imgVersion}</div>
                        </div>
                    </div>
                </section>
                <section className="dialog-footer">
                    <button className="btn-primary" onClick={this.close}>
						{this.state.locale.CLOSEBUTTON}
					</button>
                </section>
            </Dialog>
        );
    }
});
