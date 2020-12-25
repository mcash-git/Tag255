import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native'
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux'

import { width, height, iconImages, getBackgroundColorByType, getColorByType, isIphoneX } from 'constants/config'

import * as ApiUtils from 'actions/utils'

import NavBar from 'components/NavBar'
import ThreeImages from 'components/ThreeImages'

@connect(
  state => ({
    userData: state.userData
  }),
  dispatch => ({
  })
)
export default class NotifSend extends Component {
  close = () => {
    const { resetMakeIntroductionData, navigation } = this.props
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Main'})
      ],
     key:null
    })
    navigation.dispatch(resetAction)
  }

  componentDidMount() {
    setTimeout(() => {
      this.close()
    }, 2000)
  }

  render() {
    const { navigation, makeIntroductionData, userData } = this.props
    const detailsData = navigation.state && navigation.state.params && navigation.state.params.detailsData
    const navBarProps = {
      leftPart: {
        image: iconImages.navBarCrossIconWhite,
        action: () => this.close()
      },
      centerPart: {
        text: 'Confirmation'
      },
    }
    const mateUserModel = userData.userModel.user_uid == detailsData.userId1 || (detailsData.user1 && (userData.userModel.mobilePhone == detailsData.user1.phone || userData.userModel.user == detailsData.user1.phone))
      ? detailsData.user2
      : detailsData.user1
    return (
      <View style={styles.wrapper}>
        <View style={styles.treeImagesWrapper}>
          <ThreeImages images={[mateUserModel && mateUserModel.avatar, 'notset', 'notset']} withoudBorderRadius wrapperWidth={width(200)} />
        </View>
        <View style={styles.overlay}>
          <View style={[styles.overlayImage, { backgroundColor: getBackgroundColorByType(detailsData.relationType) }]} />
        </View>
        <View style={styles.overlay}>
          <NavBar {...navBarProps} statusBarBackgroundColor={getColorByType(detailsData.relationType)} transparent navigation={navigation} />
          <View style={styles.content}>
            <View style={styles.successIconImageWrapper}>
              <Image source={iconImages.successBigIconImage} style={styles.successIconImage} />
            </View>
            <View style={styles.infoWrapper}>
              <Text style={styles.info}>
                Your message has been sent!
              </Text>
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
    height: '100%',
    width: '100%',
    opacity: 0.9
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
    marginTop: isIphoneX()
      ? width(-30)
      : 0,
    height: width(50),
    width: width(50),
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
    fontWeight: '500',
    textAlign: 'center'
  }
})