import React   from 'react/addons';
import Board   from '../models/board';
import Minimap from './minimap';

/**
 *
 */
export default React.createClass({
	mixins: [ React.addons.PureRenderMixin ],

	propTypes: {
		background: React.PropTypes.shape({
			value:         React.PropTypes.string.isRequired,
			requestChange: React.PropTypes.func.isRequired
		}).isRequired,
		customBackground: React.PropTypes.shape({
			value:         React.PropTypes.string,
			requestChange: React.PropTypes.func.isRequired
		}).isRequired
	},

	onChange(event) {
		this.props.background.requestChange(event.target.value);
	},

	render() {
		let background    = Board.Background[this.props.background.value];
		let backgroundURL = background.url;

		let customBackgroundInput = null;
		if(background === Board.Background.CUSTOM) {
			customBackgroundInput = (
				<div className="custom-background-url">
					<label htmlFor="board-custom-background">URL</label>
					<input type="url" name="board-custom-background"
						placeholder="URL"
						valueLink={this.props.customBackground} />
				</div>
			);
			backgroundURL = this.props.customBackground.value;
		}

		return (
			<div className="background-select">
				<label>{this.state.locale.EDITBOARD_BOARDBG}</label>
				<div className="select" id={"background-select"}>
					<select onChange={this.onChange}
							defaultValue={this.props.background.value}>
						{this.renderOptions()}
					</select>
					<span className="caret fa fa-arrow-down"></span>
				</div>
				{customBackgroundInput}
			</div>
		);
	},

	renderOptions: function() {
		return Object.keys(Board.Background).map(function(key) {
			return (
				<option key={key} value={key} id={`background-select-${key}`}>
					{Board.Background[key].description}
				</option>
			);
		});
	}
});
