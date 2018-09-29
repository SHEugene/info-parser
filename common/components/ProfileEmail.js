import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Button = require('./Button');
import * as NotificationActions from '../actions/NotificationActions'
const i18n = require('../lib/i18n');
const api = require('../lib/api');

class ProfileEmail extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			newEmail: '',
			loading: false
		};
	}
	handleSubmit (event) {
		event.preventDefault();
		if (this.validate()) {
			const body = {
				newEmail: this.state.newEmail
			};
			this.setState({loading: true});
			api.post('/api/v1/profile/email', body).done(() => {
				this.props.notificationActions.addNotification(i18n.__('profile.email_change_check_emails', this.state.newEmail), 'success');
				this.setState({loading: false});
			}).fail(() => {
				//TODO differ between wrong password and other issues
				this.props.notificationActions.addNotification(i18n.__('validation.email_already_used'), 'error');
				this.setState({loading: false});
			});
		}
	}
	validate () {
		return true;//window.$(this.refs.passwordForm).parsley().validate();
	}
	render () {
		return (
			<div>
				<h3 className='page-header'>{i18n.__('profile.change_email')}</h3>
				<form className='form form-horizontal'
					  ref='passwordForm' data-parsley-validate noValidate onSubmit={this.handleSubmit.bind(this)}>
					<div className='form-group'>
						<label className='col-md-2 control-label'>{i18n.__('profile.new_email')}</label>
						<div className='col-md-10'>
							<input id='form-field-newEmail' type='email' className='form-control'
								   value={this.state.newEmail}
								   onChange={(event) => this.setState({newEmail: event.target.value})}
								   required data-parsley-trigger='change'/>
						</div>
					</div>
					<div className='form-group'>
						<div className='col-md-10 col-md-offset-2'>
							<div className='form-control-static'>
								<Button loading={this.state.loading} className='btn btn-primary' type='submit'>{i18n.__('profile.change_email')}</Button>
							</div>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user
	}
}

function mapDispatchToProps(dispatch) {
	return {
		notificationActions: bindActionCreators(NotificationActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEmail)
