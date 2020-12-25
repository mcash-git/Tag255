import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, Image, TextInput, Platform } from 'react-native';

import { width, height, isIphoneX } from 'constants/config';

export default class extends PureComponent {
	render() {
		const { containerStyle, icon, secure, value, onChangeText, refName } = this.props
		return (
			<View style={[styles.wrapper, containerStyle && containerStyle]}>
				<Image style={styles.image}
					source={icon}
					resizeMode='contain'/>
				<TextInput
					{...this.props}
					style={styles.input}
					ref={comp => refName && refName(comp)}
					value={value}
					underlineColorAndroid='rgba(0,0,0,0)'
					placeholderTextColor='white'
					onChangeText={onChangeText}
					secureTextEntry={secure}/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	wrapper: {
		borderBottomWidth: 1,
		flexDirection: 'row',
		borderColor: 'rgba(255,255,255,0.7)', 
		alignItems: 'center',
		paddingVertical: Platform.OS == 'ios'
			? isIphoneX()
				? width(5.8)
				:	width(5.8)
			: width(1.5),
		paddingHorizontal: Platform.OS == 'ios'
			? isIphoneX()
				? width(4)
				: width(3)
			: width(2)
	},
	image: {
		width: isIphoneX()
			?	width(6)
			: width(5),
		height: isIphoneX()
			?	width(6)
			: width(5),
		marginLeft: width(4)
	},
	input: {
		flex: 1,
		color: 'white',
		fontSize: Platform.OS == 'ios'
			?	isIphoneX()
				? width(4.6)
				: width(4)
			: width(3.4),
		marginLeft: width(4),
		paddingRight: width(2.4)
	}
})
