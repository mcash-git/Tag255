import axios from 'axios'


export default requestServer = (url, method, params) => {
  const fetchParams = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    },
    data: method == 'POST'
      ? params
      : null
  }
  return new Promise((resolve, reject) => {
    axios(url, fetchParams)
      .then((response) => {
        console.log(response)
        resolve({...response.data, status: 'success'})
      })
      .catch((error) => {
        console.log('error')
        console.log(error)
        reject({
          status: 'failed',
          code: 500,
          message: error.msg,
        })
      })
  })
}