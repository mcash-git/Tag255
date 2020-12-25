import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'

import { width, height, iconImages } from 'constants/config'

export default class DefaultMessageItem extends Component {
  render() {
    const { item, onPress, idx } = this.props
    return (
      <View style={styles.wrapper}>
        <TouchableOpacity onPress={() => onPress(item, idx)}>
          <View style={styles.inner}>

            <View style={styles.messageTextWrapper}>
              <Text style={styles.messageText}>
                {item}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: width(1.2)
  },
  inner: {
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
    overflow: 'hidden',
    flexDirection: 'row',
    paddingVertical: width(1.4),

  },
  iconImageWrapper: {
    height: width(4),
    width: width(4),
    marginTop: width(2),
    marginRight: width(3)
  },
  iconImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  messageTextWrapper: {
    flex: 1,
    flexShrink: 1,
  },
  messageText: {
    marginBottom: width(3),
    fontSize: width(3),
    fontWeight: 'bold',
    color: '#75757A',
    lineHeight: width(5)
  }
})
