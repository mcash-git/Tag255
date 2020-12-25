import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, Platform } from 'react-native'
import NestedScrollView from 'react-native-nested-scroll-view'
import { NavigationActions } from 'react-navigation';
import BusyIndicator from 'react-native-busy-indicator'
import Contacts from 'react-native-contacts'
import Permissions from 'react-native-permissions'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { width, height, iconImages, isIphoneX, serverUrls } from 'constants/config'
import { connectWithNavigationIsFocused, checkNextProps, cleanPhoneNumb, getAuthHeader, fullCleanPhone } from 'utils'

import * as ApiUtils from 'actions/utils'
import fetchServ from 'actions/fetchServ'

import NavBar from 'components/NavBar'
import PhoneInput from 'components/PhoneInput'
import StdInput from 'components/StdInput'
import Sep from 'components/Sep'
import StdBtn from 'components/StdBtn'
import HintModal from 'components/HintModal'

const fieldsOrder = ['phone', 'email']

const errorHints = {
  inviteYourSelf: {
    title: 'Oops! You can’t invite yourself.',
    text: 'You already have the app installed.'
  },
  requeredFieldsEmpty: {
    title: 'Oops! Some fields are empty.',
    text: 'You should fill all fields that are marked with a red dot.'
  }
}


@connectWithNavigationIsFocused(
  state => ({
    sendSms: state.sendSms,
    userData: state.userData,
    inviteUser: state.inviteUser,
    contacts: state.contacts,
    countryCodes: state.countryCodes,
  }),
  dispatch => ({
    actionSendSms: (data, headers) => {
			dispatch(fetchServ(serverUrls.sendSms, data, headers, 'SENDSMS'))
		},
    actionInviteUser: (data, headers) => {
			dispatch(fetchServ(serverUrls.inviteUser, data, headers, 'INVITEUSER'))
    },
    setContacts: (contacts) => {
      dispatch(ApiUtils.setContacts(contacts))
    },
  })
)
export default class AddContactInfo extends Component {

  constructor(props) {

    super(props);

    const { navigation } = this.props
    const contactInfo = navigation.state && navigation.state.params && navigation.state.params.contactInfo

    const fields = {
      phone: '',
      email: '',
      //firstName: userData.userModel.firstName,
      //  lastName: userData.userModel.firstName,
      ...contactInfo
    }
    this.state = {
      fields,
      showError: false,
      isLoading: false,
      error: ''
    }

  }

  onFieldChange = (fieldName, value) => {
    let newStateFields = this.state.fields
    newStateFields[fieldName] = value
    this.setState({fields: newStateFields})
  }


  confirm = () => {

    const { navigation, actionSendSms, userData, actionInviteUser, contacts } = this.props
    const { fields } = this.state
    const { phone, email } = fields
    console.log('confirm')
    console.log(cleanPhoneNumb(fields.phone))
    console.log(userData.userModel)
    const cleanedPhone = cleanPhoneNumb(fields.phone)
    if (cleanedPhone == userData.userModel.mobilePhone || cleanedPhone == userData.userModel.user || userData.userModel.email == fields.email) {
      this.setState({ error: errorHints.inviteYourSelf }, () => {
        this.showErrorHint()
      })
    } else if ((!cleanedPhone || cleanedPhone.length < 11) && !email) {
      this.setState({ error: errorHints.requeredFieldsEmpty }, () => {
        this.showErrorHint()
      })
    } else {
      if (phone) {
        actionInviteUser({
          ...fields,
          emailTemplate: 'cs-invite.html',
          firstName: userData.userModel.firstName,
          lastName: userData.userModel.lastName,
          body: 'Hello! '+userData.userModel.firstName+' '+userData.userModel.lastName+' has invited you to try Connector Street. A new app that connects people. \n\n iOS: https://itunes.apple.com/us/app/connector-street/id1063707229?mt=8 \n\n Android: https://play.google.com/store/apps/details?id=com.connectorstreet.app'
        }, getAuthHeader(userData.token))
        const cleanedPhone = cleanPhoneNumb(fields.phone)
        const findExistingPhoneIncontacts = contacts && contacts.data.find(item => item && item.cleanedPhone && item.cleanedPhone == cleanedPhone)
        // if (!findExistingPhoneIncontacts) {
        //   const newPerson = {
        //     emailAddresses: [{
        //       label: "ConnectorStreet",
        //       email: fields.email,
        //     }],
        //     familyName: 'New fName',
        //     givenName: 'New sName',
        //     phoneNumbers: [{
        //       label: "mobile",
        //       number: cleanedPhone,
        //     }],
        //   }
        //   Permissions.check('contacts').then(response => {
        //     console.log(response)
        //     if (response == 'authorized') {
        //       Contacts.addContact(newPerson, (error) => {
        //         console.log(error)
        //         if (error) {
        //           Alert.alert('Error creating the contact', null, [
        //             {text: 'OK'}
        //           ])
        //         }
        //         this.getContactts()
        //       })
        //     }
        //   })
        // }
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

  componentWillReceiveProps(nextProps) {
    const { userData, navigation } = this.props
    console.log('componentWillReceiveProps')
    console.log(this.props)
    const propsCheckerSendSms = checkNextProps(nextProps, this.props, 'inviteUser')
    if (propsCheckerSendSms == 'error') {
			const error = nextProps.inviteUser.error
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
      const data = nextProps.inviteUser.response
      this.setState({ isLoading: false }, () => {
        const resetNavigation = () => {
          const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'Main'})
            ],
           key:null
          })
          navigation.dispatch(resetAction)
        }
        Alert.alert('Invitation sent successfully', null, [
          {text: 'OK', onPress: resetNavigation}
        ], {
          onDismiss: () => resetNavigation
        })
      })
    }
  }

  showErrorHint = () => {
    this.setState({ showError: true }, () => {
      setTimeout(() => {
        this.setState({ showError: false })
      }, 5000)
    })
  }

  onSubmitEditing = (fieldName) => {
		const { onSubmit } = this.props
		const indexOfField = fieldsOrder.indexOf(fieldName)
		if (indexOfField < fieldsOrder.length - 1) {
      this[fieldsOrder[indexOfField + 1]] && this[fieldsOrder[indexOfField + 1]].focus()
    } else {
      this.confirm && this.confirm()
    }
	}

  render() {
    const { navigation } = this.props
    const { fields, showError, isLoading, error, userData } = this.state
    const { phone, email } = fields

    const navBarProps = {
      leftPart: {
        image: iconImages.navBarCrossIconWhite,
        action: () => navigation.goBack()
      },
      centerPart: {
        text: 'Add Contact Information'
      },
    }
    const hintData = {
      text: {
        title: 'A mobile phone is required',
        text: 'We require a phone number to send invitations because the Invitees must use a phone number to sign up. '
      },
      photo: {
        avatar: iconImages.fakeHintAvatar,
        title: 'New Message from Maurice Davidson',
        text: 'Thanks for the introduction!'
      }
    }
    return (
      <View style={styles.wrapper} contentContainerStyle={styles.contentContainerStyle}>
        <NavBar {...navBarProps} navigation={navigation} />
        <View style={styles.content}>
          <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" enableOnAndroid={true} extraHeight={200} showsVerticalScrollIndicator={false}>
          <View style={styles.topPart}>
            <View style={styles.textsWrapper}>
              <Text style={styles.titleText}>
                Add contact information
              </Text>
              <Text style={styles.infoText}>
                Enter a mobile number and an email address (if you have one), we’ll send a link to download the app.
              </Text>
            </View>
            <View style={styles.formWrapper}>
              <View style={styles.phoneInputWrapper}>
                <PhoneInput
                  refName={comp => this['phone'] = comp}
                  countryProps={{
                    wrapperStyle: {paddingRight: width(0)}
                  }}
                  phoneProps={{
                    wrapperStyle: { marginLeft: width(6) },
                    redDot: true,
                    keyboardType: 'phone-pad',
                    autoCorrect: false,
                    onSubmitEditing: () => this.onSubmitEditing('phone'),
                    returnKeyLabel: 'Next'
                  }}
                  value={phone}
                  onChangeText={text => this.onFieldChange('phone', text)} />
              </View>
              <Sep type="andOr" />
              <View style={styles.mailInputWrapper}>
                <StdInput
                  refName={comp => this['email'] = comp}
                  returnKeyLabel='Next'
					        onSubmitEditing={() => this.onSubmitEditing('email')}
                  placeholder="Email Address"
                  value={email}
                  keyboardType='email-address'
                  onChangeText={text => this.onFieldChange('email', text)} />
              </View>
              <Sep />
            </View>
          </View>
          </KeyboardAwareScrollView>
          <View style={styles.bottomPart}>
            <View style={styles.btnWrapperPart}>
              <View style={styles.btnWrapper}>
                <StdBtn type="btImage" textStyle={{fontSize: width(4.5)}} text="Confirm" onPress={() => this.confirm()} />
              </View>
            </View>
          </View>
        </View>
        <HintModal show={showError} type="text" hintData={error} />
        <BusyIndicator isVisible={isLoading} overlayColor="rgba(0,0,0,0.4)" overlayWidth={60} overlayHeight={60} size="small"/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: height(100),
    backgroundColor: 'white',
  },
  contentContainerStyle: {
    minHeight: '100%'
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  textsWrapper: {
    marginTop: width(12),
    width: width(88),
    flexShrink: 1
  },
  titleText: {
    fontSize: width(5),
    color: '#646464',
    fontWeight: '500'
  },
  infoText: {
    fontSize: width(4.2),
    color: '#ADADAD',
    marginTop: width(2),
    lineHeight: width(6.6)
  },
  formWrapper: {
    marginTop: width(4),
    width: width(90),
    justifyContent: 'flex-start'
  },
  phoneInputWrapper: {
    height: width(20),
    width: '100%'
  },
  mailInputWrapper: {
    paddingVertical: width(0.5),
    width: '100%',
    height: width(18)
  },
  bottomPart: {
  },
  btnWrapperPart: {
  },
  btnWrapper: {
    height: width(13),
    width: width(100),
    justifyContent: 'center',
    alignItems: 'center'
  }
})
