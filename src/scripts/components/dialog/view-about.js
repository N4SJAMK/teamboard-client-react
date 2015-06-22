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
			infoGet: 		false,
			clientVersion: 	process.env.VERSION || 'unknown',
    		apiVersion: 	null,
    		imgVersion: 	null
    	}
	},

    componentWillMount(){
    	let token = UserStore.getToken();

    	api.queryApiVersion({ token }).then((res) => {
    		this.state.apiVersion = res.version;
            this.setState({infoGet : true});
    	}, (err) => { this.state.apiVersion = 'Error'; this.setState({infoGet : true}); });
		
    	api.queryImgVersion({ token }).then((res) => {
			this.state.imgVersion = res.version;
            this.setState({infoGet : true});
    	}, (err) => { this.state.imgVersion = 'Error'; this.setState({infoGet : true}); });
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
                    <div className="aboutTable"> 
                        <div className="aboutTableRow">
                            <div className="aboutTableCell-left">Check our homepages:</div>
                            <div className="aboutTableCell">
                                <a target="_blank" href="http://n4sjamk.github.io/">http://n4sjamk.github.io/</a>
                            </div>
                        </div>

                        <div className="aboutTableRow">
                            <div className="aboutTableCell-left">Client version:</div>
                            <div className="aboutTableCell">{this.state.clientVersion}</div>
                        </div>

                        <div className="aboutTableRow">
                            <div className="aboutTableCell-left">API version:</div>
                            <div className="aboutTableCell">{this.state.apiVersion}</div>
                        </div>

                        <div className="aboutTableRow">
                            <div className="aboutTableCell-left">IMG version:</div>
                            <div className="aboutTableCell">{this.state.imgVersion}</div>
                        </div>
                    </div>
                </section>
                <section className="dialog-footer">
                	<button className="btn-primary" onClick={this.close}>
						Done
					</button>
                </section>
            </Dialog>
        );
    }
});
