import React, {Component} from "react";
import { Image } from 'react-native';

import { width, height, iconImages } from 'constants/config';

import SignUpWithPhone from 'layouts/SignUpWithPhone';

export default class SignUpWithPhoneScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle:( 
        <Image 
          source={iconImages.logo}
          style={{
            width: width(45),
            marginRight: width(6),
            backgroundColor: 'transparent',
            alignSelf: 'center'
          }}
          resizeMode='contain'
      />
    ),   
  headerStyle: { backgroundColor: 'rgba(80, 210, 194, 0.95)', elevation: 0, shadowOffset: { width: 0, height: 0 } },
  headerBackTitleStyle: { backgroundColor: 'white'},
  headerTintColor: 'white'  
  });

  render() {
    const {navigate, goBack} = this.props.navigation;

    return (
        <SignUpWithPhone
              navigation={this.props.navigation}
            // onSignUpPress={() => navigate('SignUp')}
        />
    );    
  }
}
