import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, FlatList, Linking, Platform, Alert } from 'react-native'
import moment from 'moment'
import Permissions from 'react-native-permissions'
import Contacts from 'react-native-contacts'

import { width, height, iconImages, getBackgroundImageByType, getColorByType, isIphoneX, monthNamesFull, dayNames, monthNames } from 'constants/config'
import { cleanPhoneNumb, getAuthHeader, checkNextProps, fullCleanPhone } from 'utils'

import * as ApiUtils from 'actions/utils'

import NavBar from 'components/NavBar'
import StdInput from 'components/StdInput'
import Sep from 'components/Sep'
import SmallRoundBtn from 'components/SmallRoundBtn'
import MessageItem from 'components/MessageItem'

@connectWithNavigationIsFocused(
  state => ({
    makeIntroductionData: state.makeIntroductionData,
    routes: state.routes,
    userData: state.userData,
    countryCodes: state.countryCodes
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
export default class Send extends Component {
  constructor(props) {
    super(props);
    const fields = {
      message: '',
    }
    this.state = {
      fields,
      messageIsSaved: false
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


  onFieldChange = (fieldName, value) => {
    let newStateFields = this.state.fields
    newStateFields[fieldName] = value
    this.setState({fields: newStateFields})
  }

  onAddAvatarPress = () => {

  }

  _keyExtractor = (item, index) => item.key;

  saveToLibrary = (message) => {
    const { addNewMessage } = this.props
    this.setState({messageIsSaved: true}, () => addNewMessage(message))
  }

  renderItem = ({ item, index }) => {
    const { navigation } = this.props
    const { messageIsSaved } = this.state
    const detailsData = navigation.state && navigation.state.params && navigation.state.params.detailsData
    const button = {
      text: messageIsSaved
        ? 'Saved'
        : 'Save Message to Library',
      onPress: () => this.saveToLibrary(detailsData.message)
    }
    const messageButton = {
      onPress: () => navigation.navigate('ConnIntroductionDetatils', {detailsData}),
      text: 'View Introduction'
    }
    return <MessageItem
      item={item}
      button={button}
      messageButton={messageButton}
      idx={index} />
  }

  onAddToContactsPress = (detailsData) => {
    const { userData, contacts } = this.props
    const mateUserModel = userData.userModel.user_uid == detailsData.userId1 || (detailsData.user1 && (userData.userModel.mobilePhone == detailsData.user1.phone || userData.userModel.user == detailsData.user1.phone))
      ? detailsData.user2
      : detailsData.user1
    const cleanedPhone = mateUserModel && cleanPhoneNumb(mateUserModel.phone)
    const findExistingPhoneIncontacts = contacts && mateUserModel && contacts.data.find(item => item && item.cleanedPhone && item.cleanedPhone == cleanedPhone)
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

  onEmailPress = (detailsData) => {
    console.log(detailsData)
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

  onMessagePress = (detailsData) => {
    const { navigation } = this.props
    navigation.navigate('ConnSelectAndEditMsg', {detailsData})
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
      navigation.navigate('MakeIntroductions', {prevScreen: 'Connections'})
    }
  }

  render() {
    const { navigation, userData } = this.props
    const detailsData = navigation.state && navigation.state.params && navigation.state.params.detailsData
    const { fields } = this.state
    const { message } = fields
    const navBarProps = {
      leftPart: {
        image: iconImages.navBarBackIconWhite,
        action: () => navigation.goBack()
      },
      centerPart: {
        text: 'My Connections',
        fontSize: width(4.2),
        subText: 'People you have been introduced to'
      },
    }
    const itemMoment = moment.unix(detailsData.date)
    const itemTime = itemMoment.format('hh:mm a')
    const messageData = [
      {
        key: 1,
        nameBy: detailsData.userBy && (detailsData.userBy.firstName + ' ' + detailsData.userBy.lastName),
        middleText: 'made an ',
        lastTest: 'introduction',
        message: detailsData.message || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
        dateText: dayNames[itemMoment.isoWeekday() - 1] + ', ' + monthNames[itemMoment.month()] + ' ' + itemMoment.date() + 'th ' + itemTime,
        avatar: detailsData.userBy && detailsData.userBy.avatar
      }
    ]
    const mateUserModel = userData.userModel.user_uid == detailsData.userId1 || (detailsData.user1 && (userData.userModel.mobilePhone == detailsData.user1.phone || userData.userModel.user == detailsData.user1.phone))
      ? detailsData.user2
      : detailsData.user1
    return (
      <View style={styles.wrapper}>
        <View style={styles.topPartWrapper}>
          <ImageBackground source={getBackgroundImageByType(detailsData.relationType)} style={styles.topPart}>
            <NavBar {...navBarProps} statusBarBackgroundColor={getColorByType(detailsData.relationType)} transparent navigation={navigation} />
            <View style={styles.topPartContent}>
              <View style={styles.row}>
                <View style={styles.roundBtnWrapper}>
                  <SmallRoundBtn
                    backgroundColor="#F6F6F6"
                    icon={iconImages.connectionsPlusIconGreen}
                    customWidth={width(9)}
                    customIconStyle={{width: width(3.2), height: width(3.2)}}
                    onPress={() => this.onAddToContactsPress(detailsData)} />
                  <Text style={styles.roundBtnText}>
                    Add to Contacts
                  </Text>
                </View>
                <View style={styles.avatarImageWrapper}>
                  <Image resizeMethod="scale" source={mateUserModel && mateUserModel.avatar && {uri: mateUserModel.avatar} || iconImages.avatarPlaceholder} style={styles.avatarImage} />
                </View>
                <View style={styles.roundBtnWrapper}>
                  <SmallRoundBtn
                    backgroundColor="#F6F6F6"
                    icon={iconImages.connectionsNextIconGreen}
                    customWidth={width(9)}
                    customIconStyle={{width: width(4.2), height: width(4.2)}}
                    onPress={() => this.onIntroducePress(detailsData)} />
                  <Text style={styles.roundBtnText}>
                    Introduce {mateUserModel && mateUserModel.fName}
                  </Text>
                </View>
              </View>
              <View style={styles.infoWrapper}>
                <Text style={styles.nameText}>
                  {mateUserModel && (mateUserModel.fName + ' ' + mateUserModel.sName)}
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.content}>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionItem} onPress={() => this.onEmailPress(detailsData)}>
              <View style={styles.actionIconImageWrapper}>
                <Image style={styles.actionIconImage} source={iconImages.connectionMailIconGrey} />
              </View>
              <Text style={styles.actionText}>
                Email {mateUserModel && mateUserModel.fName}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={() => this.onTextPress(detailsData)}>
              <View style={styles.actionIconImageWrapper}>
                <Image style={styles.actionIconImage} source={iconImages.connectionNoteIconGrey} />
              </View>
              <Text style={styles.actionText}>
                Text {mateUserModel && mateUserModel.fName}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={() => this.onMessagePress(detailsData)}>
              <View style={styles.actionIconImageWrapper}>
                <Image style={styles.actionIconImage} source={iconImages.connectionMessageIconGrey} />
              </View>
              <Text style={styles.actionText}>
                Message {mateUserModel && mateUserModel.fName}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.messagingWrapper}>
            <View style={styles.bottomPartTitleWrapper}>
              <Text style={styles.bottomPartTitleText}>
                BETWEEN {mateUserModel && mateUserModel.fName.toUpperCase()} AND YOU
              </Text>
              <Sep />
            </View>
            <View style={styles.listWrapper}>
              <FlatList
                data={messageData}
                extraData={this.state}
                keyExtractor={this._keyExtractor}
                renderItem={this.renderItem}/>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

// <View style={styles.socialIconsWrapper}>
//                   <TouchableOpacity>
//                     <View style={styles.socialIconWrapper}>
//                       <Image style={styles.socialIconImage} source={iconImages.linkedinIconWhite} />
//                     </View>
//                   </TouchableOpacity>
//                   <TouchableOpacity>
//                     <View style={styles.socialIconWrapper}>
//                       <Image style={styles.socialIconImage} source={iconImages.twitterIconWhite} />
//                     </View>
//                   </TouchableOpacity>
//                   <TouchableOpacity>
//                     <View style={styles.socialIconWrapper}>
//                       <Image style={styles.socialIconImage} source={iconImages.fbIconWhite} />
//                     </View>
//                   </TouchableOpacity>
//                 </View>

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'white'
  },
  topPartWrapper: {
    width: width(100),
    height: Platform.OS == 'ios'
      ? isIphoneX()
          ? width(84)
          : width(75)
      : width(60)
  },
  topPart: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  topPartContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width(100),
    paddingTop: isIphoneX()
      ? width(10)
      : 25
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundBtnWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: width(3)
  },
  roundBtnText: {
    color: 'white',
    fontSize: width(2.6),
    marginTop: width(1)
  },
  avatarImageWrapper: {
    height: width(26),
    width: width(26),
    borderRadius: width(26),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: width(4),
    borderWidth: 1,
    borderColor: 'white',
  },
  avatarImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover'
  },
  infoWrapper: {
    marginTop: isIphoneX()
      ? width(5)
      : width(2),
    alignItems: 'center',
    justifyContent: 'center'
  },
  nameText: {
    color: 'white',
    fontSize: width(4.2),
  },
  socialIconsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: width(2)
  },
  socialIconWrapper: {
    marginHorizontal: width(2),
    height: width(5),
    width: width(5)
  },
  socialIconImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  actionsRow: {
    width: width(100),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    marginTop: width(0)
  },
  actionItem: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: width(4)
  },
  actionIconImageWrapper: {
    height: width(4),
    width: width(4)
  },
  actionIconImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  actionText: {
    color: '#868686',
    fontSize: width(2.6),
    marginTop: width(2)
  },
  messagingWrapper: {
    alignItems: 'center'
  },
  bottomPartTitleWrapper: {
    width: width(90),
    justifyContent: 'center'
  },
  bottomPartTitleText: {
    marginVertical: width(4),
    color: '#868686',
    fontSize: width(3),
  },
  listWrapper: {
    width: width(90),
  }
})
