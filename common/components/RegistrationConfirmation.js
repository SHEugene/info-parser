const React = require('react');
import i18n from '../lib/i18n';
const Link = require('react-router').Link;

class RegistrationConfirmation extends React.Component {
	render () {
		return (
			<div>
				<h4 className='section-header'>{i18n.__('registration.done.thank_you')}</h4>
				<p>{i18n.__('registration.done.will_receive_email', this.props.email)}</p>
				<br/>
				<Link to='/login'>{i18n.__('back_to_login')}</Link>
			</div>
		);
	}
}
RegistrationConfirmation.propTypes = {
	email: React.PropTypes.string
};

module.exports = RegistrationConfirmation;
