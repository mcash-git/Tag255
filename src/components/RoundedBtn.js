import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';

import { width, height, iconImages } from 'constants/config'

export default class RoundedBtn extends Component {
  render() {
    const { icon, backgroundColor, text, textStyle, wrapperStyle, innerStyle, onPress, disabled, gradient, elevation, flexy } = this.props
    const innerComp = (
      <View style={styles.contentWrapper}>
        {
          icon
            ? <View style={styles.iconImageWrapper}>
                <Image style={styles.iconImage} source={icon} />
              </View>
            : null
        }
        {
          text
            ? <Text style={[styles.text, textStyle && textStyle]}>{text}</Text>
            : null
        }
      </View>
    )
    return (
      <View style={[styles.wrapper, wrapperStyle && wrapperStyle, disabled && styles.disabled, elevation && styles.elevation]}>
        <TouchableOpacity style={flexy && {width: '100%', height: '100%'}} onPress={onPress}>
          <View style={[styles.inner, innerStyle && innerStyle, backgroundColor && {backgroundColor: backgroundColor}]}>
            {
              gradient
                ? <LinearGradient
                    start={gradient.start} end={gradient.end}
                    colors={gradient.colors} style={styles.linearGradient}>
                    {innerComp}
                  </LinearGradient>
                : innerComp
            }
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: width(1),
  },
  elevation: {
    elevation: 5
  },
  inner: {
    height: width(22),
    width: width(22),
    borderRadius: width(20),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  contentWrapper: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImageWrapper: {
    height: width(7),
    width: width(7)
  },
  iconImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  avatarImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover'
  },
  text: {
    marginTop: width(1.7),
    fontSize: width(2.5),
    fontWeight: 'bold',
    color: 'white'
  },
  disabled: {
    opacity: 0.5
  },
  linearGradient: {
    width: '100%',
    height: '100%'
  }
})
