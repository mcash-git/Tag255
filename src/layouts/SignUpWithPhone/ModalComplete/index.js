import React, { PureComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Image} from 'react-native';
import Overlay from 'react-native-modal-overlay';
import { Button, Text, Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

import { width, height, iconImages } from 'constants/config'

export default class ModalComplete extends PureComponent {
	render() {
		const { visible, closeOnTouchOutside, onBtnPress, avatar } = this.props
		return (
			<Overlay visible={ visible } closeOnTouchOutside={closeOnTouchOutside} onClose={() => onBtnPress('close')} animationType='slideInUp' containerStyle={styles.wrapperContainer}
				childrenWrapperStyle={styles.childerenWrapper} animationDuration={ 500 }>
				<View style={styles.crossIconWrapper}>
				<TouchableOpacity onPress={() => onBtnPress('close')}>
					<View style={styles.crossIconInner}>
						<Image style={styles.crossIconImage} source={iconImages.crossIconImage} />
					</View>
				</TouchableOpacity>
				</View>
					<View style={ { flex: 1, justifyContent: 'space-around' } }>
						<Text style={styles.titleText}>Please confirm your profile picture.</Text>
						<TouchableWithoutFeedback style={{elevation: 8}}>
							<View style={styles.avatarWrapper}>
								<Image source={ avatar && {uri: avatar} || iconImages.avatarPlaceholder } resizeMode='cover' style={styles.avatarImage} />
							</View>
						</TouchableWithoutFeedback>
						<View style={styles.buttonsWrapper}>
							<TouchableOpacity onPress={() => onBtnPress('back')} activeOpacity={ 0.5 } style={styles.backBtnWrapper}>
								<Text style={styles.backBtnText}>Back</Text>
							</TouchableOpacity>
							<LinearGradient colors={ ['#50D2C2', '#56CCF2',] } style={styles.confirmBtnWrapper}>
								<TouchableOpacity onPress={() => onBtnPress('confirm')} activeOpacity={ 0.5 } style={ { flex: 1, justifyContent: 'center', alignItems: 'center' } }>
									<Text style={styles.confirmBtnText}>Confirm</Text>
								</TouchableOpacity>
							</LinearGradient>
						</View>
					</View>
			</Overlay>
		)
	}
}
const styles = StyleSheet.create({
	wrapperContainer: {
		backgroundColor: 'rgba(37, 8, 10, 0.78)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	childerenWrapper: {
		backgroundColor: '#FFFFFF',
		borderRadius: 10,
		height: width(110),
		width: width(81)
	},
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
	titleText: {
		marginTop: width(3.8),
		textAlign: 'center',
		fontSize: width(4),
		fontWeight: '400',
		marginHorizontal: width(8)
	},
	avatarWrapper: {
		width: width(38),
		height: width(38),
		borderRadius: 100,
		borderColor: '#F1F1F1',
		borderWidth: 1,
		alignSelf: 'center',
		marginTop: width(3.8),
		overflow: 'hidden'
	},
	avatarImage: {
		height: '100%',
		width: '100%',
		resizeMode: 'cover'
	},
	buttonsWrapper: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginBottom: width(3.8),
		marginTop: width(10)
	},
	confirmBtnWrapper: {
		borderRadius: 30,
		width: width(30),
		height: width(10)
	},
	confirmBtnText: {
		color: 'white',
		fontSize: width(4)
	},
	backBtnText: {
		color: '#B5B3B3',
		fontSize: width(4)
	},
	backBtnWrapper: {
		width: width(30),
		height: width(10),
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(190, 190, 190, 0.2)',
		borderWidth: 1,
		borderColor: 'rgba(190, 190, 190, 1)',
		borderRadius: 30
	}
})
