import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Platform  } from 'react-native'

import { width, height, isIphoneX } from 'constants/config'

import DefaultMessageItem from './DefaultMessageItem'

export default class DefaultMessagesList extends Component {

  _keyExtractor = (item, index) => 'defaultMessageItem_' + index;

  renderItem = ({ item, index }) => {
    const { onPressItem } = this.props
    return (
      <DefaultMessageItem
        item={item}
        idx={index}
        onPress={onPressItem}/>
    )
  }

  render() {
    const { data, extraData, onPressItem } = this.props
    return (
      <View style={styles.wrapper}>
        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          extraData={extraData}
          keyExtractor={this._keyExtractor}
          contentContainerStyle={styles.contentContainerStyle}
          renderItem={this.renderItem}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    // flex: 1
  },
  contentContainerStyle: {
    paddingBottom: Platform.OS == 'ios'
      ? isIphoneX()
          ? width(0)
          : width(50)
      : width(50)
  }
})
