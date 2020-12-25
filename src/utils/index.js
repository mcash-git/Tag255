
import NavigationIsFocused from './NavigationIsFocused'
export const connectWithNavigationIsFocused = NavigationIsFocused
var btoa = require('Base64').btoa

export const checkNextProps = (nextProps, props, property, type, withoutProperty) => {
  const newIsFocused = nextProps.navigation.isFocused()
  const oldIsFocused = props.navigation.isFocused()
  if (!newIsFocused && newIsFocused!= undefined) {
    switch (type) {
      case 'once':
        if (oldIsFocused && !newIsFocused) return false
      case 'noway':
        if (!oldIsFocused && !newIsFocused) return false
      case 'anyway':
        break  
      default:
        return false  
    }
  }
  if (withoutProperty) {
    if (props[property] != nextProps[property]) {
      if (nextProps[property] && Object.keys(nextProps[property]).length) {
        return true
      } else {
        return 'empty'
      }
    }
  } else {
    if (nextProps[property] && !nextProps[property].isFetching && props[property].isFetching != nextProps[property].isFetching) {
      if (nextProps[property].response) {
        return true  
      } else if (nextProps[property].error) { 
        return 'error'
      } else {
        return 'empty'
      }
    }
  }
  return false
}

export const queryString = (json) => {
  return Object.keys(json).reduce(function (str, key, i) {
    var delimiter, val;
    delimiter = (i === 0) ? '?' : '&';
    key = encodeURIComponent(key);
    val = json[key];
    return [str, delimiter, key, '=', val].join('');
  }, '');
}

export const filterBlackList = (blackList, params, addParamsList) => {
  let fullList = blackList
  if (addParamsList && addParamsList.length) fullList = [...fullList, ...addParamsList]
  if (!(blackList && blackList.length)) return params
  return params
    ? Object.entries(params)
      .filter(([key]) => !fullList.includes(key))
      .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {})
    : null; 
}

export const filterWhiteList = (whiteList, params, addParamsList) => {
  let fullList = whiteList
  if (addParamsList && addParamsList.length) fullList = [...fullList, ...addParamsList]
  if (!(whiteList && whiteList.length)) return params
  return params
    ? Object.entries(params)
      .filter(([key]) => fullList.includes(key))
      .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {})
    : {}; 
}

export const applyAdapter = (params, type, { adapterKeyParams, adapterValueParams }, whiteListParams, incomming) => {
  if (!params || typeof params != 'object' || !(adapterKeyParams && adapterKeyParams[type])) return params || null
  const data = incomming
    ? Object.assign({}, ...Object.keys(params).map(key => params[key] == 0 || params[key] != '' ? ({[Object.keys(adapterKeyParams[type]).find(adapterParamKey => adapterKeyParams[type][adapterParamKey] == key) || key]: adapterValueParams[type] && adapterValueParams[type][key] && adapterValueParams[type][key](params[key]) || params[key]}) : null))
    : Object.assign({}, ...Object.keys(params).map(key => params[key] == 0 || params[key] != '' ? ({[adapterKeyParams[type][key] || key]: adapterValueParams[type] && adapterValueParams[type][key] && adapterValueParams[type][key](params[key]) || params[key] }) : null))
  if (whiteListParams[type]) return filterWhiteList(whiteListParams[type], data)
  return data
}

export const checkRequiredFieldsNotEmpty = (fieldsObj, requiredList, exceptList = []) => {
  return Object.keys(fieldsObj).every(fieldsObjKey => !exceptList.includes(fieldsObjKey) 
    ? requiredList
      ? requiredList.includes(fieldsObjKey) 
        ? !!fieldsObj[fieldsObjKey]
        : true
      : !!fieldsObj[fieldsObjKey]
    : true
  )
}

export const uniqueID = () => {
  const chr4 = () => {
    return Math.random().toString(16).slice(-4);
  }
  return chr4() + chr4() +
    '-' + chr4() +
    '-' + chr4() +
    '-' + chr4() +
    '-' + chr4() + chr4() + chr4();
}

export const getAuthHeader = (token, toBase64 = false, type = 'Bearer') => {
  try {
    return {
      Authorization: type + ' ' + (toBase64 ? btoa(token) : token)
    }
  } catch (error) {
    console.log('error btoa encode')
    console.log(error)
  }
}

export const getTextError = (error, textErrors) => {
  if (typeof error == 'string' || !error) {
    return error || 'Internal server error'
  } else {
    const errorFound = Object.keys(error).find(errorKey => error && error[errorKey])
    console.log(errorFound)
    if (errorFound) {
      return textErrors[errorFound] || error.message
    }
    return error.message
  }
}

export const initModels = (models, token) => {
  Object.keys(models).forEach(modelKey => {
    models[modelKey]['init'] && models[modelKey]['init'](token)
  })
}

export const fullCleanPhone = (phoneNumber) => {
  if (!phoneNumber) return ''
  return phoneNumber
      .replace(/\s/g, "")
      .replace(/\(/g, "")
      .replace(/\)/g, "")
      .replace(/-/g, "")
      .replace(/\+/g, "")
}

export const cleanPhoneNumb = (phoneNumber) => {
  if (phoneNumber.indexOf('(') != -1 && phoneNumber.indexOf(')') != -1) {
    const phoneNumberArray = phoneNumber.split(' ')
    const countryArr = phoneNumberArray[0].split('(')
    const countryCode = countryArr[1].substring(0, countryArr[1].length - 1)
    return (countryCode + phoneNumberArray[1] + (phoneNumberArray[2] || ''))
      .replace(/ /g, "")
      .replace(/\(/g, "")
      .replace(/\)/g, "")
      .replace(/-/g, "")
  } else {
    return phoneNumber
  }
}