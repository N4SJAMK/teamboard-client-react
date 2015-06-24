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

        return (
            <Dialog className="dialog-board-members"
                    onDismiss={this.props.onDismiss}>
                <section className="dialog-header">
                    Board members
                </section>
                <section className="dialog-content">
                    <section className="dialog-members">
                        <section className="dialog-header">
                            Online
                        </section>
                        <section className="dialog-member-list">
                            {board.members.map(function(member) {
                                return (
                                    <div className="member-info-online">{member.user.username}</div>
                                );
                            })}
                        </section>
                        <section className="dialog-header">
                            Offline
                        </section>
                        <section className="dialog-member-list">

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
