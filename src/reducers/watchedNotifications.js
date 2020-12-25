import * as types from 'constants/ActionTypes';

const _defaultState = { data: [] };

export default function (state = _defaultState, action) {
	switch (action.type) {
		case types.ADD_WATCHED_NOTIFICATIONS:
			return { ...state, data: [...state.data, ...action.data] };
		default:
			return state;
	}
}