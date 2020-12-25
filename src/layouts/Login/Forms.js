import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import { width, height, iconImages } from 'constants/config'

import { Form } from 'components';

import PhoneInput from 'components/PhoneInput'

const fieldsOrder = ['login', 'password']

export default class Forms extends Component {

	onSubmitEditing = (fieldName) => {
		const { onSubmit } = this.props
		const indexOfField = fieldsOrder.indexOf(fieldName)
		if (indexOfField < fieldsOrder.length - 1) {
			this[fieldsOrder[indexOfField + 1]] && this[fieldsOrder[indexOfField + 1]].focus()
		} else {
			onSubmit && onSubmit()
		}
	}

	render() {
		const { onChangeText, fields } = this.props
		const { login, password } = fields
		return (
			<View
				style={{
					marginTop: width(30)
				}}>
				<View style={styles.phoneInputWrapper}>
					<PhoneInput
						refName={comp => this['login'] = comp}
						countryProps={{
							wrapperStyle: {paddingRight: width(0)},
							inputStyle: {color: 'white'},
							customFieldWrapper: {
								// flex: 2.5
							}
						}}
						phoneProps={{
							wrapperStyle: { marginLeft: width(2) },
							keyboardType: 'phone-pad',
							inputStyle: {color: 'white'},
							placeholderTextColor: 'white',
							onSubmitEditing: () => this.onSubmitEditing('login')
						}}
						value={login}
						onChangeText={(text) => onChangeText('login', text)}
						iconWrapperStyle={{
							marginRight: width(2.4)
						}}
						returnKeyLabel='Next'
						icon={iconImages.phoneIconWhite}
						wrapperStyle={styles.phoneInputInner}/>
				</View>
				<Form
					refName={comp => this['password'] = comp}
					//onSubmitEditing={() => this.onSubmitEditing('password')}
					onChangeText={(text) => onChangeText('password', text)}
					icon={iconImages.passwordIconWhite}
					placeholder='Password'
					returnKeyType = {"done"}
					value={password}
					secure/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	phoneInputWrapper: {
		height: width(17),
		width: '100%',
		justifyContent: 'center',
		paddingHorizontal: width(6.4),
		borderBottomColor: 'rgba(255,255,255,0.7)',
		borderBottomWidth: 1
	}
})
