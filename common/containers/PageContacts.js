import React, { Component } from 'react'
const _ = require('lodash');
import { browserHistory } from 'react-router'
import api from '../lib/api';
import i18n from '../lib/i18n';
const Button = require('../components/Button');

class PageContacts extends Component {
	constructor () {
		super();
		this.state = {
			contacts: []
		};
	}
	componentDidMount () {
		api.get(`/api/v1/tenants/${this.props.params.tenantId}/contacts`).then((contacts) => {
			this.setState({contacts: contacts});
		});
	}
	handleClick () {
		browserHistory.push(`${this.props.location.pathname}/new`);
	}
	renderList (list) {
		if (list.length) {
			return (<div>
				<div className='row'>
					<div className='col-md-4'>{i18n.__('contact.name')}</div>
					<div className='col-md-4'>{i18n.__('contact.email')}</div>
					<div className='col-md-4'>{i18n.__('created_at')}</div>
				</div>
				{_.map(list, (contact) => {
					return (
						<div key={contact.id} className='row'>
							<div className='col-md-4'>{contact.fullName}</div>
							<div className='col-md-4'>{contact.EmailAddress.email}</div>
							<div className='col-md-4'>{contact.createdAtRendered}</div>
						</div>
					);
				})}
				</div>
			);
		} else {
			return <div>{i18n.__('manage.list.contacts.empty')}</div>
		}
	}
	render () {
		return (
			<div className='list'>
				<div className='row'>
					<div className='col-md-6'>
						<h4>{i18n.__('contacts.header')}</h4>
					</div>
					<div className='col-md-6'>
						<Button
							primary
							onClick={this.handleClick.bind(this)}
							className='btn-cta pull-right'
							type='button'>{i18n.__('creation.contact.header')}</Button>
					</div>
				</div>
				{this.renderList(this.state.contacts)}
			</div>
		)
	}
}
export default PageContacts
