const React = require('react');
const i18n = require('../lib/i18n');
const Button = require('./Button');
const IconFormRow = require('./IconFormRow');
import { Validate, ValidateGroup, ErrorMessage } from 'react-validate';
import validator from 'validator';

class CreateContactForm extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			firstName: props.firstName,
			lastName: props.lastName,
			email: props.email,
			errorFirstName: false,
			errorLastName: false,
			errorEmail: false,
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
				email: this.state.email
			};
			this.props.onSubmit(data);
		}
	}
	handleReturn (event) {
		event.preventDefault();
		this.props.onReturn();
	}
	render () {
		return (
			<div>
				<h4 className='section-header'>{i18n.__('creation.contact.header')}</h4>
				<form className='form-horizontal form-login-form' onSubmit={this.handleSubmit} ref='form'>
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
						<p>
							<Button
								primary
								className='btn-cta btn-block'
								type='submit'
								loading={this.props.registerLoading}
								data-track-event='registration'
								data-track-action='submit'
								data-track-label='complete registration'>{i18n.__('registration.call_to_action')}</Button>
						</p>
					</ValidateGroup>
				</form>
			</div>
		);
	}
}
CreateContactForm.propTypes = {
	firstName: React.PropTypes.string,
	lastName: React.PropTypes.string,
	email: React.PropTypes.string
};

module.exports = CreateContactForm;
