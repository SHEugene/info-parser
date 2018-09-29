import {
	SET_NOTIFICATION_SYSTEM,
	ADD_NOTIFICATION
} from '../constants/NotificationSystem'

export default function notificationSystem(state = null, action) {

	switch (action.type) {
		case ADD_NOTIFICATION:
			state.addNotification({
				message: action.payload.message,
				level: action.payload.level
			});
			return state;
		case SET_NOTIFICATION_SYSTEM:
			return action.payload;

		default:
			return state
	}
}
