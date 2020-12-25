import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Text, Alert } from 'react-native';
import BusyIndicator from 'react-native-busy-indicator'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { width, height, iconImages, serverUrls, requiredList } from 'constants/config'
import { checkNextProps, connectWithNavigationIsFocused, getAuthHeader, initModels, cleanPhoneNumb } from 'utils'

import * as Models from 'models'

import fetchServ from 'actions/fetchServ'
import * as ApiUtils from 'actions/utils'

import Forms from './Forms';
import Buttons from './Buttons';
import Logo from './Logo';
import Background from './Background';

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
export default class Login extends Component {
	constructor(props) {
		super(props);
		const { settings } = props
		const fields = {
			login: '',
			password: '',
			keepLogin: settings && settings.keepLogin || false
		}
		// const fields = {
		// 	login: '+17602538641',
		// 	password: '{password1Qq}',
		// 	keepLogin: false
		// }
		this.state = {
			fields,
			isLoading: false
		}
	}


	componentWillMount() {
		const { userData, actionParseToken, settings } = this.props
		// Testing alert timeout
		// setTimeout(() => {
		// 	Alert.alert('Hello', null, [
		// 		{text: 'OK', onPress: () => navigation.goBack()}
		// 	], {
		// 		onDismiss: () => navigation.goBack()
		// 	}, 'default', 2)
		// }, 2000)
		if (settings && settings.keepLogin) {
			if (userData && userData.token) {
				this.setState({ isLoading: true }, () => {
					actionParseToken(getAuthHeader(userData.token))
				})
			}
		}
	}


	onLoginPress = () => {
		const { actionAuthenticate } = this.props
		const { fields } = this.state
		const { login, password } = fields
		this.setState({ isLoading: true }, () => {
			actionAuthenticate({
				client_short_code: "cstreet"
			}, getAuthHeader(login + ':' + password, true, 'Basic'))
		})
	}

	onSingUpPress = () => {
		this.props.navigation.navigate('SignUpStack');
	}

	onChangeText = (fieldName, value) => {
		const newStateFields = this.state.fields
		newStateFields[fieldName] = value
		this.setState({fields: newStateFields})
		// const numbers = '0123456789';
		// const isDigit = value.split('').every(q => numbers.includes(q));

		// if (isDigit) {
		// 	this.setState({ phoneNumber: value})
		// }
	}

	onForgetPasswordPress = () => {
		const { navigation } = this.props
		navigation.navigate('ResetPasswordStack')
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
					if (fields.keepLogin) {
						actionSetLocalSettings({
							keepLogin: true
						})
					}
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
					navigation.navigate('Main')
				}
			})
    }
	}

	onFieldChange = (fieldName, value) => {
		const newStateFields = this.state.fields
		if (typeof newStateFields[fieldName] == 'boolean') {
			newStateFields[fieldName] = !newStateFields[fieldName]
		} else {
			newStateFields[fieldName] = value
		}
		this.setState({fields: newStateFields})
	}

	render() {
		const { fields, isLoading } = this.state
		const signInDisabled = !Object.keys(fields).every(fieldKey => requiredList['signin'].includes(fieldKey)
			? !!fields[fieldKey]
			: true
		)
		return (
			<View style={styles.wrapper}>
				<Background />
				<KeyboardAwareScrollView keyboardShouldPersistTaps="handled" enableOnAndroid={true} extraHeight={200} showsVerticalScrollIndicator={false}>
				<Logo />
				<Forms
					onSubmit={this.onLoginPress}
					fields={fields}
					onChangeText={this.onFieldChange}/>
				<Buttons
					signInDisabled={signInDisabled}
					keepLogin={fields.keepLogin}
					onKeepLoginTrigger={() => this.onFieldChange('keepLogin')}
					onForgetPasswordPress={this.onForgetPasswordPress}
					onSignUpPress={this.onSingUpPress}
					onLoginPress={this.onLoginPress} />
				</KeyboardAwareScrollView>
				<BusyIndicator isVisible={isLoading} overlayColor="rgba(0,0,0,0.4)" overlayWidth={60} overlayHeight={60} size="small"/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		backgroundColor: 'rgba(80, 210, 194, 0.95)',
		height: height(110),
		width: width(100)
	}
})
