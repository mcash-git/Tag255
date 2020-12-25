import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native'
import { connect } from 'react-redux'

import { width, height, iconImages, isIphoneX } from 'constants/config'

import StdInput from './StdInput'

@connect(
  state => ({
    countryCodes: state.countryCodes,
  }),
)
export default class PhoneInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: this.getFieldsStateFormProps(props),
    }
  }

  getFieldsStateFormProps = (props) => {
    let phoneArr = props.value && props.value.split(' ')
    const country = phoneArr && phoneArr.splice(0, 1)[0]
    return ({
      country: country || 'US(+1)',
      phone: phoneArr && phoneArr.join(' ') || ''
    })
  }

  componentWillReceiveProps(nextProps){
		if (this.props.value != nextProps.value) {
      this.setState({
        fields: this.getFieldsStateFormProps(nextProps)
      })
    }
	}

  onFieldChange = (fieldName, value) => {
    let newStateFields = this.state.fields
    newStateFields[fieldName] = value
    this.setState({ fields: newStateFields }, () => {
      const { onChangeText } = this.props
      const { fields } = this.state
      const { country, phone } = fields
      const countryArr = country.split('(')
      onChangeText((country || '') + ' ' + (phone || ''))
    })
  }

  render() {
    const { fields } = this.state
    const { phoneProps, countryProps, countryCodes, wrapperStyle, icon, iconWrapperStyle, refName} = this.props
    const { country, phone } = fields
    if (!(countryCodes && countryCodes.response && countryCodes.response.length)) return null
    const pickerData = countryCodes.response.map(item => ({ value: item, label: item }))
    const findCountryInData = pickerData.find(dataItem => dataItem.value.indexOf(country || 'US(+1)') != -1)
    const defaultCountry = pickerData.find(dataItem => dataItem.value.indexOf('US(+1)') != -1)
    const countryInputContent = (
      <View style={[styles.countryFieldWrapper, countryProps.customFieldWrapper && countryProps.customFieldWrapper]}>
        <StdInput
          placeholder="Country"
          value={findCountryInData && findCountryInData.value || defaultCountry && defaultCountry.value}
          type="picker"
          onSubmitEditing={value => this.onFieldChange('country', value)}
          border="Right"
          data={pickerData}
          customStyle={{borderBottomWidth: 0, borderWidth: 0, width: '100%'}}
          {...countryProps}

          inputStyle={[{color: '#78787D', ...countryProps.inputStyle}, icon && {backgroundColor: 'transparent'}]} />
      </View>
    )
    return (
      <View style={[styles.wrapper, wrapperStyle && wrapperStyle]}>
        {
          icon
            ? <View style={styles.iconInputWrapper}>
                {
                  icon
                    ? <View style={[styles.phoneIconImageWrapper, iconWrapperStyle]}>
                        <Image style={styles.phoneIconImage} source={icon} />
                      </View>
                  : null
                }
                {countryInputContent}
              </View>
              : countryInputContent
        }
        <View style={[styles.phoneFieldWrapper, phoneProps.customFieldWrapper && phoneProps.customFieldWrapper]}>
          <StdInput
            refName={comp => refName && refName(comp && comp.input || comp)}
            placeholder="Mobile Phone"
            value={phone}
            keyboardType="phone-pad"
            returnKeyType={ 'done' }
            mask={"([000]) [000]-[0000]"}
            onChangeText={text => this.onFieldChange('phone', text)}
            {...phoneProps} />
        </View>
      </View>
    );
  }
}

//{
//   icon
//     ? <View style={styles.iconInputWrapper}>
//         {
//           icon
//             ? <View style={[styles.phoneIconImageWrapper, iconWrapperStyle]}>
//                 <Image style={styles.phoneIconImage} source={icon} />
//               </View>
//           : null
//         }
//         {countryInputContent}
//         <View style={styles.arrowDownIconWrapper}>
//           <Image style={styles.arrowDownIconImage} source={iconImages.arrowDownIconGrey} />
//         </View>
//       </View>
//       : countryInputContent
// }

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  countryFieldWrapper: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',

  },
  phoneIconImageWrapper: {
    height: width(5),
    width: width(5)
  },
  phoneIconImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  phoneFieldWrapper: {
    flex: 5
  },
  iconInputWrapper: {
    flexDirection: 'row',
    flex:3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  arrowDownIconWrapper: {
    height: width(2),
    width: width(3),
    position: 'absolute',
    right: width(3),
    top: width(6)
  },
  arrowDownIconImage: {
    height: '100%',
    width: '100%'
  }
})
