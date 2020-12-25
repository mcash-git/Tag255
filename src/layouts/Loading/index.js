import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, Platform, ImageBackground } from 'react-native'
import NestedScrollView from 'react-native-nested-scroll-view'
import { NavigationActions } from 'react-navigation';
import BusyIndicator from 'react-native-busy-indicator'

import { width, height, iconImages, serverUrls, requiredList } from 'constants/config'
import { checkNextProps, connectWithNavigationIsFocused, getAuthHeader, initModels, cleanPhoneNumb } from 'utils'

import * as Models from 'models'

import * as ApiUtils from 'actions/utils'
import fetchServ from 'actions/fetchServ'

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
		setSettings: (data) => {
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
export default class AddContactInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }

  componentWillMount() {
    const { userData, actionParseToken, settings, navigation } = this.props
    setTimeout(() => {
			if (settings && settings.keepLogin) {
				if (userData && userData.token) {
					this.setState({ isLoading: true }, () => {
						actionParseToken(getAuthHeader(userData.token))
					})
				} else {
					navigation.navigate('LoginStack')
				}
			} else {
				navigation.navigate('LoginStack')
			}
		}, 1000)
  }

  componentWillReceiveProps(nextProps) {
		const { navigation, setUserData, userData, actionParseToken, setSettings, actionGetSettings, actionSetSettings, actionGetNotifications } = this.props
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
			navigation.navigate('LoginStack')
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
			navigation.navigate('LoginStack')
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
					// if (!(nextProps.getAllUsers.response && nextProps.getAllUsers.response.length)) {
					// 	// actionGetAllUsers(getAuthHeader(nextProps.userData.token))
					// 	actionGetNotifications(nextProps.userData.userModel.user_uid)
					// } else {
						if (nextProps.userData && nextProps.userData.userModel && !nextProps.userData.userModel.email) {
							// const cleanedPhone = cleanPhoneNumb(fields.login || nextProps.userData.userModel.user)
							// const findUserByPhone = nextProps.getAllUsers && nextProps.getAllUsers.response && nextProps.getAllUsers.response.find(user => user['2fa_mobile'] == cleanedPhone)
							// if (findUserByPhone) {
							// 	setUserData({userModel: {email: findUserByPhone.email}})
							// } else {
								// actionGetAllUsers(getAuthHeader(nextProps.userData.token))
								actionGetNotifications(nextProps.userData.userModel.user_uid)
							// }
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

		const propsCheckerGeNotifications = checkNextProps(nextProps, this.props, 'getNotifications')
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
				navigation.navigate('Main')
			})
    }
	}

  render() {
    const { navigation } = this.props
    const { isLoading } = this.state
    return (
			<View style={styles.wrapper} contentContainerStyle={styles.contentContainerStyle}>
				<ImageBackground source={iconImages.splash} style={{ flex: 1 }}>
				</ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: height(100),
  },
})
