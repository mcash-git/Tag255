import React, { Component } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Alert, Platform, NativeModules, ImageEditor } from 'react-native'
import { connect } from 'react-redux'
import { Icon } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker'
import BusyIndicator from 'react-native-busy-indicator'
import RNFetchBlob from 'react-native-fetch-blob'
import { LoginManager, GraphRequest, GraphRequestManager, AccessToken } from 'react-native-fbsdk'
import LinkedinLogin from 'react-native-linkedin-login';
const { RNTwitterSignIn } = NativeModules
import LinkedInModal from 'react-native-linkedin'
import RNFS from 'react-native-fs'
import ImageResizer from 'react-native-image-resizer';
import FastImage from 'react-native-fast-image'
import ImageCropper from 'react-native-image-crop-picker';

import { width, height, iconImages, imageInBase64, getBackgroundImageByType, getColorByType, getButtonBackgroundImageByType, serverUrls, requiredList, socialData, isIphoneX } from 'constants/config'
import { connectWithNavigationIsFocused, checkNextProps, filterBlackList, filterWhiteList, getAuthHeader } from 'utils'

import * as Models from 'models'
import * as ApiUtils from 'actions/utils'

import NavBar from 'components/NavBar'
import StdInput from 'components/StdInput'
import Sep from 'components/Sep'
import StdBtn from 'components/StdBtn'
import ShowImagePickModal from 'components/ShowImagePickModal'
import ModalSelectPhoto from './ModalSelectPhoto';

import fetchServ from 'actions/fetchServ';

const boolFields = ['emailNotif', 'pushNotif', 'textNotif', 'linkedin', 'twitter', 'facebook']

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs

var options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

@connectWithNavigationIsFocused(
  state => ({
    setSettings: state.setSettings,
    getSettings: state.getSettings,
    updateSettings: state.updateSettings,
    userData: state.userData,
    updateUser: state.updateUser,
    getUsers: state.getUsers,
    uploadImage: state.uploadImage
  }),
  dispatch => ({
    actionSetSettings(userId, data) {
      dispatch(Models.settings.setSettings(userId, data))
    },
    actionUpdateSettings(userId, data) {
      dispatch(Models.settings.updateSettings(userId, data))
    },
    actionGetSettings(userId) {
      dispatch(Models.settings.getSettings(userId))
    },
    actionUpdateUser(userId, keyValue, headers) {
      dispatch(fetchServ({...serverUrls.updateUser, url: serverUrls.updateUser.url + '/' + userId}, keyValue, headers, 'UPDATEUSER'))
    },
    actionGetUsers(filters, headers) {
      dispatch(fetchServ({ ...serverUrls.getUsers, url: serverUrls.getUsers.url }, filters, headers, 'GETUSERS'))
    },
    actionUploadImage(data, headers) {
      dispatch(fetchServ(serverUrls.uploadImage, data, headers, 'UPLOADIMAGE'))
    },
    setUserData: (data) => {
      dispatch(ApiUtils.setUserData(data))
    },
  })
)
export default class SendingMessage extends Component {
  constructor(props) {
    super(props);
    const fields = {
      fName: '',
      sName: '',
      nickName: '',
      password: '',
      email: '',
      emailNotif: false,
      pushNotif: false,
      textNotif: false,
      linkedin: false,
      twitter: false,
      facebook: false,
      avatar: '',
      avatarSource: '',
      avatarExtension: '',
      prevImage: ''
    }
    // const fields = {
    //   fName: 'Kir',
    //   sName: 'Sap',
    //   nickName: 'KirSap',
    //   password: '',
    //   emailNotif: true,
    //   pushNotif: true,
    //   textNotif: false,
    //   linkedin: true,
    //   twitter: false,
    //   facebook: false,
    //   avatar: '',
    //   avatarSource: ''
    // }
    this.state = {
      fields,
      isLoading: false,
      signUpCredentials: [],
      // showPickerModal: false,
      modalSelectPhotoShow: false,
      checkedPhotoId: -1,
    }
  }


  componentWillMount() {
    const { userData, actionGetSettings } = this.props
    if (userData && userData.userModel) {
      const userId = userData.userModel.user_uid
      const token = userData.token
      if (userData.settings && Object.keys(userData.settings).length) {
        this.setState({ fields: userData.settings }, () => {
          this.setState({ isLoading: true }, () => {
            actionGetSettings(userData.userModel.user_uid)
          })
        })
      } else {
        this.setState({ isLoading: true }, () => {
          actionGetSettings(userData.userModel.user_uid)
        })
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { setUserData, navigation, actionGetSettings, actionGetUser, actionUploadImage, actionGetUsers } = this.props
    const { fields } = this.state
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
      const dataFormUserModel = nextProps.userData.userModel
      const { fields } = this.state
      this.setState({ isLoading: false }, () => {
        this.setState({
          fields: {
            ...fields,
            fName: dataFormUserModel.firstName,
            sName: dataFormUserModel.lastName,
            nickName: dataFormUserModel.nickname,
            email: dataFormUserModel.email,
            avatar: dataFormUserModel.avatar,
            avatarSource: ''
          }
        })
      })
    }

    const propsCheckerUpdateUser = checkNextProps(nextProps, this.props, 'updateUser')
    if (propsCheckerUpdateUser == 'error') {
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
    } else if (propsCheckerUpdateUser) {
      if (fields.avatarSource) {
        const imageData = fields.avatarSource.replace('data:image/jpeg;base64,', '').replace('data:image/png;base64,', '')
        console.log('uploadImage')
        actionUploadImage({
          image: imageData,
          type: fields.avatarExtension
        }, getAuthHeader(nextProps.userData.token))
      } else {
        actionGetUsers({
          user_uid: nextProps.userData.userModel.user_uid
        }, getAuthHeader(nextProps.userData.token))
      }
    }

    const propsCheckerUploadImage = checkNextProps(nextProps, this.props, 'uploadImage')
    if (propsCheckerUploadImage == 'error') {
			const error = nextProps.uploadImage.error
			this.setState({
				isLoading: false,
      }, () => {
        Alert.alert(error.msg, null, [
          {text: 'OK', onPress: () => navigation.goBack()}
        ], {
          onDismiss: () => navigation.goBack()
        })
      });
    } else if (propsCheckerUploadImage) {
      const data = nextProps.uploadImage.response
      console.log('propsCheckerUploadImage')
      console.log(data)
      // this.onFieldChange('avatar', data.avatar_url)
      actionGetUsers({
        user_uid: nextProps.userData.userModel.user_uid
      }, getAuthHeader(nextProps.userData.token))
    }
    //else {fields.prevImage && this.onFieldChange('avatar', fields.prevImage)}

    const propsCheckerGetUser = checkNextProps(nextProps, this.props, 'getUsers')
    if (propsCheckerGetUser == 'error') {
			const error = nextProps.getUsers.error
			this.setState({
				isLoading: false,
      }, () => {
        Alert.alert(error.msg, null, [
          {text: 'OK', onPress: () => navigation.goBack()}
        ], {
          onDismiss: () => navigation.goBack()
        })
      });
    } else if (propsCheckerGetUser && propsCheckerGetUser != 'empty') {
      const data = nextProps.getUsers.response
      setUserData({
        userModel: {
          ...data,
          avatar: data.avatar,
          nickName: nextProps.getUsers.response.nickname,
        }
      })
      // RNFetchBlob
      //   .config({
      //     fileCache : true
      //   })
      //   .fetch('GET', data.avatar)
      //   .then((resp) => {
      //       // the image path you can use it directly with Image component
      //       imagePath = resp.path()
      //       return resp.readFile('base64')
      //   })
      //   .then((base64Data) => {
      //       console.log(base64Data)
      //       setUserData({
      //         userModel: {
      //           ...data,
      //           avatar: 'data:image/jpeg;base64,' + base64Data,
      //           nickName: nextProps.getUsers.response.nickname,
      //         }
      //       })
      //       return fs.unlink(imagePath)
      //   })
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
      actionGetSettings(nextProps.userData.userModel.user_uid)
      Alert.alert('The settings are saved', null, [
        {text: 'OK'}
      ])
    }

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
    } else if (propsCheckerUpdateSettings) {
			const data = nextProps.getSettings.response
      actionGetSettings(nextProps.userData.userModel.user_uid)
      Alert.alert('The settings are saved', null, [
        {text: 'OK'}
      ])
    }

    const propsCheckerUserData = checkNextProps(nextProps, this.props, 'userData', null, true)
    if (propsCheckerUserData && propsCheckerUserData != 'empty') {
			this.setState({ isLoading: false }, () => {
        const dataFormUserModel = nextProps.userData.userModel
        const savedSettings = nextProps.userData.settings
        const signUpCredentials = nextProps.userData.signUpCredentials
        let newFields = {
          ...savedSettings,
          ...this.state.fields,
          fName: dataFormUserModel.firstName,
          sName: dataFormUserModel.lastName,
          nickName: dataFormUserModel.nickname,
          email: dataFormUserModel.email,
          linkedin: signUpCredentials && signUpCredentials.find(item => item && item.type == 'linkedin'),
          twitter: signUpCredentials && signUpCredentials.find(item => item && item.type == 'twitter'),
          facebook: signUpCredentials && signUpCredentials.find(item => item && item.type == 'facebook'),
          avatarSource: ''
        }
        if (!this.state.fields.avatar) {
          console.log('keep image')
          newFields = {...newFields, avatar: dataFormUserModel.avatar}
        } else {
          console.log('nochanges')
        }
        this.setState({
          fields: newFields,
          signUpCredentials: signUpCredentials
        })
			})
    }
  }


  onFieldChange = (fieldName, value) => {
    let newStateFields = this.state.fields
    if (boolFields.indexOf(fieldName) != -1) {
      newStateFields[fieldName] = !newStateFields[fieldName]
    } else {
      newStateFields[fieldName] = value
    }
    this.setState({fields: newStateFields})
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
          data: imageObj.data
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

      this.setState({ checkedPhotoId: -1 }, () => {
        this.onFieldChange('prevImage', this.state.fields.avatar)
        this.onFieldChange('avatar', response.uri)
        this.onFieldChange('avatarSource', 'data:image/jpeg;base64,' + response.data)
        this.onFieldChange('avatarExtension',
          response.path && response.path.split('.') && response.path.split('.')[1] && response.path.split('.')[1].toLowerCase() ||
          response.fileName && response.fileName.split('.') && response.fileName.split('.')[1] && response.fileName.split('.')[1].toLowerCase() ||
          'jpg'
        )
      })

    }
  }

  onAddAvatarPress = () => {
    ImagePicker.showImagePicker(options, (response) => {
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

        ImageCropper.openCropper({
          path: response.uri,
          width: 300,
          height: 300,
          cropping: true,
          includeBase64: true
        }).then((imageObj) => {
          const res = {
            uri: imageObj.path,
            data: imageObj.data
          }
          this.onFieldChange('avatar', res.uri)
          this.onFieldChange('avatarSource', 'data:image/jpeg;base64,' + res.data)
          this.onFieldChange('avatarExtension',
            response.path && response.path.split('.') && response.path.split('.')[1] && response.path.split('.')[1].toLowerCase() ||
            response.fileName && response.fileName.split('.') && response.fileName.split('.')[1] && response.fileName.split('.')[1].toLowerCase() ||
            'jpg'
          )
        });

        // ImageResizer.createResizedImage(response.uri, 300, 300, 'JPEG', 50, 0)
				// .then((newImageUrl) => {
        //   ImageEditor.cropImage(newImageUrl.uri, {
        //     size: {
        //       width: 300,
        //       height: 300
        //     },
        //     offset: {
        //       x: 0,
        //       y: 0
        //     }
        //   }, (newImageUrlCroped) => {
        //     return RNFS.readFile(newImageUrlCroped, 'base64')
        //     .then((base64Image) => {
        //       this.onFieldChange('avatar', newImageUrlCroped)
        //       this.onFieldChange('avatarSource', 'data:image/jpeg;base64,' + base64Image)
        //       this.onFieldChange('avatarExtension', 'jpeg')
        //     })
        //   }, (error) => {
        //     console.log('error cropping')
        //     console.log(error)
        //     return RNFS.readFile(newImageUrl.uri, 'base64')
        //     .then((base64Image) => {
        //       this.onFieldChange('avatar', newImageUrl.uri)
        //       this.onFieldChange('avatarSource', 'data:image/jpeg;base64,' + base64Image)
        //       this.onFieldChange('avatarExtension', 'jpeg')
        //     })
        //   })
				// })
				// .catch((error) => {
				// 	console.log('error while resizing image')
        //   console.log(error);
        //   return RNFS.readFile(response.uri, 'base64')
        //     .then((base64Image) => {
        //       this.onFieldChange('avatar', response.uri)
        //       this.onFieldChange('avatarSource', 'data:image/jpeg;base64,' + base64Image)
        //       this.onFieldChange('avatarExtension', 'jpeg')
        //     })
				// });
      }
    });
  }

  save = () => {
    const { userData, navigation, actionUpdateSettings, actionSetSettings, actionUpdateUser } = this.props
    const { fields } = this.state
    if (userData && userData.userModel && userData.userModel.user_uid) {
      const userId = userData.userModel.user_uid
      const token = userData.token
      if (userData.settings) {
        this.setState({ isLoading: true }, () => {
          actionUpdateSettings(
            userId,
            filterBlackList(
              ['fName', 'sName', 'nickName', 'avatar', 'avatarSource', 'avatarExtension'],
              fields
            )
          )
          actionUpdateUser(
            userId,
            fields,
            getAuthHeader(token)
          )
        })
      } else {
        this.setState({ isLoading: true }, () => {
          actionSetSettings(
            userId,
            filterBlackList(
              ['fName', 'sName', 'nickName', 'avatar', 'avatarSource', 'avatarExtension'],
              fields
            )
          )
          actionUpdateUser(
            userId,
            fields,
            getAuthHeader(token)
          )
        })
      }
    }
    // navigation.navigate('HomeStack')
  }

  cancel = () => {
    const { navigation } = this.props
    navigation.navigate('HomeStack')
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
              this.addSignUpCredentials({
                  type: 'twitter',
                  authToken: authToken,
                  authTokenSecret: authTokenSecret,
                  userId: loginData.userID
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
				this.linkedInModal && this.linkedInModal.open()

				break
		}
  }

  addSignUpCredentials = (data) => {
    const { setUserData } = this.props
    const newStateSignUpCredentials = this.state.signUpCredentials
    newStateSignUpCredentials.push(data)
    this.setState({signUpCredentials: newStateSignUpCredentials}, () => {
      setUserData({ signUpCredentials: newStateSignUpCredentials })
    })
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
        this.addSignUpCredentials(signUpCredentials)
			}
		});
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
      this.addSignUpCredentials(tokenData)
		}
  }

  pickerModalCallback = (result) => {
    switch (result) {
      case 'close':
        this.setState({showPickerModal: false})
        break
      case 'takePicture':
        this.setState({showPickerModal: false}, () => this.onTakePhotoPress())
        break
      case 'cameraRoll':
        this.setState({showPickerModal: false}, () => this.onCameraRollPress())
        break
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
					console.log(imageInBase64[pictrueId])
					this.setState({
						checkedPhotoId: pictrueId
					}, () => {
						setTimeout(() => {
              this.onFieldChange('avatar', imageInBase64[pictrueId])
              this.onFieldChange('avatarSource', 'data:image/jpeg;base64,' + imageInBase64[pictrueId])
              this.onFieldChange('avatarExtension', 'png')
              this.setState({ modalSelectPhotoShow: false })
						}, 500)
					})
					break
				}
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

  render() {
    const { navigation } = this.props
    const { fields, isLoading, checkedPhotoId, modalSelectPhotoShow } = this.state
    const { fName, sName, email, password, nickName, emailNotif, pushNotif, textNotif, linkedin, twitter, facebook, avatar, avatarSource } = fields
    const navBarProps = {
      leftPart: {
        image: iconImages.navBarBackIconWhite,
        action: () => navigation.goBack()
      },
      centerPart: {
        image: iconImages.navBarLogoImage,
        imageWrapperCustomStyle: {
          width: width(60),
          height: width(16),
          alignItems: 'center',
          justifyContent: 'center',
        },
        imageCustomStyles: {
          height: '120%',
          width: '120%',
          marginTop: width(17)
        }
      },
    }
    const saveDisabled = !Object.keys(fields).every(fieldKey => requiredList['settings'].includes(fieldKey)
      ? !!fields[fieldKey]
      : true
    )
    console.log(fields)
    return (
      <View style={styles.wrapper} >
        <ImageBackground style={styles.settingBackgroundImage} source={iconImages.settingsBackgroundImage}>
        <NavBar {...navBarProps} navBarBackgroundImage={iconImages.navBarBackgroundImageBlue} navigation={navigation} />
        <ScrollView showsVerticalScrollIndicator={false} style={styles.content} contentContainerStyle={styles.contentContainerStyle}>

            <View style={styles.topPartWrapper}>

              <View style={styles.avatarWrapper}>
                <TouchableOpacity onPress={this.onAvatarAddPress}>
                  <View style={styles.avatarInner}>
                    <View style={styles.avatarImageWrapper}>
                      {
                        avatar
                          ? avatar.indexOf('http') != -1
                            ?  <FastImage
                                  style={styles.avatarImage}
                                  source={avatar && {
                                    uri: avatar
                                  }}
                              resizeMode={FastImage.resizeMode.cover} />
                            : <Image
                            style={styles.avatarImage}
                            source={
                              avatar
                                ? { uri: avatar }
                                : iconImages.addPhotoIcon
                            }/>
                          : null
                      }
                    </View>
                    <View style={styles.avatarIconContainerWrapper}>
                      <ImageBackground resizeMode="cover" source={iconImages.smallAddIconBackgroundBlue} style={styles.avatarIconContainerBackgroundImage}>
                        <Icon
                          raised
                          name='add'
                          underlayColor="transparent"
                          containerStyle={{
                            height: width(7),
                            width: width(7),
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'transparent',
                            marginLeft: width(-0.3),
                            marginTop: width(-0.3)
                          }}
                          size={width(5)}
                          // onPress={props.onSubstractPress}
                          color='white'/>
                      </ImageBackground>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputsPart}>
              <View source={iconImages.settingsBackgroundImage} style={styles.inputsInner}>
                <View style={styles.inputWrapper}>
                  <StdInput
                    label="FIRST NAME"
                    autoCapitalize="sentences"
                    value={fName}
                    type="splited"
                    inputStyle={{
                      marginLeft: width(30),
                      color: 'white'
                    }}
                    onChangeText={text => this.onFieldChange('fName', text)} />
                  <Sep color="white" />
                </View>
                <View style={styles.inputWrapper}>
                  <StdInput
                    label="LAST NAME"
                    autoCapitalize="sentences"
                    value={sName}
                    type="splited"
                    inputStyle={{
                      marginLeft: width(30),
                      color: 'white'
                    }}
                    onChangeText={text => this.onFieldChange('sName', text)} />
                  <Sep color="white" />
                </View>
                <View style={styles.inputWrapper}>
                  <StdInput
                    label="NICKNAME"
                    autoCapitalize="sentences"
                    value={nickName}
                    type="splited"
                    inputStyle={{
                      marginLeft: width(30),color: 'white'
                    }}
                    onChangeText={text => this.onFieldChange('nickName', text)} />
                  <Sep color="white" />
                </View>
                <View style={styles.inputWrapper}>
                  <StdInput
                    label="EMAIL"
                    autoCapitalize="none"
                    value={email}
                    type="splited"
                    inputStyle={{
                      marginLeft: width(30),
                      color: 'white'
                    }}
                    onChangeText={text => this.onFieldChange('email', text)} />
                  <Sep color="white" />
                </View>
                <View style={styles.inputWrapper}>
                  <StdInput
                    label="EMAIL NOTIFICATIONS"
                    value={emailNotif}
                    type="splited-switch"
                    inputStyle={{
                      marginLeft: width(0),
                      color: 'white'
                    }}
                    secureTextEntry={true}
                    onValueChange={() => this.onFieldChange('emailNotif')} />
                  <Sep color="white" />
                </View>
                <View style={styles.inputWrapper}>
                  <StdInput
                    label="PUSH NOTIFICATIONS"
                    value={pushNotif}
                    type="splited-switch"
                    inputStyle={{
                      marginLeft: width(0),
                      color: 'white'
                    }}
                    secureTextEntry={true}
                    onValueChange={() => this.onFieldChange('pushNotif')} />
                  <Sep color="white" />
                </View>
                <View style={styles.inputWrapper}>
                  <StdInput
                    label="TEXT NOTIFICATIONS"
                    value={textNotif}
                    type="splited-switch"
                    inputStyle={{
                      marginLeft: width(0),
                      color: 'white'
                    }}
                    secureTextEntry={true}
                    onValueChange={() => this.onFieldChange('textNotif')} />
                </View>
              </View>
            </View>

        </ScrollView>

        <View style={styles.buttonsWrapper}>
          <View style={[styles.btnWrapper, {backgroundColor: '#5F9DD0'}]}>
            <TouchableOpacity onPress={() => this.cancel()}>
              <View style={styles.btnInner}>
                <Text style={styles.btnText}>
                  CANCEL
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={[styles.btnWrapper, {backgroundColor: '#52C986'}]}>
            <TouchableOpacity disabled={saveDisabled} style={[saveDisabled && {opacity: 0.5}]} onPress={() => this.save()}>
              <View style={styles.btnInner}>
                <Text style={styles.btnText}>
                  SAVE
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <BusyIndicator isVisible={isLoading} overlayColor="rgba(0,0,0,0.4)" overlayWidth={60} overlayHeight={60} size="small"/>
        <LinkedInModal
					ref={comp => this.linkedInModal = comp}
					linkText=""
          clientID={socialData.linkedIn.clientID}
          clientSecret={socialData.linkedIn.clientSecret}
          redirectUri="https://google.com"
          onSuccess={this.getLinkedInProfile}
        />
        <ModalSelectPhoto
          onBtnPress={this.onModalSelectPhotoBtnPress}
          checkedPhotoId={checkedPhotoId}
          visible={modalSelectPhotoShow}/>
            </ImageBackground>
      </View>
    );
  }
}

// <Image
//                         style={styles.avatarImage}
//                         source={
//                           avatar
//                             ? { uri: avatar }
//                             : iconImages.addPhotoIcon
//                         }/>




// <View style={styles.inputWrapper}>
// <StdInput
//   label="Connect"
//   onPress={() => this.onLoginWithBtnPress('linkedIn')}
//   value={linkedin}
//   leftIconSource={iconImages.linkedinSettingsIconWhite}
//   rightIconStyle={linkedin && {height: width(4.2), width: width(3.2), marginRight: width(0)}}
//   rightIconSource={
//     linkedin
//       ? iconImages.arrowSettingsCheckedIconWhite
//       : iconImages.arrowSettingsNextIconWhite
//   }
//   type="splited-icons"
//   inputStyle={{
//     marginLeft: width(-5),
//     color: 'white',
//   }}
//   onValueChange={() => this.onFieldChange('linkedin')} />
// <Sep color="white" />
// </View>
// <View style={styles.inputWrapper}>
// <StdInput
//   label="Connect"
//   value={twitter}
//   onPress={() => this.onLoginWithBtnPress('twitter')}
//   leftIconSource={iconImages.twitterSettingsIconWhite}
//   rightIconStyle={twitter && {height: width(4.2), width: width(3.2), marginRight: width(0)}}
//   rightIconSource={
//     twitter
//       ? iconImages.arrowSettingsCheckedIconWhite
//       : iconImages.arrowSettingsNextIconWhite
//   }
//   type="splited-icons"
//   inputStyle={{
//     marginLeft: width(-5),
//     color: 'white',
//   }}
//   onValueChange={() => this.onFieldChange('twitter')} />
// <Sep color="white" />
// </View>
// <View style={styles.inputWrapper}>
// <StdInput
//   label="Connect"
//   value={facebook}
//   onPress={() => this.onLoginWithBtnPress('facebook')}
//   leftIconSource={iconImages.fbSettingsIconWhite}
//   rightIconStyle={facebook && {height: width(4.2), width: width(3.2), marginRight: width(0)}}
//   rightIconSource={
//     facebook
//       ? iconImages.arrowSettingsCheckedIconWhite
//       : iconImages.arrowSettingsNextIconWhite
//   }
//   type="splited-icons"
//   inputStyle={{
//     marginLeft: width(-5),
//     color: 'white',
//   }}
//   onValueChange={() => this.onFieldChange('facebook')} />
// </View>

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: height(100),
    width: '100%',
    backgroundColor: '#3B8AC3'
  },
  content: {
    flex: 1,
    marginBottom: width(13),
    minHeight: height(85)
  },
  contentContainerStyle: {
    alignItems: 'center',
    height: isIphoneX()
      ? '100%'
      : 'auto'
  },
  topPartWrapper: {
    width: '100%'
  },
  avatarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#73C9D6',
    paddingVertical: width(5)
  },
	avatarInner: {
		position: 'relative',
		justifyContent: 'center',
		alignSelf: 'center',
		paddingTop: width(1),
		marginTop: width(1)
	},
	avatarIconContainerWrapper: {
		height: width(7),
		width: width(7),
		borderWidth: 1,
		borderColor: 'white',
		position: 'absolute',
		backgroundColor: '#5C91E1',
		top: width(0.4),
		right: width(0.8),
		borderRadius: width(7),
		overflow: 'hidden',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	avatarIconContainerBackgroundImage: {
		height: '100%',
		width: '100%',
		backgroundColor: '#5C91E1',
	},
	avatarImageWrapper: {
		width: width(26),
		height: width(26),
		borderRadius: width(26),
		overflow: 'hidden'
	},
	avatarImage: {
		height: '100%',
		width: '100%',
		resizeMode: 'cover'
  },
  inputsPart: {
    flex: 1,
    width: '100%',
    alignItems: 'center'
  },
  inputsInner: {
    flex: 1,
    width: width(90),
  },
  inputsWrapper: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputWrapper: {
    height: width(18),
    width: '100%',
  },
  settingBackgroundImage: {
    flex: 1,
    width: '100%',
    marginRight: 0,
    marginLeft: 0
  },
  buttonsWrapper: {
    width: width(100),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0
  },
  btnWrapper: {
    flex: 1,
    height: width(14),
  },
  btnInner: {
    marginVertical: width(5),
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnText: {
    color: 'white',
    fontSize: width(3)
  }
})
