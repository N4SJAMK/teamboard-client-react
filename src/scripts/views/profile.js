import page  from 'page';
import React from 'react/addons';
import User  from '../models/user';
import Board from '../models/board';

import UserStore     from '../stores/user';
import BoardStore    from '../stores/board';
import SettingsStore from '../stores/settings';

import BoardAction    from '../actions/board';
import TicketAction   from '../actions/ticket';
import SettingsAction from '../actions/settings';

import listener from '../mixins/listener';

import Control         from '../components/control';
import Scrollable      from '../components/scrollable';
import Navigation      from '../components/navigation';
import Broadcaster     from '../components/broadcaster';
import BoardComponent  from '../components/board';

import EditBoardDialog   from '../components/dialog/edit-board';
import ExportBoardDialog from '../components/dialog/export-board.js';
import ShareBoardDialog  from '../components/dialog/share-board';

/**
 * Fix issues with iOS and IScroll not working together too well...
 */
function preventDefault(event) {
    return event.preventDefault();
}

/**
 *
 */
export default React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        user: (props) => {
            if(!props.user instanceof User) throw new Error();
        }
    },

    mixins: [
        listener(UserStore)
    ],

    onChange() {
        return this.setState(this.getState());
    },

    getState() {
        return {
            user: UserStore.getUser()
        }
    },

    componentDidMount() {
        BoardAction.load(this.props.id);
        document.addEventListener('touchmove', preventDefault);
    },

    componentWillUnmount() {
        document.removeEventListener('touchmove', preventDefault);
    },

    render() {
        return (
            <div className="view view-profile">
                <Broadcaster />
                <Navigation showHelp={false} title={this.state.user.username} />
                <div className="content">
                    <Scrollable>
                    </Scrollable>
                </div>
            </div>
        );
    }
});
