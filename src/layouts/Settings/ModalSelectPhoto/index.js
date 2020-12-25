import React, { Component } from 'react';
import { View,ScrollView, TouchableOpacity, TouchableWithoutFeedback, Image, StyleSheet } from 'react-native';
import Overlay from 'react-native-modal-overlay';
import { Button, Text, Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

import { width, height, iconImages } from 'constants/config'

const avatars = [ { id: 0, checked: false}, { id: 1, checked: false}, { id: 2, checked: false},
	{ id: 3, checked: false}, { id: 4, checked: false}, { id: 5, checked: false}, { id: 6, checked: false},
		{ id: 7, checked: false}, { id: 8, checked: false}, { id: 9, checked: false}, { id: 10, checked: false},
		{ id: 11, checked: false}, { id: 12, checked: false}, { id: 13, checked: false}, { id: 14, checked: false},
		{ id: 15, checked: false}, { id: 16, checked: false}, { id: 17, checked: false}, { id: 18, checked: false},
		{ id: 19, checked: false}, { id: 20, checked: false}, { id: 21, checked: false}, { id: 22, checked: false}, { id: 23, checked: false},
		{ id: 24, checked: false}, { id: 25, checked: false}, { id: 26, checked: false}, { id: 27, checked: false}, { id: 28, checked: false},
	  { id: 29, checked: false}, { id: 30, checked: false}, { id: 31, checked: false}, { id: 32, checked: false},{ id: 33, checked: false},
		{ id: 34, checked: false}, { id: 35, checked: false}, { id: 36, checked: false}, { id: 37, checked: false}, { id: 38, checked: false},
		{ id: 39, checked: false}, { id: 40, checked: false},, { id: 41, checked: false}, { id: 42, checked: false}];

export default class ModalSelectPhoto extends Component {
	render() {
		const { closeOnTouchOutside, onBtnPress, visible, checkedPhotoId } = this.props
		return (
			<Overlay visible={visible}
				closeOnTouchOutside={closeOnTouchOutside}
				onClose={() => onBtnPress('close')}
				animationType='slideInUp'
				animationDuration={500}
				containerStyle={{
					backgroundColor: 'rgba(37, 8, 10, 0.78)',
					justifyContent: 'center',
					alignItems: 'center'
				}}
				childrenWrapperStyle={{
					backgroundColor: '#FFFFFF',
					borderRadius: 10,
					height: width(120),
					width: width(78)
				}}>
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
							fontSize: width(4),
							fontWeight: '400'
						}}>
						Take a photo, select one from your camera roll or choose an avatar
					</Text>
					<View
						style={{
							justifyContent: 'space-around',
							alignItems: 'center',
							marginTop: width(0.8),
						}}>
						<LinearGradient colors={['#50D2C2', '#56CCF2',]}
							style={{
								borderRadius: 30,
								width: width(60),
								height: width(11),
								marginBottom: width(3.8)
							}}>
							<TouchableOpacity
								onPress={() => onBtnPress('take')}
								activeOpacity={0.5}
								style={{
									flex: 1,
									justifyContent: 'center',
									alignItems: 'center'
								}}>
								<Text style={{ color: 'white', fontSize: width(3.5) }}>
									Take Photo
								</Text>
							</TouchableOpacity>
						</LinearGradient>
							<TouchableOpacity
								onPress={() => onBtnPress('cameraRoll')}
								activeOpacity={0.5}
								style={{
									width: width(60),
									height: width(11),
									justifyContent: 'center',
									alignItems: 'center',
									backgroundColor: 'rgba(190, 190, 190, 0.2)',
									borderWidth: 1,
									borderColor: 'rgba(190, 190, 190, 1)',
									borderRadius: 30,
								}}>
								<Text style={{ color: '#B5B3B3', fontSize: width(3.5)}}>
									Camera Roll
								</Text>
							</TouchableOpacity>
					</View>
					<ScrollView style={{
						marginTop: width(8)
					}}>
					<View
						style={{
							flexDirection: 'row',
							flexWrap: 'wrap',
							justifyContent: 'space-between',
							// alignContent: 'space-between'
						}}>
						{
							avatars.map(item => (
								<TouchableWithoutFeedback
									key={item.id}
									onPress={() => onBtnPress('picture', item.id)}
									style={{
										position: 'relative',
										elevation: 4
									}}>
								<View
									style={{
										position: 'relative',
									}}>
									<Image
										source={iconImages['avatar'+item.id]}
										resizeMode='contain'
										style={{
											width: width(20),
											height: width(20),
											alignSelf: 'center',
											marginTop: item.id > 2 ? width(1.8) : 0
										}}/>
										{
											checkedPhotoId == item.id
											&&
											<Icon
												raised
												name='check'
												type='feather'
												size={width(4)}
												color='green'
												containerStyle={{
													width: width(6),
													height: width(6),
													position: 'absolute',
													bottom: -5,
													right: 0
												}}
											/>
										}
									</View>
								</TouchableWithoutFeedback>
							))
						}
					</View>
				</ScrollView>
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
	}
})
