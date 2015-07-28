import React     from 'react/addons';
import Immutable from 'immutable';
import TimeAgo   from 'react-timeago';

import Board       from '../../models/board';
import localeMixin from '../../mixins/locale';

import Dialog     from '../dialog';
import Avatar     from '../avatar';
import Scrollable from './scrollable';

function formatTime(value, unit, suffix) {
	if(unit === 'second') return this.locale('TIME_NOW');

	if(value !== 1) unit = `${unit}s`;

	unit   = this.locale(`TIME_${unit.toUpperCase()}`);
	suffix = this.locale('TIME_SUFFIX');

	return `${value} ${unit} ${suffix}`;
}

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
		members: (props) => {
			if(!props.members instanceof Immutable.List) throw new Error();
		},
		onDismiss: React.PropTypes.func.isRequired
	},

	submit(event) {
		event.preventDefault();

		return this.props.onDismiss();
	},

	renderMembers(members) {
		return members.map((member) => {
			let user = member.get('user');
			let date = member.get('date');

			let name   = user.name || user.username;
			let active = date > new Date(new Date().getTime() - (5 * 60000));

			return (
				<div className={active ? 'member-info-online' : 'member-info-offline'}>
					<Avatar size={32} name={name} isOnline={active}
						imageurl={user.avatar} usertype={user.type} />
					<div className="user-name" title={name}>{name}</div>
					{active ? (
						<div className="user-last-seen">
							<TimeAgo date={date} formatter={formatTime.bind(this)} />
						</div>
					) : null}
				</div>
			);

		});
	},

	render() {
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
								{this.renderMembers(this.props.members.sort((a, b) => b.date - a.date))}
							</section>
						</Scrollable>
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
