import * as types from 'constants/ActionTypes';
import moment from 'moment'
import store from 'api/ReduxStore'

import { dayNames, monthNames } from 'constants/config'

const _defaultState = { response: '', isFetching: false, error: null };

export const makeIntroduction = (state = _defaultState, action) => {
	switch (action.type) {
		case types.FETCH_MAKEINTRODUCTION_FETCHING:
			return { ...state, isFetching: true };
		case types.FETCH_MAKEINTRODUCTION_ERROR:
			return { ...state, isFetching: false, response: '', error: action.error };
		case types.FETCH_MAKEINTRODUCTION_SUCCESS:
			return { ...state, response: action.response, isFetching: false };
		default:
			return state;
	}
}

export const introductionById = (state = _defaultState, action) => {
	switch (action.type) {
		case types.FETCH_GETINTRODUCTIONBYID_FETCHING:
			return { ...state, isFetching: true };
		case types.FETCH_GETINTRODUCTIONBYID_ERROR:
			return { ...state, isFetching: false, response: '', error: action.error };
		case types.FETCH_GETINTRODUCTIONBYID_SUCCESS:
			return { ...state, response: action.response && action.response[0] && action.response[0][1], isFetching: false };
		default:
			return state;
	}
}

export const getMyIntroductions = (state = _defaultState, action) => {
	switch (action.type) {
		case types.FETCH_GETMYINTRODUCTIONS_FETCHING:
			return { ...state, isFetching: true };
		case types.FETCH_GETMYINTRODUCTIONS_ERROR:
			return { ...state, isFetching: false, response: '', error: action.error };
		case types.FETCH_GETMYINTRODUCTIONS_SUCCESS:
			const data = action.response && action.response.map(item => item[1]).sort((a, b) => a.date > b.date) || []
			const storeState = store.getState()
			console.log('getMyIntroductions')
			console.log(data)
			let dataGroupedByDay = []
			data.forEach(item => {
				const dateDay = Math.floor(item.date / (86400))
				const itemMoment = moment.unix(item.date)
				const itemTime = itemMoment.format('hh:mm a')
				const itemObj = {
					key: item.id,
					time: itemTime.split(' ')[0],
					midnight: itemTime.split(' ')[1],
					topText: item.user1.fName + ' and ' + item.user2.fName,
					relationType: item.relationType,
					avatar1: item.user1.avatar,
					avatar2: item.user2.avatar,
					text: item.message || 'Test message',
					fullDetails: {
						...item,
						ownerAvatar: storeState.userData.settings.avatar
					}
				}
				const findIndexOfDataByDateDay = dataGroupedByDay.findIndex(item => item.dateDay == dateDay)
				if (dataGroupedByDay.findIndex(item => item.dateDay == dateDay) == -1) {
					dataGroupedByDay.push(
						{
							title: dayNames[itemMoment.isoWeekday() - 1].toUpperCase() + ' ' + monthNames[itemMoment.month()].toUpperCase() + ' ' + itemMoment.date(),
							data: [itemObj],
							date: item.date,
							dateDay: dateDay
						}
					)
				} else {
					dataGroupedByDay[findIndexOfDataByDateDay].data.push(itemObj)
				}
			})
			return { ...state, response: dataGroupedByDay.sort((a, b) => a.date < b.date) , isFetching: false };
		default:
			return state;
	}
}

export const getMyConnections = (state = _defaultState, action) => {
	switch (action.type) {
		case types.FETCH_GETMYCONNECTIONS_FETCHING:
			return { ...state, isFetching: true };
		case types.FETCH_GETMYCONNECTIONS_ERROR:
			return { ...state, isFetching: false, response: '', error: action.error };
		case types.FETCH_GETMYCONNECTIONS_SUCCESS:
			const storeState = store.getState()
			const data = action.response && action.response.map(item => item[1]).sort((a, b) => a.date > b.date) || []
			console.log('getMyConnections')
			console.log(data)
			let dataGroupedByDay = []
			const userPhone = storeState.userData.userModel.phone
			const userId = storeState.userData.userModel.user_uid
			data.forEach(item => {
				const dateDay = Math.floor(item.date / (86400))
				const itemMoment = moment.unix(item.date)
				const itemTime = itemMoment.format('hh:mm a')
				const numbOfUser = userId == item.userId1 || userPhone == item.userPhone1
					? '2'
					: '1'
				const itemObj = {
					key: item.id,
					time: itemTime.split(' ')[0],
					midnight: itemTime.split(' ')[1],
					topText: item['user' + numbOfUser].fName + ' ' + item['user' + numbOfUser].sName,
					relationType: item.relationType,
					avatar: item['user' + numbOfUser].avatar,
					text: 'Introduced by ' + item.userBy.firstName + ' ' + item.userBy.lastName,
					fullDetails: item
				}
				const findIndexOfDataByDateDay = dataGroupedByDay.findIndex(item => item.dateDay == dateDay)
				if (dataGroupedByDay.findIndex(item => item.dateDay == dateDay) == -1) {
					dataGroupedByDay.push(
						{
							title: dayNames[itemMoment.isoWeekday() - 1].toUpperCase() + ' ' + monthNames[itemMoment.month()].toUpperCase() + ' ' + itemMoment.date(),
							data: [itemObj],
							date: item.date,
							dateDay: dateDay
						}
					)
				} else {
					dataGroupedByDay[findIndexOfDataByDateDay].data.push(itemObj)
				}
			})
			return { ...state, response: dataGroupedByDay.sort((a, b) => a.date < b.date) , isFetching: false };
		default:
			return state;
	}
}