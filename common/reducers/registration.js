import {
	REGISTERED
} from '../constants/Registration'

const initialState = false;

export default function registration(state = initialState, action) {

	switch (action.type) {
		case REGISTERED:
			return action.payload;
		default:
			return state
	}
}
