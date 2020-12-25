import DAO from 'utils/DAO'
import * as types from 'constants/ActionTypes';

import { adapterKeyParams, adapterValueParams, whiteListParams, textErrors } from 'constants/config'
import { filterBlackList, filterWhiteList, applyAdapter, getTextError } from 'utils/index'

export const setErrors = (error={status: 500, msg: 'Internal serrver error'}, type) => {
  return {
    type: types.SET_ERRORS,
    error: {...error, type}
  }
}

export const fetchFetching = (type) => {
  return {
    type: types['FETCH_' + type + '_FETCHING'],
  }
}
export const fetchError = (error = { status: 500, msg: 'Internal server error' }, type) => {
  return {
    type: types['FETCH_' + type + '_ERROR'],
    error: {
      ...error,
      msg: getTextError(error.msg, textErrors)
    }
  }
}
export const fetchSuccess = (response, type) => {
  return {
    type: types['FETCH_' + type + '_SUCCESS'],
    response,
  };
}

export default fetchServ = ({url, method}, params, headers, type, rerturnPromise) => {
  return dispatch => {
    const funct = (resolve, reject) => {
      console.log('req', type)
      dispatch(fetchFetching(type))
      DAO.request({url, method}, applyAdapter(params, type, { adapterKeyParams, adapterValueParams }, whiteListParams), headers)
        .then((response) => {
          console.log('res', type)
          dispatch(fetchSuccess(response, type))
          resolve && resolve(response, type)
        })
        .catch((error) => {
          console.log(error);
          dispatch(setErrors(error, type))
          dispatch(fetchError(error, type))
          reject && reject(error, type)
        })
    }
    if (rerturnPromise) {
      return new Promise((resolve, reject) => {
        funct(resolve, reject)
      })
    } else {
      return funct()
    }
  }
}
