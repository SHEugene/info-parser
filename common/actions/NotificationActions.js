/* eslint-disable no-unused-vars */
import {
	SET_NOTIFICATION_SYSTEM,
	ADD_NOTIFICATION
} from '../constants/NotificationSystem'

export function setNotificationSystem(payload) {
	return (dispatch) => {
		dispatch({
			type: SET_NOTIFICATION_SYSTEM,
			payload: payload
		});
	}
}

export function addNotification(message, level) {
	return (dispatch) => {
		dispatch({
			type: ADD_NOTIFICATION,
			payload: {
				message,
				level
			}
		});
	}
}

/* eslint-enable no-unused-vars */
