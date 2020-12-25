import React from 'react';
import { Image, Dimensions } from 'react-native';

import { height, width, iconImages, isIphoneX } from 'constants/config'

export default () => {
    return (
        <Image
            style={{
                width: width(100),
                height: isIphoneX()
                ? width(220)
                : width(220),
                // width: Dimensions.get('window').width,
                // height: Dimensions.get('window').height,
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                zIndex: -100
            }}
            source={iconImages.loginBackground}
        />
    );
}
