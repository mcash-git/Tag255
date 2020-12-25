import React, { Component } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, Alert, PermissionsAndroid, Platform, ImageEditor, KeyboardAvoidingView } from 'react-native'
import ImagePicker from 'react-native-image-picker'
import Contacts from 'react-native-contacts'
import Permissions from 'react-native-permissions'
import { NavigationActions } from 'react-navigation';
import RNFS from 'react-native-fs'
import ImageResizer from 'react-native-image-resizer';
import FastImage from 'react-native-fast-image'
import ImageCropper from 'react-native-image-crop-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { width, height, iconImages, alphabet, isIphoneX, requiredList, serverUrls, imageInBase64 } from 'constants/config'
import { cleanPhoneNumb, getAuthHeader, checkNextProps, fullCleanPhone, connectWithNavigationIsFocused } from 'utils'

import * as ApiUtils from 'actions/utils'
import fetchServ from 'actions/fetchServ'

import NavBar from 'components/NavBar'
import PhoneInput from 'components/PhoneInput'
import StdInput from 'components/StdInput'
import Sep from 'components/Sep'
import StdBtn from 'components/StdBtn'
import SmallRoundBtn from 'components/SmallRoundBtn'
import HintModal from 'components/HintModal'
import ShowImagePickModal from 'components/ShowImagePickModal'
import ModalSelectPhoto from './ModalSelectPhoto';

var options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

const errorHints = {
  introduceYourSelf: {
    title: 'Oops! You can’t introduce yourself to others.',
    text: 'We don’t allow you to introduce yourself to other people. We do this to keep the app free of spam.'
  },
  requeredFieldsEmpty: {
    title: 'Oops! Some fields are empty.',
    text: 'You should fill all fields that are marked with red dot.'
  }
}

const fieldsOrder = ['fName', 'sName', 'nickName', 'phone', 'email']

@connectWithNavigationIsFocused(
  state => ({
    userData: state.userData,
    inviteUser: state.inviteUser,
    getUsers: state.getUsers,
    contacts: state.contacts,
    countryCodes: state.countryCodes,
  }),
  dispatch => ({
    setMakeIntroductionData: (data) => {
      dispatch(ApiUtils.setMakeIntroductionData(data))
    },
    // actionSendSms: (data, headers) => {
		// 	dispatch(fetchServ(serverUrls.sendSms, data, headers, 'SENDSMS'))
    // },
    actionGetUsers(filters, headers) {
      dispatch(fetchServ({ ...serverUrls.getUsers, url: serverUrls.getUsers.url }, filters, headers, 'GETUSERS'))
    },
    setContacts: (contacts) => {
      dispatch(ApiUtils.setContacts(contacts))
    },
  })
)
export default class AddCustomContact extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props
    const contactInfo = navigation.state && navigation.state.params && navigation.state.params.contactInfo
    const phone = contactInfo
      ? contactInfo.phone && contactInfo.phone.indexOf('(') != -1 && contactInfo.phone || contactInfo && contactInfo.origPhone  || ''
      : ''
    console.log(this.props)
    const fields = {
      fName: contactInfo && contactInfo.fName || '',
      sName: contactInfo && contactInfo.sName || '',
      nickName: '',
      phone: phone,
      email: contactInfo && contactInfo.email || '',
      agree: false,
      avatar: contactInfo && contactInfo.avatar || '',
      avatarSource: '',
    }
    this.state = {
      fields,
      showError: false,
      showPickerModal: false,
      modalSelectPhotoShow: false,
      checkedPhotoId: -1,
    }
  }
  onFieldChange = (fieldName, value) => {
    let newStateFields = this.state.fields
    if (typeof value == 'boolean') {
      newStateFields[fieldName] = !newStateFields[fieldName]
    } else {
      newStateFields[fieldName] = value
    }
    this.setState({fields: newStateFields})
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

  onAddAvatarPress = () => {
    this.setState({ modalSelectPhotoShow: true })


    //last last
    // this.setState({showPickerModal: true})

    // last
    // ImagePicker.showImagePicker(options, (response) => {
    //   console.log('Response = ', response);

    //   if (response.didCancel) {
    //     console.log('User cancelled image picker');
    //   }
    //   else if (response.error) {
    //     console.log('ImagePicker Error: ', response.error);
    //   }
    //   else if (response.customButton) {
    //     console.log('User tapped custom button: ', response.customButton);
    //   }
    //   else {
    //     ImageCropper.openCropper({
    //       path: response.uri,
    //       width: 300,
    //       height: 300,
    //       cropping: true,
    //       includeBase64: true
    //     }).then((imageObj) => {
    //       const res = {
    //         uri: imageObj.path,
    //         data: imageObj.data
    //       }
    //       this.onFieldChange('avatar', res.uri)
    //       this.onFieldChange('avatarSource', 'data:image/jpeg;base64,' + res.data)
    //     });

        // ImageResizer.createResizedImage(response.uri, 300, 300, 'JPEG', 50, 0)
        //   .then((newImageUrl) => {
        //     ImageEditor.cropImage(newImageUrl.uri, {
        //       size: {
        //         width: 300,
        //         height: 300
        //       },
        //       offset: {
        //         x: 0,
        //         y: 0
        //       }
        //     }, (newImageUrlCroped) => {
        //       return RNFS.readFile(newImageUrlCroped, 'base64')
        //       .then((base64Image) => {
        //         this.onFieldChange('avatar', newImageUrlCroped)
        //         this.onFieldChange('avatarSource', 'data:image/jpeg;base64,' + base64Image)
        //         this.onFieldChange('avatarExtension', 'jpeg')
        //       })
        //     }, (error) => {
        //       console.log('error cropping')
        //       console.log(error)
        //       return RNFS.readFile(newImageUrl.uri, 'base64')
        //         .then((base64Image) => {
        //           this.onFieldChange('avatar', newImageUrl.uri)
        //           this.onFieldChange('avatarSource', 'data:image/jpeg;base64,' + base64Image)
        //         })
        //     })
				// })
				// .catch((error) => {
				// 	console.log('error while resizing image')
        //   console.log(error);
        //   return RNFS.readFile(newImageUrl.uri, 'base64')
        //     .then((base64Image) => {
        //       this.onFieldChange('avatar', response.uri)
        //       this.onFieldChange('avatarSource', 'data:image/jpeg;base64,' + base64Image)
        //     })
				// });
      // }
    // });
  }

  showErrorHint = () => {
    this.setState({ showError: true }, () => {
      setTimeout(() => {
        this.setState({ showError: false })
      }, 5000)
    })
  }

  componentWillReceiveProps(nextProps) {
    const { userData, navigation, setMakeIntroductionData, actionInviteUser } = this.props
    console.log('nextProps')
    console.log(nextProps)
    const propsCheckerSendSms = checkNextProps(nextProps, this.props, 'sendSms')
    if (propsCheckerSendSms == 'error') {
			const error = nextProps.sendSms.error
			this.setState({
				isLoading: false,
      }, () => {
        Alert.alert(error.msg, null, [
          {text: 'OK', onPress: () => navigation.goBack()}
        ], {
          onDismiss: () => navigation.goBack()
        })
      });
    } else if (propsCheckerSendSms) {
      const data = nextProps.sendSms.response
    }

    const propsCheckerGetUsers = checkNextProps(nextProps, this.props, 'getUsers', 'noway')
    console.log(propsCheckerGetUsers)
    if (propsCheckerGetUsers == 'error') {
			const error = nextProps.getUsers.error
			this.setState({
				isLoading: false,
			});
			if (error.msg != "Token has expired.") {
				Alert.alert(error.msg)
			}
    } else if (propsCheckerGetUsers) {
      const data = nextProps.getUsers.response
      const personKey = navigation.state.params && navigation.state.params.personKey
      const { fields } = this.state
      const cleanedPhone = cleanPhoneNumb(fields.phone)
      console.log('getUsers')
      console.log(data)
      console.log(personKey)
      if (data) {
        setMakeIntroductionData({
          [personKey]: {
            avatar: data.avatar,
            email: data.email,
            fName: data.firstName,
            sName: data.lastName,
            nickName: data.nickname,
            phone: data.mobilePhone,
            origCleadPhone: cleanedPhone,
            origPhone: fields.phone,
            userId: data.user_uid
          }
        })
      } else {
        setMakeIntroductionData({
          [personKey]: {
            avatar: fields.avatar,
            avatarSource: fields.avatarSource,
            email: fields.email,
            fName: fields.fName,
            sName: fields.sName,
            nickName: fields.nickName,
            phone: cleanedPhone,
            origCleadPhone: cleanedPhone,
            origPhone: fields.phone
          }
        })
      }
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Intro'})
        ],
       key:null
      })
      // navigation.dispatch(NavigationActions.navigate({ routeName: 'Intro'}))
      navigation.navigate('Intro', {localPrevScreen: 'AddCustomContact'})
    }
  }


  confirm = (fields) => {
    const { navigation, setMakeIntroductionData, userData, actionGetUsers, contacts } = this.props
    console.log('userData.userModel')
    console.log(userData.userModel)
    const cleanedPhone = cleanPhoneNumb(fields.phone)
    if (cleanedPhone == userData.userModel.mobilePhone || cleanedPhone == userData.userModel.user || userData.userModel.email == fields.email) {
      this.setState({ error: errorHints.introduceYourSelf }, () => {
        this.showErrorHint()
      })
    } else if (this.checkConfirmDisabled(fields)) {
      this.setState({ error: errorHints.requeredFieldsEmpty }, () => {
        this.showErrorHint()
      })
    } else {
      const personKey = navigation.state.params && navigation.state.params.personKey
      const contactInfo = navigation.state && navigation.state.params && navigation.state.params.contactInfo
      if (!contactInfo) {
        if (fields.agree) {
          const cleanedPhone = cleanPhoneNumb(fields.phone)
          const findExistingPhoneIncontacts = contacts && contacts.data.find(item => item && item.cleanedPhone && item.cleanedPhone == cleanedPhone)
          if (!findExistingPhoneIncontacts) {
            const newPerson = {
              emailAddresses: [{
                label: "ConnectorStreet",
                email: fields.email,
              }],
              familyName: Platform.OS == 'ios'
                ? fields.sName
                : '',
              givenName: Platform.OS == 'ios'
                ? fields.fName
                : fields.fName + ' ' + fields.sName,
              phoneNumbers: [{
                label: "mobile",
                number: cleanedPhone,
              }],
            }
            Permissions.check('contacts').then(response => {
              console.log(response)
              if (response == 'authorized') {
                Contacts.addContact(newPerson, (error) => {
                  console.log(error)
                  if (error) {
                    Alert.alert('Error creating the contact', null, [
                      {text: 'OK'}
                    ])
                  }
                  this.getContactts()
                })
              }
            })
          }
        }
      }
      if (personKey) {
        const cleanedPhone = cleanPhoneNumb(fields.phone)
        actionGetUsers({
          mobilePhone: cleanedPhone
        }, getAuthHeader(userData.token))
      }
    }
  }

  getContactts = () => {
    const { setContacts, countryCodes } = this.props
    const countryCodesArray = countryCodes.response
    Contacts.getAll((err, contacts) => {
      if(err === 'denied') {
        // error
        // console.log(err)
      } else {
        console.log('contacts')
        console.log(contacts)
        const contactsData = contacts.map(item => {
          if (!item) return null
          console.log(item)
          return {
            fName: item.givenName && item.givenName.split(' ')[0] || '',
            sName: Platform.OS == 'ios'
              ? item.familyName || ''
              : item.givenName && item.givenName.split(' ')[1] || item.familyName || '',
            phone: item.phoneNumbers[0] && item.phoneNumbers[0].number,
            avatar: item.thumbnailPath,
            email: item.emailAddresses && item.emailAddresses[0] && item.emailAddresses[0].email
          }
        })
        if (countryCodesArray) {
          setContacts(contactsData.map(contact => {
            if (!(contact && contact.phone)) return null
            const phoneCleaned = fullCleanPhone(contact.phone)
            contact.cleanedPhone = phoneCleaned && ('+' + phoneCleaned)
            const realNumb = phoneCleaned.slice(-10).trim()
            let countryCode = '+' + phoneCleaned.replace(realNumb, '').trim()
            if (countryCode == '+') countryCode = '+1'
            if (countryCode && countryCode != '+') {
              if (countryCode == '+1') {
                countryCode = 'US(+1)'
              } else {
                countryCode = '(' + countryCode + ')'
              }
              const foundFullCountryCode = countryCodesArray.find(item => item.indexOf(countryCode) != -1 || item == countryCode)
              contact.phone = foundFullCountryCode + ' ' + realNumb
              return contact
            } else {
              return null
            }
          }).filter(item => item))
        }
      }
    })
  }

  back = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  checkConfirmDisabled = (fields) => {
    return !Object.keys(fields).every(fieldKey => requiredList['addCustomContact'].includes(fieldKey)
      ? !!fields[fieldKey]
      : true
    )
  }

  onSubmitEditing = (fieldName) => {
		const { onSubmit } = this.props
		const indexOfField = fieldsOrder.indexOf(fieldName)
		if (indexOfField < fieldsOrder.length - 1) {
      this[fieldsOrder[indexOfField + 1]] && this[fieldsOrder[indexOfField + 1]].focus()
		}
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

      this.onFieldChange('avatar', response.uri)
      this.onFieldChange('avatarSource', 'data:image/jpeg;base64,' + response.data)

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

  render() {
    const { navigation, userData } = this.props
    const { newContact } = navigation.state && navigation.state.params && navigation.state.params
    const { fields, showError, error, showPickerModal, modalSelectPhotoShow, checkedPhotoId } = this.state
    const { fName, sName, nickName, email, phone, agree, avatar, avatarSource } = fields
    const navBarProps = {
      leftPart: {
        image: iconImages.navBarCrossIconWhite,
        action: () => this.back()
      },
      centerPart: {
        text: 'Add Contact'
      },
    }
    const hintData = {
      photo: {
        avatar: iconImages.fakeHintAvatar,
        title: 'New Message from Maurice Davidson',
        text: 'Thanks for the introduction!'
      }
    }
    console.log(navigation.state)
    console.log(newContact)
    return (
      <View style={styles.wrapper} contentContainerStyle={styles.contentContainerStyle}>
        <NavBar {...navBarProps} navigation={navigation} />
        <View style={styles.content}>
          <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" enableOnAndroid={true} extraHeight={100} showsVerticalScrollIndicator={false} >
          <View style={styles.topPart}>
            <View style={styles.avatarBtnWrapper}>
              <SmallRoundBtn
                backgroundColor="#F6F6F6"
                avatar={avatar}
                icon={iconImages.photoImageBlack}
                customWidth={width(17)}
                onPress={this.onAddAvatarPress} />
            </View>
            <View style={styles.inputsWrapper}>
              <View style={styles.inputWrapper}>
                <StdInput
                  redDot
                  refName={comp => this['fName'] = comp}
                  returnKeyType = {"next"}
					        onSubmitEditing={() => this.onSubmitEditing('fName')}
                  placeholder="First Name"
                  value={fName}
                  onChangeText={text => this.onFieldChange('fName', text)} />
              </View>
              <Sep />
              <View style={styles.inputWrapper}>
                <StdInput
                  redDot
                  refName={comp => this['sName'] = comp}
                  returnKeyType = {"next"}
					        onSubmitEditing={() => this.onSubmitEditing('sName')}
                  placeholder="Last Name"
                  value={sName}
                  onChangeText={text => this.onFieldChange('sName', text)} />
              </View>
              <Sep />
              <View style={styles.inputWrapper}>
                <StdInput
                  refName={comp => this['nickName'] = comp}
                  returnKeyType = {"next"}
					        onSubmitEditing={() => this.onSubmitEditing('nickName')}
                  placeholder="Nickname"
                  value={nickName}
                  onChangeText={text => this.onFieldChange('nickName', text)} />
              </View>
              <Sep />
              <View style={styles.inputWrapper}>
                <PhoneInput

                  refName={comp => this['phone'] = comp}
                  countryProps={{
                    wrapperStyle: {paddingRight: width(0)}
                  }}
                  phoneProps={{
                    wrapperStyle: { marginLeft: width(6) },
                    redDot: true,
                    onSubmitEditing: () => this.onSubmitEditing('phone'),
                  }}
                  value={phone}
                  onChangeText={text => this.onFieldChange('phone', text)} />
              </View>
              <Sep />
                <View style={styles.inputWrapper}>
                  <StdInput
                    refName={comp => this['email'] = comp}
                    returnKeyType={ 'done' }
                    onSubmitEditing={() => this.onSubmitEditing('email')}
                    placeholder="Email Address"
                    value={email}
                    keyboardType='email-address'
                    onChangeText={text => this.onFieldChange('email', text)} />
                </View>
                <Sep />
            </View>
              {
                newContact
                  ? <TouchableOpacity onPress={() => this.onFieldChange('agree', !agree)}>
                      <View style={styles.checkBoxWrapper}>
                        <View style={styles.checkBoxIconImageWrapper}>
                          <Image style={styles.checkBoxIconImage} source={
                            agree
                              ? iconImages.checkBoxCheckedImage
                              : iconImages.checkBoxImage
                          } />
                        </View>
                        <Text style={styles.checkBoxText}>
                          Add to contacts?
                        </Text>
                      </View>
                  </TouchableOpacity>
                : null
              }
          </View>
          </KeyboardAwareScrollView>
          <View style={styles.bottomPart}>
            <View style={styles.btnWrapperPart}>
              <View style={styles.btnWrapper}>
                <StdBtn type="btImage" textStyle={{fontSize: width(4.5)}} text="Confirm" onPress={() => this.confirm(fields)} />
              </View>
            </View>
          </View>
        </View>
        <ModalSelectPhoto
          onBtnPress={this.onModalSelectPhotoBtnPress}
          checkedPhotoId={checkedPhotoId}
          visible={modalSelectPhotoShow}/>
        <HintModal show={showError} type="text" hintData={error} />
        <ShowImagePickModal callback={this.pickerModalCallback} show={showPickerModal}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
    height: height(100),
  },
  contentContainerStyle: {
    minHeight: '100%'
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarBtnWrapper: {
    marginTop: width(4),
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputsWrapper: {
    marginTop: width(2),
    width: width(86)
  },
  inputWrapper: {
    width: '100%',
    height: isIphoneX()
      ? width(24)
      : width(18)
  },
  checkBoxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: width(5)
  },
  checkBoxIconImageWrapper: {
    height: width(8),
    width: width(8)
  },
  checkBoxIconImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  checkBoxText: {
    fontSize: width(3.9),
    marginLeft: width(4)
  },
  topTextsWrapper: {
    marginTop: width(10),
    width: width(80),
    flexShrink: 1
  },
  titleText: {
    fontSize: width(5),
    color: '#646464'
  },
  infoText: {
    marginTop: width(2),
    fontSize: width(4.2),
    color: '#ADADAD',
    lineHeight: width(6.6)
  },
  roundBtnsWrapper: {
    marginTop: width(10),
    width: width(74),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  middleTextsWrapper: {
    marginTop: width(10),
    width: width(80),
  },
  roundedBtnsWrapper: {
    marginTop: width(5),
    width: width(86),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  bottomPart: {
    // marginTop: width(9.1),
    width: width(100),
    alignSelf: 'flex-end'
  },
  btnWrapper: {
    height:  isIphoneX()
      ? width(22)
      : width(14),
    }
})
