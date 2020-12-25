import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import BusyIndicator from 'react-native-busy-indicator'

import { width, height, iconImages, getBackgroundImageByType, getColorByType, getButtonBackgroundImageByType, isIphoneX, serverUrls, requiredList } from 'constants/config'
import { connectWithNavigationIsFocused, checkNextProps, cleanPhoneNumb, getAuthHeader, initModels } from 'utils'

import * as Models from 'models'

import fetchServ from 'actions/fetchServ'
import * as ApiUtils from 'actions/utils'

import NavBar from 'components/NavBar'
import StdInput from 'components/StdInput'
import Sep from 'components/Sep'
import PhoneInput from 'components/PhoneInput'
import RoundedBtn from 'components/RoundedBtn'

@connectWithNavigationIsFocused(
  state => ({
    createUser: state.createUser,
  }),
  dispatch => ({
    actionCreateUser: (data, headers) => {
      dispatch(fetchServ(serverUrls.createUser, data, headers, 'CREATEUSER'))
    }
  })
)
export default class ResetPassword extends Component {
  constructor(props) {
    super(props);
    const fields = {
      phone: ''
    }
    this.state = {
      fields,
      isLoading: false
    }
  }

  onFieldChange = (fieldName, value) => {
    let newStateFields = this.state.fields
    newStateFields[fieldName] = value
    this.setState({fields: newStateFields})
  }

  onAddAvatarPress = () => {

  }

  createUser = () => {
    const { navigation, actionCreateUser } = this.props
    const navParams = navigation.state.params
    const { fields } = this.state
    const { phone, email } = fields
    this.setState({ isLoading: true }, () => {
			actionCreateUser({
				"phone": phone,
				"email": navParams.fields.email
			})
		})
  }

  componentWillReceiveProps(nextProps) {
    const { navigation } = this.props
    const navParams = navigation.state.params
		const { fields } = this.state
		const propsCheckerCreateUser = checkNextProps(nextProps, this.props, 'createUser')
    if (propsCheckerCreateUser && propsCheckerCreateUser != 'empty') {
			this.setState({ isLoading: false })
      const data = nextProps.createUser.response
			navigation.navigate('SignUpConfirmCode', {
				fields: {
          ...fields,
          ...navParams.fields,
          mfa_id: String(data.mfa_id),
          signUpCredentials: navParams.signUpCredentials
				}
			})
    } else if (propsCheckerCreateUser == 'empty') {
      this.setState({
        isLoading: false,
      });
    }
	}

  render() {
    const { navigation } = this.props
    const { fields, isLoading } = this.state
    const { phone, email } = fields
    const navBarProps = {
      leftPart: {
        image: iconImages.navBarBackIconWhite,
        action: () => navigation.goBack()
      },
      centerPart: {
        text: 'Verification'
      },
    }
    const signUnDisabled = !Object.keys(fields).every(fieldKey => requiredList['signup'].includes(fieldKey) 
			? !!fields[fieldKey]
			: true
		)
    return (
      <View style={styles.wrapper}>
        <NavBar {...navBarProps} navBarBackgroundImage={iconImages.navBarBackgroundImageGreen} navigation={navigation} />
        <View style={styles.content}>
          <View style={styles.topPartWrapper}>
            <View style={styles.titleWrapper}>
              <Text style={styles.title}>
                What’s your mobile number or email?
              </Text> 
            </View>
            <View style={styles.inputsWrapper}>
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
              <Sep />
            </View>
            <Sep />
          </View>
          <View style={styles.bottomPartWrapper}>
            <View style={styles.roundBtnWrapper}>
              <RoundedBtn
                disabled={signUnDisabled}
                innerStyle={{
                  height: width(9),
                  width: width(60),
                  borderRadius: width(8),
                  borderWidth: 0,
                }}
                textStyle={{
                  color: 'white',
                  fontSize: width(3.2),
                  marginTop: 0
                }}
                onPress={this.createUser}
                backgroundColor="#8D8D8D"
                text="Send code" />  
            </View> 
          </View>  
        </View>  
        <BusyIndicator isVisible={isLoading} overlayColor="rgba(0,0,0,0.4)" overlayWidth={60} overlayHeight={60} size="small"/>
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
    flex: 1,
  },
  titleWrapper: {
    width: '100%',
    alignItems: 'center'
  },
  title: {
    fontSize: width(4),
    fontWeight: '400',
    color: '#646464',
    marginTop: width(8),
    marginBottom: width(6),
    lineHeight: width(8),
    textAlign: 'center',
    width: width(60)
  },
  inputsWrapper: {
    marginTop: width(8)
  },
  phoneInputWrapper: {
    width: '100%',
    height: isIphoneX()
      ? width(20)
      : width(18)
  },
  mailInputWrapper: {
    height: width(18)
  },
  bottomPartWrapper: {
    width: '100%',
    alignItems: 'center'
  },
  roundBtnWrapper: {
    marginVertical: width(4)
  },
})