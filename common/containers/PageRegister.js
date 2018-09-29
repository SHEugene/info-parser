import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as UserActions from '../actions/UserActions'
import * as LanguageActions from '../actions/LanguageActions'
import CreateUserForm from '../components/CreateUserForm';
import RegistrationConfirmation from '../components/RegistrationConfirmation';
import * as NotificationActions from '../actions/NotificationActions'
import NotificationSystem from 'react-notification-system';

export class PageRegister extends Component {
	constructor (props) {
		super(props);
	}
	componentDidMount () {
		this.props.notificationActions.setNotificationSystem(this.refs.notificationSystem);
		this.props.languageActions.fetchLanguages();
	}
	handleSubmit (data) {
		this.props.actions.register(data);
	}
	render () {
		if (this.props.registration) {
			return (<div>
				<NotificationSystem ref='notificationSystem'/>
				<div className='logo-main'>
				</div>
				<div className='container-fluid panel-main'>
					<RegistrationConfirmation />
				</div>
			</div>);
		} else {
			return (<div>
					<NotificationSystem ref='notificationSystem'/>
					<div className='logo-main'>
					</div>
					<div className='container-fluid panel-main'>
						<CreateUserForm onSubmit={this.handleSubmit.bind(this)} languages={this.props.languages} />
					</div>
				</div>);
		}
	}
}

function mapStateToProps (state) {
	return {
		languages: state.languages,
		registration: state.registration
	}
}

function mapDispatchToProps (dispatch) {
	return {
		actions: bindActionCreators(UserActions, dispatch),
		languageActions: bindActionCreators(LanguageActions, dispatch),
		notificationActions: bindActionCreators(NotificationActions, dispatch)
	}
}

export default connect (mapStateToProps, mapDispatchToProps)(PageRegister)
