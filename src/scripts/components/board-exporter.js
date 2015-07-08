import React     from 'react';
import UserStore from '../stores/user';

import settingsMixin  from '../mixins/settings';

const Format = {
	CSV:       'csv',
	JSON: 	   'json',
	PLAINTEXT: 'plaintext',
	IMAGE: 	   'image'
}

/**
 *
 */
export default React.createClass({
	mixins: [ settingsMixin() ],

	propTypes: {
		boardID: React.PropTypes.string.isRequired
	},

	getInitialState() {
		return { format: Format.CSV }
	},

	onChange(event) {
		this.setState({ format: event.target.value });
	},

	render() {
		let id    = this.props.boardID;
		let query = `access_token=${UserStore.getToken()}
			&format=${this.state.format}`;

		let apiURL    = process.env.API_URL || 'http://localhost:9002/api';
		let exportURL = `${apiURL}/boards/${id}/export?${query}`;

		return (
			<section className="board-exporter">
				<label>{this.state.locale.EXPORTBOARD_FORMAT}</label>
				<div className="input-group">
					<div className="select">
						<select id={"export-select"} onChange={this.onChange}
								defaultValue={this.state.format}>
							{this.renderFormats()}
						</select>
						<span className="caret fa fa-arrow-down" />
					</div>
					<a className="btn btn-secondary" href={exportURL}
							target="_blank">
						{this.state.locale.EXPORTBOARD_EXPBUTTON}
					</a>
				</div>
			</section>
		);
	},

	renderFormats() {
		return Object.keys(Format).map((key) => {
			return <option key={key} value={Format[key]} id={"export-select-" + key}>{key}</option>;
		});
	}
});
