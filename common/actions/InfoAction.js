/* eslint-disable no-unused-vars */
import api from '../lib/api';
import {
	LOADED_FAIL,
	LOADED_SUCCESS,
} from '../constants/Info'
export function loadInfo(payload) {
	return (dispatch) => {
		api.get('/info', payload).then((data) => {
			dispatch({
				type: LOADED_SUCCESS,
				payload: data
			});
		}).fail((error) => {
			dispatch({
				type: LOADED_FAIL,
				payload: {
					message: error.responseJSON.message,
					level: 'error'
				}
			});
		});
	}
}