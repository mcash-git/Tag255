import React from 'react';
import { View, Image, Text, Dimensions, StyleSheet } from 'react-native';

import  { width, height, iconImages } from 'constants/config'

export default (props) => {
    return (
        <View style={styles.wrapper}>
            <Image 
                style={styles.image}
                source={iconImages.logoImageWhite}
                resizeMode='contain'
            />
        </View>

    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: width(46),
        height: width(7.5),
        alignSelf: 'center',
        justifyContent: 'center'
    },
    image: {
        height: '100%',
        width: '100%'
    }
})