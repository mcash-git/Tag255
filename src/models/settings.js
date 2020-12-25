import Database from 'api/Database'

class Settings extends Database {
  constructor(token) {
    super('settings');
    this.token = null
  }

  init(token) {
    this.token = token
  }
  
  setSettings(userId, keyValue) {
    return dispatch => dispatch(super.createKeyRecord(this.token, userId, keyValue, 'SETSETTINGS'))
  }

  updateSettings(userId, keyValue) {
    return dispatch => dispatch(super.updateKeyRecord(this.token, userId, keyValue, 'UPDATESETTINGS'))
  }

  getSettings(userId) {
    return dispatch => dispatch(super.readKeyRecord(this.token, userId, 'GETSETTINGS'))
  }

  getUsersSettings(userIds) {
    return dispatch => dispatch(super.readKeyRecord(this.token, null, 'GETUSERSSETTINGS', {
      select: '*',
      where: userIds.map(userId => 'kvsjson->>\'id\' = \'settings_' + userId + '\'').join(' OR '),
      order: ''
    }))
  }
}

export default SettingsModel = new Settings()