import React     from 'react/addons';


const colors = {
    guest: '#000000'
}

export default React.createClass({
    propTypes: {
        size:     React.PropTypes.number,
        name:     React.PropTypes.string,
        imageurl: React.propTypes.string
    },

    render() {
        return (
            <div className="user-voice-trigger">
                {this.props.children}
            </div>
        );
    }
});
