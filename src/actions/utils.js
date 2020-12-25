import * as types from 'constants/ActionTypes';

export const setContacts = (data) => {
  return {
    type: types.SET_CONTACTS,
    data,
  }
};

export const resetContacts = () => {
  return { type: types.RESET_CONTACTS }
};

export const setMakeIntroductionData = (data) => {
  return {
    type: types.SET_MAKEINTRODUCTIONDATA,
    data,
  }
};

export const resetMakeIntroductionData = () => {
  return { type: types.UNSET_MAKEINTRODUCTIONDATA, }
};

export const setSettings = (data) => {
  return {
    type: types.SET_SETTINGS,
    data,
  }
};

export const resetSettings = () => {
  return { type: types.RESET_SETTINGS };
};

export const setUserData = (data) => {
  return {
    type: types.SET_USERDATA,
    data
  };
};

export const unsetUserData = () => {
  return {
    type: types.UNSET_USERDATA,
  };
};

export const updateNotificationSeenDate = (date) => {
  return {
    type: types.UPDATE_NOTIFICATIONSEENDATE,
    date: date
  };
};

export const addNewMessage = (data) => {
  console.log('addNewMessage')
  console.log(data)
  return {
    type: types.ADD_SAVED_MESSAGE,
    data: data
  };
};

export const addWatchedNotificationIds = (data) => {
  return {
    type: types.ADD_WATCHED_NOTIFICATIONS,
    data: data
  };
};

export const setPushIdsLocal = (data) => {
  return {
    type: types.SET_PUSH_IDS_LOCAL,
    data: data
  };
};

