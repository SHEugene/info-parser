import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as UserActions from '../actions/UserActions'
import Button from '../components/Button';
const i18n = require('../lib/i18n');
import { browserHistory } from 'react-router'
const IconFormRow = require('../components/IconFormRow');
import * as NotificationActions from '../actions/NotificationActions'
import NotificationSystem from 'react-notification-system';

export class PageLogin extends Component {
	constructor (props) {
		super(props);
		this.state = {
			email: '',
			password: ''
		}
	}
	componentDidMount () {
		this.props.notificationActions.setNotificationSystem(this.refs.notificationSystem);
	}
	handleSubmit(e) {
		e.preventDefault();
		if (this.state.email.length && this.state.password.length) {
			this.props.actions.login({name: this.state.email, password: this.state.password});
		}
	}
	handleClick() {
		browserHistory.push('/register');
	}
	render() {
		return (<div>
			<NotificationSystem ref='notificationSystem'/>
			<div className='logo-main'>
			</div>
			<div className='container-fluid panel-main'>
				<form className='form-login-form'>
					<IconFormRow
						icon='fa-envelope-o'
						required
						onChange={event => this.setState({ email: event.target.value })}
						errorMessage={i18n.__('validation.email_format')}
						value={this.state.email}
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
					<div className='btn-cta'>
						<Button
							className='btn-primary btn-block'
							onClick={ this.handleSubmit.bind(this) }
							type='button'>
							{i18n.__('login.call_to_action')}
						</Button>
					</div>
				</form>
				<a className='link' href='/reset_password'>{i18n.__('login.forgot_password')}</a>
				<div className='btn-cta'>
					<Button
						primary
						className='btn-block'
						type='button'
						onClick={this.handleClick.bind(this)}
						loading={this.props.registerLoading}
						data-track-event='registration'
						data-track-action='submit'
						data-track-label='complete registration'>{i18n.__('registration.call_to_action')}</Button>
				</div>
			</div>
			</div>
		)
	}
}

function mapStateToProps() {
	return {}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(UserActions, dispatch),
		notificationActions: bindActionCreators(NotificationActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PageLogin)
