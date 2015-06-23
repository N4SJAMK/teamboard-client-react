import React 		from 'react/addons';
import Dialog 		from '../../components/dialog';
import UserStore    from '../../stores/user';
import api  		from '../../utils/api';

export default React.createClass({
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
            this.state.apiVersion = res.version  || 'unknown';
            this.setState({infoReceived : true});
    	}, (err) => { 
            this.state.apiVersion = 'error'; 
            this.setState({infoReceived : true}); 
        });
		
    	api.queryImgVersion({ token }).then((res) => {
			this.state.imgVersion = res.version || 'unknown';
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
       	return(
            <Dialog className="dialog-about"
                    onDismiss={this.props.onDismiss}>
                <section className="dialog-header">
                    About Contriboard
                </section>
                <section className="dialog-content">
                    <div className="description-area">
                        Fast open-source brainstorming tool for everyone.
                    </div>
                    <hr className="divider" />
                    <div className="aboutTable">
                        <div className="aboutTableRow">
                            <div className="aboutTableCell-left">Developers:</div>
                            <div className="aboutTableCell">
                                <a target="_blank" href="http://n4sjamk.github.io/">n4sjamk.github.io</a>
                            </div>
                        </div>
                        <div className="aboutTableRow">
                            <div className="aboutTableCell-left">Contriboard homepage:</div>
                            <div className="aboutTableCell">
                                <a target="_blank" href="http://n4sjamk.github.io/contriboard">n4sjamk.github.io/contriboard</a>
                            </div>
                        </div>
                    </div>
                    <div className="versionTable">
                        <div className="versionTableRow">
                            <div className="versionTableCell-left">Client version:</div>
                            <div className="versionTableCell">{this.state.clientVersion}</div>
                        </div>
                        <div className="versionTableRow">
                            <div className="versionTableCell-left">API version:</div>
                            <div className="versionTableCell">{this.state.apiVersion}</div>
                        </div>
                        <div className="versionTableRow">
                            <div className="versionTableCell-left">IMG version:</div>
                            <div className="versionTableCell">{this.state.imgVersion}</div>
                        </div>
                    </div>
                </section>
                <section className="dialog-footer">
                	<button className="btn-primary" onClick={this.close}>
						Close
					</button>
                </section>
            </Dialog>
        );
    }
});
