import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'

import { width, height, iconImages, serverUrls } from 'constants/config'
import { checkNextProps, getAuthHeader, cleanPhoneNumb } from 'utils'

import * as ApiUtils from 'actions/utils'

import NavBar from 'components/NavBar'
import PhoneInput from 'components/PhoneInput'
import StdInput from 'components/StdInput'
import Sep from 'components/Sep'
import StdBtn from 'components/StdBtn'
import HintModal from 'components/HintModal'

@connect(
  state => ({
    getAllUsers: state.getAllUsers,
    userData: state.userData,
    inviteUser: state.inviteUser,
  }),
  dispatch => ({
    setMakeIntroductionData: (data) => {
      dispatch(ApiUtils.setMakeIntroductionData(data))
    },
    actionGetUsers(filters, headers) {
      dispatch(fetchServ({ ...serverUrls.getUsers, url: serverUrls.getUsers.url }, filters, headers, 'GETUSERS'))
    },
    actionInviteUser: (data, headers) => {
			dispatch(fetchServ(serverUrls.inviteUser, data, headers, 'INVITEUSER'))
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
      ...contactInfo
    }
    this.state = {
      fields,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { navigation, setMakeIntroductionData } = this.props
    const personKey = navigation.state.params && navigation.state.params.personKey
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
      console.log('getUsers')
      console.log(data)
      if (!(data && data.length)) {

      } else {
        setMakeIntroductionData({ [personKey]: fields })
        navigation.navigate('Intro', {prevScreen: 'AddCustomContact'})
      }
    }
  }


  onFieldChange = (fieldName, value) => {
    let newStateFields = this.state.fields
    newStateFields[fieldName] = value
    this.setState({fields: newStateFields})
  }

  confirm = (fields) => {
    const { navigation } = this.props
    const personKey = navigation.state.params && navigation.state.params.personKey
    if (personKey) {
      actionGetUsers({
        mobilePhone: fields.phone
      }, getAuthHeader(nextProps.userData.token))
    }
  }

  close = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  render() {
    const { navigation } = this.props
    const { fields } = this.state
    const { phone, email } = fields
    const navBarProps = {
      leftPart: {
        image: iconImages.navBarCrossIconWhite,
        action: () => this.close()
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
      <View style={styles.wrapper}>
        <NavBar {...navBarProps} navigation={navigation} />
        <View style={styles.content}>

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
                  countryProps={{
                    wrapperStyle: {paddingRight: width(0)}
                  }}
                  phoneProps={{
                    wrapperStyle: { marginLeft: width(6) },
                    redDot: true
                  }}
                  value={phone}
                  onChangeText={text => this.onFieldChange('phone', text)} />
              </View>
              <Sep type="andOr" />
              <View style={styles.mailInputWrapper}>
                <StdInput
                  placeholder="Email Address"
                  value={email}
                  keyboardType='email-address'
                  onChangeText={text => this.onFieldChange('email', text)} />
              </View>
              <Sep />
            </View>
          </View>
          <View style={styles.bottomPart}>
            <View style={styles.btnWrapperPart}>
              <View style={styles.btnWrapper}>
                <StdBtn type="btImage" text="Confirm" onPress={() => this.confirm(fields)} />
              </View>
            </View>
          </View>
        </View>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  textsWrapper: {
    marginTop: width(10),
    width: width(88),
    flexShrink: 1
  },
  titleText: {
    fontSize: width(5.4),
    color: '#646464',
    fontWeight: '500'
  },
  infoText: {
    fontSize: width(4.4),
    color: '#ADADAD',
    lineHeight: width(7)
  },
  formWrapper: {
    marginTop: width(6),
    width: width(90),
    justifyContent: 'flex-start'
  },
  phoneInputWrapper: {
    height: width(20),
    width: '100%'
  },
  mailInputWrapper: {
    paddingVertical: width(2),
    width: '100%'
  },
  bottomPart: {
    marginTop: width(-2)
  },
  btnWrapperPart: {
    marginTop: width(-4)
  },
  btnWrapper: {
    height: width(13),
    width: width(100),
    justifyContent: 'center',
    alignItems: 'center'
  }
})
