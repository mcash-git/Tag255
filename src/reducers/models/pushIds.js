import * as types from 'constants/ActionTypes';

const _defaultState = { response: '', isFetching: false, error: null };

export const setUserPushIds = (state = _defaultState, action) => {
	switch (action.type) {
		case types.FETCH_SETUSERPUSHIDS_FETCHING:
			return { ...state, isFetching: true };
		case types.FETCH_SETUSERPUSHIDS_ERROR:
			return { ...state, isFetching: false, response: '', error: action.error };
		case types.FETCH_SETUSERPUSHIDS_SUCCESS:
			return { ...state, response: action.response, isFetching: false };
		default:
			return state;
	}
}

export const getUserPushIds = (state = _defaultState, action) => {
	switch (action.type) {
		case types.FETCH_GETUSERPUSHIDS_FETCHING:
			return { ...state, isFetching: true };
		case types.FETCH_GETUSERPUSHIDS_ERROR:
			return { ...state, isFetching: false, response: '', error: action.error };
		case types.FETCH_GETUSERPUSHIDS_SUCCESS:
			return { ...state, response: action.response && action.response[0], isFetching: false };
		default:
			return state;
	}
}

export const getUsersPushIds = (state = _defaultState, action) => {
	switch (action.type) {
		case types.FETCH_GETUSERSPUSHIDS_FETCHING:
			return { ...state, isFetching: true };
		case types.FETCH_GETUSERSPUSHIDS_ERROR:
			return { ...state, isFetching: false, response: '', error: action.error };
		case types.FETCH_GETUSERSPUSHIDS_SUCCESS:
			return { ...state, response: action.response.map(item => item[1]), isFetching: false };
		default:
			return state;
	}
}

export const updateUserPushIds = (state = _defaultState, action) => {
	switch (action.type) {
		case types.FETCH_UPDATEPUSHIDS_FETCHING:
			return { ...state, isFetching: true };
		case types.FETCH_UPDATEPUSHIDS_ERROR:
			return { ...state, isFetching: false, response: '', error: action.error };
		case types.FETCH_UPDATEPUSHIDS_SUCCESS:
			return { ...state, response: action.response, isFetching: false };
		default:
			return state;
	}
}
