import {
	FETCH_LANGUAGES
} from '../constants/Language'

const initialState = [];

export default function languages(state = initialState, action) {

	switch (action.type) {

		case FETCH_LANGUAGES:
			return action.payload;
		default:
			return state
	}
}
