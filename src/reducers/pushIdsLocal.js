import * as types from 'constants/ActionTypes';

const _defaultState = {};

export default function (state = _defaultState, action) {
	switch (action.type) {
		case types.SET_PUSH_IDS_LOCAL:	
			return {
				...state, ...action.data,
			};
		default:
			return state;
	}
}