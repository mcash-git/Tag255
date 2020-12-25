import React from 'react';
import { Image } from 'react-native';

import { width, height, iconImages } from 'constants/config'

export default () => {
    return (
        <Image
            style={{ 
                flex: 1, 
                width: null,
                height: null, 
                position: 'absolute', 
                top: 0, 
                right: 0,
                bottom: 0, 
                left: 0
            }}
            source={iconImages.walkthroughBackgroundImage}
            resizeMode='cover'
        />
    );
}
