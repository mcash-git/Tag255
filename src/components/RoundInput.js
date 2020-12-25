import React, { Component } from 'react';
import { View, TextInput, StyleSheet } from 'react-native'

import { width, height, iconImages } from 'constants/config'

export default class RoundInput extends Component {
  render() {
    const { borderWidth, wrapperStyle, inputStyle } = this.props
    return (
      <View style={[styles.wrapper, borderWidth && {borderWidth: borderWidth}, wrapperStyle && wrapperStyle]}>
        <TextInput
          {...this.props}
          underlineColorAndroid="transparent"
          style={[styles.input, inputStyle && inputStyle]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: width(10),
    borderColor: '#EDEDED',
    borderWidth: 1,
    borderStyle: 'solid',
    paddingHorizontal: width(5),
    paddingVertical: width(1),
    width: '100%',
    height: '100%'
  },
  input: {
    fontSize: width(3.8),
    color: 'black',
    width: '100%',
    height: '100%',
  }
})