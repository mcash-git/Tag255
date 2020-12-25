import React, { Component } from 'react';
import { View, StyleSheet, Text, ImageBackground, TouchableOpacity } from 'react-native'

import { width, height, iconImages } from 'constants/config'

import Sep from './Sep'

export default class StdBtn extends Component {
  render() {
    const { borderRadius, wrapperStyle, innerStyle, type, source, onPress, textStyle, text, separators, disabled } = this.props
    const BtnComp = type == 'btImage'
      ? ImageBackground
      : View
    return (
      <View style={[styles.wrapper, wrapperStyle && wrapperStyle, borderRadius && borderRadius, disabled && styles.disabled]}>
        <TouchableOpacity disabled={disabled} onPress={onPress}>
          {
            separators 
              ? <Sep />
              : null
          }  
          <View style={[styles.inner, innerStyle && innerStyle ]}>
            <BtnComp source={source || iconImages.sendMessageButtonBackgroundBlue} style={[styles.innerComp, type == 'btImage' ? styles.btnImage : styles.btnInner]}>
              <Text style={[styles.btnText, textStyle && textStyle]}>
                {text}
              </Text>  
            </BtnComp>  
          </View>
          {
            separators == 2
              ? <Sep />
              : null
          }  
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    height: '100%',
    width: '100%',
  },
  disabled: {
    opacity: 0.5
  },
  inner: {
    height: '100%',
    width: '100%',
  },
  innerComp: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnImage: {
          
  },
  btnInner: {
    alignItems: 'center',
  },
  btnText: {
    fontSize: width(3.6),
    color: 'white'
  }
})