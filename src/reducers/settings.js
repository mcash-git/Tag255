import * as types from 'constants/ActionTypes';

import { defaultSettings } from 'constants/config'

const _defaultState = defaultSettings

export default function (state = _defaultState, action) {
	switch (action.type) {
		case types.SET_SETTINGS:
			return { ...state, ...action.data }
		case types.UNSET_SETTINGS:
			return { ...state, data: {} }
		default:
			return state;
	}
}