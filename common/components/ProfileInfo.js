import React, { Component } from 'react'
import { connect } from 'react-redux'
const Row = require('./Row');
const i18n = require('../lib/i18n');

class ProfileInfo extends Component {
	constructor (props) {
		super(props);
	}
	render() {
		return (
			<div className='col-md-12'>
				<Row>
					<div className='col-md-6'>{i18n.__('contact.name')}</div>
					<div className='col-md-6'>{this.props.user.fullName}</div>
				</Row>
				<Row>
					<div className='col-md-6'>{i18n.__('contact.email')}</div>
					<div className='col-md-6'>{this.props.user.email}</div>
				</Row>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		user: state.user
	}
}

function mapDispatchToProps(dispatch) {
	return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileInfo)
