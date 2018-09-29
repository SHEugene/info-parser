import React from 'react'
import { Route, IndexRedirect } from 'react-router'

import requireAuthentication from '../common/containers/AuthenticatedComponent';
import SiteClient from '../common/containers/SiteClient';
import SiteManage from '../common/containers/SiteManage';
import SiteSysadmin from '../common/containers/SiteSysadmin';
import PageLogin from '../common/containers/PageLogin';
import ResetPassword from '../common/components/ResetPassword';
import ResetPasswordFromEmail from '../common/components/ResetPasswordFromEmail';
import PageRegister from '../common/containers/PageRegister';
import PageRegisterByInvite from '../common/containers/PageRegisterByInvite';
import NotFound from '../common/components/NotFound';
import PageTenants from '../common/containers/PageTenants';
import PageUsers from '../common/containers/PageUsers';
import PageContacts from '../common/containers/PageContacts';
import PageEditContact from '../common/containers/PageEditContact';
import PageHome from '../common/containers/PageHome';
import PageWork from '../common/containers/PageWork';
import PageProfile from '../common/containers/PageProfile';
import ProfileInfo from '../common/components/ProfileInfo';
import ProfilePassword from '../common/components/ProfilePassword';
import ProfileEmail from '../common/components/ProfileEmail';

const routes = (
	<div>
		<Route path='/login' component={PageLogin} />
		<Route path='/register' component={PageRegister} />
		<Route path='/reset_password' component={ResetPassword} />
		<Route path='/reset_password/choose' component={ResetPasswordFromEmail} />
		<Route path='/profile/' component={requireAuthentication(PageProfile)}>
			<IndexRedirect to='info' />
			<Route path='info' component={ProfileInfo}/>
			<Route path='password' component={ProfilePassword}/>
			<Route path='email' component={ProfileEmail}/>
		</Route>
		<Route path='/' component={SiteClient}>
			<IndexRedirect to='home' />
			<Route path='home' component={PageHome}/>
			<Route path='work' component={requireAuthentication(PageWork)} />
			<Route path='invite' component={PageRegisterByInvite} />
		</Route>
		<Route path='/manage/:tenantId/' component={requireAuthentication(SiteManage)}>
			<IndexRedirect to='users' />
			<Route path='users' component={PageUsers}/>
			<Route path='contacts' component={PageContacts}/>
			<Route path='contacts/new' component={PageEditContact}/>
		</Route>
		<Route path='/sysadmin/' component={requireAuthentication(SiteSysadmin)}>
			<IndexRedirect to='tenants' />
			<Route path='tenants' component={PageTenants}/>
		</Route>
		<Route path='*' component={NotFound} />
	</div>
);

export default routes
