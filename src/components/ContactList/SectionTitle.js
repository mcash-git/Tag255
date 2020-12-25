import React, { Component, PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native'

import { width, height, iconImages } from 'constants/config'

export default class SectionTitle extends PureComponent {
  render() {
    const { title} = this.props
    return (
      <View style={styles.wrapper}>
        <Text style={styles.text}>
          {title}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: width(100),
    height: width(9.8),
    backgroundColor: '#F3F3F3',
    justifyContent: 'center'
  },
  text: {
    marginLeft:width(5)
  }
})
