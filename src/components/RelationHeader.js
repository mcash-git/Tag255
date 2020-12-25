import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native'

import { width, height, iconImages } from 'constants/config'

export default class RelationIntem extends Component {
  render() {
    const { item } = this.props
    const { title } = item
    return (
      <View style={styles.titleWrapper}>
        <View style={styles.titleInner}>
          <Text style={styles.titleText}>
            {title}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleWrapper: {
    borderLeftWidth: 4,
    borderLeftColor: '#E1E1E2',
    backgroundColor: '#F8F8F8',
    width: width(100)
  },
  titleInner: {
    marginVertical: width(5),
    marginLeft: width(6)
  },
  titleText: {
    fontSize: width(3),
    color: '#A4A4A7'
  },
})