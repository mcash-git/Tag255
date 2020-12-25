import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native'
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux'

import { width, height, iconImages, getBackgroundColorByType, getColorByType, isIphoneX } from 'constants/config'

import * as ApiUtils from 'actions/utils'

import NavBar from 'components/NavBar'
import ThreeImages from 'components/ThreeImages'
import RoundedBtn from 'components/RoundedBtn'

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
export default class Sent extends Component {
  close = () => {
    const { resetMakeIntroductionData, screenProps, navigation } = this.props
    const screenPropsNavigation = screenProps && screenProps.navigation
    this.props.navigation.dispatch(NavigationActions.popToTop())
    /*const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'clearHomeStack'})
      ],
     key:null
   })*/
      resetMakeIntroductionData()
    //navigation.dispatch(resetAction)
  }

  back = () => {
    const { navigation } = this.props
    navigation.goBack()
  }



  render() {
    const { navigation, makeIntroductionData, userData } = this.props
    const { fPerson, sPerson, otherData } = makeIntroductionData
    const navBarProps = {
      leftPart: {
        image: iconImages.navBarCrossIconWhite,
        action: () => this.close()
      },
      centerPart: {
        text: 'Confirmation'
      },
    }
    const userAvatar = userData && userData.userModel && userData.userModel.avatar
    console.log(otherData.relationType)
    return (
      <View style={styles.wrapper}>

        <View style={styles.overlay}>
          <Image source={getBackgroundColorByType(otherData.relationType)} style={styles.overlayImage} />
        </View>
        <View style={styles.overlay}>
          <NavBar {...navBarProps} statusBarBackgroundColor={getColorByType(otherData.relationType)} transparent navigation={navigation} />
          <View style={styles.content}>
            <View style={styles.successIconImageWrapper}>
              <Image source={iconImages.successBigIconImage} style={styles.successIconImage} />
            </View>
            <View style={styles.infoWrapper}>
              <Text style={styles.info}>
                Your message has been sent!
              </Text>
            </View>
            <View style={styles.btnsWrapper}>
              <View style={styles.btnWrapper}>
                <RoundedBtn
                  innerStyle={{
                    height: '100%',
                    width: '100%',
                    borderRadius: width(2),
                    borderWidth: 1,
                    borderColor: 'white',
                  }}
                  textStyle={{
                    color: getColorByType(otherData.relationType),
                    marginTop: 0,
                    fontSize: width(2.8)
                  }}
                  flexy
                  onPress={this.close}
                  backgroundColor="white"
                  text="DONE" />
              </View>
              <View style={styles.btnWrapper}>
                <RoundedBtn
                  innerStyle={{
                    height: '100%',
                    width: '100%',
                    borderRadius: width(2),
                    borderWidth: 1,
                    borderColor: 'white',
                  }}
                  textStyle={{
                    color: 'white',
                    marginTop: 0,
                    fontSize: width(2.8)
                  }}
                  flexy
                  onPress={this.back}
                  backgroundColor="transparent"
                  text="GO BACK TO MESSAGE" />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

// <Text style={styles.title}>
// Your invite has been sent!
// </Text>

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'white'
  },
  treeImagesWrapper: {
    // marginTop: width(22),
    marginLeft: width(-48)
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: height(100),
    width: width(100),
  },
  overlayImage: {
    height: '110%',
    width: '100%',
    opacity: 1
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: 'white',
    fontSize: width(5),
    fontWeight: '500',
    textAlign: 'center'
  },
  successIconImageWrapper: {
    height: width(25),
    width: width(25),
    marginTop: isIphoneX()
      ? width(-10)
      : 0
    // marginTop: width(10)
  },
  successIconImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  infoWrapper: {
    // marginTop: width(10)
    marginTop: width(4)
  },
  info: {
    color: 'white',
    marginTop: width(3),
    fontSize: width(4.4),
    fontWeight: 'bold',
    textAlign: 'center'
  },
  btnsWrapper: {
    marginTop: width(6),
    width: width(60)
  },
  btnWrapper: {
    width: '100%',
    height: width(12),
    marginVertical: width(2)
  }
})
