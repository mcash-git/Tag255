import React, { Component} from 'react';
import { View, StyleSheet, Text, Alert, SafeAreaView } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import Permissions from 'react-native-permissions'
import moment from 'moment'
import OneSignal from 'react-native-onesignal';

import { width, height, iconImages, overlay, isIphoneX, serverUrls } from 'constants/config'
import { connectWithNavigationIsFocused, checkNextProps } from 'utils'

import * as Models from 'models'
import * as ApiUtils from 'actions/utils'

import Buttons from './Buttons';
import Background from './Background';
import Avatar from './Avatar';
import NavBar from 'components/NavBar'

@connectWithNavigationIsFocused(
  state => ({
		userData: state.userData,
		getNotifications: state.getNotifications,
		updateSettings: state.updateSettings,
		getSettings: state.getSettings,
		watchedNotifications: state.watchedNotifications,
		pushIdsLocal: state.pushIdsLocal,
		setUserPushIds: state.setUserPushIds,
		getUserPushIds: state.getUserPushIds,
		updateUserPushIds: state.updateUserPushIds
  }),
	dispatch => ({
		actionGetSettings(userId) {
      dispatch(SettingsModel.getSettings(userId))
    },
    actionUpdateSettings(userId, data) {
      dispatch(SettingsModel.updateSettings(userId, data))
		},
		setUserData: (data) => {
			dispatch(ApiUtils.setUserData(data))
		},
		actionGetSettings(userId) {
      dispatch(SettingsModel.getSettings(userId))
		},
		actionSetUserPushIds: (userId, data) => {
      dispatch(Models.pushIds.setUserPushIds(userId, data))
    },
		actionGetUserPushIds: (userId) => {
      dispatch(Models.pushIds.getUserPushIds(userId))
    },
		actionUpdateUserPushIds: (userId, data) => {
      dispatch(Models.pushIds.updateUserPushIds(userId, data))
    }
  })
)
export default class Home extends Component {
	constructor(props) {
		super(props);
		const { userData } = this.props
		this.state = {
			pushNotif: false,
			avatar: userData && userData.userModel && userData.userModel.avatar,
			firstName: userData && userData.userModel && userData.userModel.firstName
		}
	}

	goToNotifications = () => {
		const { navigation } = this.props
		navigation.navigate('Notifications')
	}

	async componentDidMount () {
		const { actionUpdateSettings, setUserData, actionGetUserPushIds, userData, pushIdsLocal } = this.props
		Permissions.check('notification').then(response => {
			if (response != 'authorized') {
        Permissions.request('notification').then(response => {
					if (response != 'authorized') {
						this.setState({ pushNotif: true }, () => {
							actionUpdateSettings({
								pushNotif:  true
							})
							actionGetUserPushIds(userData.userModel.user_uid)
						})
					} else {
						this.setState({ pushNotif: false }, () => {
							actionUpdateSettings({
								pushNotif:  false
							})
						})
					}
        })
			} else {
				actionGetUserPushIds(userData.userModel.user_uid)
			}
    })
		Permissions.check('camera').then(response => {
      if (response != 'authorized') {
        Permissions.request('camera').then(response => {
					if (response != 'authorized') {
						console.log('got camera permissions')
					} else {
						console.log('did not get camera permission')
					}
        })
      }
    })
		Permissions.check('photo').then(response => {
      if (response != 'authorized') {
        Permissions.request('photo').then(response => {
					if (response != 'authorized') {
						console.log('got photo permissions')
					} else {
						console.log('did not get photo permission')
					}
        })
      }
    })
	}

	componentWillReceiveProps(nextProps) {
		const { actionGetSettings, setUserData, actionUpdateUserPushIds, actionSetUserPushIds, pushIdsLocal } = this.props
		const propsCheckerUpdateSettings = checkNextProps(nextProps, this.props, 'updateSettings')
    if (propsCheckerUpdateSettings == 'error') {
			const error = nextProps.updateSettings.error
			this.setState({
				isLoading: false,
      }, () => {
        Alert.alert(error.msg, null, [
          {text: 'OK', onPress: () => navigation.goBack()}
        ], {
          onDismiss: () => navigation.goBack()
        })
      });
    } else if (propsCheckerUpdateSettings && propsCheckerUpdateSettings != 'empty') {
			const data = nextProps.getSettings.response
      actionGetSettings(nextProps.userData.userModel.user_uid)
    } else if (propsCheckerUpdateSettings == 'empty') {
      actionGetSettings(nextProps.userData.userModel.user_uid)
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
      const data = nextProps.getSettings.response
      setUserData({settings: data})
    } else if (propsCheckerGetSettings == 'empty') {

		}

		const propsCheckerUserData = checkNextProps(nextProps, this.props, 'userData', 'anyway', true)
		if (propsCheckerUserData && propsCheckerUserData != 'empty') {
			this.setState({
				avatar: nextProps.userData && nextProps.userData.userModel && nextProps.userData.userModel.avatar,
				firstName: nextProps.userData && nextProps.userData.userModel && nextProps.userData.userModel.firstName
			})
		}

		const propsCheckerGetUserPushIds = checkNextProps(nextProps, this.props, 'getUserPushIds')
    if (propsCheckerGetUserPushIds == 'error') {
			const error = nextProps.getUserPushIds.error
			this.setState({
				isLoading: false,
      }, () => {
        Alert.alert(error.msg, null, [
          {text: 'OK', onPress: () => navigation.goBack()}
        ], {
          onDismiss: () => navigation.goBack()
        })
      });
    } else if (propsCheckerGetUserPushIds && propsCheckerGetUserPushIds != 'empty') {
			const data = nextProps.getUserPushIds.response
			// Alert.alert('got data ' + JSON.stringify(data))
			// Alert.alert(JSON.stringify(pushIdsLocal) + ' userId' + nextProps.userData.userModel.user_uid)
			if (data) {
				actionUpdateUserPushIds(nextProps.userData.userModel.user_uid, pushIdsLocal)
			} else {
				actionSetUserPushIds(nextProps.userData.userModel.user_uid, pushIdsLocal)
			}
    } else if (propsCheckerGetUserPushIds == 'empty') {
			actionSetUserPushIds(nextProps.userData.userModel.user_uid, pushIdsLocal)
		}
	}

	getTextFormTime = () => {
		const currHour = Number(moment().format('HH'))
		if (currHour >= 12 && currHour < 18) {
			return 'Good Afternoon, '
		} else if (currHour >= 18 && currHour <= 24) {
			return 'Good evening, '
		} else {
			return 'Good Morning, '
		}
	}

	render () {
		const { navigation, userData, getNotifications, watchedNotifications } = this.props
		const { avatar, firstName } = this.state
		const navBarProps = {
      leftPart: {
        image: iconImages.navBarMenuIcon,
        action: () => navigation.navigate('DrawerOpen')
      },
      centerPart: {
				image: iconImages.navBarLogoImage,
				imageWrapperCustomStyle: {
					width: width(70),
					height: width(20),
					alignItems: 'center',
					justifyContent: 'center',
				},
				imageCustomStyles: {
					height: '100%',
					width: '100%',
					marginTop: width(20)
				}
      },
		}
		const newNotificationsAmount = getNotifications.response && getNotifications.response.filter(notif => watchedNotifications.data.indexOf(notif.id) == -1).length
		const textFromTime = this.getTextFormTime()
		return (
			<View style={styles.wrapper}>
				<Background />
				<View style={styles.contentWrapper}>
					<NavBar {...navBarProps} transparent navigation={navigation} />
					<View style={styles.content}>
						<View style={styles.topPartWrapper}>
							{
								firstName
									&& 	<Text style={styles.greetingText}>
												{textFromTime + firstName}!
											</Text>
							}
							{
								avatar
									&& <Avatar source={avatar} notificationsAmount={newNotificationsAmount} />
							}
						</View>
						<SafeAreaView >

							<Button
								onPress={this.goToNotifications}
								title={
									newNotificationsAmount
										? 'You have ' + newNotificationsAmount + ' new notifications!'
										: 'You do not have any notifications'
								}
								textStyle={styles.btnText}
								rightIcon={
									newNotificationsAmount
										? { name: 'chevron-right', color: 'white', size: width(6)}
										: null
									}
								buttonStyle={styles.btn}/>
							<Buttons
								onMakeIntoductionPress={() => navigation.navigate('MakeIntroductions', {prevScreen: 'Home'})}
								onMyIntoductionsPress={() => navigation.navigate('MyIntroductions')}
								onInvitePress={() => navigation.navigate('Invite')}
								onMyConnectionsPress={() => navigation.navigate('Connections')}
								// onMenuButtonPress={this.onMenuButtonPress}
								/>
						</SafeAreaView>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
	},
	contentWrapper: {
		...overlay
	},
	content: {
		justifyContent: 'space-between',
		flex: 1
	},
	topPartWrapper: {
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	greetingText: {
		fontSize: width(6),
		textAlign: 'center',
		color: '#FFFFFF',
		paddingHorizontal: width(10),
		marginTop: isIphoneX()
			?	width(20)
			: width(5)
	},
	btnText: {
		color: 'white',
		fontSize: width(4),
		marginRight: width(1)
	},
	btn: {
		width: width(100),
		alignSelf: 'center',
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: "rgba(255, 255, 255, .4)",
		backgroundColor: 'transparent'
	}
})
