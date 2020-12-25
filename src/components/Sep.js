import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native'

import { width, height, iconImages, alphabet } from 'constants/config'

export default class Sep extends Component {
  renderSeparatorOnType = (type) => {
    const { color } = this.props
    switch(type) {
      case 'full':
        return (
          <View style={[styles.fullSep, thin && styles.thin, color && {backgroundColor: color} ]} />
        )
      case 'andOr':
        return (
          <View style={styles.row}>
            <View style={styles.sepHalf} />
            <View style={styles.textCenter}>
              <Text style={styles.text}>
                AND/OR
              </Text>
            </View>
            <View style={styles.sepHalf} />
          </View>
        )
      default:
        return (
          <View style={[styles.fullSep, color && {backgroundColor: color}]} />
        )
    }
  }

  render() {
    const { type } = this.props
    return (
      <View style={styles.wrapper}>
        {this.renderSeparatorOnType(type)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fullSep: {
    width: '100%',
    backgroundColor: '#E0E0E0',
    height: .8
  },
  sepHalf: {
    flex: 5,
    backgroundColor: '#E0E0E0',
    height: 1
  },
  textCenter: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#BDBDBD',
    fontSize: width(3.4),
    textAlign: 'center'
  },
  thin: {
    height: 1
  }
})
