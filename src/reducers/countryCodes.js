import * as types from 'constants/ActionTypes';

const _defaultState = { response: '', isFetching: false };

export default function (state = _defaultState, action) {
	switch (action.type) {
		case types.FETCH_COUNTRYCODES_FETCHING:
			return { ...state, isFetching: true };
		case types.FETCH_COUNTRYCODES_ERROR:
			return { ...state, isFetching: false, response: '' };
		case types.FETCH_COUNTRYCODES_SUCCESS:
			return { ...state, response: action.response && action.response.sort((a, b) => b.length - a.length) || [], isFetching: false };
		default:
			return state;
	}
}