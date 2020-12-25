import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Keyboard, Alert } from 'react-native'
import { connect } from 'react-redux'
import BusyIndicator from 'react-native-busy-indicator'

import { width, height, iconImages, getBackgroundImageByType, getColorByType, getButtonBackgroundImageByType, isIphoneX, serverUrls } from 'constants/config'
import { connectWithNavigationIsFocused, checkNextProps, cleanPhoneNumb } from 'utils'

import * as ApiUtils from 'actions/utils'

import NavBar from 'components/NavBar'
import StdInput from 'components/StdInput'
import Sep from 'components/Sep'
import ThreeImages from 'components/ThreeImages'
import BigTextInput from 'components/BigTextInput'
import RoundedBtn from 'components/RoundedBtn'
import StdBtn from 'components/StdBtn'

@connectWithNavigationIsFocused(
  state => ({
		resetPswdRequest: state.resetPswdRequest
  }),
  dispatch => ({
    actionResetPswdRequest: (login) => {
      dispatch(fetchServ({ ...serverUrls.resetPswdRequest, url: serverUrls.resetPswdRequest.url + '/' + login }, null, null, 'RESETPSWDREQUEST'))
    },
  })
)
export default class ConfirmCode extends Component {
  constructor(props) {
    super(props);
    const fields = {
      code0: '',
      code1: '',
      code2: '',
      code3: '',
      code4: '',
      code5: '',
    }
    this.state = {
      fields
    }
  }

  componentWillReceiveProps(nextProps) {
    const { navigation, unsetUserData } = this.props
    const propsCheckerResetRequest = checkNextProps(nextProps, this.props, 'resetPswdRequest')
    if (propsCheckerResetRequest == 'error') {
			const error = nextProps.resetPswdRequest.error
			this.setState({
				isLoading: false,
      }, () => {
        Alert.alert(error.msg, null, [
          {text: 'OK', onPress: () => navigation.goBack()}
        ], {
          onDismiss: () => navigation.goBack()
        })
      });
    } else if (propsCheckerResetRequest) {
      this.setState({ isLoading: false }, () => {
        Alert.alert('Code has been resend', null, [
          {text: 'OK'}
        ])
      })
    }
  }

  onFieldChange = (fieldName, value) => {
    const { navigation } = this.props
    let newStateFields = this.state.fields
    newStateFields[fieldName] = value
    this.setState({fields: newStateFields}, () => {
      if (value.length) {
        if (Object.keys(newStateFields).indexOf(fieldName) < Object.keys(newStateFields).length) {
          const nextItemIndex = Object.keys(newStateFields).indexOf(fieldName) + 1
          if (nextItemIndex && Object.keys(newStateFields)[nextItemIndex]) {
            this[Object.keys(newStateFields)[nextItemIndex]] && this[Object.keys(newStateFields)[nextItemIndex]].focus()
          } else {
            Keyboard.dismiss()
            this.goToNewPassword()
          }
        } else {
          Keyboard.dismiss()
          this.goToNewPassword()
        }
      }
    })
  }

  goToNewPassword = () => {
    const { fields } = this.state
    const { navigation } = this.props
    const navParams = navigation.state.params
    navigation.navigate('NewPassword', {...navParams, code: Array(Object.keys(fields).length).fill().map((item, idx) => fields['code' + idx]).join('')})
  }

  onAddAvatarPress = () => {

  }

  resend = () => {
    const { actionResetPswdRequest, navigation } = this.props
    const navParams = navigation.state.params
    this.setState({
      isLoading: true,
    }, () => {
      actionResetPswdRequest(navParams.phone && cleanPhoneNumb(navParams.phone)||navParams.email)
    })
  }

  render() {
    const { navigation } = this.props
    const { fields, isLoading } = this.state
    const navParams = navigation.state.params
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
        <KeyboardAvoidingView style={styles.content} keyboardVerticalOffset={width(4)} behavior='padding'>
          <View style={styles.topPartWrapper}>
            <View style={styles.textsWrapper}>
              <Text style={styles.title}>
                Enter confirmation code
              </Text>
              <Text style={styles.text}>
                Enter the code we sent to {navParams.phone}
              </Text>
            </View>
            <View style={styles.inputsWrapper}>

                {
                  fields && Object.keys(fields).map((item, idx) => {
                    return (
                      <View key={'input_' + item} style={styles.inputWrapper}>
                        <StdInput
                          refName={comp => this[item] = comp}
                          value={fields[item]}
                          keyboardType='numeric'
                          inputStyle={{
                            fontSize: width(5),
                            textAlign: 'center',
                            fontWidth: '600',
                            borderBottomWidth: width(.4),
                            paddingBottom: width(2),
                            borderBottomColor: '#cccccc'
                          }}
                          onChangeText={text => this.onFieldChange(item, text)} />

                      </View>
                    )
                  })
                }
            </View>
          </View>
          <View style={styles.bottomPartWrapper}>
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
                onPress={this.resend}
                backgroundColor="#8D8D8D"
                text="Resend" />
            </View>
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
    flex: 1
  },
  textsWrapper: {
    width: '100%',
    alignItems: 'center'
  },
  title: {
    fontSize: width(4.5),
    fontWeight: '400',
    color: '#646464',
    marginTop: width(6),
    lineHeight: width(6),
    textAlign: 'center'
  },
  text: {
    fontSize: width(3.5),
    color: '#646464',
    marginTop: width(6),
    marginBottom: width(6),
    lineHeight: width(6),
    textAlign: 'center'
  },
  inputsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: width(6),
    height: width(18)
  },
  inputWrapper: {
    width: width(10)
  },
  bottomPartWrapper: {
    width: '100%',
    alignItems: 'center'
  },
  roundBtnWrapper: {
    marginVertical: width(4)
  },
})
