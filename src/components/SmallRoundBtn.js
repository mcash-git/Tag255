import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'

import { width, height, iconImages } from 'constants/config'

export default class SmallRoundBtn extends Component {
  render() {
    const { icon, widthShadow, backgroundColor, text, textStyle, wrapperStyle, innerStyle, onPress, customWidth, avatar, customIconStyle } = this.props
    const wrapperDem = Number((customWidth + (width(2))).toFixed())
    const iconDem = Number((customWidth * 0.5).toFixed())
    return (
      <View style={[styles.wrapper, wrapperStyle && wrapperStyle, customWidth && {height: wrapperDem, width: wrapperDem}]}>
        <TouchableOpacity onPress={onPress} style={[styles.inner, innerStyle && innerStyle, widthShadow && styles.shadow, backgroundColor && {backgroundColor: backgroundColor}, customWidth && {height: customWidth, width: customWidth, borderRadius: customWidth}]}>
          {
            icon && !avatar
              ? <View style={[styles.iconImageWrapper, customWidth && {height: iconDem, width: iconDem}, customIconStyle && customIconStyle]}>
                  <Image style={styles.iconImage} source={icon} />
                </View>  
              : null
          }
          {
            avatar
              ? <View style={styles.avatarWrapper}><Image resizeMethod="scale" style={styles.avatarImage} source={avatar && {uri: avatar}} /></View>
              : null
          }
        </TouchableOpacity> 
        {
          text
            ? <Text style={[styles.text, textStyle && textStyle]}>{text}</Text>
            : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: width(20),
    width: width(20),
  },
  inner: {
    height: width(18),
    width: width(18),
    borderRadius: width(18),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 0
  },
  shadow: {
    elevation: 10
  },
  iconImageWrapper: {
    height: width(5),
    width: width(5)
  },
  iconImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  avatarWrapper: {
    height: width(20),
    width: width(20),
  },
  avatarImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  text: {
    marginTop: width(4),
    fontSize: width(3.6),
    color: '#8D8D8D',
    backgroundColor: 'transparent'
  }
})