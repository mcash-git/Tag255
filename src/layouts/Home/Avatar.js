import React, { Component } from 'react';
import { View, Text, Image, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import { Icon } from 'react-native-elements'
import FastImage from 'react-native-fast-image'

import { width, height, iconImages, isIphoneX } from 'constants/config'

export default class Avatar extends Component {
	render() {
		const { source, notificationsAmount } = this.props
		return (
			<TouchableWithoutFeedback style={ { } }>
				<View style={styles.wrapper}>
					<View style={styles.imageWrapper}>
						<Image
							style={styles.image}
							source={source && {
								uri: source
							} || iconImages.avatarPlaceholder}
							resizeMode={FastImage.resizeMode.cover}/>
					</View>
					{
						notificationsAmount
							? <View style={styles.counter}>
									<Text style={ { color: 'red', fontSize: width(4) } }>
										{notificationsAmount}
									</Text>
								</View>
							: null
					}
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

// <Image style={styles.image} source={source && {uri: source} || iconImages.avatarPlaceholder}/>

const styles = StyleSheet.create({
	wrapper: {
		position: 'relative',
		width: isIphoneX()
			?	width(46)
			: width(28),
		height: isIphoneX()
			?	width(46)
			: width(28),
		justifyContent: 'center',
		alignSelf: 'center',
		marginTop: isIphoneX()
			?	width(12)
			: width(14)
	},
	counter: {
		width: isIphoneX()
			?	width(10)
			: width(8),
		height: isIphoneX()
			?	width(10)
			: width(8),
		borderWidth: 1,
		borderColor: 'red',
		backgroundColor: 'white',
		borderRadius: 100,
		position: 'absolute',
		top: isIphoneX()
			?	width(3)
			: width(-3),
		right: isIphoneX()
			?	width(0)
			: -5,
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 6,
		paddingBottom: 4
	},
	imageWrapper: {
		borderColor: 'rgba(255, 255, 255, 1)',
		borderWidth: 2,
		elevation: 0,
		marginLeft: isIphoneX()
			?	width(0)
			: width(-5),
		height: isIphoneX()
			?	width(45)
			: width(37),
		width: isIphoneX()
			?	width(45)
			: width(37),
		borderRadius: isIphoneX()
			?	width(45)
			: width(37),
		overflow: 'hidden'
	},
	image: {
		height: '100%',
		width: '100%',
		resizeMode: 'cover'
	}
})
