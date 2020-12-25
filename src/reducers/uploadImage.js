import * as types from 'constants/ActionTypes';

const _defaultState = { response: '', isFetching: false, error: null };

export default function (state = _defaultState, action) {
	switch (action.type) {
		case types.FETCH_UPLOADIMAGE_FETCHING:
			return { ...state, isFetching: true };
		case types.FETCH_UPLOADIMAGE_ERROR:
			return { ...state, isFetching: false, response: '', error: action.error };
		case types.FETCH_UPLOADIMAGE_SUCCESS:
			return { ...state, response: action.response, isFetching: false };
		default:
			return state;
	}
}