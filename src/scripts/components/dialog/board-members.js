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
            <Dialog className="dialog-edit-board"
                    onDismiss={this.props.onDismiss}>
                <section className="dialog-header">
                    Board Members
                </section>
                <section className="dialog-content">

                </section>
                <section className="dialog-footer">
                    <button className="btn-primary" onClick={this.submit}>
                        Done
                    </button>
                </section>
            </Dialog>
        );
    }
});
