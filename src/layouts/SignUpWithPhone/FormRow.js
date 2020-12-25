import React from 'react';
import { ScrollView, View, StyleSheet, Text, Image, TextInput } from 'react-native';
import { Icon } from 'react-native-elements';
import ModalDropdown from 'react-native-modal-dropdown'

import { width, height, iconImages } from 'constants/config';

export default (props) => {    
	return (
		<View style={[styles.wrapper, props.containerStyle]}>
			<View style={styles.countryWrapper}>
				<Image  style={styles.image} source={props.icon} resizeMode='contain'/>
				<ModalDropdown 
					options={props.data}
					onSelect={props.onSelect}
					adjustFrame={props.adjustFrame}
					containerStyle={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						backgroundColor: 'red'
					}}
					style={{
						width: width(30), 
						marginLeft: width(5),
						marginBottom: height(1),
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
					textStyle={{ color: 'white', fontSize: width(5)}}
					dropdownStyle={{ 
						width: width(30),
						// height: height(10)
					}}
					dropdownTextStyle={{
						color: 'white',
						backgroundColor: 'rgba(86, 204, 238, 0.95)'
					}}>
					<View style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: width(26)
					}}>
					<Text style={styles.label}>
						{props.label}
					</Text>
					<Icon
						type='font-awesome'
						name='angle-down'
						size={width(5)}
						color='rgba(255, 255, 255, 0.5)'
						containerStyle={{ marginRight: 5 }}
					/>
					</View>
				</ModalDropdown>
			</View>
			<TextInput
				style={styles.input}
				onChangeText={props.onChangeText}
				value={props.phoneNumber}
				placeholder={props.placeholder}
				underlineColorAndroid='rgba(0,0,0,0)'
				placeholderTextColor='white'
				secureTextEntry={props.secure}
				keyboardType={props.keyboardType}/>
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		borderBottomWidth: 1, 
		flexDirection: 'row', 
		borderColor: '#D8D8D8', 
		alignItems: 'center'
	},
	countryWrapper: {
		flexDirection: 'row',
		alignItems: 'center', 
		borderRightWidth: 1, 
		borderColor: '#D8D8D8',
		height: width(16),
		width: width(44),
		justifyContent: 'center',
	},
	image: {
		width: width(6), 
		height: width(6),
		marginLeft: width(4),
		marginBottom: width(1.8)
	},
	modalDropDownContainer: {
		
	},
	modalDropdown: {
		
	},
	modalDropDownText: {
		
	},
	label: {
		color: 'white', fontSize: width(4),
	},
	input: {
		flex: 1, 
		color: 'white', 
		fontSize: width(4),
		marginLeft: width(4), 
		marginVertical: width(1),
		paddingRight: 30
	},
})

				