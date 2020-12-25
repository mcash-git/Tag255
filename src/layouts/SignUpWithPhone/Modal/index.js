import React, { Component } from 'react';
import { View, TouchableOpacity, TouchableWithoutFeedback, Image, StyleSheet } from 'react-native';
import Overlay from 'react-native-modal-overlay';
import { Button, Text, Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

import { width, height, iconImages } from 'constants/config'

import Buttons from './Buttons';

export default class Modal extends Component {
	render() {
		const { visible, onBtnPress, closeOnTouchOutside } = this.props
		return (
			<Overlay visible={visible}
				closeOnTouchOutside={closeOnTouchOutside}
				onClose={() => onBtnPress('close')}
				animationType='slideInUp'            
				containerStyle={{ 
						backgroundColor: 'rgba(37, 8, 10, 0.78)', 
						justifyContent: 'center', 
						alignItems: 'center' 
				}}
				childrenWrapperStyle={{ 
						backgroundColor: '#FFFFFF', 
						borderRadius: 10, 
						height: width(120), 
						width: width(81) 
				}}
				animationDuration={500}            >
				<View style={styles.crossIconWrapper}>
				<TouchableOpacity onPress={() => onBtnPress('close')}>
					<View style={styles.crossIconInner}>
						<Image style={styles.crossIconImage} source={iconImages.crossIconImage} />
					</View>
				</TouchableOpacity>
				</View>
				<View
					style={{
							flex: 1,
							justifyContent: 'space-around'
					}}>
					<Text
						style={{ 
							marginTop: width(3.8), 
							textAlign: 'center', 
							fontSize: width(5), 
							fontWeight: '400'
						}}>
						Are you sure you don't want to add a profile picture?
					</Text>
					<TouchableWithoutFeedback>
						<Image
							source={iconImages.addPhotoIconGrey}
							style={{ 
									width: width(25), 
									height: width(25), 
									alignSelf: 'center'
							}}/>
					</TouchableWithoutFeedback>
					<Text
						style={{                       
								textAlign: 'center', 
								fontSize: width(4.5)
						}}>
						We can also get your profile picture from your social media account if you connect it below.
					</Text>
					<Buttons />
					<View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: width(3.8)}}>
						<TouchableOpacity
							onPress={() => onBtnPress('later')}
							activeOpacity={0.5}
							style={{
									width: width(32),
									height: width(11),
									justifyContent: 'center',
									alignItems: 'center',
									backgroundColor: 'rgba(190, 190, 190, 0.2)',
									borderWidth: 1,
									borderColor: 'rgba(190, 190, 190, 1)',
									borderRadius: 30,
							}}>
							<Text style={{ color: '#B5B3B3', fontSize: width(4) }}>
								Later
							</Text>
						</TouchableOpacity>
						<LinearGradient colors={['#50D2C2', '#56CCF2']} style={{ borderRadius: 30 }}>
							<TouchableOpacity
								onPress={() => onBtnPress('select')}
								activeOpacity={0.5}
								style={{
									width: width(32),
									height: width(10),
									justifyContent: 'center',
									alignItems: 'center',
									paddingTop: width(0.2)
								}}>
								<Text style={{ color: 'white', fontSize: width(4) }}>
									Select Photo
								</Text>
							</TouchableOpacity>
						</LinearGradient>
					</View>
				</View>
			</Overlay>
		)
	}
}


const styles = StyleSheet.create({
		crossIconWrapper: {
		position: 'absolute', 
		top: width(3), 
		left: width(3),
		height: width(7),
		width: width(7),
	},
	crossIconInner: {
		height: width(6),
		width: width(6),
		padding: width(0.4)
	},
	crossIconImage: {
		height: '100%',
		width: '100%',
		resizeMode: 'contain',
	},
	iconContainer: {
		position: 'absolute', 
		top: 5, 
		left: 5
	},
})
