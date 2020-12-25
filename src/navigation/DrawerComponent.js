import { DrawerItems, SafeAreaView } from 'react-navigation';
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Platform,
    TouchableNativeFeedback,
    TouchableOpacity,
    Image
} from 'react-native';
import { NavigationActions } from 'react-navigation';

import { width, height, iconImages } from 'constants/config'
import { connectWithNavigationIsFocused, checkNextProps } from 'utils'

import * as ApiUtils from 'actions/utils'


const Button = (props) => {
  return Platform.OS === 'android'
    ?
    <TouchableNativeFeedback {...props} />
    :
    <TouchableOpacity {...props}  />
};


const footerList = [
  {
    key: 'Settings',
    title: 'Settings',
    image: iconImages.settings
  },
  {
    key: 'logout',
    title: 'Logout',
    image: iconImages.logout
  }
];

@connectWithNavigationIsFocused(
  state => ({
    userData: state.userData,
    getNotifications: state.getNotifications,
    watchedNotifications: state.watchedNotifications
  }),
  dispatch => ({
    unsetUserData: () => {
      dispatch(ApiUtils.unsetUserData())
    },
    setSettings: () => {
      dispatch(ApiUtils.resetSettings())
    }
  })
)
export default class DrawerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      witingForNextProps: false
    }
  }

  footerNavigate = (key) => {
    const { navigation, unsetUserData, setSettings } = this.props
    switch(key) {
      case 'logout':
        this.setState({ witingForNextProps: true }, () => {
          setSettings({
            keepLogin: false
          })
          unsetUserData()
        })
      default:
        navigation.navigate(key)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { navigation } = this.props
    const { witingForNextProps } = this.state
    if (witingForNextProps) {
      const propsCheckerUserData = checkNextProps(nextProps, this.props, 'userData', 'anyway', true)
      if (propsCheckerUserData == 'empty') {
        this.setState({ witingForNextProps: false }, () => {
          const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'LoginStack'})
            ],
           key:null
          })
          navigation.dispatch(resetAction)
        })
      }
    }
  }

  bodyNavigate = (key) => {
    const { navigation, getNotifications } = this.props
    switch(key) {
      default:
        navigation.navigate(key, {prevScreen: 'Home'})
    }
  }

  render() {
    const { getNotifications, userData, watchedNotifications } = this.props
    const newNotificationsAmount = getNotifications.response && getNotifications.response.filter(notif => watchedNotifications.data.indexOf(notif.id) == -1).length
    const mainList = [
      {
        key: 'HomeStack',
        title: 'Home',
        image: iconImages.home
      },
      {
        key: 'Notifications',
        title: 'Notifications',
        image: iconImages.notification,
        count: newNotificationsAmount || ''
      },
      {
        key: 'MakeIntroductions',
        title: 'Make an Introduction',
        image: iconImages.hands_drawer
      },
      {
        key: 'MyIntroductions',
        title: 'My Introductions',
        image: iconImages.people_drawer
      },
      {
        key: 'Connections',
        title: 'My Connections',
        image: iconImages.connects_drawer
      },
      {
        key: 'Invite',
        title: 'Invite Friends',
        image: iconImages.add_drawer
      }
    ];

    return (
      <ScrollView>
    <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>

    <View
      style={{ flexDirection: 'row', marginVertical: width(5.6), marginLeft: width(4)}}
          >
      <View style={{width: width(12), height: width(12), marginRight: width(4), borderRadius: width(12), alignItems: 'center', overflow: 'hidden'}}  >
      <Image
        style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
        source={userData && userData.userModel && userData.userModel.avatar && {uri: userData.userModel.avatar} || iconImages.avatarPlaceholder}
      />
      </View>
      <View style={{paddingRight: width(20)}}
      >
        <Text numberOfLines={1}
          style={{ fontSize: width(5.4), color: 'black'}}
              >{userData && userData.userModel && userData.userModel.firstName + ' ' + userData.userModel.lastName || ''}</Text>
        <Text numberOfLines={1}
          style={{ fontSize: width(4), color: 'gray'}}
              >{userData && userData.userModel && userData.userModel.email || ''}</Text>
      </View>


    </View>

      <View
        style={{ flex: 1, height: width(0.16), backgroundColor: 'gray', marginVertical: width(1.6)}}
      >
      </View>

      <View style={{marginTop: width(2), marginBottom: width(7)}}>
      {
        mainList.map(item => {
          return (
            <Button
              key={item.key}
              onPress={() => this.bodyNavigate(item.key)}

          >
            <View
              style={{ flex: 1,
                flexDirection: 'row', paddingLeft: width(6), paddingVertical: width(2.8),
              alignItems: 'center' }}
            >
              <Image
                style={{ width: width(5.6), height: width(5.6), marginRight: width(6)}}
                source={item.image}
                resizeMode='contain'
              />
              <Text
                style={[{ fontSize: width(4), color: 'black'}, item.key == 'HomeStack' && { color: '#52C986'}]}
              >{item.title}</Text>
              <View
                style={{ flex: 1 , alignItems: 'flex-end', paddingRight: width(3)}}
              >
                <Text
                  style={{ fontSize: width(4.5), marginRight: width(4.5), color: 'black'}}
                >{item.count}</Text>
              </View>

            </View>

          </Button>
          );
        })
    }
    </View>

      <View
        style={{ flex: 1, height: width(0.16), backgroundColor: 'gray', marginTop: width(15.6), marginBottom: width(7.6)}}
      >
      </View>

{
        footerList.map(item => {
          return (
            <Button
              key={item.key}
              onPress={() => this.footerNavigate(item.key)}
          >
            <View
              style={{ flex: 1,
                flexDirection: 'row', paddingLeft: width(6), paddingVertical: width(2.8),
              alignItems: 'center' }}
            >
              <Image
                style={{ width: width(5), height: width(5), marginRight: width(5)}}
                source={item.image}
                resizeMode='contain'
              />
              <Text
                style={{ fontSize: width(4), color: 'black'}}
              >{item.title}</Text>
              <View
                style={{ flex: 1 , alignItems: 'flex-end', paddingRight: width(3)}}
              >
                <Text
                  style={{ fontSize: width(4.5), marginRight: width(5), color: 'black'}}
                >{item.count}</Text>
              </View>
            </View>

          </Button>
          );
        })
    }


    </SafeAreaView>
  </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
