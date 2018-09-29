const React = require('react');
const classNames = require('classnames');

function Row (props) {
	const { box, className, children, ...restProps } = props;
	return (
		<div className={classNames('row', { 'box--row': box }, className)} {...restProps}>
			{children}
		</div>
	);
}

module.exports = Row;
