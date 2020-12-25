import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native'

import { width, height, iconImages } from 'constants/config'

export default class TextHint extends Component {
  render() {
    const { avatar, text, title } = this.props
    return (
      <View style={styles.wrapper}>
        <View style={styles.avatarImageWrapper}>
          <Image style={styles.avatarImage} source={avatar} />
        </View>
        <View style={styles.textsWrapper}>
          <Text style={styles.title}>
            {title}
          </Text>
          <Text style={styles.text}>
            {text}
          </Text>
        </View>  
        <View style={styles.arrowIconImageWrapper}>
          <Image style={styles.arrowIconImage} source={iconImages.rightArrowIconGrey} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  avatarImageWrapper: {
    height: width(10),
    width: width(10)
  },
  avatarImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  title: {
    color: '#8D8D8D',
    fontSize: width(3.5)
  },
  text: {
    color: '#8D8D8D',
    fontSize: width(3.2)
  },
  arrowIconImageWrapper: {
    height: width(5),
    width: width(5)
  },
  arrowIconImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  }
})