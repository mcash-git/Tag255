import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

import { width, height, iconImages } from 'constants/config'

export default class MenuScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Menu',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={iconImages.people}
        style={[styles.icon, {tintColor}]}
      />
    ),
  };

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.navigate('Notifications')}
        title="Go to notifications"
      />
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});
