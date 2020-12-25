import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native'
import { OptionList, updatePosition } from 'react-native-dropdown'
import NestedScrollView from 'react-native-nested-scroll-view'

import { width, height, iconImages } from 'constants/config'

import NavBar from 'components/NavBar'
import PhoneInput from 'components/PhoneInput'
import StdInput from 'components/StdInput'
import Sep from 'components/Sep'
import StdBtn from 'components/StdBtn'
import HintModal from 'components/HintModal'

export default class AddContactInfo extends Component {
  constructor(props) {
    super(props);
    const fields = {
      phone: '',
      email: ''
    }
    this.state = {
      fields,
      showError: false
    }
  }


  onFieldChange = (fieldName, value) => {
    let newStateFields = this.state.fields
    newStateFields[fieldName] = value
    this.setState({fields: newStateFields})
  }

  confirmBtnPress = () => {
    const { fields } = this.state
    const { phone, email } = fields
    if (!phone && !email) {
      this.showErrorHint()
    }
  }

  showErrorHint = () => {
    this.setState({ showError: true }, () => {
      setTimeout(() => {
        this.setState({ showError: false })
      }, 5000)
    })
  }

  render() {
    const { navigation } = this.props
    const { fields, showError } = this.state
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
                <StdBtn type="btImage" text="Confirm" onPress={() => this.confirmBtnPress()} />
              </View>
            </View>
          </View>
          <OptionList customScrollViewComp={NestedScrollView} ref="OPTIONLIST_COUNTRY"/>
        </View> 
        <HintModal show={showError} type="text" hintData={hintData.text} />
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
    // height: height(88),
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
    width: '100%'
  },
  bottomPart: {
    marginTop: width(0)
  },
  btnWrapperPart: {
    marginTop: width(4)
  },
  btnWrapper: {
    height: width(13),
    width: width(100),
    justifyContent: 'center',
    alignItems: 'center'
  }
})