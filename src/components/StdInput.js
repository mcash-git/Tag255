import React, { Component } from 'react';
import { View, TextInput, Text, StyleSheet, Image, TouchableOpacity, Switch, Platform } from 'react-native'
import TextInputMask from 'react-native-text-input-mask';
import { Select, Option } from 'react-native-dropdown'
import SelectInput from 'react-native-select-input-ios'

import { width, height, iconImages, alphabet, overlay } from 'constants/config'

import Sep from './Sep'

export default class StdInput extends Component {
  getBorderStyle = (border) => {
    const borderCapitalize = border.charAt(0).toUpperCase() + border.slice(1)
    return ({
      ['border' + borderCapitalize + 'Width']: 1,
      ['border' + borderCapitalize + 'Color']: 'white',
      borderStyle: 'solid',
    })
  }

  renderContent = () => {
    const { dorpDownKey, optionSelectStyle, textSelectStyle, mask, type, data,
      keyExtractor, textExtractor, inputStyle, width, refName, customStyle, value, label, onChange, color } = this.props
    const InputComp = mask
      ? TextInputMask
      : TextInput
    switch (type) {
      case 'dropdown':
        return (
          <Select
            {...this.props}
            width={width}
            ref={refName}
            style={[styles.select, customStyle && customStyle]}
            styleOption={[styles.optionInSelect, optionSelectStyle && optionSelectStyle]}
            styleText={[styles.dropDownText, textSelectStyle && textSelectStyle]}>
            {
              data && data.map((dataObj, idx) => <Option key={keyExtractor(dataObj, idx)}>{textExtractor(dataObj)}</Option>)
            }
          </Select>
        )
      case 'text':
        return (
          <InputComp
            {...this.props}
            textAlignVertical="center"
            underlineColorAndroid="transparent"
            style={[styles.input, inputStyle && inputStyle, {backgroundColor: 'transparent'}]} />
        )
      case 'picker':
        return (
          <SelectInput
            {...this.props}
            options={this.props.data}
            labelStyle={[{backgroundColor: 'transparent'}, inputStyle && inputStyle]}
            style={[styles.picker, {backgroundColor: 'transparent'}, customStyle && customStyle]}/>
        )
      case 'btn':
        return (
          <View style={styles.btnWrapper}>
            <TouchableOpacity onPress={onChange}>
              <View style={styles.btnInner}>
                <Text style={[styles.btnText, inputStyle && inputStyle]}>
                  {label}
                </Text>
                <View style={styles.arrowDownIconImageWrapper}>
                  <Image style={styles.arrowDownIconImage} source={iconImages.arrowDownIconGrey} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )
      case 'radio':
        return (
          <View style={styles.radioInputWrapper}>
            <TouchableOpacity onPress={onChange}>
              <View style={styles.radioInputInner}>
                <View style={styles.radionBtnImageWrapper}>
                  <Image style={styles.radioBtnImage} source={
                    value
                      ? iconImages.radioInputBtnIconChecked
                      : iconImages.radioInputBtnIcon
                  } />
                </View>
                <Text style={[styles.radioInputText, inputStyle && inputStyle]}>
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )
      case 'splited':
        return (
          <InputComp
            {...this.props}
            textAlignVertical="center"
            color={color}
            underlineColorAndroid="transparent"
            style={[styles.input, inputStyle && inputStyle]} />
        )
      case 'splited-switch':
        return (
          <Text style={[styles.labelText, inputStyle && inputStyle]}>
            {label}
          </Text>
        )
      case 'splited-icons':
        return (
          <Text style={[styles.labelTextWhite, inputStyle && inputStyle]}>
            {label}
          </Text>
        )
      default:
        return (
          <InputComp
            {...this.props}
            textAlignVertical="center"
            color={color}
            onBlur={
              mask
                ? () => {
                  this.props.onSubmitEditing
                }
                : this.props.onBlur
            }
            ref={
              refName && typeof refName == 'function'
                ? comp => refName(comp)
                : refName
              }
            underlineColorAndroid="transparent"
            style={[styles.input, inputStyle && inputStyle]} />
        )
    }
  }

  render() {
    const { wrapperStyle, inputStyle, redDot, border, type, underLine, mask, optionListRef, refName, innerStyle, iconStyle, label,
      labelWrapperStyle, leftIconSource, rightIconSource, rightIconStyle, onPress, returnKeyLabel } = this.props
    return (
      <View style={[styles.wrapper, border && this.getBorderStyle(border), wrapperStyle && wrapperStyle]}>
        <View style={[styles.inner, innerStyle && innerStyle, type == 'splited-icons' && styles.splitedIconsInner]}>
          {
            type == 'splited-icons'
              ? <TouchableOpacity onPress={onPress}>
                  <View style={{flexDirection: 'row', alignItems: 'center',justifyContent: 'center'}}>
                    <View style={styles.leftIconImageWrapper}>
                      <View style={styles.leftIconImageInner}>
                        <Image source={leftIconSource} style={styles.leftIconImage} />
                      </View>
                    </View>
                    {this.renderContent()}
                  </View>
                </TouchableOpacity>
              : null
          }
          {
            type == 'splited'
              ? <View style={[overlay, styles.labelWrapper, labelWrapperStyle && labelWrapperStyle]}>
                  <View style={styles.labelInner}>
                    <Text style={styles.labelText}>
                      {label}
                    </Text>
                  </View>
                </View>
              : null
          }
          {
            type == 'picker'

              ? <View style={[styles.arrowIconWrapper, iconStyle && iconStyle]}>
                  <View style={styles.arrowIconInner}>
                    <Image source={iconImages.arrowDownIconWhite} style={styles.arrowIconImage} />
                  </View>
                </View>
              : null
          }
          {type != 'splited-icons' && this.renderContent()}
          {
            redDot
              ? <Text style={styles.redDotText}>*</Text>
              : null
          }
          {
            type == 'dropdown'
              ? <TouchableOpacity onPress={() => this.refs[refName] && this.refs[refName].show()}>
                  <View style={styles.arrowIconWrapper}>
                    <Image source={iconImages.arrowDownIconGrey} style={styles.arrowIconImage} />
                  </View>
                </TouchableOpacity>
              : null
          }
          {
            rightIconSource
              ? type == 'splited-icons' && onPress
                  ? <TouchableOpacity onPress={onPress}>
                      <View style={[styles.arrowRightIconWrapper, rightIconStyle && rightIconStyle]}>
                        <Image source={rightIconSource} style={styles.arrowRightIconImage} />
                      </View>
                    </TouchableOpacity>
                  : <View style={[styles.arrowRightIconWrapper, rightIconStyle && rightIconStyle]}>
                      <Image source={rightIconSource} style={styles.arrowRightIconImage} />
                    </View>
              : null
          }
          {
            type == 'splited-switch'
              ? <View style={[styles.switchWrapper]}>
                  <View style={styles.switchInner}>
                    <Switch {...this.props} thumbTintColor="white" onTintColor="#A3CCE1" />
                  </View>
                </View>
              : null
          }
        </View>
        {
          underLine
            ? <Sep />
            : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: width(1),
    justifyContent: 'center',
    flex: 1,
  },
  inner: {
    marginVertical: width(0.2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    fontSize: width(3.8),
    marginVertical: width(0.8),
    marginBottom: width(1),
    flex: 1
  },
  redDotText: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: 'red',
    fontSize: width(3)
  },
  underline: {
    backgroundColor: '#FDFDFD',
    height: 1,
    width: '100%'
  },
  arrowIconWrapper: {
    height: '100%',
    width: width(4),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: '8%'
  },
  arrowIconInner: {
    height: width(2),
    width: width(3.5),
  },
  arrowIconImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  select: {
    flex: 1,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    flexWrap: 'wrap',
    paddingBottom: 0,
  },
  picker: {
    paddingBottom: 0,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    width: '100%',
    height: '100%'
  },
  optionInSelect: {
    paddingLeft: 0,
    backgroundColor: 'transparent',
    borderWidth: 0
  },
  dropDownText: {
    fontSize: width(3.6),
  },
  radioInputWrapper: {
    width: '100%',
    height: '100%'
  },
  radioInputInner: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  radionBtnImageWrapper: {
    height: width(5),
    width: width(5)
  },
  radioBtnImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  radioInputText: {
    fontSize: width(3.6),
    color: '#9A9BA0',
    lineHeight: width(6),
    marginLeft: width(8)
  },
  btnWrapper: {
    height: '100%',
    width: '100%'
  },
  btnInner: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  btnText: {
    fontSize: width(3.8),
    color: '#8C96AE'
  },
  arrowDownIconImageWrapper: {
    height: width(2.2),
    width: width(4.6)
  },
  arrowDownIconImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  labelWrapper: {
    width: 'auto',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  labelText: {
    fontSize: width(3.2),
    color: 'white',
    opacity: 0.8
  },
  labelTextWhite: {
    fontSize: width(3.2),
    color: 'white',
    opacity: 0.9
  },
  switchWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: width(12)
  },
  switchInner: {

  },
  leftIconImageWrapper: {
    width: width(30),
    height: '100%'
  },
  leftIconImageInner: {
    height: width(4.6),
    width: width(4.6),
    opacity: 0.8,
  },
  leftIconImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  arrowRightIconWrapper: {
    height: width(4),
    width: width(3),
    alignSelf: 'flex-end'
  },
  arrowRightIconImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  splitedIconsInner: {
    marginHorizontal: width(2)
  }
})
