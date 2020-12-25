import React, { PureComponent } from 'react';
import { StyleSheet ,Image } from 'react-native';

import { width, height, iconImages } from 'constants/config'

export default class extends PureComponent {
	render() {
		return (
				<Image
					style={styles.image}
					source={iconImages.signupBackground}/>
		)
	}
}

const styles = StyleSheet.create({
	image: {
		flex: 1, 
		width: null,
		height: null, 
		position: 'absolute', 
		top: 0, 
		right: 0,
		bottom: 0, 
		left: 0
	}
})