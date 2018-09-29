import {
	LOGIN_REQUEST,
	LOGIN_FAIL,
	LOGIN_SUCCESS,
	LOGOUT_SUCCESS
} from '../constants/User'

const initialState = {
	fullName: 'Guest'
};

export default function userstate(state = initialState, action) {

	switch (action.type) {

		case LOGIN_REQUEST:
			// TODO
			return {};

		case LOGIN_SUCCESS:
			return {
				...state,
				fullName: action.payload.fullName,
				email: action.payload.email,
				isAuthenticated: action.payload.isAuthenticated,
				roles: action.payload.roles
			};

		case LOGIN_FAIL:
			return initialState;

		case LOGOUT_SUCCESS:
			return initialState;

		default:
			return state
	}
}
