import React from 'react/addons';

import Dialog from '../../components/dialog';

export default React.createClass({
    propTypes: {
        onDismiss: React.PropTypes.func.isRequired
    },

    render() {

        return (
            <Dialog className="dialog-edit-board"
                    onDismiss={this.props.onDismiss}>
                <section className="dialog-header">
                    About Contriboard
                </section>
                <section className="dialog-content">
                	<p> asd </p>
                </section>
                <section className="dialog-footer">
                </section>
            </Dialog>
        );
    }
});
