import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

import { width, height, iconImages } from 'constants/config'

export default class Avatar extends Component {
	render() {
		return (            
			<View style={styles.wrapper}>				
				<View
					style={styles.inner}>
					<View style={styles.imageWrapper}>
						<Image 
							style={styles.image}
							source={this.props.image}
							resizeMode='cover'/>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		position: 'relative', 
		width: width(24), 
		height: width(24),
	},
	inner: {
		flex: 1,
		borderRadius: 100,
		borderColor: 'rgba(255, 255, 255, 0.6)',
		borderWidth: 2,
		elevation: 5,
		alignItems: 'center',
		justifyContent: 'center'
	},
	imageWrapper: {
		height: '100%',
		width: '100%',
		borderRadius: width(12),
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center',
	},
	image: {
		width: '120%',
		height: '120%',
		resizeMode: 'cover'
	}
})