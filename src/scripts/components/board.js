import React     from 'react/addons';
import Hammer    from 'hammerjs';
import immutable from 'immutable';

import gridify   from '../utils/gridify';
import doubletap from '../utils/doubletap';

import Board        from '../models/board';
import Ticket       from '../models/ticket';
import TicketAction from '../actions/ticket';

import TicketComponent from '../components/ticket';
import localeMixin     from '../mixins/locale';

/**
 * TODO Can Scrollable be made into a mixin, and mixed here?
 */
export default React.createClass({
    mixins: [
        localeMixin()
    ],

    propTypes: {
        board: (props) => {
            if(!props.board instanceof Board) throw new Error();
        },
        snap: React.PropTypes.bool
    },

    getDefaultProps() {
        return { snap: false }
    },

    componentDidMount() {
        this.hammer = doubletap(this.getDOMNode());
        this.hammer.on('doubletap', (event) => {
            // We need to take into account the height of the navigation bar.
            event.center.y = event.center.y - 64;

            // Calculate the position to be at the center of the ticket. Since
            // the 'Board' component is wrapped by a 'Scrollable', we receive
            // an 'offset' property.
            // If the user has enabled snapping, we also need to make sure to
            // snap the position to a grid.
            let position = {
                x: (event.center.x - this.props.offset.x) - (Ticket.Width  / 2),
                y: (event.center.y - this.props.offset.y) - (Ticket.Height / 2)
            }
            position = this.props.snap ? gridify(position) : position;

            // Finally we need to clamp the position so that it does not go
            // over the bounds of the board. Note that we need to make sure the
            // board size is in pixel values before clamping.

            let size = {
                width:  this.props.board.size.width  * Ticket.Width,
                height: this.props.board.size.height * Ticket.Height
            }

            position.x = position.x >= 0
                ? ((position.x + Ticket.Width) > size.width
                    ? size.width - Ticket.Width
                    : position.x)
                : 0;
            position.y = position.y >= 0
                ? ((position.y + Ticket.Height) > size.height
                    ? size.height - Ticket.Height
                    : position.y)
                : 0;

            TicketAction.create(this.props.board, { position });
        });
    },

    render() {
        let board         = this.props.board;
        let background    = Board.Background[board.background];
        let backgroundURL = background.url
            ? `url(${background.url})` : '';

        if(background === Board.Background.CUSTOM) {
            backgroundURL = board.customBackground
                ? `url(${board.customBackground})` : '';
        }

        let style = {
            width:           board.size.width  * Ticket.Width,
            height:          board.size.height * Ticket.Height,
            backgroundImage: backgroundURL
        }

        return (
            <div className="board" style={style}>
                {this.renderTickets()}
            </div>
        );
    },

    renderTickets() {
        if(this.props.board.tickets.size === 0) {
            return (
                <div className="board-helper">
                    {this.locale('BOARD_TAP')}
                </div>
            );
        }
        return this.props.board.tickets.map((ticket) => {
            return (
                <TicketComponent key={ticket.id} snap={this.props.snap}
                    board={this.props.board.id} ticket={ticket} />
            );
        });
    }
});
