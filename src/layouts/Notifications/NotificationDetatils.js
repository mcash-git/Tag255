import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, FlatList, Linking, Platform, Alert } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import Contacts from 'react-native-contacts'
import Permissions from 'react-native-permissions'

import { width, height, iconImages, getBackgroundImageByType, getColorByType, dayNames, monthNames, monthNamesFull } from 'constants/config'
import { cleanPhoneNumb, getAuthHeader, checkNextProps, fullCleanPhone } from 'utils'

import * as ApiUtils from 'actions/utils'

import NavBar from 'components/NavBar'
import StdInput from 'components/StdInput'
import Sep from 'components/Sep'
import SmallRoundBtn from 'components/SmallRoundBtn'
import MessageItem from 'components/MessageItem'
import RoundedBtn from 'components/RoundedBtn'

@connect(
  state => ({
    savedMessages: state.savedMessages,
    userData: state.userData,
    contacts: state.contacts,
    countryCodes: state.countryCodes,
  }),
  dispatch => ({
    setMakeIntroductionData: (data) => {
      dispatch(ApiUtils.setMakeIntroductionData(data))
    },
    addNewMessage: (data) => {
      dispatch(ApiUtils.addNewMessage(data))
    },
    setContacts: (contacts) => {
      dispatch(ApiUtils.setContacts(contacts))
    },
  })
)
export default class NotificationDetatils extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageIsSaved: false
    }
  }

  saveToLibrary = () => {
    const { navigation, addNewMessage } = this.props
    const detailsData = navigation.state && navigation.state.params && navigation.state.params.detailsData
    addNewMessage(detailsData.message)
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
  }

  _keyExtractor = (item, index) => item.key;

  onEmailPress = (detailsData) => {
    const { userData } = this.props
    const mateUserModel = userData.userModel.user_uid == detailsData.userId1 || (detailsData.user1 && (userData.userModel.mobilePhone == detailsData.user1.phone || userData.userModel.user == detailsData.user1.phone))
      ? detailsData.user2
      : detailsData.user1
    const prefix = Platform.OS == 'ios'
      ? 'mailto:'
      : 'mailto:'
      mateUserModel && Linking.openURL(prefix + mateUserModel.email + '?subject=ConnectorStreet&body=')
  }

  onTextPress = (detailsData) => {
    const { userData } = this.props
    const mateUserModel = userData.userModel.user_uid == detailsData.userId1 || (detailsData.user1 && (userData.userModel.mobilePhone == detailsData.user1.phone || userData.userModel.user == detailsData.user1.phone))
      ? detailsData.user2
      : detailsData.user1
    const prefix = Platform.OS == 'ios'
      ? 'sms:'
      : 'sms:://'
      mateUserModel && Linking.openURL(prefix + mateUserModel.phone)
  }

  onMessagePress = (data) => {
    const { navigation } = this.props
    const detailsData = navigation.state && navigation.state.params && navigation.state.params.detailsData
    navigation.navigate('NotiffSelectAndEditMsg', {detailsData})
  }

  onIntroducePress = (detailsData) => {
    const { navigation, setMakeIntroductionData, userData } = this.props
    const mateUserModel = userData.userModel.user_uid == detailsData.userId1 || (detailsData.user1 && (userData.userModel.mobilePhone == detailsData.user1.phone || userData.userModel.user == detailsData.user1.phone))
      ? detailsData.user2
      : detailsData.user1
    if (mateUserModel) {
      setMakeIntroductionData({
        fPerson: mateUserModel
      })
      navigation.navigate('MakeIntroductions', {prevScreen: 'Notifications'})
    }
  }

  onAddToContactsPress = (detailsData) => {
    const { userData, contacts } = this.props
    const mateUserModel = userData.userModel.user_uid == detailsData.userId1 || (detailsData.user1 && (userData.userModel.mobilePhone == detailsData.user1.phone || userData.userModel.user == detailsData.user1.phone))
      ? detailsData.user2
      : detailsData.user1
    const cleanedPhone = mateUserModel && cleanPhoneNumb(mateUserModel.phone)
    const findExistingPhoneIncontacts = contacts && cleanedPhone && contacts.data.find(item => item && item.cleanedPhone && item.cleanedPhone == cleanedPhone)
    console.log(findExistingPhoneIncontacts)
    if (!findExistingPhoneIncontacts) {
      const newPerson = {
        emailAddresses: [{
          label: "ConnectorStreet",
          email: mateUserModel.email,
        }],
        familyName: Platform.OS == 'ios'
          ? mateUserModel.sName
          : '',
        givenName: Platform.OS == 'ios'
          ? mateUserModel.fName
          : mateUserModel.fName + ' ' + mateUserModel.sName,
        phoneNumbers: [{
          label: "mobile",
          number: cleanedPhone,
        }],
      }
      console.log('newPerson')
      console.log(newPerson)
      Permissions.check('contacts').then(response => {
        console.log(response)
        if (response == 'authorized') {
          Contacts.addContact(newPerson, (error) => {
            console.log(error)
            if (error) {
              Alert.alert('Error creating the contact', null, [
                {text: 'OK'}
              ])
            } else {
              Alert.alert('Added to contacts list')
            }
            this.getContactts()
          })
        }
      })
    }
  }

  getContactts = () => {
    const { setContacts, countryCodes } = this.props
    const countryCodesArray = countryCodes.response
    Contacts.getAll((err, contacts) => {
      if(err === 'denied') {
        // error
        // console.log(err)
      } else {
        console.log('contacts')
        console.log(contacts)
        const contactsData = contacts.map(item => {
          if (!item) return null
          console.log(item)
          return {
            fName: item.givenName && item.givenName.split(' ')[0] || '',
            sName: Platform.OS == 'ios'
              ? item.familyName || ''
              : item.givenName && item.givenName.split(' ')[1] || item.familyName || '',
            phone: item.phoneNumbers[0] && item.phoneNumbers[0].number,
            avatar: item.thumbnailPath,
            email: item.emailAddresses && item.emailAddresses[0] && item.emailAddresses[0].email
          }
        })
        if (countryCodesArray) {
          setContacts(contactsData.map(contact => {
            if (!(contact && contact.phone)) return null
            const phoneCleaned = fullCleanPhone(contact.phone)
            contact.cleanedPhone = phoneCleaned && ('+' + phoneCleaned)
            const realNumb = phoneCleaned.slice(-10).trim()
            let countryCode = '+' + phoneCleaned.replace(realNumb, '').trim()
            if (countryCode == '+') countryCode = '+1'
            if (countryCode && countryCode != '+') {
              if (countryCode == '+1') {
                countryCode = 'US(+1)'
              } else {
                countryCode = '(' + countryCode + ')'
              }
              const foundFullCountryCode = countryCodesArray.find(item => item.indexOf(countryCode) != -1 || item == countryCode)
              contact.phone = foundFullCountryCode + ' ' + realNumb
              return contact
            } else {
              return null
            }
          }).filter(item => item))
        }
      }
    })
  }

  renderItem = ({ item, index }) => {
    const { navigation, setMakeIntroductionData, addNewMessage, userData } = this.props
    const { messageIsSaved } = this.state
    const detailsData = navigation.state && navigation.state.params && navigation.state.params.detailsData
    const button = {
      text: messageIsSaved
        ? 'Saved'
        : 'Save Message to Library',
      onPress: () => this.saveToLibrary(item.message)
    }
    console.log('detailsData.user2')
    console.log(detailsData.user2)
    const mateUserModel = userData.userModel.user_uid == detailsData.userId1 || (detailsData.user1 && (userData.userModel.mobilePhone == detailsData.user1.phone || userData.userModel.user == detailsData.user1.phone))
      ? detailsData.user2
      : detailsData.user1
    const actionButtons = {
      onMailPress: () => this.onEmailPress(detailsData),
      onAddPress: () => this.onAddToContactsPress(detailsData),
      onTextPress: () => this.onTextPress(detailsData),
      onMessagePress: () => this.onMessagePress(detailsData),
      userAvatar: mateUserModel && mateUserModel.avatar
    }
    const messageButton = {
      onPress: () => this.onIntroducePress(detailsData),
      text: 'Make a New Introduction',
      innerStyle: {
        backgroundColor: '#48B1F0',
      },
      textStyle: {
        color: 'white'
      }
    }
    return <MessageItem
      item={item}
      button={item.type != 'makeIntroduction' && button}
      messageWrapperStyle={
        item.type == 'makeIntroduction'
          && {
            borderColor: '#F5F6FB',
            borderWidth: 7,
            borderRadius: width(1)
          }
      }
      messageInnerStyle={
        item.type == 'makeIntroduction'
          && {
            borderRadius: width(1),
            borderWidth: 1,
            borderColor: '#F1F2F7',
            backgroundColor: 'white'
          }
      }
      messageButton={item.type == 'makeIntroduction' && messageButton}
      actionButtons={item.type == 'makeIntroduction' && actionButtons}
      idx={index} />
  }

  saveToLibrary = (message) => {
    const { addNewMessage } = this.props
    this.setState({messageIsSaved: true}, () => addNewMessage(message))
  }

  render() {
    const { navigation, userData } = this.props
    const detailsData = navigation.state && navigation.state.params && navigation.state.params.detailsData
    const navBarProps = {
      leftPart: {
        image: iconImages.navBarBackIconWhite,
        action: () => navigation.goBack()
      },
      centerPart: {
        text: 'From ' + detailsData.userBy.firstName,
      },
    }
    const itemMoment = moment.unix(detailsData.date)
    const itemTime = itemMoment.format('hh:mm a')
    console.log(detailsData)
    const mateUserModel = userData.userModel.user_uid == detailsData.userId1 || (detailsData.user1 && (userData.userModel.mobilePhone == detailsData.user1.phone || userData.userModel.user == detailsData.user1.phone))
      ? detailsData.user2
      : detailsData.user1
    console.log(detailsData)
    const messageData = [
      {
        nameBy: detailsData.userBy.firstName + ' ' + detailsData.userBy.lastName,
        name: userData.userModel.firstName + ' ' + userData.userModel.lastName,
        message: detailsData.message || 'Thanks for the introduction! It is much appreciated. I look forward to connecting with John.',
        dateText: dayNames[itemMoment.isoWeekday() - 1] + ', ' + monthNames[itemMoment.month()] + ' ' + itemMoment.date() + 'th ' + itemTime,
        fNameSecond: mateUserModel && mateUserModel.fName,
        sNameSecond: mateUserModel && mateUserModel.sName,
        type: detailsData.type,
        relationType: detailsData.relationType,
        detailsData: detailsData,
        avatar: detailsData.userBy.avatar
      }
    ]
    console.log('userData.userModel.user_uid')
    console.log(userData.userModel.user_uid)
    console.log(detailsData)
    return (
      <View style={styles.wrapper}>
        <NavBar {...navBarProps} navigation={navigation} />
        <View style={styles.content}>
          <View style={styles.listWrapper}>
            <FlatList
              data={messageData}
              contentContainerStyle={styles.listContentContainerStyle}
              style={styles.listInner}
              extraData={this.state}
              keyExtractor={this._keyExtractor}
              renderItem={this.renderItem}/>
          </View>
          <View style={styles.roundBtnWrapper}>
            <RoundedBtn
              innerStyle={{
                height: width(8),
                width: width(80),
                borderRadius: width(8),
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: '#BABCBE'
              }}
              textStyle={{
                color: '#7F8082',
                marginTop: 0,
                fontSize: width(2.8)
              }}
              onPress={() => this.saveToLibrary(detailsData.message)}
              backgroundColor="transparent"
              text="Save Message To Library" />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'white'
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  listWrapper: {
    flex: 1,
  },
  listInner: {
    width: width(100)
  },
  listContentContainerStyle: {
    width: width(90),
    alignSelf: 'center'
  },
  roundBtnWrapper: {
    paddingVertical: width(2),
    alignItems: 'center',
    justifyContent: 'center'
  }
})
