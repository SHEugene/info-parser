/* eslint-disable no-unused-vars */
import api from '../lib/api';
import {
	SET_NOTIFICATION_SYSTEM,
	ADD_NOTIFICATION
} from '../constants/NotificationSystem'
import {
	REGISTERED
} from '../constants/Registration'
import {
	REGISTER_REQUEST,
	REGISTER_FAIL,
	REGISTER_SUCCESS,
	LOGIN_REQUEST,
	LOGIN_FAIL,
	LOGIN_SUCCESS,
	LOGOUT_SUCCESS
} from '../constants/User'

import {
	ROUTING
} from '../constants/Routing'

export function register(payload) {
	return (dispatch) => {

		dispatch({
			type: REGISTER_REQUEST
		});

		api.post('/api/register', payload).then((data) => {
			dispatch({
				type: REGISTERED,
				payload: true
			});
		}).fail((error) => {
			dispatch({
				type: ADD_NOTIFICATION,
				payload: {
					message: error.responseJSON.message,
					level: 'error'
				}
			});
			dispatch({
				type: REGISTER_FAIL
			});
		});
	}
}

export function registerByInvite(payload) {
	return (dispatch) => {

		dispatch({
			type: REGISTER_REQUEST
		});

		api.post('/api/registerByInvite', payload).then((data) => {
			dispatch({
				type: REGISTER_SUCCESS,
				payload: {
					name: payload.name,
					isAuthenticated: true
				}
			});

			dispatch({
				type: ROUTING,
				payload: {
					method: 'replace',
					nextUrl: '/work'
				}
			});
		});
	}
}

export function login(payload) {
	return (dispatch) => {

		dispatch({
			type: LOGIN_REQUEST
		});
		
		api.post('/api/login', {username: payload.name, password: payload.password}).done((data) => {
			console.log(data);
			dispatch({
				type: LOGIN_SUCCESS,
				payload: {
					fullName: data.user.fullName,
					email: data.user.email,
					isAuthenticated: true,
					roles: data.user.roles
				}
			});

			dispatch({
				type: ROUTING,
				payload: {
					method: 'replace',
					nextUrl: '/work'
				}
			});
		}).fail((error) => {
			dispatch({
				type: ADD_NOTIFICATION,
				payload: {
					message: 'Невідомий емайл або пароль',
					level: 'error'
				}
			});
			dispatch({
				type: LOGIN_FAIL
			});
		});
	}
}

export function logout() {
	return (dispatch) => {

		api.get('/api/logout').then((data) => {
			dispatch({
				type: LOGOUT_SUCCESS
			});

			dispatch({
				type: ROUTING,
				payload: {
					method: 'replace',
					nextUrl: '/home'
				}
			});
		});
	}
}

/* eslint-enable no-unused-vars */
