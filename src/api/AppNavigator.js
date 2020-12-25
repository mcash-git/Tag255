import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Easing, Keyboard, Linking, Platform, PermissionsAndroid, SafeAreaView, Alert } from 'react-native'
import { connect } from 'react-redux'
import { addNavigationHelpers, StackNavigator, DrawerNavigator, TabNavigator } from 'react-navigation'
import Contacts from 'react-native-contacts'
import OneSignal from 'react-native-onesignal';
import Permissions from 'react-native-permissions'

import CustomDrawerContentComponent from '../components/CustomDrawerContentComponent'

import { width, height, googleApiKey, onesignalAppId } from 'constants/config'
import { checkNextProps, fullCleanPhone } from 'utils'

import store, { addListener } from './ReduxStore'

import * as ApiUtils from 'actions/utils'
import * as ApiCountryCodes from 'actions/countryCodes'

// Imports for app routes
import Login from 'layouts/Login'
import SignUpWithPhone from 'layouts/SignUpWithPhone'
import Home from 'layouts/Home'

import SelectContact from 'layouts/Invite/SelectContact'
import AddContactInfo from 'layouts/Invite/AddContactInfo'
import AddContactInfo1 from 'layouts/Invite/AddContactInfo1'

import Intro from 'layouts/MakeIntroductions/Intro'
import AddCustomContact from 'layouts/MakeIntroductions/AddCustomContact'
import SelectMessage from 'layouts/MakeIntroductions/SelectMessage'
import EditMessage from 'layouts/MakeIntroductions/EditMessage'
import MakeIntroSent from 'layouts/MakeIntroductions/Sent'
import MakeIntroAddContactInfo from 'layouts/MakeIntroductions/AddContactInfo'
import MakeIntroSelectContact from 'layouts/MakeIntroductions/SelectContact'
import SelectMessageList from 'layouts/MakeIntroductions/SelectMessageList'
import SelectAndEditMsg from 'layouts/MakeIntroductions/SelectAndEditMsg'

import SendMessage from 'layouts/Notifications/SendMessage'
import Notifications from 'layouts/Notifications/Notifications'
import NotificationDetatils from 'layouts/Notifications/NotificationDetatils'
import NotifSelectMessageList from 'layouts/Notifications/NotifSelectMessageList'
import CustomMessage from 'layouts/Notifications/CustomMessage'
import SendingMessage from 'layouts/Notifications/SendingMessage'
import NotiffSelectAndEditMsg from 'layouts/Notifications/NotiffSelectAndEditMsg'
import NotifSend from 'layouts/Notifications/NotifSend'

import Connection from 'layouts/Connections/Connection'
import ConnectionDetatil from 'layouts/Connections/ConnectionDetatil'
import ConnIntroductionDetatils from 'layouts/Connections/ConnIntroductionDetatils'
import ConnSelectMessage from 'layouts/Connections/ConnSelectMessage'
import ConnSelectMessageList from 'layouts/Connections/ConnSelectMessageList'
import ConnSelectAndEditMsg from 'layouts/Connections/ConnSelectAndEditMsg'
import ConnSent from 'layouts/Connections/ConnSent'

import MyIntroductions from 'layouts/MyIntroductions/MyIntroductions'
import IntroductionDetatils from 'layouts/MyIntroductions/IntroductionDetatils'

import Settings from 'layouts/Settings/Settings'

import SignUpSocialPhoneEnter from 'layouts/SignUpSocial/SignUpSocialPhoneEnter'
import SignUpConfirmCode from 'layouts/SignUpWithPhone/SignUpConfirmCode'

import ResetPassword from 'layouts/ResetPassword/ResetPassword'
import ConfirmCode from 'layouts/ResetPassword/ConfirmCode'
import NewPassword from 'layouts/ResetPassword/NewPassword'
import Confirmation from 'layouts/ResetPassword/Confirmation'

import Loading from 'layouts/Loading'

const DrawerNavigatorConfig = {
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle',
  drawerWidth: width(80),
  drawerPosition: 'left',
  drawerBackgroundColor: 'transparent',
  initialRouteName: 'EditMessage',
  contentComponent: props => <CustomDrawerContentComponent {...props} />,
}

import LoginScreen from '../navigation/LoginScreen';
import SignUpSocial from '../navigation/SignUpSocial';
import SignUpWithPhoneScreen from '../navigation/SignUpWithPhoneScreen';
import HomeScreen from '../navigation/HomeScreen';
import MenuScreen from '../navigation/MenuScreen';
import DrawerComponent from '../navigation/DrawerComponent';
import { Page1, Page2, Page3 } from '../layouts/Walkthrough';

const tabBarConfig = {
  animationEnabled: false,
  lazy: false,
  navigationOptions: {
      tabBarVisible: false,
  },
  tabBarOptions: {
  }
};

const MyIntroductionsStack = StackNavigator({
  MyIntroductions: {
    screen: MyIntroductions
  },
  IntroductionDetatils: {
    screen: IntroductionDetatils
  },
}, {
  headerMode: 'nine'
})

const NotificationsStack = StackNavigator({
  Notifications: {
    screen: Notifications
  },
  NotificationDetatils: {
    screen: NotificationDetatils
  },
  SendMessage: {
    screen: SendMessage
  },
  NotifSelectMessageList: {
    screen: NotifSelectMessageList
  },
  CustomMessage: {
    screen: CustomMessage
  },
  SendingMessage: {
    screen: SendingMessage
  },
  NotiffSelectAndEditMsg: {
    screen: NotiffSelectAndEditMsg
  },
  NotifSend: {
    screen: NotifSend
  }
}, {
  headerMode: 'nine'
})

const ConnectionsStack = StackNavigator({
  Connection: {
    screen: Connection
  },
  ConnectionDetatil: {
    screen: ConnectionDetatil
  },
  ConnIntroductionDetatils: {
    screen: ConnIntroductionDetatils
  },
  ConnSelectMessage: {
    screen: ConnSelectMessage
  },
  ConnSelectMessageList: {
    screen: ConnSelectMessageList
  },
  ConnSelectAndEditMsg: {
    screen: ConnSelectAndEditMsg
  },
  ConnSent: {
    screen: ConnSent
  },
}, {
  headerMode: 'nine'
})

const MakeIntroductionsStack = StackNavigator({
  Intro: {
    screen: Intro
  },
  MakeIntroSelectContact: {
    screen: MakeIntroSelectContact
  },
  MakeIntroAddContactInfo: {
    screen: MakeIntroAddContactInfo
  },
  AddCustomContact: {
    screen: AddCustomContact
  },
  SelectMessage: {
    screen: SelectMessage
  },
  SelectMessageList: {
    screen: SelectMessageList
  },
  EditMessage: {
    screen: EditMessage
  },
  MakeIntroSent: {
    screen: MakeIntroSent
  },
  SelectAndEditMsg: {
    screen: SelectAndEditMsg
  },
}, {
  headerMode: 'nine',
  initialRouteName: 'Intro',
})

const InviteStack = StackNavigator({
  SelectContact: {
    screen: SelectContact
  },
  AddContactInfo: {
    screen: AddContactInfo
  },
  AddContactInfo1: {
    screen: AddContactInfo1
  },
}, {
  headerMode: 'nine'
  })

const SignUpStack = StackNavigator({
  SignUpSocial: { screen: SignUpSocial },
  SignUpSocialPhoneEnter: {
    screen: SignUpSocialPhoneEnter
  },
  SignUpWithPhoneScreen: { screen: SignUpWithPhoneScreen },
  SignUpConfirmCode: { screen: SignUpConfirmCode }
}, {
  headerMode: 'nine'
});

const LoginStack = StackNavigator({
  LoginScreen: { screen: LoginScreen },
  SignUpStack: { screen: SignUpStack }
}, {
  headerMode: 'nine'
});

const ResetPasswordStack = StackNavigator({
  ResetPassword: {
    screen: ResetPassword
  },
  ConfirmCode: {
    screen: ConfirmCode
  },
  NewPassword: {
    screen: NewPassword
  },
  Confirmation: {
    screen: Confirmation
  },
}, {
  headerMode: 'nine'
})

const homeStackWithOptions = StackNavigator({
      HomeScreen: { screen: HomeScreen }
  }, {
    headerMode: 'none',
  })

const MainStack = DrawerNavigator({
  HomeStack: {screen: homeStackWithOptions},
  Menu: { screen: MenuScreen },
  MakeIntroductions: {
    screen: MakeIntroductionsStack
  },
  Invite: {
    screen: InviteStack
  },
  MyIntroductions: {
    screen: MyIntroductionsStack
  },
  Connections: {
    screen: ConnectionsStack
  },
  Notifications: {
    screen: NotificationsStack
  },
  Settings: {
    screen: Settings
  },
},
{
  drawerWidth: width(80),
  contentComponent: DrawerComponent,
  contentOptions: {
      activeTintColor: '#52C986',
      itemsContainerStyle: {  marginVertical: 0 }
  }
}, { lazy: false });

const WalkthroughTab = TabNavigator({
  Page1: {
      screen: Page1
  },
  Page2: {
      screen: Page2
  },
  Page3: {
      screen: Page3
  }
},tabBarConfig);

export const AppNavigator = StackNavigator({
  Loading: {
    screen: Loading
  },
  LoginStack: {
      screen: LoginStack
  },
  ResetPasswordStack: {
    screen: ResetPasswordStack
  },
  Main: {
      screen: MainStack
  },
  Walkthrough: {
      screen: WalkthroughTab
  },
}, {
  headerMode: 'none',
  initialRouteName: 'Loading',
  lazy: false
});

export const AppNavigator1 = StackNavigator({
  Login: {
    screen: Login
  },
   SignUpSocial: {
    screen: SignUpSocial
  },
   SignUpWithPhone: {
    screen: SignUpWithPhone
  },
  Home: {
    screen: Home
  },
  SelectContact: {
    screen: SelectContact
  },
  AddContactInfo: {
    screen: AddContactInfo
  },
  Intro: {
    screen: Intro
  },
  AddCustomContact: {
    screen: AddCustomContact
  },
  SelectMessage: {
    screen: SelectMessage
  },
  EditMessage: {
    screen: EditMessage
  },
  MakeIntroSent: {
    screen: MakeIntroSent
  },
  NotifSend: {
    screen: NotifSend
  },
  SendingMessage: {
    screen: SendingMessage
  },
  Connection: {
    screen: Connection
  },
  ConnectionDetatil: {
    screen: ConnectionDetatil
  },
}, {
  initialRouteName: 'ConnectionDetatil',
  headerMode: 'none'
})

@connect(state => ({
    routes: state.routes,
    countryCodes: state.countryCodes,
  }),
  dispatch => ({
    fetchCountryCodes: (data) => {
      dispatch(ApiCountryCodes.fetchCountryCodes())
    },
    dispatch: dispatch,
    setContacts: (contacts) => {
      dispatch(ApiUtils.setContacts(contacts))
    },
    setPushIdsLocal: (data) => {
      dispatch(ApiUtils.setPushIdsLocal(data))
    },
  })
)
export default class AppWithNavigationState extends Component {
  // componentDidMount() {
  //   if (Platform.OS === 'android') {
  //     Linking.getInitialURL().then(url => {
  //       console.log(url)
  //     });
  //   } else {
  //     Linking.addEventListener('url', this.handleOpenURL);
  //   }
  //   this.requestLocationPermission()
  // }

  // async requestLocationPermission() {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       {
  //         'title': 'Location permission',
  //         'message': 'Get your location to know where you want to rent o publish you toy.'
  //       }
  //     )
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       this.watchId = navigator.geolocation.watchPosition((position) => {
  //         const { setUserData } = this.props
  //         const location = {
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         };
  //         Geocoder.geocodePosition(location)
  //         .then((result) => {
  //           setUserData({
  //             location: {
  //               ...location,
  //               geocode: result && result[0]
  //             }
  //           })
  //         })
  //         .catch(error => {
  //           console.log(error)
  //           setUserData({location: location})
  //         })
  //       },
  //       (error) => console.log(error),
  //       { timeout: 20000, maximumAge: 1000, distanceFilter: 10, enableHighAccuracy: true },
  //       )
  //     } else {
  //       console.log("Location permission denied")
  //     }
  //   } catch (error) {
  //     console.warn(error)
  //   }
  // }

  // async geocodePosition(location) {
  //   try {
  //     const res = await Geocoder.geocodePosition(location)
  //     console.log(res)
  //     return res
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // componentWillMount() {

  // }

  // componentWillUnmount() {
  //   Linking.removeEventListener('url', this.handleOpenURL)
  //   navigator.geolocation.clearWatch(this.watchId)
  // }

  // handleOpenURL = (event) => {
  //   console.log(event.url)
  // }

  checkPermissions = (callback) => {
    Permissions.check('contacts').then(response => {
      if (response == 'undetermined' || response == 'denied') {
        Permissions.request('contacts').then(response => {
          if (response == 'authorized') {
            this.getContactts()
          }
        })
      } else if (response == 'authorized') {
        this.getContactts()
      }
    })
  }

  getContactts = () => {
    const { setContacts, countryCodes } = this.props
    const countryCodesArray = countryCodes.response
    Contacts.getAll((err, contacts) => {
      if(err === 'denied') {
        // error
        // console.log(err)
      } else {
        console.log('contacts')
        console.log(contacts)
        const contactsData = contacts.map(item => {
          if (!item) return null
          return {
            fName: item.givenName && item.givenName.split(' ')[0] || '',
            sName: Platform.OS == 'ios'
              ? item.familyName || ''
              : item.givenName && item.givenName.split(' ')[1] || item.familyName || '',
            phone: item.phoneNumbers[0] && item.phoneNumbers[0].number,
            avatar: item.thumbnailPath,
            email: item.emailAddresses && item.emailAddresses[0] && item.emailAddresses[0].email
          }
        })
        if (countryCodesArray) {
          setContacts(contactsData.map(contact => {
            if (!(contact && contact.phone)) return null
            const phoneCleaned = fullCleanPhone(contact.phone)
            contact.cleanedPhone = phoneCleaned && ('+' + phoneCleaned)
            const realNumb = phoneCleaned.slice(-10).trim()
            let countryCode = '+' + phoneCleaned.replace(realNumb, '').trim()
            if (countryCode == '+') countryCode = '+1'
            if (countryCode && countryCode != '+') {
              if (countryCode == '+1') {
                countryCode = 'US(+1)'
              } else {
                countryCode = '(' + countryCode + ')'
              }
              const foundFullCountryCode = countryCodesArray.find(item => item.indexOf(countryCode) != -1 || item == countryCode)
              contact.phone = foundFullCountryCode + ' ' + realNumb
              return contact
            } else {
              contact.phone = ''
              contact.cleanedPhone = ''
              return contact
            }
          }).filter(item => item))
        }
      }
    })
  }

  componentWillMount() {
    const { fetchCountryCodes } = this.props
    console.log('componentWillMount11')
    console.log(onesignalAppId)
    !__DEV__ && OneSignal.init(onesignalAppId);
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.getPermissionSubscriptionState(data => {
      console.log('getPermissionSubscriptionState', data)
    })
    OneSignal.configure()
    // OneSignal.getPermissionSubscriptionState(data => {
    //   console.log('getPermissionSubscriptionState')
    //   console.log(data)
    // })
    fetchCountryCodes()
    this.checkPermissions()
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    Alert.alert(JSON.stringify(openResult.notification.payload.body))
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds = (device) => {
    const { setPushIdsLocal } = this.props
    console.log('Device info: ', device);
    setPushIdsLocal(device)
  }


  render() {
    const { dispatch, routes } = this.props
    const navigationProps = addNavigationHelpers({
      dispatch,
      state: routes,
      addListener
    })
    return (
      <View style={{flex: 1}}>
        <AppNavigator
          navigation={navigationProps} />
      </View>
    )
  }
}
