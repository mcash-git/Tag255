import Database from 'api/Database'
import moment from 'moment'

import { fullCleanPhone } from 'utils'

class Introduction extends Database {
  constructor(token) {
    super('introduction');
    this.token = null
  }

  init(token) {
    this.token = token
  }
  
  makeIntroduction(id, keyValue) {
    return dispatch => dispatch(super.createKeyRecord(this.token, id, {...keyValue, date: moment().unix()}, 'MAKEINTRODUCTION'))
  }
  
  updateIntroduction(id, keyValue) {
    return dispatch => dispatch(super.updateKeyRecord(this.token, id, keyValue, 'UPDATEINTRODUCTION'))
  }

  getIntroductionById(id) {
    return dispatch => dispatch(super.readKeyRecord(this.token, id, 'GETINTRODUCTIONBYID'))
  }

  getMyIntroductions(userId) {
    return dispatch => dispatch(super.readKeyRecord(this.token, userId, 'GETMYINTRODUCTIONS', {
      select: '*',
      where: 'kvsjson->>\'userIdBy\' = \'' + userId + '\' AND kvsjson->>\'id\' LIKE \'%' + 'introduction' + '%\'',
      order: ''
    }))
  }

  getMyConnections(userId, userPhone) {
    return dispatch => dispatch(super.readKeyRecord(this.token, userId, 'GETMYCONNECTIONS', {
      select: '*',
      where: '(kvsjson->>\'userId1\' = \'' + userId + '\' OR kvsjson->>\'userId2\' = \'' + userId + '\' OR kvsjson->>\'userPhone1\' LIKE \'%' + fullCleanPhone(userPhone) + '%\' OR kvsjson->>\'userPhone2\' LIKE \'%' + fullCleanPhone(userPhone) + '%\') AND kvsjson->>\'id\' LIKE \'%' + 'introduction' + '%\'',
      order: ''
    }))
  }
}

export default IntroductionModel = new Introduction()