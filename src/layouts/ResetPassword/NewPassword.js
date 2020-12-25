import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Alert } from 'react-native'
import { connect } from 'react-redux'
import BusyIndicator from 'react-native-busy-indicator'

import { width, height, iconImages, getBackgroundImageByType, getColorByType, getButtonBackgroundImageByType, isIphoneX, serverUrls } from 'constants/config'
import { connectWithNavigationIsFocused, checkNextProps } from 'utils'

import * as ApiUtils from 'actions/utils'

import NavBar from 'components/NavBar'
import StdInput from 'components/StdInput'
import Sep from 'components/Sep'
import ThreeImages from 'components/ThreeImages'
import BigTextInput from 'components/BigTextInput'
import RoundedBtn from 'components/RoundedBtn'
import StdBtn from 'components/StdBtn'

const fieldsOrder = ['password', 'confirmPassword']

@connectWithNavigationIsFocused(
  state => ({
		setNewPswdRequest: state.setNewPswdRequest
  }),
  dispatch => ({
    actionSetNewPswdRequest: (data) => {
      dispatch(fetchServ(serverUrls.setNewPswdRequest, data, null, 'SETNEWPSWDREQUEST'))
		},
  })
)
export default class NewPassword extends Component {
  constructor(props) {
    super(props);
    const fields = {
      password: '',
      confirmPassword: ''
    }
    this.state = {
      fields,
      isLoading: false
    }
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

  componentWillReceiveProps(nextProps) {
    const { navigation } = this.props
    const propsCheckerSetNewPswdRequest = checkNextProps(nextProps, this.props, 'setNewPswdRequest')
    if (propsCheckerSetNewPswdRequest == 'error') {
			const error = nextProps.setNewPswdRequest.error
			this.setState({
				isLoading: false,
      }, () => {
        Alert.alert(error.msg, null, [
          {text: 'OK', onPress: () => navigation.goBack()}
        ], {
          onDismiss: () => navigation.goBack()
        })
      });
    } else if (propsCheckerSetNewPswdRequest && propsCheckerSetNewPswdRequest != 'empty') {
      const data = nextProps.setNewPswdRequest.response
      console.log('setNewPswdRequest')
      console.log(setNewPswdRequest)
			this.setState({
        isLoading: false,
      }, () => {
        this.goToConfirmCode()
      });
    } else if (propsCheckerSetNewPswdRequest == 'empty') {
      this.setState({
        isLoading: false,
      }, () => {
        this.goToConfirmCode()
      });
    }
  }

  goToConfirmCode = () => {
    const { navigation } = this.props
    const { fields } = this.state
    const navParams = navigation.state.params
    navigation.navigate('Confirmation', {...navParams, password: fields.password })
  }


  onFieldChange = (fieldName, value) => {
    let newStateFields = this.state.fields
    newStateFields[fieldName] = value
    this.setState({fields: newStateFields})
  }

  continue = () => {
    const { navigation, actionSetNewPswdRequest } = this.props
    const { fields } = this.state
    const navParams = navigation.state.params
    if (this.checkFields()) {
      this.setState({
        isLoading: true,
      }, () => {
        actionSetNewPswdRequest({ ...navParams, password: fields.password })
      });
    }
  }

  onSubmitEditing = (fieldName) => {
		const { onSubmit } = this.props
		const indexOfField = fieldsOrder.indexOf(fieldName)
		if (indexOfField < fieldsOrder.length - 1) {
      this[fieldsOrder[indexOfField + 1]] && this[fieldsOrder[indexOfField + 1]].focus()
    } else {
      this.continue()
    }
	}

  render() {
    const { navigation } = this.props
    const { fields, isLoading } = this.state
    const { password, confirmPassword } = fields
    const navBarProps = {
      leftPart: {
        image: iconImages.navBarBackIconWhite,
        action: () => navigation.goBack()
      },
      centerPart: {
        text: 'Reset Password'
      },
    }
    return (
      <View style={styles.wrapper}>
        <NavBar {...navBarProps} navBarBackgroundImage={iconImages.navBarBackgroundImageGreen} navigation={navigation} />
        <KeyboardAvoidingView style={styles.content} keyboardVerticalOffset={30} behavior='padding'>
          <View style={styles.topPartWrapper}>
            <View style={styles.textsWrapper}>
              <Text style={styles.title}>
                New Password
              </Text>
              <Text style={styles.text}>
                Please enter a new password, it can’t be the same as your previous password, must contain a capital letter and special character.
              </Text>
            </View>
          </View>
          <View style={styles.centerPart}>
            <View style={styles.inputsWrapper}>
              <View style={styles.inputWrapper}>
                <StdInput
                  secureTextEntry={true}
                  refName={comp => this['password'] = comp}
                  returnKeyLabel='Next'
					        onSubmitEditing={() => this.onSubmitEditing('password')}
                  placeholder="NEW PASSWORD"
                  value={password}
                  inputStyle={{
                    fontSize: width(2.8)
                  }}
                  onChangeText={text => this.onFieldChange('password', text)} />
              </View>
              <Sep  />
              <View style={styles.inputWrapper}>
                <StdInput
                  secureTextEntry={true}
                  refName={comp => this['confirmPassword'] = comp}
                  returnKeyLabel='Done'
					        onSubmitEditing={() => this.onSubmitEditing('confirmPassword')}
                  placeholder="CONFIRM PASSWORD"
                  value={confirmPassword}
                  inputStyle={{
                    fontSize: width(2.8)
                  }}
                  onChangeText={text => this.onFieldChange('confirmPassword', text)} />
              </View>
              <Sep />
            </View>
            <View style={styles.roundBtnWrapper}>
              <RoundedBtn
                innerStyle={{
                  height: width(9),
                  width: width(60),
                  borderRadius: width(8),
                  borderWidth: 0,
                }}
                textStyle={{
                  color: 'white',
                  fontSize: width(3),
                  marginTop: 0
                }}
                onPress={this.continue}
                backgroundColor="#8D8D8D"
                text="Continue" />
            </View>
          </View>
          <View style={styles.bottomPartWrapper}>

          </View>
        </KeyboardAvoidingView>
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
  },
  textsWrapper: {
    width: '100%',
    alignItems: 'center'
  },
  title: {
    fontSize: width(5),
    fontWeight: '400',
    color: '#646464',
    marginTop: width(12),
    lineHeight: width(6),
    textAlign: 'center'
  },
  text: {
    fontSize: width(4),
    color: '#818387',
    marginTop: width(3),
    lineHeight: width(6),
    textAlign: 'center',
  },
  centerPart: {
    width: '100%',
    marginBottom: width(20),
    alignItems: 'center'
  },
  inputsWrapper: {
    width: '100%',
    width: width(80)
  },
  inputWrapper: {
    height: width(17)
  },
  bottomPartWrapper: {
    width: '100%',
    alignItems: 'center'
  },
  roundBtnWrapper: {
    marginVertical: width(4)
  },
})
