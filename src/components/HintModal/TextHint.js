import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native'

import { width, height, iconImages } from 'constants/config'

export default class TextHint extends Component {
  render() {
    const { title, text } = this.props
    return (
      <View style={styles.wrapper}>
        <Text style={styles.title}>
          {title}
        </Text>
        <Text style={styles.text}>
          {text}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    color: '#FA7296',
    fontSize: width(3.4),
    fontWeight: '500'
  },
  text: {
    marginTop: width(1),
    color: '#8D8D8D',
    fontSize: width(3),
    lineHeight: width(6)
  }
})