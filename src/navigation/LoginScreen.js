import React, {Component} from "react";
import { ScrollView, Image, StatusBar } from 'react-native';

import { width, height, iconImages } from 'constants/config'

import Login from 'layouts/Login';

export default class LoginScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null,
    headerStyle: { marginTop: 30 },
  });

  render() {
    const {navigate, goBack} = this.props.navigation;

    return (
      <ScrollView style={{ flex: 1}}>
        <Login navigation={this.props.navigation} />
      </ScrollView>
    );
  }
}
