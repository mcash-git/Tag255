import React, { Component } from 'react';
import { View, Text, Image, Alert, NativeModules } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import { LoginManager, GraphRequest, GraphRequestManager, AccessToken } from 'react-native-fbsdk'
import BusyIndicator from 'react-native-busy-indicator'
import LinkedinLogin from 'react-native-linkedin-login';
const { RNTwitterSignIn } = NativeModules
import LinkedInModal from 'react-native-linkedin'
import ImageCropper from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs'

import { width, height, iconImages, socialData, serverUrls, mainPath } from 'constants/config';
import { checkNextProps, connectWithNavigationIsFocused, getAuthHeader, initModels } from 'utils'

import NavBar from 'components/NavBar'
import Buttons from './Buttons';
import Background from './Background';

export default class SignUp extends Component {
	constructor(props) {
		super(props);
		// LinkedinLogin.init(
		// 	[
		// 		'r_emailaddress',
		// 		'r_basicprofile'
		// 	]
		// );
		this.state = {
			isLoading: false,
			signUpCredentials: null
		}
	}


	onMobileNumberPress = () => {
		this.props.navigation.navigate('SignUpWithPhoneScreen');
	}

	goBack = () => {
		const { navigation } = this.props
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'LoginStack'})
      ],
     key:null
    })
    navigation.dispatch(resetAction)
	}

	onLoginWithBtnPress = (btnName) => {
		const { navigation } = this.props
		switch (btnName) {
			case 'facebook':
				this.setState({ isLoading: true }, async () => {
					try {
						const logoutResult = LoginManager.logOut();
						const result = await LoginManager.logInWithReadPermissions(['public_profile', 'email']);

						if (result.isCancelled) {
							throw new Error('User cancelled request'); // Handle this however fits the flow of your app
						}

						console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);

						const data = await AccessToken.getCurrentAccessToken();

						if (!data) {
							throw new Error('Something went wrong obtaining the users access token'); // Handle this however fits the flow of your app
						}

						console.log('got data')
						console.log(data)

						const fbToken = data.accessToken
						this.setState({ signUpCredentials: { ...data, token: fbToken, type: 'facebook', email: '' } }, () => {
							const infoRequest = new GraphRequest(
								'/me',
								{
									parameters: {
										'fields': {
												'string' : 'email,first_name,last_name,friends,picture.type(large)'
										}
								}
								},
								this._responseFBInfoCallback,
							);

							new GraphRequestManager().addRequest(infoRequest).start();
						})


					} catch (e) {
						this.setState({ isLoading: false }, () => {
							console.log('Cought login fb error')
						});
					}
				})
				break
			case 'twitter':
				RNTwitterSignIn.init(socialData.twitter.customerKey, socialData.twitter.customerSecret)
				RNTwitterSignIn.logIn()
					.then(loginData => {
						console.log('loginData')
						console.log(loginData)
						const { authToken, authTokenSecret } = loginData
						this.setState({
							isLoading: false
						}, () => {
						if (authToken && authTokenSecret) {
								navigation.navigate('SignUpWithPhoneScreen', {
									signUpCredentials: {
										type: 'twitter',
										authToken: authToken,
										authTokenSecret: authTokenSecret,
										userId: loginData.userID
									},
									fields: {
										fName: loginData.first_name || loginData.userName,
										sName: loginData.userName,
										email: loginData.email,
										avatar: loginData.avatar,
										// nickName: loginData.userName,
										// password: '{' + (socialData.twitter.customerKey + loginData.userID).substr(0,9) + 'Qq}'
									}
								})
							}
						})
					})
					.catch(error => {
						console.log(error)
					}
				)
				break
			case 'linkedIn':
				// LinkedinLogin.login().then((user) => {
				// 	console.log('User logged in: ', user);

				// 	// recieved auth token
				// 	this.setState({ user });

				// 	//  AsyncStorage.setItem('user', JSON.stringify(user), () => {
				// 	// 			this.getUserProfile();
				// 	// 	});


				// }).catch((e) => {
				// 	// var err = JSON.parse(e.description);
				// 	// alert("ERROR: " + e);
				// 	console.log('Error', e);
				// });
				this.linkedInModal && this.linkedInModal.open()

				break
		}
	}

	getUserProfile = () => {
		LinkedinLogin.getProfile().then((data) => {
			console.log('received profile', data);
			const userdata = Object.assign({}, this.state.user, data);

			console.log('user: ', userdata);
			this.setState({ user: userdata });

			AsyncStorage.setItem('user', JSON.stringify(userdata), () => {
					this.getUserProfileImage();
				});

		}).catch((e) => {
			console.log(e);
		});
	}


	getUserProfileImage = () => {
		LinkedinLogin.getProfileImages().then((images) => {
			console.log('received profile image', images);

			const userdata = Object.assign({}, this.state.user, { images });

			AsyncStorage.setItem('user', JSON.stringify(userdata), () => {
				this.setState({ user: userdata });
			});

		}).catch((e) => {
			console.log(e);
		});
	}

	_responseFBInfoCallback = (error, result) => {
		const { navigation } = this.props
		const { signUpCredentials } = this.state
		this.setState({ isLoading: false }, () => {
			if (error) {
				Alert.alert('Error during request info from facebook')
				console.log(error)
			} else {
				console.log('result')
				console.log(result)
				console.log(signUpCredentials)
				this.downloadAfavtar(result.picture && result.picture.data && result.picture.data.url, (avatarData) => {
					navigation.navigate('SignUpWithPhoneScreen', {
						signUpCredentials: signUpCredentials,
						fields: {
							fName: result.first_name,
							sName: result.last_name,
							email: result.email,
							...avatarData
							// nickName: result.first_name + ' ' + result.last_name,
							// password: '{' + (signUpCredentials.applicationID + result.id).substr(0,9) + 'Qq}'
						}
					})
				})
			}
		});
	}

	downloadAfavtar = (avatar, callback) => {
		if (avatar) {
			const filePath = mainPath + 'uloadedAvatar.jpg'
			const downloadFile = RNFS.downloadFile({
				fromUrl: avatar,
				toFile: filePath
			})
			downloadFile.promise
			.then((result) => {
				console.log(result)
				return RNFS.readFile(filePath, 'base64')
			})
			.then((base64Image) => {
				callback({
					avatar: 'file://' + filePath,
					avatarSource: 'data:image/jpeg;base64,' + base64Image,
					avatarExtension: 'jpg'
				})
			})
			.catch((error) => {
				console.log(error)
				callback()
			})
		} else {
			callback()
		}
	}

	requestUserDataFb = () => {
		// _responseInfoCallback(error, result) {
		// 	if (error) {
		// 		alert('Error fetching data: ' + error.toString());
		// 	} else {
		// 		alert('Success fetching data: ' + result.toString());
		// 	}
		// }

		// // Create a graph request asking for user information with a callback to handle the response.
		// const infoRequest = new GraphRequest(
		// 	'/me',
		// 	null,
		// 	(error, result) => {
		// 		if (error) {
		// 			console.log('Get facebook data fail with error: ' + error);
		// 		} else {
		// 			console.log(result)
		// 		}
		// 	},
		// );
		// new GraphRequestManager().addRequest(infoRequest).start();
	}

	getLinkedInProfile = async (tokenData) => {
		console.log(tokenData)
		const { navigation } = this.props
		const baseApi = 'https://api.linkedin.com/v1/people/'
		const params = [
			'first-name',
			'last-name',
			'email-address',
			'id',
			'picture-url'
		]

		const response = await fetch(
			`${baseApi}~:(${params.join(',')})?format=json`,
			{
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + tokenData.access_token
				}
			}
		)
		const data = await response.json()
		console.log(data)
		if (data.status) {
			Alert.alert('Error during request info from linkedIn')
		} else {
			navigation.navigate('SignUpWithPhoneScreen', {
				signUpCredentials: tokenData,
				fields: {
					fName: data.firstName,
					sName: data.lastName,
					email: data.emailAddress,
					avatar: data.pictureUrl,
					// nickName: data.firstName + ' ' + data.lastName,
					// password: '{' + (socialData.linkedIn.clientID + data.id).substr(0,9) + 'Qq}'
				}
			})
		}
	}

	render() {
		const { navigation } = this.props
		const { isLoading } = this.state
		const navBarProps = {
      leftPart: {
        image: iconImages.navBarBackArrowLongIconWhite,
        action: () => this.goBack()
      },
			centerPart: {
				image: iconImages.navBarLogoImage,
				imageWrapperCustomStyle: {
					width: width(50),
					height: width(20),
					marginLeft: width(7),
					alignItems: 'center',
					justifyContent: 'center',
				},
				imageCustomStyles: {
					height: '120%',
					width: '120%',
					marginTop: width(20),
				}
      },
    }
		return (
			<View style={ { flex: 1, justifyContent: 'space-around', backgroundColor: 'rgba(80, 210, 194, 0.95)' } }>
				<Background />
				<NavBar {...navBarProps} transparent navigation={navigation} />
     		<View style={ { height: width(5) } } />
     		<Text style={ { fontSize: width(6), textAlign: 'center', color: 'white', marginBottom: width(5) } }>Sign Up With</Text>
     		<Buttons onBtnPress={this.onLoginWithBtnPress} />
     		<Text style={ { fontSize: width(3.2), textAlign: 'center', color: 'white' } }>OR</Text>
     		<Button title='Mobile Number' textStyle={ { fontSize: width(3.8) } } borderRadius={ 30 } buttonStyle={ { width: width(54), height: width(10), alignSelf: 'center', backgroundColor: 'rgba(255, 255, 255, 0.3)' } } onPress={ this.onMobileNumberPress } />
     		<View style={ { height: width(50) } }>
				</View>
				<BusyIndicator isVisible={isLoading} size="large" />
				<LinkedInModal
					ref={comp => this.linkedInModal = comp}
					linkText=""
          clientID={socialData.linkedIn.clientID}
          clientSecret={socialData.linkedIn.clientSecret}
          redirectUri="https://google.com"
          onSuccess={this.getLinkedInProfile}
        />
   		</View>
		);
	}
}
