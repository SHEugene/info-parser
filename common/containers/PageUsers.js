import React, { Component } from 'react'
const _ = require('lodash');
import api from '../lib/api';
import i18n from '../lib/i18n';

class PageUsers extends Component {
	constructor () {
		super();
		this.state = {
			users: []
		};
	}
	componentDidMount () {
		api.get(`/api/v1/tenants/${this.props.params.tenantId}/users`).then((users) => {
			this.setState({users: users});
		});
	}
	render () {
		return (
			<div className='list'>
				<h4 className='col-md-12'>{i18n.__('users.header')}</h4>
				<div className='row'>
					<div className='col-md-4'>{i18n.__('contact.name')}</div>
					<div className='col-md-4'>{i18n.__('contact.email')}</div>
					<div className='col-md-4'>{i18n.__('user.created_at')}</div>
				</div>
				{_.map(this.state.users, (user) => {
					return (
						<div key={user.id} className='row'>
							<div className='col-md-4'>{user.fullName}</div>
							<div className='col-md-4'>{user.EmailAddress.email}</div>
							<div className='col-md-4'>{user.createdAtRendered}</div>
						</div>
					);
				})}
			</div>
		)
	}
}
export default PageUsers
