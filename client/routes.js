import React from 'react'
import { Route, IndexRedirect } from 'react-router'
import Home from '../common/containers/Home';


const routes = [
	{
		path:'/home',
		component:Home,
		onEnter :  function (store) {

		},
	}

];

export default routes
