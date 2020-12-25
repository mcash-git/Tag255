import axios from 'axios'
import { Platform } from 'react-native'

import { baseUrl } from 'constants/config'
import { queryString, textErrors } from 'utils'

export default DAO = {
  request({url, method}, params, headers) {
    return new Promise((resolve, reject) => {
      let fetchParams = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: method == 'POST' || method == 'PUT'
          ? JSON.stringify(params)
          : null
      }
      if (headers) fetchParams.headers = {...fetchParams.headers, ...headers}
      console.log(baseUrl + url + (method == 'GET' && params ? queryString(params) : ''))
      console.log(params)
      console.log(fetchParams)
      fetch(baseUrl + url + (method == 'GET' && params ? queryString(params) : ''), fetchParams)
        .then((response) => {
          console.log('response')
          console.log(response)
          let data
          if (response._bodyText && response._bodyText.indexOf('<html') == -1) {
            try {
              data = JSON.parse(response._bodyText)
            } catch (error) {
              console.log(error)
              data = response._bodyText
            }
          } else {
            data = response._bodyText
          }
          if (response.status == 200) {
            resolve(data)
          } else {
            reject({
              status: response.status,
              msg: data.description,
            })
          }
        })
        .catch((error) => {
          console.log('error')
          console.log(error)
          // if (error.code == 'ECONNABORTED') {
          //   reject({
          //     code: 408,
          //     message: 'Timeout. Check your internet connection.',
          //   })
          // }
          reject({
            code: 500,
            message: error.msg,
          })
        })
    })
  }
}