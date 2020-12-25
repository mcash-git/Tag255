import * as types from 'constants/ActionTypes';

const _defaultState = { response: '', isFetching: false, error: null };

export const addNotification = (state = _defaultState, action) => {
	switch (action.type) {
		case types.FETCH_ADDNOTIFICATION_FETCHING:
			return { ...state, isFetching: true };
		case types.FETCH_ADDNOTIFICATION_ERROR:
			return { ...state, isFetching: false, response: '', error: action.error };
		case types.FETCH_ADDNOTIFICATION_SUCCESS:
			return { ...state, response: action.response, isFetching: false };
		default:
			return state;
	}
}

export const getNotifications = (state = _defaultState, action) => {
	switch (action.type) {
		case types.FETCH_GETNOTIFICATIONS_FETCHING:
			return { ...state, isFetching: true };
		case types.FETCH_GETNOTIFICATIONS_ERROR:
			return { ...state, isFetching: false, response: '', error: action.error };
		case types.FETCH_GETNOTIFICATIONS_SUCCESS:
			return { ...state, response: action.response && action.response.map(item => item[1]).sort((a, b) => a.date < b.date) || [], isFetching: false };
		default:
			return state;
	}
}
