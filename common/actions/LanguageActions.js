/* eslint-disable no-unused-vars */
import api from '../lib/api';
const _ = require('lodash');
import {
	FETCH_LANGUAGES
} from '../constants/Language'

export function fetchLanguages () {
	return (dispatch) => {
		api.get('/api/v1/languages').then((languages) => {
			dispatch({
				type: FETCH_LANGUAGES,
				payload: _.map(languages, (language) => {
					language.value = language.id;
					language.label = language.name;
					return language;
				})
			});
		});
	}
}

/* eslint-enable no-unused-vars */
