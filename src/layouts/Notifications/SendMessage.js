import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation';

import { width, height, iconImages, getBackgroundImageByType, getColorByType, getButtonBackgroundImageByType } from 'constants/config'

import * as ApiUtils from 'actions/utils'

import NavBar from 'components/NavBar'
import StdInput from 'components/StdInput'
import Sep from 'components/Sep'
import ThreeImages from 'components/ThreeImages'
import BigTextInput from 'components/BigTextInput'
import RoundedBtn from 'components/RoundedBtn'
import StdBtn from 'components/StdBtn'

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
export default class SendingMessage extends Component {
  constructor(props) {
    super(props);
    const fields = {
      editedMessage: '',
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

  onAddAvatarPress = () => {

  }

  send = () => {
    const { navigation } = this.props
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Main'})
      ],
     key:null
    })
    this.props.navigation.dispatch(resetAction)
  }

  render() {
    const { navigation } = this.props
    const { fields } = this.state
    const { editedMessage } = fields
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
        <NavBar {...navBarProps} navBarBackgroundImage={iconImages.navBarBackgroundImageGreen} navigation={navigation} />
        <KeyboardAvoidingView style={styles.content} keyboardVerticalOffset={width(4)} behavior='padding'>
          <View style={styles.topPartWrapper}>
            <Text style={styles.title}>
              Select message
            </Text> 
            <Sep />
            <View style={styles.bigTextInputWrapper}>
              <BigTextInput
                value={editedMessage}
                autoCorrect={false}
                placeholder="Lorem ipsum dolor sit amet, consecteit. Ed do eiusmod tempor"  
                onChangeText={text => this.onFieldChange('editedMessage', text)} />
            </View>
            <Sep />
            <View style={styles.roundBtnWrapper}>
              <RoundedBtn
                innerStyle={{
                  height: width(9),
                  width: width(80),
                  borderRadius: width(8),
                  borderWidth: 1,
                  borderColor: '#8D8D8D',
                }}
                textStyle={{
                  color: '#8D8D8D',
                  fontSize: width(3),
                  marginTop: 0
                }}
                onPress={this.save}
                backgroundColor="transparent"
                text={
                  messageIsSaved
                    ? 'Saved'
                    : 'Save Message to Library'
                } />  
            </View> 
          </View>
          <View style={styles.bottomPartWrapper}>
            <View style={styles.bottomBtnWrapper}>
              <StdBtn
                type="btImage"
                text="Send"
                source={iconImages.sendMessageButtonBackgroundGreen}
                onPress={() => this.send()} />
            </View>  
          </View>  
        </KeyboardAvoidingView>  
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
    justifyContent: 'space-between'
  },
  topPartWrapper: {
    width: width(80),
    flex: 1
  },
  title: {
    fontSize: width(5),
    fontWeight: '500',
    color: '#646464',
    marginTop: width(6),
    marginBottom: width(6)
  },
  bigTextInputWrapper: {
    width: '100%',
    marginTop: width(4),
    flex: 1,
    maxHeight: width(30)
  },
  roundBtnWrapper: {
    marginVertical: width(4)
  },
  bottomPartWrapper: {
    width: '100%',
  },
  bottomBtnWrapper: {
    height: width(14),
    width: '100%'
  }
})