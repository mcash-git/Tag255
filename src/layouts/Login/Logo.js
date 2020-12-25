import React from 'react';
import { View, Image, Text, Platform } from 'react-native';

import { width, height, iconImages, isIphoneX } from 'constants/config'

export default (props) => {
    return (
        <View>
            <Text
                style={{
                    fontSize: width(4.4),
                    textAlign: 'center',
                    color: 'white',
                    marginTop: Platform.OS == 'ios'
                        ? isIphoneX()
                            ? width(40)
                            : width(24)
                        : width(24),
                    marginBottom: width(8),
}}
            >Welcome to</Text>

            <Image
                style={{ width: width(70), alignSelf: 'center',  }}
                source={iconImages.logoImageWhite}
                resizeMode='contain'
            />
        </View>

    );
}
