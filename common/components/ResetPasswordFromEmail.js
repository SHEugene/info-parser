const React = require('react');
const Link = require('react-router').Link;
const historyPropType = require('react-router/lib/PropTypes').history;
const Button = require('./Button');
const IconFormRow = require('./IconFormRow');
const PageSpinner = require('./PageSpinner');
import api from '../lib/api';
import i18n from '../lib/i18n';


class ResetPasswordFromEmail extends React.Component {
	constructor (props) {
		super(props);
		const query = this.props.location.query;
		let token;
		if (query) {
			token = query.token;
		}
		this.state = {
			isLoading: true,
			token: token,
			tenant: null,
			isValid: false
		};
	}
	componentDidMount () {
		api.get(`/api/v1/reset_password/choose?token=${this.state.token}`).done(({tenant, token, isValid}) => {
			let isLoading = false;
			this.setState({isLoading, isValid, tenant, token});
		});
	}
	render () {
		let component;
		if (this.state.isLoading) {
			component = <PageSpinner />;
		} else if (this.state.token) {
			if (this.state.isValid) {
				component = <ResetPasswordChoose tenant={this.state.tenant} token={this.state.token} />;
			} else {
				component = <WrongToken isExpired={true} />;
			}
		} else {
			component = <WrongToken isExpired={false} />;
		}
		return component;
	}
}

class WrongToken extends React.Component {
	render () {
		return (
			<div>
				<h4>{i18n.__('reset_password.reset_password')}</h4>
				<p>
					{this.props.isExpired
						? i18n.__('reset_password.expired_token_text', '')
						: i18n.__('reset_password.wrong_token_text', '')}
					<Link to='/reset_password'>{i18n.__('reset_password.new_request')}</Link>
					.
				</p>
				<br />
				<Link to='/login'>{i18n.__('back_to_login')}</Link>
		</div>
		);
	}
}

class ResetPasswordChoose extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			password: '',
			passwordConfirm: ''
		};
	}
	handleSubmit (event) {
		event.preventDefault();
		if (this.validate()) {
			api.post('/api/v1/reset_password/choose', { token: this.props.token.token, password: this.state.password }).done(({message}) => {
				this.context.history.push('/');
			});
		}
	}
	validate () {
		return (window.$(this.refs.newPasswordForm).parsley().validate());
	}
	render () {
		return (
			<div>
				<div className='logo-main'>
				</div>
				<div className='container-fluid panel-main'>
					<h4 className='section-header'>
						{this.props.tenant
							? i18n.__('manager_invite.choose_password_header')
							: i18n.__('reset_password.choose_new_header')}
					</h4>
					<p>
						{this.props.tenant
							? i18n.__('manager_invite.choose_password_instructions', this.props.tenant.name)
							: i18n.__('reset_password.choose_new_instructions')}
					</p>
					<form className='form-horizontal form-login-form' onSubmit={this.handleSubmit.bind(this)}
						data-parsley-validate ref='newPasswordForm'>
						<IconFormRow
							icon='fa-lock'
							name='password'
							type='password'
							inputProps={{'id': 'form-field-password', 'required': true, 'data-parsley-minlength': 8, 'data-parsley-minlength-message': i18n.__('validation.password_length')}}
							autoFocus
							onChange={event => this.setState({ password: event.target.value })}
							value={this.state.password}
							placeholder={i18n.__('password')} />
						<IconFormRow
							icon='fa-lock'
							name='confirm_password'
							type='password'
							inputProps={{'required': true, 'data-parsley-equalto': '#form-field-password'}}
							onChange={event => this.setState({ passwordConfirm: event.target.value })}
							value={this.state.passwordConfirm}
							placeholder={i18n.__('password_repeat')} />
						<Button primary className='btn-block btn-cta' type='submit'>{i18n.__('reset_password.confirm')}</Button>
					</form>
					<br/>
					<Link to='/login'>{i18n.__('back_to_login')}</Link>
				</div>
			</div>
		);
	}
}
ResetPasswordChoose.contextTypes = {
	history: historyPropType
};

module.exports = ResetPasswordFromEmail;
