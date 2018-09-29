import React from 'react'
import { Route, IndexRedirect } from 'react-router'
import Home from '../common/containers/Home';


const routes = (
	<div>
		<Route path='/home' component={Home} />
	</div>
);

export default routes
