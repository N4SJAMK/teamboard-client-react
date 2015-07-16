import React from 'react/addons';

import Board       from '../../models/board';
import BoardAction from '../../actions/board';

import Dialog           from '../../components/dialog';
import BoardExporter    from '../../components/board-exporter';

import localeMixin  from '../../mixins/locale';
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

    submit(event) {
        event.preventDefault();
        return this.props.onDismiss();
    },
    render() {
        let id = this.props.board.id;

        return (
            <Dialog className="dialog-edit-board"
                    onDismiss={this.props.onDismiss}>
                <section className="dialog-header">
                    {this.locale('EXPORTBOARD_TITLE')}
                </section>
                <section className="dialog-content">
                    <BoardExporter boardID={id} />
                </section>
                <section className="dialog-footer">
                    <button className="btn-primary" onClick={this.submit}>
                        {this.locale('DONEBUTTON')}
                    </button>
                </section>
            </Dialog>
        );
    }
});
