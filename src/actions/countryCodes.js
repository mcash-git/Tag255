import axios from 'axios'
import * as types from 'constants/ActionTypes';

import { countryCodesUrl } from 'constants/config'

const fetchFetching = (type) => {
  return {
    type: types['FETCH_COUNTRYCODES_FETCHING'],
  }
}
const fetchError = (error = 'Unknown error', type) => {
  return {
    type: types['FETCH_COUNTRYCODES_ERROR'],
    error
  }
}
const fetchSuccess = (response, type) => {
  return {
    type: types['FETCH_COUNTRYCODES_SUCCESS'],
    response,
  };
}

export const fetchCountryCodes = () => {
  return dispatch => {
    dispatch(fetchFetching())
    // console.log(type)
    const normalizeIsoCode = code => {
			if (code.length > 0) {
				return code.slice(0, 2); 
			}
			return "";
		};

		const formatCode = data => {
			return data.map(q => normalizeIsoCode(q.isocode) + "(+" + q.countrycode  + ")");           
    }
		axios.get(countryCodesUrl)
      .then(res => {
        const countryCodes = formatCode(res.data).sort();
        dispatch(fetchSuccess(countryCodes))
			})
      .catch(error => {
        console.log(error)
        dispatch(fetchError(error))
      });
  }
}
