import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as UserActions from '../actions/UserActions'
import CreateContactForm from '../components/CreateContactForm';
import { browserHistory } from 'react-router'
import api from '../lib/api';

export class PageEditContact extends Component {
	handleSubmit(data) {
		api.post(`/api/v1/tenants/${this.props.params.tenantId}/contacts`, data).then((result) => {
			browserHistory.push(`/manage/${this.props.params.tenantId}/contacts`);
		});
	}
	render() {
		return (
			<CreateContactForm onSubmit={this.handleSubmit.bind(this)} />
		)
	}
}

function mapStateToProps(state) {
	return {
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(UserActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PageEditContact)
