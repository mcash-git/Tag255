import React, { PureComponent} from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { Button, Icon } from 'react-native-elements';

import { width, height, iconImages } from 'constants/config'

export default class extends PureComponent {
	render() {
		const { containerStyle, onInPress } = this.props
		return (
			<View style={[styles.wrapper, containerStyle]}>
				<TouchableOpacity
					activeOpacity={0.5}
					onPress={onInPress}>
					<Icon 
						raised
						type="material-community"
						name="linkedin"
						color='#0C81BE'
						size={width(6)}/>
				</TouchableOpacity>
				<TouchableOpacity activeOpacity={0.5} onPress={onInPress}>
					<Icon 
						raised
						type="material-community"
						name="twitter"
						color='#759EC7'
						size={width(6)}/>
				</TouchableOpacity>
				<TouchableOpacity	activeOpacity={0.5} onPress={onInPress}>
					<Icon 
						raised
						type="material-community"
						name="facebook"
						color='#445281'
						size={width(6)}/>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flexDirection: 'row',
		justifyContent: 'space-around'
	}
})
