import React, { PureComponent } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Button, Icon } from 'react-native-elements';

import { width, height, iconImages } from 'constants/config'

export default class extends PureComponent {
	render() {
		const { onBtnPress } = this.props
		return (
			<View
				style={{ 
					// marginTop: height(37),
					flexDirection: 'row',
					justifyContent: 'space-around',
					width: width(80),
					alignSelf: 'center'
				}}>
				<TouchableOpacity
					activeOpacity={0.5}
					onPress={() => onBtnPress('linkedIn')}>
					<Icon 
						raised
						type="material-community"
						name="linkedin"
						color='#0C81BE'
						size={width(6.8)}/>
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={0.5}
					onPress={() => onBtnPress('twitter')}>
					<Icon 
						raised
						type="material-community"
						name="twitter"
						color='#759EC7'
						size={width(6.8)}/>
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={0.5}
					onPress={() => onBtnPress('facebook')}>
					<Icon 
						raised
						type="material-community"
						name="facebook"
						color='#445281'
						size={width(6.8)}/>
				</TouchableOpacity>
			</View>
		);
	}
}
