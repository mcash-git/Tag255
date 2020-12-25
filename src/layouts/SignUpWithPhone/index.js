import React, { Component} from 'react';
import { ScrollView, View, StyleSheet, Text, Alert, Platform, ImageEditor} from 'react-native';
import { Button } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import BusyIndicator from 'react-native-busy-indicator'
import RNFS from 'react-native-fs'
import ImageResizer from 'react-native-image-resizer';
import ImageCropper from 'react-native-image-crop-picker';

import { width, height, iconImages, serverUrls, requiredList, imageInBase64, mainPath, isIphoneX } from 'constants/config';
import { connectWithNavigationIsFocused, checkNextProps } from 'utils'

import Modal from './Modal';
import ModalSelectPhoto from './ModalSelectPhoto';
import ModalComplete from './ModalComplete';
import Background from './Background';
import Forms from './Forms';
import Avatar from './Avatar';
import NavBar from 'components/NavBar'

import fetchServ from 'actions/fetchServ'

var options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

@connectWithNavigationIsFocused(
	state => ({
		createUser: state.createUser
	}),
  dispatch => ({
    actionCreateUser: (data, headers) => {
      dispatch(fetchServ(serverUrls.createUser, data, headers, 'CREATEUSER'))
    }
  })
)
export default class SignUpWithPhone extends Component {
	constructor(props) {
		super(props);
		const { navigation } = this.props
		const navParams = navigation.state.params
		const navFields = navParams && navParams.fields
		console.log(navFields)
		const fields = {
			fName: navFields && navFields.fName || '',
			sName: navFields && navFields.sName || '',
			nickName: navFields && navFields.nickName || '',
			phone: navFields && navFields.phone || '',
			email: navFields && navFields.email || '',
			password: '',
			avatar: navFields && navFields.avatar || '',
			avatarSource: navFields && navFields.avatarSource || '',
			avatarExtension: navFields && navFields.avatarExtension || ''
		}
		// {password1Qq}
		// const fields = {
		// 	fName: 'Saprronov',
		// 	sName: 'Kirill',
		// 	nickName: 'bintoll',
		// 	phone: '+1 (760) 253-8641',
		// 	email: 'sapronovkd@gmail.com',
		// 	password: '{password1Qq}',
		// 	avatar: '',
		// 	avatarSource: ''
		// }
		this.state = {
			fields,
			modalSelectPhotoShow: false,
			modalCompleteShow: false,
			modalAreYouSureShow: false,
			checkedPhotoId: -1,
			isLoading: false,
			typeOfConfirmImageModal: null,
			prevValue: ''
		}
	}

	componentWillReceiveProps(nextProps) {
		const { navigation } = this.props
		const { fields } = this.state
		const propsCheckerCreateUser = checkNextProps(nextProps, this.props, 'createUser')
		if (propsCheckerCreateUser == 'error') {
			const error = nextProps.createUser.error
			console.log(nextProps.createUser)
			this.setState({
        isLoading: false,
			}, () => {
				Alert.alert(error.msg && error.msg.message, null, [
					{text: 'OK'}
				])
			});
    } else if (propsCheckerCreateUser && propsCheckerCreateUser != 'empty') {
			const data = nextProps.createUser.response
			this.setState({ isLoading: false }, () => {
				navigation.navigate('SignUpConfirmCode', {
					signUpCredentials: navigation.state && navigation.state.params && navigation.state.params.signUpCredentials,
					fields: {
						...fields,
						mfa_id: String(data.mfa_id)
					}
				})
			})
    } else if (propsCheckerCreateUser == 'empty') {
      this.setState({
        isLoading: false,
      });
    }
	}


	onFieldChange = (fieldName, value) => {
    let newStateFields = this.state.fields
		newStateFields[fieldName] = value
    this.setState({fields: newStateFields})
  }

	onGetStartedPress = () => {
		const { fields, checkedPhotoId } = this.state
		const { avatar, avatarSource } =fields
		if (this.checkFields()) {
			if (!avatar && !avatarSource && checkedPhotoId == -1) {
				this.setState({ modalAreYouSureShow: true });
				// this.setState({modalSelectPhotoShow: true})
			} else {
				this.setState({ typeOfConfirmImageModal: null }, () => this.requestCreateUser())
			}
		}
	}



	requestCreateUser = () => {
		const { actionCreateUser } = this.props
		const { fields  } = this.state
		this.setState({ isLoading: true }, () => {
			actionCreateUser({
				"phone": fields.phone,
				"email": fields.email
			})
		})
	}


	checkFields = () => {
		const { fields } = this.state
		if (!fields.password) {
			Alert.alert('The password should not be emty')
			return false
		} else {
			if (!/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(fields.password)) {
				Alert.alert('The password should have at least one special char')
				return false
			}
			if (!/\d/.test(fields.password)) {
				Alert.alert('The password should have at least one digit')
				return false
			}
			if (!(fields.password.length >= 8 && fields.password.length <= 30)) {
				Alert.alert('The password length should be between 8 and 30')
				return false
			}
			if (fields.password === fields.password.toLowerCase()) {
				Alert.alert('The password should have at least one uppercase letter')
				return false
			}
			if (fields.password === fields.password.toUpperCase()) {
				Alert.alert('The password should have at least one lowercase letter')
				return false
			}
		}
		return true
	}

	onTakePhotoPress = () => {
		setTimeout(() => {
			ImageCropper.openCamera({
				width: 300,
				height: 300,
				cropping: true,
				includeBase64: true
			}).then((imageObj) => {
				console.log('imageObj')
				console.log(imageObj)
				const res = {
					uri: imageObj.path,
					data: imageObj.data
				}
				this.onGetImageResponse(res)
			})
			.catch((error) => {
				console.log('onTakePhotoPress error')
				console.log(error)
			})
		}, 100)
		// ImagePicker.launchCamera(options, (response)  => {
		// 	this.onGetImageResponse(response)
		// });
	}

	onCameraRollPress = () => {
		setTimeout(() => {
			ImageCropper.openPicker({
				width: 300,
				height: 300,
				cropping: true,
				includeBase64: true
			}).then((imageObj) => {
				console.log('imageObj')
				console.log(imageObj)
				const res = {
					uri: imageObj.path,
					data: imageObj.data,
					path: imageObj.path
				}
				this.onGetImageResponse(res)
			})
			.catch((error) => {
				console.log('onCameraRollPress error')
				console.log(error)
			})
		}, 100)
		// ImagePicker.launchImageLibrary(options, (response)  => {
		// 	this.onGetImageResponse(response)
		// });
	}

	onGetImageResponse = (response) => {
		console.log('Response = ', response);

		if (response.didCancel) {
			console.log('User cancelled image picker');
		}
		else if (response.error) {
			console.log('ImagePicker Error: ', response.error);
		}
		else if (response.customButton) {
			console.log('User tapped custom button: ', response.customButton);
		}
		else {
			this.setState({ prevValue: this.state.fields.avatarSource }, () => {
				this.onFieldChange('avatar', response.uri)
				this.onFieldChange('avatarSource', 'data:image/jpeg;base64,' + response.data)
				this.onFieldChange('avatarExtension',
					response.path && response.path.split('.') && response.path.split('.')[response.path.split('.').length - 1] && response.path.split('.')[response.path.split('.').length - 1].toLowerCase() ||
					response.fileName && response.fileName.split('.') && response.fileName.split('.')[response.fileName.split('.').length -1] && response.fileName.split('.')[response.fileName.split('.').length -1].toLowerCase() ||
					'jpg'
				)
				this.setState({
					modalPhotoVisible: false,
					checkedPhotoId: -1
				}, () => {
					if (this.state.typeOfConfirmImageModal == 'profile') {
						this.setState({modalCompleteShow: true})
					}
				})
			})

			// ImageCropper.openCropper({
			// 	path: response.uri,
			// 	width: 300,
			// 	height: 300,
			// 	cropping: true,
			// 	includeBase64: true
			// }).then((imageObj) => {
			// 	console.log('imageObj')
			// 	console.log(imageObj)
			// 	const res = {
			// 		uri: imageObj.path,
			// 		data: imageObj.data
			// 	}
			// 	this.setState({ prevValue: this.state.fields.avatarSource }, () => {
			// 		this.onFieldChange('avatar', res.uri)
			// 		this.onFieldChange('avatarSource', 'data:image/jpeg;base64,' + res.data)
			// 		this.onFieldChange('avatarExtension',
      //       response.path && response.path.split('.') && response.path.split('.')[1] && response.path.split('.')[1].toLowerCase() ||
      //       response.fileName && response.fileName.split('.') && response.fileName.split('.')[1] && response.fileName.split('.')[1].toLowerCase() ||
      //       'jpg'
      //     )
			// 		this.setState({
			// 			modalPhotoVisible: false,
			// 			checkedPhotoId: -1
			// 		}, () => {
			// 			if (this.state.typeOfConfirmImageModal == 'profile') {
			// 				this.setState({modalCompleteShow: true})
			// 			}
			// 		})
			// 	})
			// });

			// ImageEditor.cropImage(response.uri, {
			// 	size: {
			// 		width: 300,
			// 		height: 300
			// 	},
			// 	offset: {
			// 		x: 0,
			// 		y: 0
			// 	}
			// }, (newImageUrlCroped) => {
			// 	return RNFS.readFile(newImageUrlCroped, 'base64')
			// 	.then((base64Image) => {
			// 		this.setState({ prevValue: this.state.fields.avatarSource }, () => {
			// 			this.onFieldChange('avatar', newImageUrlCroped)
			// 			this.onFieldChange('avatarSource', 'data:image/jpeg;base64,' + base64Image)
			// 			this.onFieldChange('avatarExtension', 'jpeg')
			// 			this.setState({
			// 				modalPhotoVisible: false,
			// 				checkedPhotoId: -1
			// 			}, () => {
			// 				if (this.state.typeOfConfirmImageModal == 'profile') {
			// 					this.setState({modalCompleteShow: true})
			// 				}
			// 			})
			// 		})
			// 	})
			// }, (error) => {
			// 	console.log('error cropping')
			// 	console.log(error)
			// 	return RNFS.readFile(response.uri, 'base64')
			// 	.then((base64Image) => {
			// 		this.setState({ prevValue: this.state.fields.avatarSource }, () => {
			// 			this.onFieldChange('avatar', newImageUrl.uri)
			// 			this.onFieldChange('avatarSource', 'data:image/jpeg;base64,' + base64Image)
			// 			this.onFieldChange('avatarExtension', 'jpeg')
			// 			this.setState({
			// 				modalPhotoVisible: false,
			// 				checkedPhotoId: -1
			// 			}, () => {
			// 				if (this.state.typeOfConfirmImageModal == 'profile') {
			// 					this.setState({modalCompleteShow: true})
			// 				}
			// 			})
			// 		})
			// 	})
			// })

			// ImageResizer.createResizedImage(response.uri, 300, 300, 'JPEG', 50, 0)
			// 	.then((newImageUrl) => {
			// 		ImageEditor.cropImage(newImageUrl.uri, {
      //       size: {
      //         width: 300,
      //         height: 300
      //       },
      //       offset: {
      //         x: 0,
      //         y: 0
      //       }
      //     }, (newImageUrlCroped) => {
			// 			return RNFS.readFile(newImageUrlCroped, 'base64')
			// 			.then((base64Image) => {
			// 				this.setState({ prevValue: this.state.fields.avatarSource }, () => {
			// 					this.onFieldChange('avatar', newImageUrlCroped)
			// 					this.onFieldChange('avatarSource', 'data:image/jpeg;base64,' + base64Image)
			// 					this.onFieldChange('avatarExtension', 'jpeg')
			// 					this.setState({
			// 						modalPhotoVisible: false,
			// 						checkedPhotoId: -1
			// 					}, () => {
			// 						if (this.state.typeOfConfirmImageModal == 'profile') {
			// 							this.setState({modalCompleteShow: true})
			// 						}
			// 					})
			// 				})
			// 			})
      //     }, (error) => {
      //       console.log('error cropping')
			// 			console.log(error)
			// 			return RNFS.readFile(newImageUrl.uri, 'base64')
			// 			.then((base64Image) => {
			// 				this.setState({ prevValue: this.state.fields.avatarSource }, () => {
			// 					this.onFieldChange('avatar', newImageUrl.uri)
			// 					this.onFieldChange('avatarSource', 'data:image/jpeg;base64,' + base64Image)
			// 					this.onFieldChange('avatarExtension', 'jpeg')
			// 					this.setState({
			// 						modalPhotoVisible: false,
			// 						checkedPhotoId: -1
			// 					}, () => {
			// 						if (this.state.typeOfConfirmImageModal == 'profile') {
			// 							this.setState({modalCompleteShow: true})
			// 						}
			// 					})
			// 				})
			// 			})
      //     })
			// 	})
			// 	.catch((error) => {
			// 		console.log('error while resizing image')
			// 		console.log(error);
			// 		this.setState({ prevValue: this.state.fields.avatarSource }, () => {
			// 			this.onFieldChange('avatar', response.uri)
			// 			this.onFieldChange('avatarSource', 'data:image/jpeg;base64,' + response.data)
			// 			this.onFieldChange('avatarExtension', 'jpeg')
			// 			this.setState({
			// 				modalPhotoVisible: false,
			// 				checkedPhotoId: -1
			// 			}, () => {
			// 				if (this.state.typeOfConfirmImageModal == 'profile') {
			// 					this.setState({modalCompleteShow: true})
			// 				}
			// 			})
			// 		})
			// 	});
		}
	}

	onModalSelectPhotoBtnPress = (btnKey, pictrueId) => {
		switch (btnKey) {
			case 'close':
				this.setState({modalSelectPhotoShow: false})
				break
			case 'cameraRoll':
				this.setState({ modalSelectPhotoShow: false }, () => {
					this.onCameraRollPress()
				})
				break
			case 'take':
				this.setState({ modalSelectPhotoShow: false }, () => {
					this.onTakePhotoPress()
				})
				break
			case 'picture':
				// if (pictrueId != -1) {
				// 	console.log('pictrueId')
				// 	console.log((RNFS.MainBundlePath || RNFS.DocumentDirectoryPath))
				// 	RNFS.readFile((RNFS.MainBundlePath || RNFS.DocumentDirectoryPath) + iconImages['avatar' + pictrueId], 'base64').then((statResult) => {
				// 		console.log(statResult)
				// 	})
				// 	.catch((error) => {
				// 		console.log(error);
				// 	});
				// }
				if (pictrueId != -1) {

					this.setState({
						checkedPhotoId: pictrueId
					}, () => {
						setTimeout(() => {
              console.log(imageInBase64[pictrueId])
							  this.setState({ prevValue: this.state.fields.avatarSource }, () => {
								this.onFieldChange('avatar', imageInBase64[pictrueId])
								this.onFieldChange('avatarSource', imageInBase64[pictrueId])
								this.onFieldChange('avatarExtension', 'png')
								this.setState({ modalSelectPhotoShow: false }, () => this.setState({ modalCompleteShow: true }))
							})
						}, 500)
					})
					break
				}
		}
	}

	onModalCompleteBtnPress = (btnKey) => {
		switch (btnKey) {
			case 'close':
				this.setState({modalCompleteShow: false})
				break
			case 'back':
				const { prevValue } = this.state
				this.onFieldChange('avatar', prevValue)
				this.onFieldChange('avatarSource', prevValue)
				this.setState({
					prevValue: null,
					modalCompleteShow: false,
					checkedPhotoId: -1
				})
				break
			case 'confirm':
				this.setState({ modalCompleteShow: false }, () => {
					if (this.state.typeOfConfirmImageModal != 'profile') {
						this.requestCreateUser()
					} else {
						this.setState({modalCompleteShow: false})
					}
				})
				break
		}
	}

	onModalAreYouSureBtnPress = (btnKey) => {
		switch (btnKey) {
			case 'close':
				this.setState({modalAreYouSureShow: false})
				break
			case 'later':
				this.setState({ modalAreYouSureShow: false }, () => {
					this.requestCreateUser()
				})
				break
			case 'select':
				this.setState({ modalAreYouSureShow: false }, () => {
					this.setState({modalSelectPhotoShow: true})
				})
				break
		}
	}

	onAvatarAddPress = () => {
		this.setState({modalSelectPhotoShow: true, typeOfConfirmImageModal: 'profile'})
		// this.setState({typeOfConfirmImageModal: 'profile'}, () => {
		// 	ImagePicker.showImagePicker(options, (response) => {
		// 		this.onGetImageResponse(response)
		// 	});
		// })
	}
	render () {
		const { navigation } = this.props
		const { fields, modalSelectPhotoShow, modalCompleteShow, modalAreYouSureShow, checkedPhotoId, isLoading } = this.state
		const { avatar, avatarSource } = fields
		const navBarProps = {
      leftPart: {
        image: iconImages.navBarBackArrowLongIconWhite,
        action: () => navigation.goBack()
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
					marginTop: width(24),
				}
      },
		}
		return (
				<View style={styles.wrapper} keyboardShouldPersistTaps="handled" contentContainerStyle={{flex: 1}}>
					<Background />
					<View style={styles.content}>
						<KeyboardAwareScrollView keyboardOpeningTime={1200} style={{flex: 1}} extraScrollHeight={0} keyboardShouldPersistTaps="handled" enableOnAndroid={true}>
						<NavBar {...navBarProps} transparent navigation={navigation} />
						<Text style={styles.titleText}>
							Complete Profile
						</Text>
						<Avatar avatar={avatar} onPress={this.onAvatarAddPress}/>
						<View style={styles.formsWrapper}>
							<Forms onSubmit={this.onGetStartedPress} fields={fields} onFieldChange={this.onFieldChange} />
						</View>
						</KeyboardAwareScrollView>
							<Button
								disabled={!Object.keys(fields).every(fieldKey => requiredList['signup'].includes(fieldKey)
									? !!fields[fieldKey]
									: true
								)}
								title='Get Started'
								textStyle={{ fontSize: width(4)}}
								containerStyle={styles.getStartedBtnContainer}
								buttonStyle={styles.getStartedBtn}
								onPress={this.onGetStartedPress}/>
						</View>
						<ModalSelectPhoto
							onBtnPress={this.onModalSelectPhotoBtnPress}
							checkedPhotoId={checkedPhotoId}
							visible={modalSelectPhotoShow}/>
						<ModalComplete
							avatar={avatar}
							onBtnPress={this.onModalCompleteBtnPress}
							visible={modalCompleteShow}/>
						<Modal
							onBtnPress={this.onModalAreYouSureBtnPress}
							visible={modalAreYouSureShow} />
					<BusyIndicator isVisible={isLoading} overlayColor="rgba(0,0,0,0.4)" overlayWidth={60} overlayHeight={60} size="small"/>
				</View>

		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		backgroundColor: 'rgba(80, 210, 194, 0.95)',
	},
	contentContainerStyle: {
		// justifyContent: 'space-between',
		flex: 1
	},
	content: {
		flex: 1,

	},
	titleText: {
		fontSize: width(5.5),
		textAlign: 'center',
		color: 'white',
		//  marginBottom: height(1),
		 marginTop: isIphoneX()
     ? width(20)
     : -2
	},
	getStartedBtn: {
		width: width(100),
		height: isIphoneX()
    ? width(20)
    : width(15),
		alignSelf: 'center',
		backgroundColor: 'rgba(255, 255, 255, 0.3)'
	},
	getStartedBtnContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0
	},
	formsWrapper: {
		marginTop: width(0),
		flex: 1
	}
})
