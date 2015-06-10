import page  from 'page';
import React from 'react/addons';
import User  from '../models/user';

import UserStore     from '../stores/user';

import Navigation      from '../components/navigation';
import Broadcaster     from '../components/broadcaster';

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
