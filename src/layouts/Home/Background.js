import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import { height, width, iconImages, overlay } from 'constants/config'


export default () => {
	return (
		<View style={styles.imageWrapper}>
			<Image style={styles.image} source={iconImages.homeBg} />
		</View>
	);
}

const styles = StyleSheet.create({
	imageWrapper: {
		height: height(110),
		width: width(100),
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	},
	image: {
		height: '100%',
		width: '100%',
		resizeMode: 'cover'
	}
})
