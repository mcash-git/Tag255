import Database from 'api/Database'
import moment from 'moment'

class Notification extends Database {
  constructor(token) {
    super('pushIds');
    this.token = null
  }

  init(token) {
    this.token = token
  }
  
  setUserPushIds(userId, keyValue) {
    return dispatch => dispatch(super.createKeyRecord(this.token, userId, {...keyValue, }, 'SETUSERPUSHIDS'))
  }

  getUserPushIds(userId) {
    return dispatch => dispatch(super.readKeyRecord(this.token, userId, 'GETUSERPUSHIDS', {
      select: '*',
      where: 'kvsjson->>\'id\' = \'pushIds_' + userId + '\'',
      order: ''
    }))
  }

  getUsersPushIds(userIds) {
    return dispatch => dispatch(super.readKeyRecord(this.token, null, 'GETUSERSPUSHIDS', {
      select: '*',
      where: userIds.map(userId => 'kvsjson->>\'id\' = \'pushIds_' + userId + '\'').join(' OR '),
      order: ''
    }))
  }

  updateUserPushIds(userId, keyValue) {
    return dispatch => dispatch(super.updateKeyRecord(this.token, userId, keyValue, 'UPDATEPUSHIDS'))
  }
}

export default NotificationModel = new Notification()