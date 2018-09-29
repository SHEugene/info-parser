const React = require('react');
const i18n = require('../lib/i18n');
const Button = require('./Button');
const IconFormRow = require('./IconFormRow');
const StaticSelect = require('./StaticSelect');
import { Validate, ValidateGroup, ErrorMessage } from 'react-validate';
import validator from 'validator';

class CreateUserForm extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			firstName: props.firstName,
			lastName: props.lastName,
			email: props.email,
			password: '',
			passwordRepeat: '',
			termsAndPrivacyAccepted: false,
			errorFirstName: false,
			errorLastName: false,
			errorEmail: false,
			errorPassword: false,
			loading: false
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleReturn = this.handleReturn.bind(this);
	}
	validate () {
		return true;
	}
	handleSubmit (event) {
		event.preventDefault();
		if (this.validate()) {
			this.setState({loading: true});
			let data = {
				firstName: this.state.firstName,
				lastName: this.state.lastName,
				email: this.state.email,
				password: this.state.password,
				LanguageId: this.state.languageId
			};
			this.props.onSubmit(data);
		}
	}
	validateLength (value) {
		return validator.isLength(value, { min: 6 });
	}

	handleReturn (event) {
		event.preventDefault();
		this.props.onReturn();
	}
	render () {
		return (
			<div>
				<h4 className='section-header'>{i18n.__('registration.header')}</h4>
				<p>{i18n.__('registration.introduction')}</p>
				<form className='form-login-form' onSubmit={this.handleSubmit} ref='form'>
					<ValidateGroup>
						<IconFormRow
							icon='fa-user'
							required
							onChange={event => this.setState({ firstName: event.target.value })}
							value={this.state.firstName}
							validators={[]}
							placeholder={i18n.__('first_name')} />
						<IconFormRow
							icon='fa-user'
							required
							onChange={event => this.setState({ lastName: event.target.value })}
							value={this.state.lastName}
							validators={[]}
							placeholder={i18n.__('last_name')} />
						<IconFormRow
							icon='fa-envelope-o'
							required
							onChange={event => this.setState({ email: event.target.value })}
							minLength='8'
							errorMessage={i18n.__('validation.email_format')}
							value={this.state.email}
							validators={[validator.isEmail]}
							placeholder={i18n.__('email')} />
						<IconFormRow
							icon='fa-lock'
							type='password'
							required
							onChange={event => this.setState({ password: event.target.value })}
							errorMessage={i18n.__('validation.password_length')}
							value={this.state.password}
							validators={[]}
							placeholder={i18n.__('password')} />
						<IconFormRow
							icon='fa-lock'
							type='password'
							required
							errorMessage={i18n.__('validation.password_equal')}
							onChange={event => this.setState({ passwordRepeat: event.target.value })}
							value={this.state.passwordRepeat}
							validators={[]}
							placeholder={i18n.__('password_repeat')} />
						<div className={'form-group' + (this.props.hasError ? ' has-error' : '')}>
							<div className='input-icon'>
								<i className='fa fa-language'/>
							</div>
							<StaticSelect
								onChange={value => this.setState({ languageId: value })}
								options={this.props.languages}/>
						</div>
						<div className='btn-cta'>
							<Button
								primary
								className='btn-block'
								type='submit'
								loading={this.props.registerLoading}
								data-track-event='registration'
								data-track-action='submit'
								data-track-label='complete registration'>{i18n.__('registration.call_to_action')}</Button>
						</div>
					</ValidateGroup>
				</form>
				<br />
				<a className='link' href='/login'>{i18n.__('back_to_login')}</a>
			</div>
		);
	}
}
CreateUserForm.propTypes = {
	firstName: React.PropTypes.string,
	lastName: React.PropTypes.string,
	email: React.PropTypes.string,
	registerLoading: React.PropTypes.bool
};

module.exports = CreateUserForm;
