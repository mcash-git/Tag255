import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import { Icon } from 'react-native-elements';

import { width, height, iconImages } from 'constants/config'

export default class Avatar extends Component {
	render() {
		const { onPress, avatar } = this.props
		return (
			<TouchableWithoutFeedback onPress={onPress}>
				<View style={styles.inner}>
					<View style={styles.avatarImageWrapper}>
						<Image
							style={styles.avatarImage}
							source={
								avatar
									? {uri: avatar}
									: iconImages.addPhotoIcon
							}/>
					</View>
					<View style={styles.iconContainerWrapper}>
						<ImageBackground resizeMode="cover" source={iconImages.smallAddIconBackgroundBlue} style={styles.iconContainerBackgroundImage}>
							<Icon
								raised
								name='add'
								underlayColor="transparent"
								containerStyle={{
									height: width(7),
									width: width(7),
									justifyContent: 'center',
									alignItems: 'center',
									backgroundColor: 'transparent',
									marginLeft: width(-0.3),
									marginTop: width(-0.3)
								}}
								size={width(5)}
								// onPress={props.onSubstractPress}
								color='white'/>
						</ImageBackground>
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {

	},
	inner: {
		position: 'relative',
		justifyContent: 'center',
		alignSelf: 'center',
		paddingTop: width(1),
		marginTop: width(1)
	},
	iconContainerWrapper: {
		height: width(7),
		width: width(7),
		borderWidth: 1,
		borderColor: 'white',
		position: 'absolute',
		backgroundColor: '#5C91E1',
		top: width(0.4),
		right: width(0.8),
		borderRadius: width(7),
		overflow: 'hidden',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	iconContainerBackgroundImage: {
		height: '100%',
		width: '100%',
		backgroundColor: '#5C91E1',
	},
	avatarImageWrapper: {
		width: width(26),
		height: width(26),
		borderRadius: width(26),
		overflow: 'hidden'
	},
	avatarImage: {
		height: '100%',
		width: '100%',
		resizeMode: 'cover'
	}
})
