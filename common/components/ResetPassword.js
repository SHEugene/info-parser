const React = require('react');
const Link = require('react-router').Link;
const Button = require('./Button');
const IconFormRow = require('./IconFormRow');
import api from '../lib/api';
import i18n from '../lib/i18n';

class ResetPassword extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			email: '',
			emailSent: false,
			hasError: false,
			errorMessage: '',
			loading: false
		};
	}
	handleSubmit (event) {
		const { loading, email } = this.state;
		this.setState({ loading: true });
		event.preventDefault();
		if (!loading && email && email !== '' ) {
			api.post('/api/v1/reset_password', { username: email }).done(({message}) => {
				this.setState({ emailSent: message && message === 'success', loading: false });
				if (!message || message === 'failure') {
					this.setState({hasError: true, errorMessage: i18n.__('validation.no_existing_email')});
				}
			});
		} else {
			this.setState({loading: false, hasError: true, errorMessage: i18n.__('required_field')});
		}
	}
	render () {
		const { onBackClick } = this.props;
		const { hasError, email, errorMessage, emailSent } = this.state;
		if (!emailSent) {
			return (
				<div>
					<div className='logo-main'>
					</div>
					<div className='container-fluid panel-main'>
						<h4 className='section-header'>{i18n.__('reset_password.header')}</h4>
						<p>{i18n.__('reset_password.instructions')}</p>
						<form className='form-horizontal form-login-form' onSubmit={this.handleSubmit.bind(this)}>
							<IconFormRow
								icon='fa-envelope-o'
								name='username'
								type='email'
								autoFocus
								hasError={hasError}
								onChange={event => this.setState({ email: event.target.value, hasError: false })}
								value={email}
								placeholder={i18n.__('email')}
								inputProps={ {'data-parsley-required' : true }}/>
							{hasError
								? (<ul className='parsley-errors-list filled'>
								<li className='parsley-required'>{errorMessage}</li>
							</ul>)
								: null }
							<Button primary className='btn-block btn-cta' type='submit' loading={this.state.loading}>{i18n.__('reset_password.header')}</Button>
						</form>
						<br/>
						{ !onBackClick
								? <Link to='/login'>{i18n.__('back_to_login')}</Link>
								: <a href='#' onClick={() => onBackClick()}>{i18n.__('back_to_login')}</a>
						}
					</div>
				</div>
			);
		} else {
			return (
				<div>
					<div className='logo-main'>
					</div>
					<div className='container-fluid panel-main'>
						<h4 className='section-header'>{i18n.__('reset_password.check_emails_header')}</h4>
						<p>{i18n.__('reset_password.email_if_found')}</p>
						<p>{i18n.__('email_check_spam')} <a href='mailto:sorgr2014@gmail.com'>sorgr2014@gmail.com</a>.</p>
						<br/>
						{ !onBackClick
								? <Link to='/login'>{i18n.__('back_to_login')}</Link>
								: <a href='#' onClick={() => onBackClick()}>{i18n.__('back_to_login')}</a>
						}
					</div>
				</div>
			);
		}
	}
}
ResetPassword.propTypes = {
	onBackClick: React.PropTypes.func
};

module.exports = ResetPassword;
