import { DrawerItems, SafeAreaView } from 'react-navigation';
import React, { Component } from 'react';
import { 
    View,
    Text    
} from 'react-native';
import Forms from './Forms';
import Buttons from './Buttons';
import Logo from './Logo';


export const DrawerComponent = (props) => (
  <ScrollView>
    <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>

            <Text>Hello</Text>


    </SafeAreaView>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
      {/*<DrawerItems {...props} 
      />*/}