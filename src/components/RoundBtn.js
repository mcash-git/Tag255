import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native'

import { width, height, iconImages } from 'constants/config'

export default class RoundBtn extends Component {
  render() {
    const { icon, avatar, widthShadow, backgroundColor, text, textStyle, wrapperStyle, innerStyle, onPress } = this.props
    return (
      <View style={[styles.wrapper, wrapperStyle && wrapperStyle]}>
        <View style={widthShadow && styles.shadow}>
        <TouchableOpacity onPress={onPress} style={[styles.inner, innerStyle && innerStyle, backgroundColor && {backgroundColor: backgroundColor}, widthShadow && Platform.OS != 'ios' && {margin: 4, elevation: 5}]}>
          {
            icon && !avatar
              ? <View style={styles.iconImageWrapper}>
                  <Image style={styles.iconImage} source={icon} />
                </View>
              : null
          }
          {
            avatar
              ? <Image style={styles.avatarImage} source={{uri: avatar }}/>
              : null
          }
          </TouchableOpacity>
        </View>
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
    height: width(32),
    width: width(32),
  },
  inner: {
    height: width(30),
    width: width(30),
    borderRadius: width(30),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 0
  },
  shadow: {
    elevation: 80,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 7,
    shadowOpacity: 0.1,
    padding: width(2)
  },
  iconImageWrapper: {
    height: width(10),
    width: width(10)
  },
  iconImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  avatarImage: {
    height: width(38),
    width: width(38),
    resizeMode: 'cover'
  },
  text: {
    marginTop: width(2),
    fontSize: width(3.2),
    color: '#8D8D8D',
    backgroundColor: 'transparent',
    textAlign: 'center'
  }
})
