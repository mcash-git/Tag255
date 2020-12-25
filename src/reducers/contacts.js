import * as types from 'constants/ActionTypes';

const _defaultState = { data: [] };

export default function (state = _defaultState, action) {
	switch (action.type) {
		case types.RESET_CONTACTS:
			return { ...state, data: [] };
		case types.SET_CONTACTS:
			return { ...state, data: action.data};
		default:
			return state;
	}
}