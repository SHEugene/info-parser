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

export class PageProfile extends Component {
	constructor (props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.handleDropdown = this.handleDropdown.bind(this);
	}
	componentDidMount () {
		this.props.notificationActions.setNotificationSystem(this.refs.notificationSystem);
	}
	handleClick () {
		this.props.actions.logout();
	}
	handleSelect (eventKey) {
		browserHistory.push(`/profile/${eventKey}`);
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
				return 'adminOfTenant' === role.name;
			});
			const sysadminRoles = _.filter(user.roles, (role) => {
				return 'superAdmin' === role.name;
			});
			return (<Nav pullRight onSelect={this.handleDropdown}>
				<DropdownButton title={user.fullName} id='bg-vertical-dropdown-1'>
					{managerRoles.length ? _.map(managerRoles, (role) => {
							return <MenuItem eventKey={`manage/${role.tenantId}/`}>{`${i18n.__('manage')} ${role.tenantName}`}</MenuItem>
						}) : null
					}
					{sysadminRoles.length ? _.map(sysadminRoles, (role) => {
							return <MenuItem eventKey='sysadmin/'>{i18n.__('sysadmin')}</MenuItem>
						}) : null
					}
					{this.renderSeparator(managerRoles.length + sysadminRoles.length)}
					<MenuItem eventKey='logout'>{i18n.__('logout')}</MenuItem>
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
							<NavItem eventKey={'info'}>{i18n.__('profile')}</NavItem>
							<NavItem eventKey={'password'}>{i18n.__('profile.change_password')}</NavItem>
							<NavItem eventKey={'email'}>{i18n.__('profile.change_email')}</NavItem>
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

function mapStateToProps(state) {
	return {
		user: state.user
    }
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(UserActions, dispatch),
		notificationActions: bindActionCreators(NotificationActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PageProfile)
