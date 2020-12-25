import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Alert } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation';

import { width, height, iconImages, getBackgroundImageByType, getColorByType, getButtonBackgroundImageByType, isIphoneX, serverUrls } from 'constants/config'
import { checkNextProps, connectWithNavigationIsFocused, getAuthHeader, initModels, cleanPhoneNumb } from 'utils'

import * as Models from 'models'

import fetchServ from 'actions/fetchServ'
import * as ApiUtils from 'actions/utils'

import NavBar from 'components/NavBar'
import StdInput from 'components/StdInput'
import Sep from 'components/Sep'
import ThreeImages from 'components/ThreeImages'
import BigTextInput from 'components/BigTextInput'
import RoundedBtn from 'components/RoundedBtn'
import StdBtn from 'components/StdBtn'

@connectWithNavigationIsFocused(
  state => ({
		authenticate: state.authenticate,
		userData: state.userData,
		parseToken: state.parseToken,
		settings: state.settings,
		getSettings: state.getSettings,
		setSettings: state.setSettings,
		getAllUsers: state.getAllUsers,
		getNotifications: state.getNotifications
  }),
  dispatch => ({
    actionAuthenticate: (data, headers) => {
      dispatch(fetchServ(serverUrls.authenticate, data, headers, 'AUTHENTICATE'))
		},
		actionParseToken: (headers) => {
			dispatch(fetchServ(serverUrls.parseToken, null, headers, 'PARSETOKEN'))
		},
		setUserData: (data) => {
			dispatch(ApiUtils.setUserData(data))
		},
		actionSetLocalSettings: (data) => {
			dispatch(ApiUtils.setSettings(data))
		},
		actionGetSettings(userId) {
      dispatch(Models.settings.getSettings(userId))
		},
		actionSetSettings(userId, data) {
      dispatch(Models.settings.setSettings(userId, data))
		},
		// actionGetAllUsers: (headers) => {
		// 	dispatch(fetchServ(serverUrls.getAllUsers, null, headers, 'GETALLUSERS'))
		// },
		actionAddNotification: (userId, data) => {
      dispatch(Models.notification.addNotification(userId, data))
		},
		actionGetNotifications: (userId) => {
      dispatch(Models.notification.getNotifications(userId))
    }
  })
)
export default class Confirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }

  login = () => {
    // const { navigation } = this.props
    // const resetAction = NavigationActions.reset({
    //   index: 0,
    //   actions: [
    //     NavigationActions.navigate({ routeName: 'LoginStack'})
    //   ],
    //  key:null
    // })
    // this.props.navigation.dispatch(resetAction)
    const { actionAuthenticate, navigation } = this.props
    const navParams = navigation.state.params
    console.log('navParams')
    console.log(navParams)
		navParams && this.setState({ isLoading: true }, () => {
			actionAuthenticate({
				client_short_code: "cstreet"
			}, getAuthHeader(navParams.phone + ':' + navParams.password, true, 'Basic'))
		})
  }

  componentWillReceiveProps(nextProps) {
		const { navigation, setUserData, userData, actionParseToken, actionSetLocalSettings, actionGetSettings, actionSetSettings, actionGetNotifications } = this.props
		const { fields } = this.state
    const propsCheckerAuthenticate = checkNextProps(nextProps, this.props, 'authenticate')
    if (propsCheckerAuthenticate == 'error') { 
			const error = nextProps.authenticate.error
			this.setState({
				isLoading: false,
			});
			if (error.msg != "Token has expired.") {
				Alert.alert(error.msg)
			}
    } else if (propsCheckerAuthenticate && propsCheckerAuthenticate != 'empty') {
			const data = nextProps.authenticate.response
			setUserData({
				token: data.token
			})
			actionParseToken(getAuthHeader(data.token))
    } else if (propsCheckerAuthenticate == 'empty') {
      this.setState({
        isLoading: false,
      });
		}
		
		const propsCheckerParseToken = checkNextProps(nextProps, this.props, 'parseToken')
    if (propsCheckerParseToken == 'error') { 
			const error = nextProps.parseToken.error
			this.setState({
				isLoading: false,
			});
      if (error.msg != "Token has expired.") {
				Alert.alert(error.msg)
			}
    } else if (propsCheckerParseToken && propsCheckerParseToken != 'empty') {
			const data = nextProps.parseToken.response
			if (Object.keys(data).map(userDataKey => userData.userModel[userDataKey] == data[userDataKey]).every(item => item) && Object.keys(data).length == Object.keys(userData.userModel).length) {
				const token = nextProps.userData.token
				const userId = nextProps.userData.userModel.user_uid
				if (token) {
					initModels(Models, token)
					console.log('read from parsetoken')
					actionGetSettings(userId)
				}
			} else {
				setUserData({userModel: data})
			}
    } else if (propsCheckerParseToken == 'empty') {
      this.setState({
        isLoading: false,
			})
		}
		
		const propsCheckerGetSettings = checkNextProps(nextProps, this.props, 'getSettings')
    if (propsCheckerGetSettings == 'error') { 
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
    } else if (propsCheckerGetSettings && propsCheckerGetSettings != 'empty') {
			console.log('getSettings')
      const userId = nextProps.parseToken.response.user_uid
			const data = nextProps.getSettings.response
			setUserData({settings: data})
    } else if (propsCheckerGetSettings == 'empty') {
			const userId = nextProps.parseToken.response.user_uid
			actionSetSettings(
				userId, 
				{
					emailNotif: true,
					pushNotif: true,
					textNotif: true,
				}
			)
		}
		
		const propsCheckerSetSettings = checkNextProps(nextProps, this.props, 'setSettings')
    if (propsCheckerSetSettings == 'error') { 
			const error = nextProps.setSettings.error
			this.setState({
				isLoading: false,
      }, () => {
        Alert.alert(error.msg, null, [
          {text: 'OK', onPress: () => navigation.goBack()}
        ], {
          onDismiss: () => navigation.goBack()
        })
      });
    } else if (propsCheckerSetSettings) {
			const userId = nextProps.parseToken.response.user_uid
			console.log('userId')
			console.log(userId)
			actionGetSettings(userId)
    }
		
		const propsCheckerUserData = checkNextProps(nextProps, this.props, 'userData', null, true)
		if (propsCheckerUserData && propsCheckerUserData != 'empty') {
			const token = nextProps.userData.token
			const userId = nextProps.userData.userModel.user_uid
			if (token) {
				initModels(Models, token)
				if (nextProps.userData.settings && Object.keys(nextProps.userData.settings).length && nextProps.userData.userModel && Object.keys(nextProps.userData.userModel).length) {
          // do not use keepLogin here
          // if (fields.keepLogin) {
					// 	actionSetLocalSettings({
					// 		keepLogin: true
					// 	})
          // }
          
					// if (!(nextProps.getAllUsers.response && nextProps.getAllUsers.response.length)) {
					// 	// actionGetAllUsers(getAuthHeader(nextProps.userData.token))
					// 	actionGetNotifications(nextProps.userData.userModel.user_uid)		
					// } else {
						if (nextProps.userData && nextProps.userData.userModel && !nextProps.userData.userModel.email) {
							const cleanedPhone = cleanPhoneNumb(fields.login || nextProps.userData.userModel.user)
							const findUserByPhone = nextProps.getAllUsers && nextProps.getAllUsers.response && nextProps.getAllUsers.response.find(user => user['2fa_mobile'] == cleanedPhone)
							if (findUserByPhone) {
								setUserData({userModel: {email: findUserByPhone.email}})
							} else {
								// actionGetAllUsers(getAuthHeader(nextProps.userData.token))
								actionGetNotifications(nextProps.userData.userModel.user_uid)		
							}
						} else {
							actionGetNotifications(nextProps.userData.userModel.user_uid)
						}
					// }
				} else {
					if (userId) {
						console.log('read from userdata')
						console.log('userId')
						console.log(userId)
						actionGetSettings(userId)
					}
				}
			}
		}

		// const propsCheckerGetAllUsers = checkNextProps(nextProps, this.props, 'getAllUsers')
    // if (propsCheckerGetAllUsers == 'error') { 
		// 	const error = nextProps.setSettings.error
		// 	this.setState({
		// 		isLoading: false,
    //   }, () => {
    //     Alert.alert(error.msg, null, [
    //       {text: 'OK', onPress: () => navigation.goBack()}
    //     ], {
    //       onDismiss: () => navigation.goBack()
    //     })
    //   });
		// } else if (propsCheckerGetAllUsers) {
		// 	const data = nextProps.getAllUsers.response
		// 	if (!(nextProps.getNotifications.response && nextProps.getNotifications.response.length)) {
		// 		const cleanedPhone = cleanPhoneNumb(fields.login || nextProps.userData.userModel.user)
		// 		const findUserByPhone = nextProps.getAllUsers && nextProps.getAllUsers.response && nextProps.getAllUsers.response.find(user => user['2fa_mobile'] == cleanedPhone)
		// 		actionGetNotifications(nextProps.userData.userModel.user_uid)		
		// 		if (findUserByPhone) {
		// 			setUserData({userModel: {email: findUserByPhone.email}})
		// 		}
		// 	}
		// }
		
		const propsCheckerGeNotifications = checkNextProps(nextProps, this.props, 'getNotifications', 'noway')
    if (propsCheckerGeNotifications == 'error') { 
			const error = nextProps.getNotifications.error
			this.setState({
				isLoading: false,
      }, () => {
        Alert.alert(error.msg, null, [
          {text: 'OK', onPress: () => navigation.goBack()}
        ], {
          onDismiss: () => navigation.goBack()
        })
      });
		} else if (propsCheckerGeNotifications) {
			const data = nextProps.getNotifications.response
			this.setState({ isLoading: false }, () => {
				if (!this.goToMainBlock) {
					this.goToMainBlock = true
          const { navigation } = this.props
          const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'Main'})
            ],
           key:null
          })
          this.props.navigation.dispatch(resetAction)
				}
			})
    }
	}

  render() {
    const { navigation } = this.props
    const navBarProps = {
      leftPart: {
        image: iconImages.navBarBackIconWhite,
        action: () => navigation.goBack()
      },
      centerPart: {
        text: 'Reset Password'
      },
    }
    return (
      <View style={styles.wrapper}>
        <NavBar {...navBarProps} navBarBackgroundImage={iconImages.navBarBackgroundImageGreen} navigation={navigation} />
        <View style={styles.content}>
          <View style={styles.topPartWrapper}>
            <View style={styles.textsWrapper}>
              <Text style={styles.title}>
                Your password has been updated!
              </Text> 
              <Text style={styles.text}>
                You can use this password to login immediately. 
              </Text> 
            </View>
          </View>
          <View style={styles.centerPartWrapper}>
            <View style={styles.successImageWrapper}>
              <Image style={styles.succeessImage} source={iconImages.confirmPasswordImage} />
            </View>
          </View>
          <View style={styles.bottomPartWrapper}>
            <View style={styles.roundBtnWrapper}>
              <RoundedBtn
                innerStyle={{
                  height: width(9),
                  width: width(60),
                  borderRadius: width(8),
                  borderWidth: 0,
                }}
                textStyle={{
                  color: 'white',
                  fontSize: width(3),
                  marginTop: 0
                }}
                onPress={this.login}
                backgroundColor="#8D8D8D"
                text="Login" />  
            </View> 
          </View>  
        </View>  
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'white',
    height: height(100)
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    maxHeight: isIphoneX()
      ? height(85)
      : 'auto'
  },
  topPartWrapper: {
    width: width(80),
  },
  textsWrapper: {
    alignItems: 'center'
  },
  title: {
    fontSize: width(4),
    fontWeight: '400',
    color: '#646464',
    marginTop: width(6),
    lineHeight: width(6),
    textAlign: 'center',
    width: width(60)
  },
  text: {
    fontSize: width(3),
    color: '#A2A5AA',
    marginTop: width(8),
    lineHeight: width(6),
    textAlign: 'center'
  },
  successImageWrapper: {
    height: width(28),
    width: width(28),
  },
  succeessImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  centerPartWrapper: {
    width: '100%',
    marginBottom: width(18),
    alignItems: 'center'
  },
  bottomPartWrapper: {
    width: '100%',
    alignItems: 'center'
  },
  roundBtnWrapper: {
    marginVertical: width(4)
  },
})