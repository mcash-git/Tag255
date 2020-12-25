import React from 'react';
import {StackNavigator, TabNavigator, DrawerNavigator} from 'react-navigation';
import { Platform } from 'react-native';

import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import SignUpWithPhoneScreen from './SignUpWithPhoneScreen';
import HomeScreen from './HomeScreen';
import MenuScreen from './MenuScreen';
import DrawerComponent from './DrawerComponent';
import { Page1, Page2, Page3 } from '../containers/Walkthrough';

const tabBarConfig = { 
    animationEnabled: false,
    lazy: false,
    navigationOptions: {
        tabBarVisible: false,
    },
    tabBarOptions: {
    }
};

const LoginStack = StackNavigator({
    LoginScreen: { screen: LoginScreen },
    SignUpScreen: { screen: SignUpScreen },
    SignUpWithPhoneScreen: { screen: SignUpWithPhoneScreen }
}, {
    
});

const MainStack = DrawerNavigator({
    HomeStack: StackNavigator({
        HomeScreen: { screen: HomeScreen }
    }),
    Menu: { screen: MenuScreen }
},
{
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

export default StackNavigator({
    Login: {
        screen: LoginStack
    },
    Main: {
        screen: MainStack
    },
    Walkthrough: {
        screen: WalkthroughTab
    },
}, { 
    headerMode: 'none',
    initialRouteName: 'Login',
    lazy: false
});
