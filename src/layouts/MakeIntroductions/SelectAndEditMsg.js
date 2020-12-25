import React, { Component } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, Keyboard, Platform, Alert, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native'
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux'
import BusyIndicator from 'react-native-busy-indicator'
import OneSignal from 'react-native-onesignal';
import moment from 'moment'

import { width, height, iconImages, getBackgroundImageByType, getColorByType, getButtonBackgroundImageByType, isIphoneX, serverUrls} from 'constants/config'
import { checkNextProps, connectWithNavigationIsFocused, filterBlackList, getAuthHeader } from 'utils'

import * as ApiUtils from 'actions/utils'
import * as Models from 'models'

import NavBar from 'components/NavBar'
import StdInput from 'components/StdInput'
import Sep from 'components/Sep'
import ThreeImages from 'components/ThreeImages'
import RoundedBtn from 'components/RoundedBtn'
import StdBtn from 'components/StdBtn'
import BigTextInput from 'components/BigTextInput'
import DefaultMessagesList from 'components/DefaultMessagesList'
import SmallRoundBtn from 'components/SmallRoundBtn'

@connectWithNavigationIsFocused(
  state => ({
    makeIntroductionData: state.makeIntroductionData,
    userData: state.userData,
    makeIntroduction: state.makeIntroduction,
    addNotification: state.addNotification,
    savedMessages: state.savedMessages,
    getUsersPushIds: state.getUsersPushIds,
    getUsersSettings: state.getUsersSettings,
    connect: state.connect
  }),
  dispatch => ({
    resetMakeIntroductionData: () => {
      dispatch(ApiUtils.resetMakeIntroductionData())
    },
    actionMakeIntroduction: (id, data) => {
      dispatch(Models.introduction.makeIntroduction(id, data))
    },
    addNewMessage: (data) => {
      dispatch(ApiUtils.addNewMessage(data))
    },
    actionAddNotification: (userId, data) => {
      dispatch(Models.notification.addNotification(userId, data))
    },
    actionGetUsersPushIds: (userIds) => {
      dispatch(Models.pushIds.getUsersPushIds(userIds))
    },
    actionGetUsersSettings: (userIds) => {
      dispatch(Models.settings.getUsersSettings(userIds))
    },
    actionConnect: (data, headers) => {
      return new Promise((resolve, reject) => {
        dispatch(
          fetchServ(
            serverUrls.connect,
            data,
            headers,
            'CONNECT',
            true)
          )
        .then((result) => {
          resolve(result)
        })
        .catch((error) => {
          reject(error)
        })
      })
    },
    actionInviteUser: (data, headers) => {
			dispatch(fetchServ(serverUrls.inviteUser, data, headers, 'INVITEUSER'))
    },
  })
)
export default class SelectAndEditMsg extends Component {
  constructor(props) {
    super(props);
    const { makeIntroductionData } = this.props
    const { otherData } = makeIntroductionData
    const fields = {
      message: '',
      editedMessage: otherData && otherData.message || ''
    }
    this.state = {
      fields,
      linesCount: 1,
      inputIsFocused: false,
      keyboardIsOpened: false,
      isLoading: false,
      messageIsSaved: false
    }
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  componentWillReceiveProps(nextProps) {
    const { navigation, makeIntroductionData, actionGetUsersSettings } = this.props
    const propsCheckerMakeIntroduction = checkNextProps(nextProps, this.props, 'makeIntroduction', 'anyway')
    if (propsCheckerMakeIntroduction == 'error') {
			const error = nextProps.getSettings.error
			this.setState({
				isLoading: false,
      }, () => {
        Alert.alert(error.msg, null, [
          {text: 'OK', onPress: () => navigation.goBack()}
        ], {
          onDismiss: () => navigation.goBack()
        })
      });
    } else if (propsCheckerMakeIntroduction) {
      this.setState({
        isLoading: false
      }, () => {
        navigation.navigate('MakeIntroSent')
      })
    }

    const propsCheckerGetUsersPushIds = checkNextProps(nextProps, this.props, 'getUsersPushIds', 'anyway')
    if (propsCheckerGetUsersPushIds == 'error') {
			const error = nextProps.getUsersPushIds.error
			this.setState({
				isLoading: false,
      }, () => {
        Alert.alert(error.msg, null, [
          {text: 'OK', onPress: () => navigation.goBack()}
        ], {
          onDismiss: () => navigation.goBack()
        })
      });
    } else if (propsCheckerGetUsersPushIds && propsCheckerGetUsersPushIds != 'empty') {

      const data = nextProps.getUsersPushIds.response
      const { fPerson, sPerson, otherData } = makeIntroductionData
      actionGetUsersSettings([
        fPerson.userId,
        sPerson.userId,
      ])

    } else if (propsCheckerGetUsersPushIds == 'empty') {

		}

    const propsCheckerGetUsersSettings = checkNextProps(nextProps, this.props, 'getUsersSettings', 'anyway')
    if (propsCheckerGetUsersSettings == 'error') {
			const error = nextProps.getUsersSettings.error
			this.setState({
				isLoading: false,
      }, () => {
        Alert.alert(error.msg, null, [
          {text: 'OK', onPress: () => navigation.goBack()}
        ], {
          onDismiss: () => navigation.goBack()
        })
      });
    } else if (propsCheckerGetUsersSettings && propsCheckerGetUsersSettings != 'empty') {
      const usersPushIds = nextProps.getUsersPushIds.response
      const usersSettings = nextProps.getUsersSettings.response

      const { fPerson, sPerson, otherData } = makeIntroductionData
      const registeredUsersArray = [fPerson, sPerson].filter(item => item.userId)

      if (usersPushIds && usersSettings) {
        usersPushIds.forEach(userPushId => {
          const findUserForPushId = registeredUsersArray.find(personData => userPushId.id.indexOf(personData.userId) != -1)

          if (findUserForPushId) {
            const findUserForSettings = usersSettings.find(userSettings => userSettings.id.indexOf(findUserForPushId.userId) != -1)

            if (findUserForSettings) {
              const findOtherUser = [fPerson, sPerson].find(personData => findUserForPushId.userId != personData.userId)

              if (findUserForSettings.pushNotif) {
                let otherParameters = {'ios_badgeType':'Increase','ios_badgeCount':'1'};
                let contents = {
                  'en': nextProps.userData.userModel.firstName + ' ' + nextProps.userData.userModel.lastName + ' wants you to meet ' + findOtherUser.fName + ' ' + findOtherUser.sName
                }

                OneSignal.postNotification(contents, {}, userPushId.userId, otherParameters);
              }
            }
          }
        })
      }
    } else if (propsCheckerGetUsersSettings == 'empty') {

		}
  }

  _keyboardDidShow = () => {
    this.setState({keyboardIsOpened: true})
  }

  _keyboardDidHide = () => {
    this.setState({keyboardIsOpened: false})
  }

  onFieldChange = (fieldName, value) => {
    let newStateFields = this.state.fields
    newStateFields[fieldName] = value
    this.setState({fields: newStateFields})
  }

  confirm = () => {
    const { navigation, resetMakeIntroductionData } = this.props
    navigation.navigate('MakeIntroSent')
  }

  onContentSizeChange = (linesCount) => {
    if (linesCount >= 7) return
    if(linesCount >= 8) {
      this.setState({linesCount: linesCount-1})
    } else {
      this.setState({linesCount: linesCount || 1})
    }
  }

  sendData = () => {
    const { navigation, resetMakeIntroductionData, actionMakeIntroduction, makeIntroductionData, userData, actionAddNotification, actionGetUsersPushIds, actionConnect, actionInviteUser } = this.props
    const { fields } = this.state
    const { fPerson, sPerson, otherData } = makeIntroductionData
    Keyboard.dismiss()
    this.setState({ isLoading: true }, () => {
      const now = moment().unix()
      const introductionId = String(userData.userModel.user_uid) + '_' + now
      actionMakeIntroduction(introductionId, {
        userId1: fPerson.userId,
        userId2: sPerson.userId,
        userPhone1: fPerson.phone,
        userPhone2: sPerson.phone,
        user1: filterBlackList(['avatarSource'], {...fPerson, avatar: fPerson.avatarSource || fPerson.avatar}),
        user2: filterBlackList(['avatarSource'], {...sPerson, avatar: sPerson.avatarSource || sPerson.avatar}),
        relationType: otherData.relationType,
        userIdBy: userData.userModel.user_uid,
        userBy: userData.userModel,
        message: fields.editedMessage,
        messagesUser1AndUser2: [],
        messagesUser1AndUserBy: [],
        messagesUser2AndUserBy: []
      })
      const notificationObject = {
        type: 'makeIntroduction',
        userId1: fPerson.userId,
        userId2: sPerson.userId,
        userPhone1: fPerson.phone,
        userPhone2: sPerson.phone,
        user1: filterBlackList(['avatarSource'], {...fPerson, avatar: fPerson.avatarSource || fPerson.avatar}),
        user2: filterBlackList(['avatarSource'], {...sPerson, avatar: sPerson.avatarSource || sPerson.avatar}),
        relationType: otherData.relationType,
        userIdBy: userData.userModel.user_uid,
        userBy: userData.userModel,
        message: fields.editedMessage,
        introductionId: introductionId,
      }

      if (fPerson.userId) {
        actionAddNotification(fPerson.userId + '_' + userData.userModel.user_uid + '_' + now, {
          ...notificationObject,
          userIdTo: fPerson.userId
        })
        fPerson['emailNotif'] = false
        fPerson['userCount'] = "first"
      }
      else {
        fPerson['emailNotif'] = true
        fPerson['userCount'] = "first"
      }

      if (sPerson.userId) {
        actionAddNotification(sPerson.userId + '_' + userData.userModel.user_uid + '_' + now, {
          ...notificationObject,
          userIdTo: sPerson.userId
        })
        sPerson['emailNotif'] = false
        sPerson['userCount'] = "second"
      }
      else {
        sPerson['emailNotif'] = true
        sPerson['userCount'] = "second"
      }
      const registeredUsersArray = [fPerson, sPerson].filter(item => item.userId)

      const notRegisteredUsersArray = [fPerson, sPerson]

      if (notRegisteredUsersArray && notRegisteredUsersArray.length) {

        notRegisteredUsersArray.forEach((item) => {
          actionConnect({
            introId: 'introduction_' + introductionId,
            phone: item.phone
          }, getAuthHeader(userData.token))
            .then((result) => {
              console.log(item.userCount)
              console.log(item.emailNotif)
              if (item.emailNotif == true && item.userCount == "first") {
                actionInviteUser({
                  ...item,
                  fromName: ''+userData.userModel.firstName+' '+userData.userModel.lastName+'',
                  fPersonfName: fPerson.fName,
                  fPersonsName: fPerson.sName,
                  sPersonfName: sPerson.fName,
                  sPersonsName: sPerson.sName,
                  emailLink: 'http://tagdesignagency.s3-website.us-east-2.amazonaws.com/connector-street/?introId=introduction_' + introductionId +'&user=' + item.phone + '&token=' + result.token,
                  emailTemplate: 'cs-introduction.html',
                  body: 'Check out your introduction from '+userData.userModel.firstName+' '+userData.userModel.lastName+' on Connector Street! View below: \n\n' + 'http://tagdesignagency.s3-website.us-east-2.amazonaws.com/connector-street/?introId=introduction_' + introductionId +'&user=' + item.phone + '&token=' + result.token
                }, getAuthHeader(userData.token))
              }
              else if (item.emailNotif == true && item.userCount == "second"){
                actionInviteUser({
                  ...item,
                  fromName: ''+userData.userModel.firstName+' '+userData.userModel.lastName+'',
                  fPersonfName: sPerson.fName,
                  fPersonsName: sPerson.sName,
                  sPersonfName: fPerson.fName,
                  sPersonsName: fPerson.sName,
                  emailLink: 'http://tagdesignagency.s3-website.us-east-2.amazonaws.com/connector-street/?introId=introduction_' + introductionId +'&user=' + item.phone + '&token=' + result.token,
                  emailTemplate: 'cs-introduction.html',
                  body: 'Check out your introduction from '+userData.userModel.firstName+' '+userData.userModel.lastName+' on Connector Street! View below: \n\n' + 'http://tagdesignagency.s3-website.us-east-2.amazonaws.com/connector-street/?introId=introduction_' + introductionId +'&user=' + item.phone + '&token=' + result.token
                }, getAuthHeader(userData.token))
              }

            })

        })
      }
      if (registeredUsersArray && registeredUsersArray.length) {

        actionGetUsersPushIds(registeredUsersArray.map(item => item.userId))

      }
    })
  }

  onFocusInput = () => {
    this.setState({inputIsFocused: true})
  }

  onBlurInput = () => {
    this.setState({inputIsFocused: false})
  }

  messageItemPress = (item) => {
    this.onFieldChange('editedMessage', item)
    this.bigInput && this.bigInput.focus()
  }

  saveToLibrary = () => {
    const { addNewMessage } = this.props
    const { fields } = this.state
    this.setState({messageIsSaved: true}, () => addNewMessage(fields.editedMessage))
  }

  render() {
    const { navigation, makeIntroductionData, savedMessages, userData } = this.props
    const { fPerson, sPerson, otherData } = makeIntroductionData
    const { fields, linesCount, keyboardIsOpened, isLoading, messageIsSaved, inputIsFocused } = this.state
    const { message, editedMessage } = fields
    const navBarProps = {
      leftPart: {
        image: iconImages.navBarBackIconWhite,
        buttonText: 'EDIT CONTACTS',
        action: () => navigation.goBack()
      }
    }
    const initialWrapperWidth = Platform.OS == 'ios'
      ? isIphoneX()
          ? width(68)
          : width(68)
      : width(58)
    const initialTopPartWrapperHeight = Platform.OS == 'ios'
      ? isIphoneX()
          ? width(80) // 116
          : width(72)
      : width(62)
    const userAvatar = userData && userData.userModel && userData.userModel.avatar

    return (
      <ScrollView style={styles.wrapper} keyboardShouldPersistTaps="handled">
          <View style={styles.topPartWrapper}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style={{flex:1}}>
              <View style={styles.headerWrapper}>
                <ImageBackground source={getBackgroundImageByType(otherData.relationType)} style={styles.topPart}>
                  <NavBar {...navBarProps} statusBarBackgroundColor={getColorByType(otherData.relationType)} transparent navigation={navigation} />
                  <View style={styles.topPartContent}>
                    <Text style={styles.topText}>
                      Awesome! Say a little something.
                    </Text>
                    <View style={styles.row}>
                      <View style={styles.middleComp}>
                        <View style={styles.lineImageWrapper}>
                          <Image style={styles.lineImage} source={iconImages.introductionLineImage} />
                        </View>
                        <View style={styles.middleCompOverlay}>
                          <View style={styles.roundView}>
                            <View style={styles.roundViewText}>
                              <Image style={styles.arrowImage} resizeMode='contain' source={iconImages.doubleArrow} />
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={styles.personItem}>
                        <View style={styles.avatarImageWrapper}>
                          <Image resizeMethod="scale" source={fPerson && fPerson.avatar && {uri:  fPerson.avatar} || iconImages.avatarPlaceholder} style={styles.avatarImage} />
                        </View>
                        <Text style={styles.personName}>
                          {fPerson && (fPerson.fName + ' ' + fPerson.sName)}
                        </Text>
                      </View>
                      <View style={styles.personItem}>
                        <View style={styles.avatarImageWrapper}>
                          <Image resizeMethod="scale" resizeMethod="scale" source={sPerson && sPerson.avatar && {uri: sPerson.avatar} || iconImages.avatarPlaceholder} style={styles.avatarImage} />
                        </View>
                        <Text style={styles.personName}>
                          {sPerson && (sPerson.fName + ' ' + sPerson.sName)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <Sep />
          <KeyboardAvoidingView keyboardVerticalOffset={20} keyboardShouldPersistTaps="handled" behavior={'padding'} style={styles.keyWrapper}>
          { inputIsFocused
          ? <View style={styles.roundedBtnWrapper}>
             <TouchableOpacity
               style={styles.backButton}
                onPress={() => Keyboard.dismiss()}
                 >
                    <Text style={styles.buttonText}>Back to Message List </Text>
                 </TouchableOpacity>

                 <TouchableOpacity
                   style={styles.backButton}

                    onPress={this.saveToLibrary}
                     >
                        <Text style={styles.buttonText}>{
                        messageIsSaved
                          ? 'Saved'
                          : 'Save Message to library'
                      }</Text>
                     </TouchableOpacity>
          </View>
          : null
          }
          <View style={[styles.topInputWrapper, inputIsFocused && {borderBottomWidth: width(0), backgroundColor: '#fafafa'}]}>
              <View style={[styles.topInputInner, {minHeight: width(4) + (width(4.6)*linesCount)}]}>
                <BigTextInput
                  refName={comp => this.bigInput = comp}
                  onFocus={this.onFocusInput}
                  onBlur={this.onBlurInput}
                  value={editedMessage}
                  type="resizable"
                  onContentSizeChange={this.onContentSizeChange}
                  wrapperStyle={{
                    paddingHorizontal: width(4),
                    borderRadius: width(5),
                    borderColor: '#EBEBEB',
                    paddingVertical: width(0.8),
                    backgroundColor: '#FFFFFF',
                    borderWidth: 1
                  }}
                  placeholder="Tap to send custom message..."
                  placeholderTextColor="#5C5C5C"
                  onChangeText={text => this.onFieldChange('editedMessage', text)} />
              </View>
              <View style={styles.topButtonsWrapper}>
              <View style={styles.sendBtnWrapper}>
                    <RoundedBtn
                      innerStyle={{
                        height: width(8),
                        width: width(12),
                        borderRadius: width(8),
                      }}
                      textStyle={{
                        color: 'white',
                        marginTop: 0,
                        fontSize: width(2.8)
                      }}
                      backgroundColor='#007AFF'
                      text='Send'
                    onPress={this.sendData}
                  />
                  </View>
                </View>

            </View>
          {
            !inputIsFocused ?
              <View style={styles.content}>
                <View style={styles.topContentPart}>
                  <View style={styles.textsWrapper}>

                    <View style={styles.messagesListWrapper}>
                      <View style={styles.messageListPadding}>
                      <DefaultMessagesList
                        onPressItem={this.messageItemPress}
                       data={savedMessages.data}/>
                    </View>
                  </View>
                  </View>
                </View>
              </View>
              : null
            }
          </KeyboardAvoidingView>
            <BusyIndicator isVisible={isLoading} overlayColor="rgba(0,0,0,0.4)" overlayWidth={60} overlayHeight={60} size="small"/>


      </ScrollView>
    );
  }
}
/* */
// <View style={styles.threeImagesWrapper}>
//                       <ThreeImages images={['notset', fPerson.avatar, sPerson.avatar]} wrapperWidth={initialWrapperWidth-(width(5)*linesCount)} />
//                     </View>

//        <ScrollView ref={comp => this.scrollView = comp} keyboardShouldPersistTaps="always" style={styles.scrollWrapper} contentContainerStyle={[styles.contentContainerStyle]}>


// <RoundedBtn
//                   innerStyle={{
//                     height: width(6),
//                     width: width(40),
//                     borderRadius: width(8),
//                     borderWidth: 1,
//                     borderColor: '#E4E6E8',
//                   }}
//                   textStyle={{
//                     color: '#8D8D8D',
//                     marginTop: 0,
//                     fontSize: width(2.8)
//                   }}
//                   onPress={this.saveToLibrary}
//                   backgroundColor="transparent"
//                   text="Save Message to Library" />


// <View style={styles.bottomPart}>
//             <View style={styles.btnWrapperPart}>
//               <View style={styles.btnWrapper}>
//                 <StdBtn
//                   type="btImage"
//                   text="Send"
//                   source={getButtonBackgroundImageByType(otherData.relationType)}
//                   onPress={() => this.confirm()} />
//               </View>
//             </View>
//           </View>

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fafafa'
  },
  scrollWrapper: {
    flex: 1,
    height: 50,
    backgroundColor: '#fafafa'
  },
  contentContainerStyle: {
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  topPartWrapper: {
    height: width(75),
    width: width(100),
  },
  headerWrapper: {
    flex: 1
  },
  topPart: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: width(1),
    backgroundColor: '#fafafa'
  },
  topContentPart: {
    alignItems: 'center',
  },
  topInputWrapper: {
    width: width(100),
    elevation: 1,
    backgroundColor: '#FFF',
    borderBottomColor: '#D6D6D6',
    borderBottomWidth: width(.1),
    paddingHorizontal: width(6.5),
    paddingVertical: width(5),
    flexDirection: 'row'
  },
  keyWrapper: {
    flex: 1
  },
  topInputInner: {
    flex: 3,
    minHeight: width(9)
  },
  topPartContent: {
    marginTop: width(1),
    alignItems: 'center',
    justifyContent: 'center',
    width: width(100),
  },
  threeImagesWrapper: {
    marginTop: width(1),
  },
  topText: {
    color: 'white',
    fontSize: width(4.0),
    fontWeight: 'bold'
  },
  textsWrapper: {
    width: width(82),
  },
  title: {
    fontSize: width(3.8),
    fontWeight: '500',
    color: '#646464',
    marginTop: width(3.8),
    marginBottom: width(2)
  },
  messagesListWrapper: {
    maxHeight: width(100)
  },
  inputWrapper: {
    width: '100%',
    marginTop: width(2)
  },
  topButtonsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
  },
  roundedBtnWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: width(12),
    backgroundColor: '#EBEBEB'
  },
  backButton: {
    flex: 1,
    borderRightColor: '#ccc',
    borderRightWidth: width(.5),
    alignItems: 'center'
  },
  buttonText: {
    fontSize: width(3),
    color: '#4B4C4D'
  },
  sendBtnWrapper: {

  },
  bottomPart: {
    width: width(100)
  },
  btnWrapper: {
    height: width(14)
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: width(7.5)
  },
  personItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  personName: {
    marginTop: width(2.2),
    color: 'white',
    fontSize: width(3.5),
  },
  avatarImageWrapper: {
    height: width(25),
    width: width(25),
    borderRadius: width(25),
    overflow: 'hidden',
    marginHorizontal: width(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'white',
    overflow: 'hidden'
  },
  arrowImage:{
    flex:1,
    height: 13,
    width: 13,
    marginTop: 1
  },
  avatarImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover'
  },
  middleComp: {
    width: width(90),
    height: width(27),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  middleCompOverlay: {
    width: width(90),
    height: width(27),
    position: 'absolute',
    left: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineImageWrapper: {
    width: width(20),
    height: 3,
    overflow: 'hidden'
  },
  lineImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  roundView: {
    height: width(7),
    width: width(7),
    borderRadius: width(7),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  roundViewText: {
    fontSize: width(4),
    marginTop: width(-0.4)
  },
})
