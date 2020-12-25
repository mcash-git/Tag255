import React, { Component } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, Keyboard, Platform, TouchableWithoutFeedback } from 'react-native'
import { NavigationActions } from 'react-navigation';
import BusyIndicator from 'react-native-busy-indicator'
import OneSignal from 'react-native-onesignal';
import moment from 'moment'

import { width, height, iconImages, getBackgroundImageByType, getColorByType, getButtonBackgroundImageByType, isIphoneX } from 'constants/config'
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
    savedMessages: state.savedMessages,
    addNotification: state.addNotification,
    userData: state.userData
  }),
  dispatch => ({
    actionAddNotification: (userId, data) => {
      dispatch(Models.notification.addNotification(userId, data))
    },
    addNewMessage: (data) => {
      dispatch(ApiUtils.addNewMessage(data))
    },
    actionUpdateIntroduction: (id, data) => {
      dispatch(Models.introduction.updateIntroduction(id, data))
    },
  })
)
export default class ConnSelectAndEditMsg extends Component {
  constructor(props) {
    super(props);
    const fields = {
      message: '',
      editedMessage: ''
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
    Keyboard.dismiss()
    navigation.navigate('ConnSent')
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
    const { navigation, userData, actionUpdateIntroduction, actionAddNotification } = this.props
    const { fields } = this.state
    const { editedMessage } = fields
    Keyboard.dismiss()
    const detailsData = navigation.state && navigation.state.params && navigation.state.params.detailsData
    const mateUserModel = userData.userModel.user_uid == detailsData.userId1 || (detailsData.user1 && (userData.userModel.mobilePhone == detailsData.user1.phone || userData.userModel.user == detailsData.user1.phone))
      ? detailsData.user2
      : detailsData.user1
    if (mateUserModel) {
      const notificationObject = {
        type: 'message',
        userTo: mateUserModel,
        userIdBy: userData.userModel.user_uid,
        userBy: userData.userModel,
        message: fields.editedMessage,
        userIdTo: mateUserModel.userId,
        relationType: detailsData.relationType
      }
      if (mateUserModel.userId) {
        actionAddNotification(userData.userModel.user_uid + '_' + mateUserModel.userId + '_' +  moment().unix(), notificationObject)
      }
    }
    const updateIntroductionId = detailsData.id.split('_').slice(1).join('_')
    actionUpdateIntroduction(updateIntroductionId, {
      ...detailsData,
      messagesUser1AndUser2: [
        ...detailsData.messagesUser1AndUser2,
        {
          id: detailsData.messagesUser1AndUser2 && detailsData.messagesUser1AndUser2.length || 0,
          text: editedMessage,
          date: moment().unix()
        }
      ]
    })
    navigation.navigate('ConnSent', {detailsData})
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

  render() {
    const { navigation, makeIntroductionData, savedMessages, userData } = this.props
    const { fields, linesCount, keyboardIsOpened, isLoading, messageIsSaved } = this.state
    const detailsData = navigation.state && navigation.state.params && navigation.state.params.detailsData
    const { message, editedMessage } = fields
    const navBarProps = {
      leftPart: {
        image: iconImages.navBarBackIconWhite,
        action: () => navigation.goBack()
      },
      centerPart: {
        text: 'Select Message'
      },
    }
    const initialAvatarWidth = Platform.OS == 'ios'
      ? isIphoneX()
        ? width(52)
        : width(44)
      : width(40)
      const mateUserModel = userData.userModel.user_uid == detailsData.userId1 || (detailsData.user1 && (userData.userModel.mobilePhone == detailsData.user1.phone || userData.userModel.user == detailsData.user1.phone))
      ? detailsData.user2
      : detailsData.user1
    const avatarImageWidth = initialAvatarWidth - (width(5) * linesCount)
    const initialTopPartWrapperHeight = Platform.OS == 'ios'
      ? isIphoneX()
          ? width(80) // 116
          : width(74)
      : width(62)
    return (
      <View style={styles.wrapper}>
          <View style={[styles.topPartWrapper, {height: initialTopPartWrapperHeight-(width(5)*(linesCount - 1))}]}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style={{flex:1}}>
              <View style={styles.headerWrapper}>
                <ImageBackground source={getBackgroundImageByType(detailsData.relationType)} style={styles.topPart}>
                  <NavBar {...navBarProps} statusBarBackgroundColor={getColorByType(detailsData.relationType)} transparent navigation={navigation} />
                  <View style={styles.topPartContent}>
                    <Text style={styles.topText}>
                      Awesome! Say a little something.
                    </Text>
                    <View style={[styles.avatarImageWrapper, {width: avatarImageWidth, height: avatarImageWidth, borderRadius: avatarImageWidth}]}>
                      <Image style={styles.avatarImage} source={mateUserModel && mateUserModel.avatar && {uri: mateUserModel.avatar} || iconImages.avatarPlaceholder} />
                    </View>
                  </View>
                </ImageBackground>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <Sep />
          {
            !keyboardIsOpened ?
              <View style={styles.content}>
                <View style={styles.topContentPart}>
                  <View style={styles.textsWrapper}>
                    <Text style={styles.title}>
                      Select a message
                    </Text>
                    <View style={styles.messagesListWrapper}>
                      <DefaultMessagesList
                        onPressItem={this.messageItemPress}
                        data={savedMessages.data}/>
                    </View>
                  </View>
                </View>
              </View>
              : null
          }
          <BusyIndicator isVisible={isLoading} overlayColor="rgba(0,0,0,0.4)" overlayWidth={60} overlayHeight={60} size="small"/> 
        <View style={[styles.topInputWrapper, keyboardIsOpened && {position: 'relative'}]}>
          <View style={[styles.topInputInner, {minHeight: width(4) + (width(5)*linesCount)}]}>
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
                paddingVertical: width(2),
                backgroundColor: 'white',
                borderWidth: 1
              }}
              placeholder="Send custom message..."
              onChangeText={text => this.onFieldChange('editedMessage', text)} />
          </View>
          {
            keyboardIsOpened
              ? <View style={styles.topButtonsWrapper}>
                  <View style={styles.roundedBtnWrapper}>
                    <RoundedBtn
                      innerStyle={{
                        height: width(8),
                        width: width(40),
                        borderRadius: width(8),
                        borderWidth: 1,
                        borderColor: '#E4E6E8',
                      }}
                      textStyle={{
                        color: '#8D8D8D',
                        marginTop: 0,
                        fontSize: width(2.8)
                      }}
                      onPress={this.saveToLibrary}
                      backgroundColor="white"
                      text={
                        messageIsSaved
                          ? 'Saved'
                          : 'Save Message to Library'
                      } />
                  </View>
                  <View style={styles.sendBtnWrapper}>
                    <SmallRoundBtn
                      backgroundColor="#6FB5E6"
                      icon={iconImages.smallBtnArrowRightWhite}
                      customWidth={width(7)}
                      customIconStyle={{width: width(3.6), height: width(3.6)}}
                      onPress={this.sendData} />
                  </View>
                </View>
              : null
          }
        </View>
      </View>
    );
  }
}

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
    flex: 1
  },
  scrollWrapper: {
    flex: 1,
    backgroundColor: '#F7F7F7'
  },
  contentContainerStyle: {
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: width(10)
  },
  topPartWrapper: {
    width: width(100),
    height: Platform.OS == 'ios'
      ? isIphoneX()
          ? width(80) // 116
          : width(70)
      : width(62)
  },
  headerWrapper: {
    flex: 1
  },
  topPart: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  avatarImageWrapper: {
    height: width(44),
    width: width(44),
    overflow: 'hidden',
    marginTop: width(2)
  },
  avatarImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover'
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7F7F7',
  },
  topContentPart: {
    alignItems: 'center',
  },
  topInputWrapper: {
    width: width(100),
    backgroundColor: '#F7F7F7',
    paddingHorizontal: width(8),
    paddingVertical: width(3),
    position: 'absolute',
    bottom: 0,
    left: 0
  },
  topInputInner: {
    minHeight: width(9),
    marginBottom: width(1.4)
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
    fontSize: width(4.6),
    fontWeight: '500'
  },
  textsWrapper: {
    width: width(80),
  },
  title: {
    fontSize: width(3.2),
    fontWeight: '500',
    color: '#646464',
    marginTop: width(3.8)
  },
  messagesListWrapper: {
    marginVertical: width(3),
    maxHeight: width(70)
  },
  inputsWrapper: {
    marginTop: width(1.4),
    width: width(80),
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  inputWrapper: {
    width: '100%',
    marginTop: width(2)
  },
  topButtonsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roundedBtnWrapper: {
  },
  sendBtnWrapper: {

  },
  bottomPart: {
    width: width(100)
  },
  btnWrapper: {
    height: width(14)
  }
})
