import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Image } from 'react-native';
import axios from 'axios';

import { width, height, iconImages } from 'constants/config'

import FormRow from './FormRow';

import PhoneInput from 'components/PhoneInput'
import Sep from 'components/Sep'
import Form from 'components/Form';
import MultiLineForm from 'components/MultiLineForm';

const url = 'https://test.tag225.net/v1/utility/country_codes';

const fieldsOrder = ['fName', 'sName', 'nickName', 'phone', 'email', 'password']

export default class Forms extends Component {
	constructor(props) {
		super(props);
		const inputFocus = {
			nickName: false,
			password: false
		}
    this.state = {
			value: '',
			dropdownValue: '',
			countryCodes: [],
			phoneNumber: '',
			inputFocus
    }
	}

	setInputFocus = (inputName, value) => {
		const newStateInputFocus = this.state.inputFocus
		newStateInputFocus[inputName] = value
		this.setState({inputFocus: newStateInputFocus})
	}

	componentDidMount() {
		const normalizeIsoCode = code => {
			if (code.length > 0) {
				return code.slice(0, 2);
			}
			return "";
		};

		const formatCode = data => {
			return data.map(q => {
				let value = normalizeIsoCode(q.isocode) + "(+" + q.countrycode  + ")";
				return value;
			});
		}
		if (this.state.countryCodes.length == 0) {
			axios.get(url)
				.then(res => {
						let countryCodes = formatCode(res.data).sort();
						this.setState({ countryCodes})
				})
				.catch(err => console.log(err));
		}
	}

	componentDidUpdate() {
		const { inputFocus } = this.state
		const findInputFocus = Object.keys(inputFocus).find(inputKey => inputFocus[inputKey])
		console.log(findInputFocus)
		findInputFocus && this[findInputFocus] && this[findInputFocus].focus()
	}

	onBlur = (fieldName) => {
		const { inputFocus } = this.state
		this.setInputFocus(fieldName, false)
	}

	onPress = (fieldName) => {
		this.setInputFocus(fieldName, true)
	}

	onDropdownRowSelect = (index, value) => {
		this.setState({ dropdownValue: value })
	}

	adjustFrame = (obj) => {
		return obj;
	}

	onChangeText = value => {
		const numbers = '0123456789';
		const isDigit = value.split('').every(q => numbers.includes(q));

		if (isDigit) {
			this.setState({ phoneNumber: value})
		}
	}

	onSubmitEditing = (fieldName) => {
		const { onSubmit } = this.props
		const indexOfField = fieldsOrder.indexOf(fieldName)
		if (indexOfField < fieldsOrder.length - 1) {
			if (fieldsOrder[indexOfField + 1] == 'nickName') {
				this.setState({ inputNickNameFocus: true})
			} else {
				this[fieldsOrder[indexOfField + 1]] && this[fieldsOrder[indexOfField + 1]].focus()
			}
		} else {
			onSubmit && onSubmit()
		}
	}

	render() {
		const { onFieldChange, fields } = this.props
		const { inputFocus } = this.state
		const { fName, sName, email, phone, password, nickName } = fields
		return (
			<View style={styles.wrapper}>
				<Form
					refName={comp => this['fName'] = comp}
					onSubmitEditing={() => this.onSubmitEditing('fName')}
					autoCapitalize="sentences"
					value={fName}
					onChangeText={text => onFieldChange('fName', text)}
					returnKeyLabel='Next'
					icon={iconImages.usernameIconWhite} placeholder='First Name' />
				<Form
					refName={comp => this['sName'] = comp}
					onSubmitEditing={() => this.onSubmitEditing('sName')}
					autoCapitalize="sentences"
					value={sName}
					onChangeText={text => onFieldChange('sName', text)}
					returnKeyLabel='Next'
					icon={iconImages.usernameIconWhite} placeholder='Last Name' />
				<MultiLineForm
					refName={comp => this['nickName'] = comp}
					onSubmitEditing={() => this.onSubmitEditing('nickName')}
					autoCapitalize="sentences"
					title='Nickname'
					subtitle='The name that will appear on your profile'
					placeholder='Nickname'
					icon={iconImages.usernameIconWhite}
					inputFocus={inputFocus['nickName']}
					onPress={() => this.onPress('nickName')}
					value={nickName}
					onChangeText={text => onFieldChange('nickName', text)}
					returnKeyLabel='Next'
					onBlur={() => this.onBlur('nickName')}/>
				<View style={styles.phoneInputWrapper}>
					<PhoneInput
						refName={comp => this['phone'] = comp}
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
							onSubmitEditing: () => this.onSubmitEditing('phone'),
							returnKeyLabel: 'Next'
						}}
						value={phone}
						onChangeText={text => onFieldChange('phone', text)}
						iconWrapperStyle={{
							marginRight: width(2.4)
						}}
						icon={iconImages.phoneIconWhite}
						wrapperStyle={styles.phoneInputInner}
						onChangeText={text => onFieldChange('phone', text)} />
				</View>
				<Sep />
				<Form
					onSubmitEditing={() => this.onSubmitEditing('email')}
					refName={comp => this['email'] = comp}
					icon={iconImages.emailIconWhite}
					placeholder='Email'
					value={email}
					autoCapitalize="none"
					onChangeText={text => onFieldChange('email', text)}
					returnKeyLabel='Next'
					keyboardType='email-address'/>
				<MultiLineForm
					refName={comp => this['password'] = comp}
					onSubmitEditing={() => this.onSubmitEditing('password')}
					autoCapitalize="sentences"
					title='Password'
					subtitle='Must contain a capital letter and a special character'
					placeholder='Password'
					icon={iconImages.passwordIconWhite}
					inputFocus={inputFocus['password']}
					onPress={() => this.onPress('password')}
					value={password}
					onChangeText={text => onFieldChange('password', text)}
					returnKeyLabel='Next'
					onBlur={() => this.onBlur('password')}
					containerStyle={{
						borderBottomWidth: 0
					}}
					withoutBottomLine
					secure/>
			</View>
		);
	}
}

// <Form
// 		onSubmitEditing={() => this.onSubmitEditing('password')}
// 		refName={comp => this['password'] = comp}
// 		containerStyle={{ borderBottomWidth: 0}}
// 		icon={iconImages.passwordIconWhite}
// 		value={password}
// 		onChangeText={text => onFieldChange('password', text)}
// 		returnKeyLabel='Done'
// 		placeholder='Password'
// 		secure/>

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		justifyContent: 'space-between'
	},
	phoneInputWrapper: {
    height: width(17),
		width: '100%',
		justifyContent: 'center',
		paddingHorizontal: width(6)
	},
	phoneInputInner: {
		// paddingHorizontal: width(4)
	}
})
