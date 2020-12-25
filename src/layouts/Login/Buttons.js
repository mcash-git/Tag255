import React, { Component } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-elements';

import { width, height, iconImages } from 'constants/config'

export default class Buttons extends Component {
	render() {
		const { onForgetPasswordPress, onSignUpPress, onKeepLoginTrigger, keepLogin, signInDisabled } = this.props
		return (
			<View style={styles.wrapper}>
				<View style={styles.topBtnsWrapper}>
					<TouchableOpacity
						onPress={onKeepLoginTrigger}
						style={styles.keepLoginBtn}>
						<Icon
							name={keepLogin ? 'checkbox-marked' : 'checkbox-blank'}
							size={width(6)}
							color='white'/>
						<Text style={styles.keepLoginBtnText}>
							Stay logged in
						</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={onForgetPasswordPress} style={styles.forgetPwdBtn}>
						<Text style={styles.forgetPwdBtnText}>
							Forgot password?
						</Text>
					</TouchableOpacity>
				</View>
				<Button
					disabled={signInDisabled}
					title='Login'
					textStyle={{ fontSize: width(5)}}
					buttonStyle={styles.loginButton}
					onPress={this.props.onLoginPress}/>
				<View style={styles.bottomBtns}>
					<Text style={styles.dontHaveAccountText}>
						Don't have an account?
					</Text>
					<TouchableOpacity onPress={onSignUpPress}>
						<Text style={styles.signupText}>
							Sign Up
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1
	},
	topBtnsWrapper: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: width(2),
		marginHorizontal: width(2)
	},
	keepLoginBtn: {
		flexDirection: 'row', marginLeft: width(4)
	},
	keepLoginBtnText: {
		color: 'rgba(255, 255, 255, 0.9)',
		fontSize: width(3.8),
		marginLeft: width(2)
	},
	forgetPwdBtn: {
		marginRight: width(3)
	},
	forgetPwdBtnText: {
		color: 'rgba(255, 255, 255, 0.9)',
		fontSize: width(3.8)
	},
	loginButton: {
		width: width(100),
		height: width(15),
		alignSelf: 'center',
		backgroundColor: 'rgba(255, 255, 255, 0.3)',
		marginVertical: width(8)
	},
	bottomBtns: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
	},
	dontHaveAccountText: {
		color: 'rgba(255, 255, 255, 0.9)',
		fontSize: width(4)
	},
	signupText: {
		color: 'rgba(255, 255, 255, 1)',
		fontSize: width(4),
		marginLeft: width(2)
	}
})


// <Icon
//                                 name={!this.state.checked ? 'checkbox-marked' : 'checkbox-blank'}
//                                 size={width(6)}
//                                 color='white'
//                             />
