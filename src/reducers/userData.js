import * as types from 'constants/ActionTypes';

const _defaultState = {};

export default function (state = _defaultState, action) {
	switch (action.type) {
		case types.SET_USERDATA:	
			return {
				...state, ...action.data,
				userModel: { ...state.userModel, ...action.data.userModel },
			};
		case types.UPDATE_NOTIFICATIONSEENDATE:	
			return {
				...state, notificationSeenDate: action.date 
			};
		case types.UNSET_USERDATA:
			return { };
		default:
			return state;
	}
}