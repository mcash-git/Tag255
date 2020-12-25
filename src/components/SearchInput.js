import React, { Component } from 'react';
import { View, TextInput, Image, StyleSheet } from 'react-native'

import { width, height, iconImages } from 'constants/config'

export default class SearchInput extends Component {
  render() {
    const { wrapperStyle, inputStyle } = this.props
    return (
      <View style={[styles.wrapper, wrapperStyle && wrapperStyle]}>
        <View style={styles.inner}>
          <View style={styles.searchIconImageWrapper}>
            <Image source={iconImages.searchIconGrey} style={styles.searchIconImage} />
          </View>
          <TextInput
            {...this.props}
            style={[styles.input, inputStyle && inputStyle]}

            underlineColorAndroid="transparent" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    height: width(9),
    width: '100%'
  },
  inner: {
    backgroundColor: '#F1F1F2',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: width(4),
    paddingTop: width(0.4),
    borderRadius: width(1)
  },
  searchIconImageWrapper: {
    height: width(4),
    width: width(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIconImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  input: {
    marginLeft: width(1),
    width: '100%',
    height: '100%',
    fontSize: width(3.1),
    backgroundColor: 'transparent',
    color: '#4D5150',
    textAlignVertical: 'center',
  }
})
