import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native'
import { OptionList, updatePosition } from 'react-native-dropdown'
import NestedScrollView from 'react-native-nested-scroll-view'
import FastImage from 'react-native-fast-image'

import { width, height, iconImages } from 'constants/config'

export default class ThreeImages extends Component {
  render() {
    const { images, wrapperWidth, vertical, withoudBorderRadius } = this.props
    const bigImageWidth = Number((wrapperWidth * 0.8).toFixed())
    const otherImagesWidth = Number((bigImageWidth * (images[0] == 'notset' ? 0.65 : 0.56)).toFixed()) //0.56
    console.log(images)
    const checkedImages = images.map((imageItem) => imageItem && {uri: imageItem} )
    console.log(iconImages.avatarPlaceholder)
    return (
      <View style={[styles.wrapper, wrapperWidth && { width: wrapperWidth, height: (images[0] == 'notset' ? wrapperWidth*0.6 : wrapperWidth) }]}>
        {
          images[1] != 'notset' ?
            <View style={[styles.smallImageWrapper, { left: otherImagesWidth * (images[0] == 'notset' ? 0.1 : 0.18) }, otherImagesWidth && { width: otherImagesWidth, height: otherImagesWidth, borderRadius: !withoudBorderRadius ?  otherImagesWidth : 0 }, vertical && {left: (wrapperWidth - otherImagesWidth)/2, top: -50}]} >
              <Image
                style={styles.imageSmall}
                source={checkedImages[1] || iconImages.avatarPlaceholder}
                resizeMode={FastImage.resizeMode.cover}/>
            </View>
            : null
        }
        {
          images[2] != 'notset' ?
            <View style={[styles.smallImageWrapper, {right: otherImagesWidth * (images[0] == 'notset' ? 0.1 : 0.18)}, otherImagesWidth && {width: otherImagesWidth, height: otherImagesWidth, borderRadius: !withoudBorderRadius ? otherImagesWidth : 0 }, vertical && {left: (wrapperWidth - otherImagesWidth)/2, top: otherImagesWidth-100}]} >
              <Image
                style={styles.imageSmall}
                source={checkedImages[2] || iconImages.avatarPlaceholder}
                resizeMode={FastImage.resizeMode.cover}/>
            </View>
            : null
        }
        {
          images[0] != 'notset' ?
            <View style={[styles.bigImageWrapper, wrapperWidth && {width: wrapperWidth, height: wrapperWidth}]}>
              <View style={[styles.bigImageInner, bigImageWidth && {height: bigImageWidth, width: bigImageWidth, borderRadius: !withoudBorderRadius ? bigImageWidth : 0 } ]}>
                <Image
                  style={styles.image}
                  source={checkedImages[0] || iconImages.avatarPlaceholder}
                  resizeMode={FastImage.resizeMode.cover}/>
              </View>
            </View>
            : null
        }
      </View>
    );
  }
}

// <Image source={ checkedImages[1] || iconImages.avatarPlaceholder} style={styles.imageSmall} />
// <Image source={ checkedImages[2] || iconImages.avatarPlaceholder} style={styles.imageSmall} />
// <Image source={ checkedImages[0] || iconImages.avatarPlaceholder} style={styles.image} />

const styles = StyleSheet.create({
  wrapper: {

  },
  bigImageWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  bigImageInner: {
    overflow: 'hidden',
    backgroundColor: 'white'
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    backgroundColor: 'white'
  },
  imageSmall: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover'
  },
  smallImageWrapper: {
    position: 'absolute',
    bottom: 0,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  left: {
    left: 0
  },
  right: {
    right: 0
  }
})
