const React = require('react');

class Select extends React.Component {
	renderOption (option, index) {
		return (
			<option key={index} value={option.value}>
				{option.label}
			</option>
		);
	}
	render () {
		return (
			<select
				className={this.props.inline ? 'form-control inline' : 'form-control'}
				value={this.props.value} onChange={event => this.props.onChange(event.target.value)}>
				{this.props.options.map(this.renderOption)}
			</select>
		);
	}
}

module.exports = Select;
