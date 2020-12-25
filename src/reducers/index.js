import { persistCombineReducers } from 'redux-persist'
import { AsyncStorage } from 'react-native'

import routes from './routes'
import errors from './errors'
import userData from './userData'
import settings from './settings'

// local imports
import makeIntroductionData from './makeIntroductionData'
import contacts from './contacts'
import watchedNotifications from './watchedNotifications'

// requests imports
import request from './request'
import user from './user'
import countryCodes from './countryCodes'
import createUser from './createUser'
import updateUser from './updateUser'
import getUsers from './getUsers'
import validateToken from './validateToken'
import authenticate from './authenticate'
import resetPswdRequest from './resetPswdRequest'
import parseToken from './parseToken'
import getAllUsers from './getAllUsers'
import getImage from './getImage'
import sendSms from './sendSms'
import uploadImage from './uploadImage'
import kvsCreateRecord from './kvsCreateRecord'
import kvsDeleteRecord from './kvsDeleteRecord'
import kvsReadRecord from './kvsReadRecord'
import kvsUpdateRecord from './kvsUpdateRecord'
import savedMessages from './savedMessages'
import pushIdsLocal from './pushIdsLocal'
import setNewPswdRequest from './setNewPswdRequest'
import inviteUser from './inviteUser'
import connect from './connect'

// model reducers
import { getSettings, updateSettings, setSettings, getUsersSettings } from './models/settings'
import { makeIntroduction, getMyIntroductions, getMyConnections, introductionById } from './models/introduction'
import { addNotification, getNotifications } from './models/notification'
import { setUserPushIds, getUserPushIds, getUsersPushIds, updateUserPushIds } from './models/pushIds'

const persistConfig = {
  key: 'primary',
  storage: AsyncStorage,
  debug: true,
  blacklist: [],
  whitelist: ['userData', 'countryCodes', 'settings', 'watchedNotifications']
}

export default persistCombineReducers(persistConfig, {
  routes,
  errors,
  request,
  settings,
  user,
  userData,
  countryCodes,
  contacts,
  makeIntroductionData,
  createUser,
  updateUser,
  getUsers,
  validateToken,
  authenticate,
  resetPswdRequest,
  parseToken,
  getImage,
  getAllUsers,
  sendSms,
  uploadImage,
  kvsCreateRecord,
  kvsDeleteRecord,
  kvsReadRecord,
  kvsUpdateRecord,
  savedMessages,
  pushIdsLocal,
  watchedNotifications,
  setNewPswdRequest,
  inviteUser,
  connect,
  //model reducers
  getSettings,
  updateSettings,
  setSettings,
  getUsersSettings,
  makeIntroduction,
  introductionById,
  getMyIntroductions,
  getMyConnections,
  addNotification,
  getNotifications,
  setUserPushIds,
  getUserPushIds,
  getUsersPushIds,
  updateUserPushIds
})