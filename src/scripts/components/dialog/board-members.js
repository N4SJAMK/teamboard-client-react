import React from 'react/addons';

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
        return (
            <Dialog className="dialog-board-members"
                    onDismiss={this.props.onDismiss}>
                <section className="dialog-header">
                    Board members
                </section>
                <section className="dialog-content">
                    <section className="dialog-members">
                        <section className="dialog-header">
                            Active
                        </section>
                        <section className="dialog-member-list">
                            {(members.filter((member) => member.isActive === true)).map(function(member) {
                                console.log(member.user);
                                return (
                                    <div className="member-info-online">
                                        <img src="http://placehold.it/32x32"
                                             className="profile-picture"></img>
                                        <div className="user-name">
                                            {member.user.username}
                                        </div>
                                    </div>
                                );
                            })
                            }
                        </section>
                        <section className="dialog-header">
                            Away
                        </section>
                        <section className="dialog-member-list">
                            {(members.filter((member) => member.isActive === false)).map(function(member) {
                                console.log(member.user);
                                return (
                                    <div className="member-info-online">
                                        <img src="http://placehold.it/32x32"
                                             className="profile-picture"></img>
                                        <div className="user-name">
                                            {member.user.username}
                                        </div>
                                    </div>
                                );
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
