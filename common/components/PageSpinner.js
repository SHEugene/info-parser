const React = require('react');

class PageSpinner extends React.Component {
	render () {
		return (
			<div className={'css-spinner--wrapper' + (this.props.centered ? ' css-spinner--wrapper-centered' : '')} style={this.props.style}>
				<div className='css-spinner--spinner'>
					<div className='css-spinner--double-bounce1' />
					<div className='css-spinner--double-bounce2' />
				</div>
			</div>
		);
	}
}
PageSpinner.propTypes = {
	centered: React.PropTypes.bool
};
PageSpinner.defaultProps = {
	centered: false
};

module.exports = PageSpinner;
