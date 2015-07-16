import React      from 'react/addons';
import TimeAgo    from 'react-timeago';

import Board       from '../../models/board';
import localeMixin from '../../mixins/locale';

import Dialog     from '../dialog';
import Avatar     from '../avatar';
import Scrollable from './scrollable';

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
        }
    },

    submit(event) {
        event.preventDefault();

        return this.props.onDismiss();
    },

    render() {
        let board = this.props.board;
        let members = board.members.sort(function(x, y) {
            return new Date(y.lastSeen) - new Date(x.lastSeen);
        });

        members = members.sort(function(x, y) {
            return (x.isActive === y.isActive)? 0 : x.isActive? -1 : 1;
        });

        let timeFormatter = ((value, unit, suffix) => {
            if(value !== 1) {
                unit = `${unit}s`;
            }

            unit = this.locale(`TIME_${unit.toUpperCase()}`);
            suffix = this.locale('TIME_SUFFIX');

            return `${value} ${unit} ${suffix}`;
        });

        return (
            <Dialog className="dialog-board-members"
                    onDismiss={this.props.onDismiss}>

                <section className="dialog-header">
                    {this.locale('BOARDMEMBERS_TITLE')}
                </section>
                <section className="dialog-content">
                    <section className="dialog-members">
                        <Scrollable>
                            <section className="dialog-member-list">
                                {
                                    members.map(function(member) {
                                        // Sort of dumb fix for user sometimes being a Map
                                        // instead of a Record. Should investigate further...
                                        let user        = member.get('user').toJS();
                                        let name        = user.username || user.name;
                                        let isActive    = member.get('isActive');
                                        let avatarURL   = user.avatar;
                                        let userRole    = member.get('role');

                                        return (
                                            <div className={isActive ? "member-info-online" : "member-info-offline" }>
                                                <Avatar size={32} name={name}
                                                            imageurl={avatarURL}
                                                            usertype={userRole}
                                                            isOnline={isActive}>
                                                </Avatar>
                                                <div className="user-name" title={name}>
                                                    {name}
                                                </div>
                                                {
                                                    !isActive ?
                                                    (
                                                        <div className="user-last-seen">
                                                            <TimeAgo date={member.get('lastSeen')}
                                                                     formatter={timeFormatter} />
                                                        </div>
                                                    ) :
                                                    null
                                                }
                                            </div>
                                        );
                                    })
                                }
                            </section>
                        </Scrollable>
                    </section>
                    <section className="dialog-footer">
                        <button className="btn-primary" onClick={this.submit}>
                            {this.locale('DONEBUTTON')}
                        </button>
                    </section>
                </section>
            </Dialog>
        );
    }
});
