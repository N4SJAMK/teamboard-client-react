import React from 'react/addons';

import Board       from '../../models/board';
import BoardAction from '../../actions/board';

import Dialog from '../../components/dialog';

import localeMixin from '../../mixins/locale';

/**
 *
 */
export default React.createClass({
    mixins: [
        React.addons.PureRenderMixin,
        React.addons.LinkedStateMixin,
        localeMixin()
    ],

    propTypes: {
        board: (props) => {
            if(!props.board instanceof Board) throw new Error();
        },
        onDismiss: React.PropTypes.func.isRequired
    },

    remove(event) {
        event.preventDefault();
        BoardAction.delete(this.props.board);
        return this.props.onDismiss();
    },

    dismiss(event) {
        if(event) {
            event.preventDefault();
        }
        return this.props.onDismiss();
    },

    getContentText(){
        if(this.props.board.name) {
            return this.state.translations.REMOVEBOARD_WITHNAME[this.state.locale]
                    .replace('{board_name}', this.props.board.name);
        }

        return this.state.translations.REMOVEBOARD_WITHOUTNAME[this.state.locale];
    },

    render() {
        let remove  = this.remove;
        let dismiss = this.dismiss;

        console.log(this.state);
        return (
            <Dialog className="dialog-remove-board" onDismiss={dismiss}>
                <section className="dialog-header">
                    {this.state.translations.REMOVEBOARD_TITLE[this.state.locale]}
                </section>
                <section className="dialog-content">
                    <p>{this.getContentText()}</p>
                </section>
                <section className="dialog-footer">
                    <button className="btn-neutral" onClick={dismiss}>
                        {this.state.translations.CANCELBUTTON[this.state.locale]}
                    </button>
                    <button className="btn-danger" onClick={remove}>
                        {this.state.translations.REMOVEBOARD_REMOVE[this.state.locale]}
                    </button>
                </section>
            </Dialog>
        );
    }
});
