import React     from 'react/addons';
import TimeAgo   from 'react-timeago';
import Dialog from '../../components/dialog';
/**
 *
 */
export default React.createClass({
    mixins: [ React.addons.PureRenderMixin, React.addons.LinkedStateMixin ],

    propTypes: {
        board: (props) => {
            if(!props.board instanceof Board) throw new Error();
        },
        onDismiss: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
        }
    },

    submit(event) {
        event.preventDefault();

        return this.props.onDismiss();
    },

    render() {
        let board = this.props.board;

        let members = board.members;

        // Dumb hack for immutableJS. We convert the members to a regular JS object
        // if it's an immutableJS, for easier handling later on...
        if(board.members.constructor.name == 'List') {
            members = board.members.toJS();
        }


        /*members.sort(function(x, y) {
            return new Date(y.lastSeen) - new Date(x.lastSeen);
        });*/

        members.sort(function(x, y) {
            return (x.isActive === y.isActive)? 0 : x.isActive? -1 : 1;
        });

        return (
            <Dialog className="dialog-board-members"
                    onDismiss={this.props.onDismiss}>
                <section className="dialog-header">
                    Board members
                </section>
                <section className="dialog-content">
                    <section className="dialog-members">
                        <section className="dialog-member-list">
                            {members.map(function(member) {
                                var name = member.user.username || member.user.name;
                                if(member.isActive === true) {
                                    return (
                                        <div className="member-info-online">
                                            <img src="http://placehold.it/32x32"
                                                 className="profile-picture"></img>

                                            <div className="user-name">
                                                {name}
                                            </div>
                                        </div>
                                    );
                                }
                                else if(member.isActive === false) {
                                    return (
                                        <div className="member-info-offline">
                                            <img src="http://placehold.it/32x32"
                                                 className="profile-picture"></img>
                                            <div className="user-name">
                                                {name}
                                            </div>
                                            <div className="user-last-seen">
                                                Seen {React.createElement(TimeAgo, {date: member.lastSeen})}
                                            </div>
                                        </div>
                                    );
                                }
                            })
                            }
                        </section>
                    </section>
                    <section className="dialog-footer">
                        <button className="btn-primary" onClick={this.submit}>
                            Done
                        </button>
                    </section>
                </section>
            </Dialog>
        );
    }
});
