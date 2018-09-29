import React, { Component } from 'react'
const _ = require('lodash');
import api from '../lib/api';
import i18n from '../lib/i18n';

class PageTenants extends Component {
	constructor () {
		super();
		this.state = {
			tenants: []
		};
	}
	componentDidMount () {
		api.get('/api/v1/tenants').then((tenants) => {
			this.setState({tenants: tenants});
		});
	}
	render () {
		return (
			<div className='list'>
				<h4 className='col-md-12'>{i18n.__('tenants.header')}</h4>
				<div className='row'>
					<div className='col-md-6'>{i18n.__('name')}</div>
					<div className='col-md-6'>{i18n.__('created_at')}</div>
				</div>
				{_.map(this.state.tenants, (tenant) => {
					return (
						<div key={tenant.id} className='row'>
							<div className='col-md-6'>{tenant.name}</div>
							<div className='col-md-6'>{tenant.createdAtRendered}</div>
						</div>
					);
				})}
			</div>
		)
	}
}
export default PageTenants
