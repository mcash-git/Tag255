import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'

import { width, height, iconImages, getColorByType, getNavBarBackgroundImageByType } from 'constants/config'

import NavBar from 'components/NavBar'
import PhoneInput from 'components/PhoneInput'
import StdInput from 'components/StdInput'
import Sep from 'components/Sep'
import StdBtn from 'components/StdBtn'
import HintModal from 'components/HintModal'
import RoundedBtn from 'components/RoundedBtn'

const radioInputs = [
  {
    key: '0',
    text: 'Thanks for the awesome introduction!'
  },
  {
    key: '1',
    text: 'Lorem ipsum dolor sit amet, consecteit. Ed do eiusmod tempor '
  },
  {
    key: '2',
    text: 'Lorem ipsum dolor sit amet, consecteit.'
  },
  {
    key: '3',
    text: 'Sed do eiusmod tempor incididunt ut lab.'
  },
  {
    key: '4',
    text: 'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.'
  },
]

@connect(
  state => ({
    makeIntroductionData: state.makeIntroductionData,
  }),
  dispatch => ({
    setMakeIntroductionData: (data) => {
      dispatch(ApiUtils.setMakeIntroductionData(data))
    },
  })
)
export default class SelectMessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radioInputActiveKey: '',
    }
  }

  onRadioInpurPress = (radioInputKey) => {
    this.setState({radioInputActiveKey: radioInputKey})
  }

  render() {
    const { navigation, makeIntroductionData } = this.props
    const { fPerson, sPerson, otherData } = makeIntroductionData
    const { radioInputActiveKey } = this.state
    const navBarProps = {
      leftPart: {
        image: iconImages.navBarBackIconWhite,
        action: () => navigation.goBack()
      },
      centerPart: {
        text: 'Select Messsage'
      },
    }
    return (
      <View style={styles.wrapper}>
        <NavBar {...navBarProps} navBarBackgroundImage={getNavBarBackgroundImageByType(otherData.relationType)} statusBarBackgroundColor={getColorByType(otherData.relationType)} navigation={navigation} />
        <View style={styles.content}>
          
          <View style={styles.topPart}>
            <View style={styles.textsWrapper}>
              <Text style={styles.titleText}>
                Select message
              </Text>  
              <Text style={styles.infoText}>
                Select a message from the list below or choose custom to enter your own. 
              </Text>  
            </View>  
            <View style={styles.formWrapper}>
              {
                radioInputs.map(item => {
                  return (
                    <View key={item.key} style={styles.inputWrapper}> 
                      <View style={styles.inputInner}>
                        <StdInput 
                          type="radio"
                          label={item.text}
                          value={item.key == radioInputActiveKey}
                          onChange={text => this.onRadioInpurPress(item.key)} />
                      </View>
                      <Sep />  
                    </View>  
                  )
                })
              }  
            </View>  
          </View>
          <View style={styles.bottomPart}>
            <View style={styles.btnWrapperPart}>
              <View style={styles.btnWrapper}>
                <RoundedBtn
                  innerStyle={{
                    height: width(11.6),
                    width: width(80),
                    borderRadius: width(1),
                    borderWidth: 1,
                    borderColor: '#E4E6E8'
                  }}
                  textStyle={{
                    color: '#8D8D8D',
                    marginTop: 0,
                    fontSize: width(3.2)
                  }}
                  onPress={() => navigation.navigate('EditMessage')}
                  backgroundColor="transparent"
                  text="Use Custom Message" />
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
    height: height(88),
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  textsWrapper: {
    marginTop: width(5),
    width: width(88),
    flexShrink: 1,
    alignSelf: 'center'
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
    width: width(100),
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  inputWrapper: {
    height: width(18),
  },
  inputInner: {
    width: width(88),
    flex: 1,
  },
  bottomPart: {
    marginTop: width(0)
  },
  btnWrapperPart: {
    marginVertical: width(4)
  },
  btnWrapper: {
    height: width(15),
    width: width(100),
    justifyContent: 'center',
    alignItems: 'center'
  }
})