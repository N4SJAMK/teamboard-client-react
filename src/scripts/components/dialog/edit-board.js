import React from 'react/addons';

import Board       from '../../models/board';
import BoardAction from '../../actions/board';

import Dialog           from '../../components/dialog';
import BackgroundSelect from '../../components/background-select';
import Minimap          from '../../components/minimap'

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

    getInitialState() {
        return {
            name:             this.props.board.name,
            background:       this.props.board.background,
            customBackground: this.props.board.customBackground,
            width:            this.props.board.size.width,
            height:           this.props.board.size.height
        }
    },

    submit(event) {
        event.preventDefault();

        let size = {
            width: this.state.width,
            height: this.state.height
        };

        let updatePayload = {
            id: this.props.board.id,
            name: this.state.name,
            background: this.state.background,
            customBackground: this.state.customBackground
        }

        if (!isNaN(size.width) && !isNaN(size.height)) {
            if (size.width < 1 || size.height < 1) {
                size.width = this.props.board.size.width;
                size.height = this.props.board.size.height;
            }
            updatePayload.size = size;
        }

        BoardAction.update(updatePayload);
        return this.props.onDismiss();
    },

    render() {
        let board = this.props.board;

        if(this.state.width !== "" && this.state.height !== "") {
            board = this.props.board.set('size',
                new Board.Size({width: this.state.width, height: this.state.height}));
        }

        if(this.state.background) {
            board = board.set('background', this.state.background);
        }

        if(this.state.customBackground && this.state.background === "CUSTOM") {
            board = board.set('customBackground', this.state.customBackground);
        }

        let widthValueLink = {
            value: this.state.width,
            requestChange: (val) => {

                let reg = new RegExp('^[1-9]+[0-9]*$');

                if((reg.test(val) || val === "") && val.length <= 2) {
                    this.setState({width: val});
                }
            }
        }

        let heightValueLink = {
            value: this.state.height,
            requestChange: (val) => {

                let reg = new RegExp('^[1-9]+[0-9]*$');

                if ((reg.test(val) || val === "") && val.length <= 2) {
                    this.setState({height: val});
                }
            }
        }
        return (
            <Dialog className="dialog-edit-board"
                    onDismiss={this.props.onDismiss}>
                <section className="dialog-header">
                    {this.locale('EDITBOARD_TITLE')}
                </section>
                <section className="dialog-content dialog-content-board">

                    <label htmlFor="board-name">
                        {this.locale('EDITBOARD_NAME')}
                    </label>
                    <input name="board-name"
                           placeholder={this.locale('EDITBOARD_NAME')}
                           valueLink={this.linkState('name')} autoFocus={true} />
                    <div className="preview-container">
                        <Minimap
                            board={board}
                            isTicketSized={true} />
                    </div>

                    <label htmlFor="board-background">
                        {this.locale('EDITBOARD_BACKGROUND')}
                    </label>
                    <BackgroundSelect
                        name="board-background"
                        background={this.linkState('background')}
                        customBackground={this.linkState('customBackground')} />

                    <label htmlFor="dialog-size-wrapper">
                        {this.locale('EDITBOARD_SIZE')}
                    </label>
                    <section className="dialog-size-wrapper">
                        <section className="dialog-size">
                                <label htmlFor="board-width">
                                    {this.locale('EDITBOARD_WIDTH')}
                                </label>
                                <input name="board-width"
                                    placeholder="Board Width"
                                    valueLink={widthValueLink}
                                    type="number"
                                    max="99"
                                    min="1" />
                        </section>

                        <section className="times-wrapper">
                            <i className="fa fa-times"></i>
                        </section>

                        <section className="dialog-size">
                            <label htmlFor="board-height">
                                {this.locale('EDITBOARD_HEIGHT')}
                            </label>
                            <input name="board-height"
                                   placeholder="Board Height"
                                   valueLink={heightValueLink}
                                   type="number"
                                   max="99"
                                   min="1" />
                        </section>
                </section>

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
