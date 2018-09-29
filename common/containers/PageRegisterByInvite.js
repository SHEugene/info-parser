import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as UserActions from '../actions/UserActions'
import * as LanguageActions from '../actions/LanguageActions'
import CreateUserForm from '../components/CreateUserForm';
import api from '../lib/api';

export class PageRegisterByInvite extends Component {
	constructor (props) {
		super(props);
		this.state = {
			firstName: '',
			lastName: '',
			email: ''
		}
	}
	handleSubmit (data) {
		data.tokenString = this.state.tokenString;
		this.props.actions.registerByInvite(data);
	}
	componentDidMount () {
		this.props.languageActions.fetchLanguages();
		api.get(`/api/v1/invitation?token=${this.props.location.query.token}`).then((data) => {
			this.setState({
				tokenString: data.tokenString,
				firstName: data.contact.firstName,
				lastName: data.contact.lastName,
				email: data.contact.email
			});
		});
	}
	render () {
		return (
			this.state.tokenString
			? <CreateUserForm
				firstName={this.state.firstName}
				lastName={this.state.lastName}
				email={this.state.email}
				onSubmit={this.handleSubmit.bind(this)}
				languages={this.props.languages} />
			: null
		)
	}
}

function mapStateToProps (state) {
	return {
		languages: state.languages
	}
}

function mapDispatchToProps (dispatch) {
	return {
		actions: bindActionCreators(UserActions, dispatch),
		languageActions: bindActionCreators(LanguageActions, dispatch)
	}
}

export default connect (mapStateToProps, mapDispatchToProps)(PageRegisterByInvite)
