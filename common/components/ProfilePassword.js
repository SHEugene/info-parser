import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Button = require('./Button');
import * as NotificationActions from '../actions/NotificationActions'
const i18n = require('../lib/i18n');
const api = require('../lib/api');

class ProfilePassword extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			oldPassword: '',
			newPassword: '',
			loading: false
		};
	}
	handleSubmit (event) {
		event.preventDefault();
		if (this.validate()) {
			const body = {
				oldPassword: this.state.oldPassword,
				newPassword: this.state.newPassword
			};
			this.setState({loading: true});
			api.post('/api/v1/profile/password', body).done(() => {
				this.props.notificationActions.addNotification(i18n.__('profile.password_changed_success'), 'success');
				this.setState({loading: false});
			}).fail(() => {
				//TODO differ between wrong password and other issues
				this.props.notificationActions.addNotification(i18n.__('validation.password_check_current'), 'error');
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
				<h3 className='page-header'>{i18n.__('profile.change_password')}</h3>
				<form className='form form-horizontal'
					  ref='passwordForm' data-parsley-validate noValidate onSubmit={this.handleSubmit.bind(this)}>
					<div className='form-group'>
						<label className='col-md-2 control-label'>{i18n.__('profile.current_password')}</label>
						<div className='col-md-10'>
							<input type='password' className='form-control'
								   value={this.state.oldPassword}
								   onChange={(event) => this.setState({oldPassword: event.target.value})}
								   required data-parsley-trigger='change'/>
						</div>
					</div>
					<div className='form-group'>
						<label className='col-md-2 control-label'>{i18n.__('profile.new_password')}</label>
						<div className='col-md-10'>
							<input id='form-field-newPassword' type='password' className='form-control'
								   value={this.state.newPassword}
								   onChange={(event) => this.setState({newPassword: event.target.value})}
								   required data-parsley-trigger='change' data-parsley-minlength='8'/>
						</div>
					</div>
					<div className='form-group'>
						<label className='col-md-2 control-label'>{i18n.__('profile.repeat_new_password')}</label>
						<div className='col-md-10'>
							<input type='password' className='form-control' required data-parsley-trigger='change' data-parsley-equalto='#form-field-newPassword'/>
						</div>
					</div>
					<div className='form-group'>
						<div className='col-md-10 col-md-offset-2'>
							<div className='form-control-static'>
								<Button loading={this.state.loading} className='btn btn-primary' type='submit'>{i18n.__('profile.change_password')}</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePassword)
