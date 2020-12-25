import React, { Component } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native'
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux'

import { width, height, iconImages, getBackgroundImageByType, getColorByType, getButtonBackgroundImageByType } from 'constants/config'

import * as ApiUtils from 'actions/utils'

import NavBar from 'components/NavBar'
import StdInput from 'components/StdInput'
import Sep from 'components/Sep'
import ThreeImages from 'components/ThreeImages'
import RoundedBtn from 'components/RoundedBtn'
import StdBtn from 'components/StdBtn'
import BigTextInput from 'components/BigTextInput'

@connect(
  state => ({
    makeIntroductionData: state.makeIntroductionData,
    userData: state.userData
  }),
  dispatch => ({
    resetMakeIntroductionData: () => {
      dispatch(ApiUtils.resetMakeIntroductionData())
    },
  })
)
export default class EditMessage extends Component {
  constructor(props) {
    super(props);
    const fields = {
      message: '',
      editedMessage: ''
    }
    this.state = {
      fields,
      messageIsSaved: false
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

  confirm = () => {
    const { navigation, resetMakeIntroductionData } = this.props
    navigation.navigate('MakeIntroSent')
  }

  render() {
    const { navigation, makeIntroductionData, userData } = this.props
    const { messageIsSaved } = this.state
    const { fPerson, sPerson, otherData } = makeIntroductionData
    const { fields } = this.state
    const { message, editedMessage } = fields
    const navBarProps = {
      leftPart: {
        image: iconImages.navBarBackIconWhite,
        action: () => navigation.goBack()
      },
      centerPart: {
        text: ''
      },
    }
    return (
      <ScrollView style={styles.wrapper} contentContainerStyle={styles.contentContainerStyle}>
        <View style={styles.topPartWrapper}>
          <ImageBackground source={getBackgroundImageByType(otherData.relationType)} style={styles.topPart}>
            <NavBar {...navBarProps} statusBarBackgroundColor={getColorByType(otherData.relationType)} transparent navigation={navigation} />
            <View style={styles.topPartContent}>
              <Text style={styles.topText}>
                Awesome! Say a little something.
              </Text>
              <View style={styles.threeImagesWrapper}>
                <ThreeImages images={[fPerson.avatar, sPerson.avatar, userData.userModel.avatar]} wrapperWidth={width(40)} />
              </View>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.content}>
          <View style={styles.topContentPart}>
            <View style={styles.topInputWrapper}>
              <View style={styles.topInputInner}>
                <StdInput
                  data={[{label: 'message1', value: 'message1'}, {label: 'message2', value: 'message2'},{label: 'message2', value: 'message2'}]}
                  value={message}
                  type="picker"
                  iconStyle={{
                    right: 0
                  }}
                  onChangeText={text => this.onFieldChange('message', text)} />
              </View>
            </View>
            <View style={styles.textsWrapper}>
              <Text style={styles.title}>
                Edit Message
              </Text>
              <View style={styles.bigTextInputWrapper}>
                <BigTextInput
                  value={editedMessage}
                  placeholder="Lorem ipsum dolor sit amet, consecteit. Ed do eiusmod tempor"
                  onChangeText={text => this.onFieldChange('editedMessage', text)} />
              </View>
              <Sep />
            </View>
            <View style={styles.inputsWrapper}>
              <View style={styles.roundedBtnWrapper}>
                <RoundedBtn
                  innerStyle={{
                    height: width(6),
                    width: width(50),
                    borderRadius: width(8),
                    borderWidth: 1,
                    borderColor: '#E4E6E8',
                  }}
                  textStyle={{
                    color: '#8D8D8D',
                    marginTop: 0,
                    fontSize: width(2.8)
                  }}
                  onPress={this.saveToLibrary}
                  backgroundColor="transparent"
                  text={
                    messageIsSaved
                      ? 'Saved'
                      : 'Save message to library'
                  } />
              </View>
            </View>
          </View>
          <View style={styles.bottomPart}>
            <View style={styles.btnWrapperPart}>
              <View style={styles.btnWrapper}>
                <StdBtn
                  type="btImage"
                  text="Send"
                  source={getButtonBackgroundImageByType(otherData.relationType)}
                  onPress={() => this.confirm()} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'white'
  },
  contentContainerStyle: {
    minHeight: '100%',
    alignItems: 'center',
  },
  topPartWrapper: {
    width: width(100),
    height: width(70)
  },
  topPart: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topContentPart: {
    alignItems: 'center',
  },
  topInputWrapper: {
    width: width(100),
    backgroundColor: '#F5F6FB',
  },
  topInputInner: {
    marginVertical: width(2),
    marginHorizontal: width(8)
  },
  topPartContent: {
    marginTop: width(1),
    alignItems: 'center',
    justifyContent: 'center',
    width: width(100),
  },
  threeImagesWrapper: {
    marginTop: width(1),
  },
  topText: {
    color: 'white',
    fontSize: width(4.6),
    fontWeight: '500'
  },
  textsWrapper: {
    width: width(80),
  },
  title: {
    fontSize: width(5.4),
    fontWeight: '500',
    color: '#646464',
    marginVertical: width(4)
  },
  bigTextInputWrapper: {
    fontSize: width(3.8),
    color: '#B8B5AD',
    lineHeight: width(6.6),
    marginTop: width(4),
    height: width(22)
  },
  inputsWrapper: {
    marginTop: width(1.4),
    width: width(80),
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  inputWrapper: {
    width: '100%',
    marginTop: width(2)
  },
  roundedBtnWrapper: {
    marginVertical: width(1.4)
  },
  bottomPart: {
    width: width(100)
  },
  btnWrapper: {
    height: width(14)
  }
})
