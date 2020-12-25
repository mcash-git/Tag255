import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native'
import { connect } from 'react-redux'

import { width, height, iconImages, getBackgroundImageByType, getColorByType, getButtonBackgroundImageByType } from 'constants/config'

import * as ApiUtils from 'actions/utils'

import NavBar from 'components/NavBar'
import StdInput from 'components/StdInput'
import Sep from 'components/Sep'
import ThreeImages from 'components/ThreeImages'

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
export default class SelectMessage extends Component {
  constructor(props) {
    super(props);
    const fields = {
      message: '',
    }
    this.state = {
      fields
    }
  }

  onFieldChange = (fieldName, value) => {
    let newStateFields = this.state.fields
    if (fieldName == 'agree') {
      newStateFields[fieldName] = !newStateFields[fieldName]
    } else {
      newStateFields[fieldName] = value
    }
    this.setState({fields: newStateFields})
  }

  onAddAvatarPress = () => {

  }

  confirm = () => {
    const { navigation } = this.props
    navigation.navigate('ConnSelectMessageList')
  }

  render() {
    const { navigation, makeIntroductionData } = this.props
    const { fPerson, sPerson, otherData } = makeIntroductionData
    const { fields } = this.state
    const { message } = fields
    const navBarProps = {
      leftPart: {
        image: iconImages.navBarBackIconWhite,
        action: () => navigation.goBack()
      },
      centerPart: {
        text: 'Select Message'
      },
    }
    return (
      <View style={styles.wrapper}>
        <View style={styles.topPartWrapper}>
          <ImageBackground source={getBackgroundImageByType(otherData.relationType)} style={styles.topPart}>
            <NavBar {...navBarProps} statusBarBackgroundColor={getColorByType(otherData.relationType)} transparent navigation={navigation} />
            <View style={styles.topPartContent}>
              <Text style={styles.topText}>
                Awesome! Say a little something.
              </Text>  
              <View style={styles.threeImagesWrapper}>
                <ThreeImages images={[iconImages.fakeThreeImages1, iconImages.fakeThreeImages2, iconImages.fakeThreeImages3]} wrapperWidth={width(62)} />
              </View>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.content}>
          <View style={styles.textsWrapper}>
            <Text style={styles.title}>
              Select message
            </Text>  
            <Text style={styles.text}>
              Please select a message below to send to Kaythrn and Landon.
            </Text>  
          </View> 
          <View style={styles.inputsWrapper}>
            <Sep />  
            <View style={styles.inputWrapper}>
              <StdInput 
                label="Select a message and edit if you like"  
                type="btn"
                inputStyle={{ color: '#75767C', marginLeft: width(2) }}
                onChange={text => this.confirm()} /> 
              </View>
            <Sep /> 
          </View>  
        </View>  
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'white'
  },
  topPartWrapper: {
    width: width(100),
    height: width(100)
  },
  topPart: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  content: {
    flex: 1,
    alignItems: 'center',
    marginBottom: width(40)
  },
  topPartContent: {
    marginTop: width(6),
    alignItems: 'center',
    justifyContent: 'center',
    width: width(100),
  },
  threeImagesWrapper: {
    marginTop: width(2)
  },
  topText: {
    color: 'white',
    fontSize: width(4.6),
    fontWeight: '500'
  },
  textsWrapper: {
    marginTop: width(6),
    width: width(80),
  },
  title: {
    fontSize: width(5),
    fontWeight: '500',
    color: '#646464'
  },
  text: {
    fontSize: width(4),
    color: '#B8B5AD',
    lineHeight: width(6.6),
    marginTop: width(2)
  },
  inputsWrapper: {
    marginTop: width(4),
    width: width(80),
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputWrapper: {
    width: '100%',
    marginVertical: width(1),
    height: width(18)
  }
})