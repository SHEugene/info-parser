import {
	LOADED_FAIL,
	LOADED_SUCCESS,
} from '../constants/Info'

const initialState = {
	info:[]
};
export default function userstate(state = initialState, action) {
	switch (action.type) {
		case LOADED_SUCCESS:
			return {
				...state,
				info: action.payload
			};
		case LOADED_FAIL:
			return initialState;
		default:
			return state
	}
}