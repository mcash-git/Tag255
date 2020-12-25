import React, { Component } from 'react'
import { View, TextInput, StyleSheet, Platform } from 'react-native'

import { width, height } from 'constants/config'

export default class BigTextInput extends Component {
  renderContent = (type) => {
    const { refName, inputStyle, onContentSizeChange } = this.props
    switch (type) {
      case 'resizable':
        return (
          <TextInput
            {...this.props}
            multiline
            ref={
              refName && typeof refName == 'function'
                ? comp => refName(comp)
                : refName
            }
            onContentSizeChange={(event) => {
              const height = Platform.OS === 'ios'
                ? event.nativeEvent.contentSize.height
                : event.nativeEvent.contentSize.height - width(4)
              const lines = Math.round(height / width(4))
              onContentSizeChange(lines)
            }}
            style={[styles.input, inputStyle && inputStyle]}
            underlineColorAndroid='transparent'/>
        )
      default:
        return (
          <TextInput
            {...this.props}
            underlineColorAndroid="transparent"
            multiline={true}
            style={styles.input} />
        )
    }
  }
  render() {
    const { type, wrapperStyle } = this.props
    return (
      <View style={[styles.wrapper, wrapperStyle && wrapperStyle]}>
        {this.renderContent(type)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    borderStyle: 'solid',
    flex: 1
  },
  input: {
    height: '100%',
    width: '100%',
    borderColor: '#EBEBEB',
    borderWidth: 0,
    borderStyle: 'solid',
    paddingTop: width(2),
    paddingBottom: width(2),
    textAlignVertical: 'auto',
    fontSize: width(3.5)
  },
})
