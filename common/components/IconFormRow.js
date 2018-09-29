const React = require('react');
import { Validate, ErrorMessage } from 'react-validate';

class IconFormRow extends React.Component {
	render () {
		return (
			<div className={'form-group' + (this.props.hasError ? ' has-error' : '')}>
				<div className='input-icon'><i className={'fa fa-fw ' + this.props.icon} /></div>
				<Validate validators={this.props.validators}>
					{this.props.type !== 'textarea'
						? <input
							className='form-control'
							ref={(c) => this._input = c}
							name={this.props.name}
							type={this.props.type}
							required={this.props.required}
							autoFocus={this.props.autoFocus}
							onChange={this.props.onChange}
							onPaste={this.props.onChange}
							value={this.props.value}
							{...this.props.inputProps}
							placeholder={this.props.placeholder} />
						: <textarea
							className='form-control'
							ref={(c) => this._input = c}
							name={this.props.name}
							type={this.props.type}
							required={this.props.required}
							autoFocus={this.props.autoFocus}
							onChange={this.props.onChange}
							rows={this.props.rows}
							value={this.props.value}
							{...this.props.inputProps}
							placeholder={this.props.placeholder} />
					}
					<ErrorMessage>{this.props.errorMessage}</ErrorMessage>
				</Validate>
			</div>
		);
	}
}
IconFormRow.propTypes = {
	placeholder: React.PropTypes.string,
	autoFocus: React.PropTypes.bool,
	required: React.PropTypes.bool,
	icon: React.PropTypes.string.isRequired,
	type: React.PropTypes.string,
	onChange: React.PropTypes.func,
	value: React.PropTypes.any,
	name: React.PropTypes.string,
	inputProps: React.PropTypes.object
};
IconFormRow.defaultProps = {
	autoFocus: false,
	required: false,
	type: 'text'
};


module.exports = IconFormRow;
