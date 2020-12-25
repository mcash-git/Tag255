import React, { Component } from 'react';
import { View, StyleSheet, Animated } from 'react-native'

import { width, height, iconImages } from 'constants/config'

import TextHint from './TextHint'
import PhotoHint from './PhotoHint'

export default class HintModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moveAnim:
      props.show
          ? new Animated.Value(1)
          : new Animated.Value(0),
      render: props.show
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.show != nextProps.show) {
      if (nextProps.show) {
        this.setState({ render: nextProps.show }, () => {
          Animated.timing(
            this.state.moveAnim, 
            {
              toValue: Number(nextProps.show),
              duration: 1000,
            }
          ).start()
        })
      } else {
        Animated.timing(
          this.state.moveAnim, 
          {
            toValue: Number(nextProps.show),
            duration: 1000,
          }
        ).start()
        setTimeout(() => this.setState({ render: nextProps.show }), 1000)
      }
    }
  }
  
  
  renderContentOnType = (type) => {
    const { hintData } = this.props
    switch(type) {
      case 'text':
        return (
          <TextHint {...hintData} />
        )
      case 'photo':
        return (
          <PhotoHint {...hintData} />
        )
    }
  }

  render() {
    const { moveAnim, render } = this.state
    const { type } = this.props
    if (!render) return null

    const wrapperTop = moveAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-200, 0],
    });

    return (
      <Animated.View style={[styles.wrapper, {top: wrapperTop}]}>
        <View style={[styles.inner, type == 'text' && styles.textBorder]}>
          {this.renderContentOnType(type)}
        </View>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    height: width(26),
    width: width(100),
    paddingVertical: width(2),
    paddingHorizontal: width(2),
    position: 'absolute',
    top: 0,
    left: 0
  },
  inner: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: width(1),
    paddingVertical: width(4),
    paddingHorizontal: width(6),
    elevation: 10,
    flexShrink: 1
  },
  textBorder: {
    borderColor: '#FACFDA',
    borderWidth: 1,
    borderStyle: 'solid'
  }
})