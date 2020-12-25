import React, {Component} from "react";
import { 
  Image,
  Platform, 
  TouchableNativeFeedback, 
  TouchableOpacity,
  View
} from 'react-native';
import { Icon } from 'react-native-elements';

import { width, height, iconImages } from 'constants/config'

import Home from 'layouts/Home';

const Button = (props) => { 
  return Platform.OS === 'android' 
    ? 
    <TouchableNativeFeedback {...props} />
    : 
    <TouchableOpacity {...props}  />
};

export default class HomeScreen extends Component {
 

  render() {
    const {navigate, goBack} = this.props.navigation;
    
    return (      
        <Home
            navigation={this.props.navigation}
            // onLoginPress={() => navigate('SignUpWithPhoneScreen')}
        />
    );    
  }
}

// static navigationOptions = ({navigation}) => ({
//   headerTitle:( 
//       <Image 
//         source={iconImages.logo}
//         style={{
//           width: width(45),
//           marginRight: width(6),
//           backgroundColor: 'transparent',
//           alignSelf: 'center'
//         }}
//         resizeMode='contain'
//     />
//   ),
//   headerLeft: ( <Button
//                   onPress={() => navigation.navigate('DrawerOpen')}
//                 >
//                 <View
//                   style={{
//                     height: height(5),
//                     width: width(15),
//                     justifyContent: 'center',
//                     alignItems: 'flex-start',
//                     paddingLeft: width(3)                      
//                   }}
//                 >
//                   <Icon 
//                     name='menu'
//                     size={width(6)}
//                     color='white'
//                     type='feather'                      
//                   />
//                 </View>
//               </Button>
//               ),
// headerStyle: { backgroundColor: 'rgba(80, 210, 194, 0.95)', elevation: 0, shadowOffset: { width: 0, height: 0 } },
// headerBackTitleStyle: { backgroundColor: 'white', marginLeft: 0, paddingLeft: 0 },
// headerTintColor: 'white'  
// });


                  {/*
                  icon={{ }}
                  borderRadius={30}                
                  buttonStyle={{
                      backgroundColor: 'transparent',
                      width: width(20)
                }}
            />*/}