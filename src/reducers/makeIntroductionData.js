import * as types from 'constants/ActionTypes';

const _defaultState = { fPerson: {}, sPerson: {}, otherData: {} };

export default function (state = _defaultState, action) {
	switch (action.type) {
		case types.UNSET_MAKEINTRODUCTIONDATA:
			return { ...state, ..._defaultState };
		case types.SET_MAKEINTRODUCTIONDATA:
			console.log('action.data')
			console.log(action.data)
			return {
				...state, ...{
					fPerson: { ...state.fPerson, ...action.data.fPerson },
					sPerson: { ...state.sPerson, ...action.data.sPerson },
					otherData: { ...state.otherData, ...action.data.otherData	},
				}
			}
		default:
			return state;
	}
}