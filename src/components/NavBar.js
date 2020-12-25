import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, StyleSheet, Text, TouchableOpacity, StatusBar, Image, Platform, ImageBackground, SafeAreaView } from 'react-native'

import { height, width, iconImages, isIphoneX } from 'constants/config'


export default class NavBar extends Component {

  renderPart = (part) => {
    if (part) {
      if (part.comp) {
        return part.comp
      } else if (part.icon) {
        return (
          <TouchableOpacity style={styles.btn} onPress={part.action}>
            {part.icon}
          </TouchableOpacity>
        )
      } else if (part.image) {
        return (
          <TouchableOpacity style={styles.btn} onPress={part.action}>
            <View style={[styles.iconImageWrapper, part.imageWrapperCustomStyle]}>
              <Image
                source={part.image}
                style={[styles.iconImage, part.imageCustomStyles]} />
            </View>
            <View style={styles.buttonWrapper}>
            <Text style={styles.buttonText}>{part.buttonText}</Text>
          </View>
          </TouchableOpacity>
        )
      } else if (part.text) {
        return (
          <TouchableOpacity style={styles.btn} onPress={part.action}>
            <Text style={styles.text}>
              {part.text}
            </Text>
          </TouchableOpacity>
        )
      }
    }
    return null
  }

  render() {

       //StatusBar.setHidden(true);

    const { navigation } = this.props
    const { leftPart, centerPart, rightPart, transparent, navBarBackgroundImage, statusBarBackgroundColor} = this.props
    const WrapperComp = transparent
      ? View
      : ImageBackground
    return (
      <WrapperComp source={
        navBarBackgroundImage
          ? navBarBackgroundImage
          : iconImages.navBarBackgroundImageBlue
        } style={[styles.container, transparent && styles.transparent]}>
        <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={statusBarBackgroundColor || "#50D2C2"} />
        <View style={[styles.leftPart, leftPart.buttonText ? {flex: 12} : {flex: 2}]}>
          {this.renderPart(leftPart)}
        </View>
        <View style={styles.centerPart}>
          {
            centerPart
              ? centerPart.text
                ? centerPart.subText
                    ? <View style={styles.centerTextWrapper}>
                        <Text style={[styles.centerPartText, centerPart.fontSize && { fontSize: centerPart.fontSize }, centerPart.text && centerPart.text.length > 18 && { fontSize: width(3.6) }]}>
                          {centerPart.text}
                        </Text>
                        <Text style={[styles.centerPartSubText, centerPart.subTextFontSize && { subTextFontSize: centerPart.fontSize }, centerPart.subText && centerPart.subText.length > 25 && { fontSize: width(2.6) }]}>
                          {centerPart.subText}
                        </Text>
                      </View>
                    : <Text style={[styles.centerPartText, centerPart.fontSize && { fontSize: centerPart.fontSize }, centerPart.text && centerPart.text.length > 18 && { fontSize: width(3.6) }]}>
                        {centerPart.text}
                      </Text>
                : this.renderPart(centerPart)
              : null
          }
        </View>
        <View style={styles.rightPart}>
          {this.renderPart(rightPart)}
        </View>
      </SafeAreaView>
      </WrapperComp>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: width(4),

  },
  safeArea: {
    height: Platform.OS == 'ios'
      ? isIphoneX()
        ? width(25)
        : width(24)
      : width(15),
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: width(4),
    alignItems: 'center',
    marginTop: width(-3)

  },
  leftPart: {
    flex: 2,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerPart: {
    flex: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPartText: {
    fontSize: width(4.8),
    color: 'white',
    textAlign: 'center'
  },
  centerPartSubText: {
    fontSize: width(3.2),
    color: 'white',
    textAlign: 'center',
    marginTop: width(0.4)
  },
  rightPart: {
    flex: 2,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  iconImageWrapper: {
    height: width(5),
    width: width(5),
  },
  iconImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  text: {
    fontSize: width(4.2),
    color: 'white'
  },
  buttonWrapper:{
   flex: 1,
   height: '100%',
   width: '100%',
 },
 buttonText:{
   marginTop: width(.8),
   marginLeft: width(1),
   fontSize: width(2.5),
   color: 'white'
 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: width(1)
  },
  transparent: {
    backgroundColor: 'transparent',
  }
})
