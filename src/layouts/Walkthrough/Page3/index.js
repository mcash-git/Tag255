import React, { Component} from 'react';
import { View, StyleSheet, Text, Image, Platform, TouchableNativeFeedback, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

import { width, height, iconImages } from 'constants/config'

import Background from '../Background';
import Logo from '../Logo';
import Avatar from './Avatar'

export class Page3 extends Component {
	render () {
		return (
				<View style={styles.wrapper}>
					<Background />
						<View>
							<View	style={styles.iconsWrapper}>
								<Icon 
									name='circle-o'
									type='font-awesome'
									size={width(3)}
									color='white'/>
								<Icon 
									name='circle-o'
									type='font-awesome'
									color='white'
									containerStyle={{
											marginHorizontal: width(3)
									}}
									size={width(3)}/>
								<Icon 
									name='circle'
									type='font-awesome'
									color='white'
									size={width(3)}/>
							</View>
							<Logo />
						</View>
						<Text	style={styles.connectedText}>
							They're connected!
						</Text>
						<View
							style={styles.avatarWrapper}>
							<Avatar image={iconImages.fakeWomanAvatar}/>
							<Text style={styles.lines}>
								- - -
							</Text>
							<Image style={styles.image}
								source={iconImages.successImage}
								resizeMode='contain'/>
							<Text style={styles.lines}>
								- - -
							</Text>
							<Avatar image={iconImages.fakeManAvatar}/>		
						</View>
						<Text style={styles.hintText}>
							They now have each other’s
							contact information, and you
							have the good feeling that
							comes from bringing people
							together!
						</Text>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('Main')} >
							<View style={styles.btnInner}>
								<Text tyle={{ color: '#4CB4C8', fontSize: width(4)}}>
									GET STARTED
								</Text>
							</View>
						</TouchableOpacity>                
			</View>
		);
	}    
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		justifyContent: 'space-between',
		backgroundColor: 'rgba(80, 210, 194, 0.95)'
	},
	iconsWrapper: {
		alignSelf: 'center', 
		flexDirection: 'row', 
		marginTop: width(9), 
		marginBottom: width(13) 
	},
	connectedText: {
		fontSize: width(4.4), 
		color: 'white', 
		textAlign: 'center', 
		width: width(70), 
		alignSelf: 'center',
		marginTop: width(-12)
	},
	avatarWrapper: {
		flexDirection: 'row', 
		paddingHorizontal: width(14), 
		justifyContent: 'space-around' ,
		alignItems: 'center',
		marginTop: width(-12)
	},
	hintText: {
		fontSize: width(4.6), 
		color: 'white', 
		textAlign: 'center', 
		width: width(66), 
		alignSelf: 'center',
		marginTop: width(-12),
		lineHeight: width(7)
	},
	btnInner: {
		height: width(16),
		width: width(100), 
		justifyContent: 'center', 
		alignItems: 'center', 
		backgroundColor: 'white' 
	},
	image: {
		height: width(9),
		width: width(9),
		marginHorizontal: width(0.8)
	},
	lines: {
		fontSize: width(9),
		color: 'white'
	}
})