import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'
import { Navbar, Nav, NavItem, DropdownButton, MenuItem } from 'react-bootstrap'
import * as UserActions from '../actions/UserActions'
import * as NotificationActions from '../actions/NotificationActions'
const i18n = require('../lib/i18n');
import NotificationSystem from 'react-notification-system';

export class SiteManage extends Component {
	constructor (props) {
		super(props);
		this.handleDropdown = this.handleDropdown.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
	}
	componentDidMount () {
		this.props.notificationActions.setNotificationSystem(this.refs.notificationSystem);
	}
	handleSelect (eventKey) {
		browserHistory.push(`/manage/${this.props.params.tenantId}/${eventKey}`);
	}
	handleDropdown (eventKey) {
		if ('logout' === eventKey) {
			this.props.actions.logout();
		} else {
			browserHistory.push(`/${eventKey}`);
		}
	}
	renderSeparator (flag) {
		if (flag) {
			return <li role='separator' className='divider'/>;
		}
	}
    renderLogin (user) {
        if (user && user.isAuthenticated) {
			const clientRoles = _.filter(user.roles, (role) => {
				return 'clientOfTenant' === role.name;
			});
			const managerRoles = _.filter(user.roles, (role) => {
				return 'adminOfTenant' === role.name && this.props.params.tenantId != role.tenantId;
			});
			const sysadminRoles = _.filter(user.roles, (role) => {
				return 'superAdmin' === role.name;
			});
			return (<Nav pullRight onSelect={this.handleDropdown}>
					<DropdownButton title={user.fullName} id='bg-vertical-dropdown-1'>
						<MenuItem eventKey='profile/'>{i18n.__('profile')}</MenuItem>
						{this.renderSeparator(true)}
						{managerRoles.length ? _.map(managerRoles, (role) => {
								return <MenuItem eventKey={`manage/${role.tenantId}/`}>{`${i18n.__('manage')} ${role.tenantName}`}</MenuItem>
							}) : null
						}
						{sysadminRoles.length ? _.map(sysadminRoles, (role) => {
								return <MenuItem eventKey='sysadmin/'>{i18n.__('sysadmin')}</MenuItem>
							}) : null
						}
						{this.renderSeparator(managerRoles.length + sysadminRoles.length)}
						<MenuItem eventKey='logout' >{i18n.__('logout')}</MenuItem>
					</DropdownButton>
				</Nav>);
        } else {
			return (<Nav pullRight onSelect={this.handleSelect}>
					<NavItem eventKey={'login'}>{i18n.__('login.call_to_action')}</NavItem>
				</Nav>);
        }
    }
    render () {
		const { user } = this.props;
        return (
			<div>
				<Navbar inverse collapseOnSelect>
					<Navbar.Collapse>
						<Nav bsStyle='pills' onSelect={this.handleSelect}>
							<NavItem eventKey={'users'}>{i18n.__('users.header')}</NavItem>
							<NavItem eventKey={'contacts'}>{i18n.__('contacts.header')}</NavItem>
						</Nav>
						{this.renderLogin(user)}
					</Navbar.Collapse>
				</Navbar>
				<NotificationSystem ref='notificationSystem'/>
				<div className='container'>
					{this.props.children}
				</div>
            </div>
        );
    }
}

function mapStateToProps (state) {
	return {
		user: state.user
    }
}

function mapDispatchToProps (dispatch) {
	return {
		actions: bindActionCreators(UserActions, dispatch),
		notificationActions: bindActionCreators(NotificationActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SiteManage)
