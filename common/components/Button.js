/*
	Source: https://github.com/facebook/react/blob/master/examples/jquery-bootstrap/js/app.js
 */

const React = require('react');
const LaddaButton = require('react-ladda').default;
const classNames = require('classnames');

class Button extends React.Component {
	render () {
		const { className, type, primary, deletion, active, loading, children, ...restProps } = this.props;
		const cName = classNames('btn', {
			active: active,
			'btn-primary': primary,
			'btn-link': deletion,
			'btn-default': !primary && !deletion,
			'ie-ladda-button': typeof document !== 'undefined' && !!document.documentMode && className && className.indexOf && className.indexOf('pull') !== -1
		}, className);
		const spinnerColor = cName.indexOf('btn-primary') !== -1 ? '#fff' : '#555';
		return (
			<LaddaButton {...restProps}
				role='button'
				type={type}
				loading={loading}
				data-style='slide-left'
				data-spinner-color={spinnerColor}
				className={cName}>
				{deletion
					? <span className='text-danger'>
						<i className='fa fa-warning' />
						{' '}
						{children}
					</span>
					: children
				}
			</LaddaButton>
		);
	}
}
Button.propTypes = {
	loading: React.PropTypes.bool,
	type: React.PropTypes.oneOf(['button', 'submit']),
	className: React.PropTypes.string,
	primary: React.PropTypes.bool,
	active: React.PropTypes.bool,
	deletion: React.PropTypes.bool
};
Button.defaultProps = {
	loading: false,
	type: 'button',
	className: '',
	primary: false,
	active: false,
	deletion: false
};

class ButtonGroup extends React.Component {
	render () {
		return (
			<div className='btn-group'>
				{this.props.children}
			</div>
		);
	}
}

class ButtonDropdown extends React.Component {
	render () {
		const { children, title, className, outerClassName } = this.props;
		return (
			<div className={classNames('dropdown', outerClassName)}>
				<a className={classNames('btn btn-default pointer', className)} data-toggle='dropdown'>
					{title} <i className='caret' />
				</a>
				<ul className='dropdown-menu dropdown-menu-right'>
					{children}
				</ul>
			</div>
		);
	}
}

module.exports = Button;
module.exports.ButtonGroup = ButtonGroup;
module.exports.ButtonDropdown = ButtonDropdown;
