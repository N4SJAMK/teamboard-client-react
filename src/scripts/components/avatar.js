import React     from 'react/addons';

const bgcolors = {
	guest: '#221a26',
	user:   [
			'#eb584a',
			'#5A3866',
			'#4F819A',
			'#DCC75B'
			]
}

export default React.createClass({
	propTypes: {
		size:     React.PropTypes.number.isRequired,
		name:     React.PropTypes.string,
		imageurl: React.PropTypes.string,
		usertype: React.PropTypes.string,
		isOnline: React.PropTypes.bool.isRequired
	},

	getDefaultProps() {
		return { name: '', imageurl: '', usertype: 'temporary' }
	},

	render() {
		let initials        = null;
		let backgroundColor = null;
		let backgroundURL   = null;
		let fontSize        = null;
		let avatarClass     = null;

		if(!this.props.imageurl) {
			// If name has a space, it's probably in the form of Firstname Lastname
			// then we take the actual initials of the user's name.
			if (this.props.name.includes(' ')) {
				let initialsArray = this.props.name.split(' ');
				initials = initialsArray[0].charAt(0).toUpperCase() + initialsArray[1].charAt(0).toUpperCase();
			} else {
				initials = this.props.name.substring(0, 2).toUpperCase();
			}
			fontSize = this.props.size * 0.55;
			if (this.props.usertype === 'guest' || this.props.usertype === 'temporary') {
				backgroundColor = bgcolors.guest;
			} else {
				// Background color is determined by modulo of the initials char colors
				if (initials.charCodeAt(1)) {
					backgroundColor = bgcolors.user[(initials.charCodeAt(0) + initials.charCodeAt(1)) % 4];
				} else {
					backgroundColor = bgcolors.user[initials.charCodeAt(0) % 4];
				}
			}
		} else {
			backgroundURL = `url('${this.props.imageurl}')`;
		}

		if (!this.props.isOnline) {
			avatarClass = 'avatar offline';
		} else {
			avatarClass = 'avatar online';
		}

		let style = {
			width:           this.props.size,
			height:          this.props.size,
			lineHeight:      this.props.size + 'px',
			fontSize:        fontSize + 'px',
			backgroundColor: backgroundColor,
			backgroundImage: backgroundURL
		}

		return (
			<div className={avatarClass} style={style} id={`avatar-${this.props.size}`}>
				{initials}
			</div>
		);
	}
});
