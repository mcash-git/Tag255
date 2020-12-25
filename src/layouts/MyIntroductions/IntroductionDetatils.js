import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, FlatList, Platform } from 'react-native'
import { NavigationActions } from 'react-navigation';
import moment from 'moment'

import { width, height, iconImages, getBackgroundImageByType, getColorByType, isIphoneX, dayNames, monthNames, monthNamesFull } from 'constants/config'

import * as ApiUtils from 'actions/utils'

import NavBar from 'components/NavBar'
import StdInput from 'components/StdInput'
import Sep from 'components/Sep'
import SmallRoundBtn from 'components/SmallRoundBtn'
import MessageItem from 'components/MessageItem'

@connectWithNavigationIsFocused(
  state => ({

  }),
  dispatch => ({
    addNewMessage: (data) => {
      dispatch(ApiUtils.addNewMessage(data))
    },
    setMakeIntroductionData: (data) => {
      dispatch(ApiUtils.setMakeIntroductionData(data))
    },
  })
)
export default class IntroductionDetatils extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageIsSaved: false
    }
  }

  _keyExtractor = (item, index) => item.key;

  renderItem = ({item, index}) => {
    const { messageIsSaved } = this.state
    const button = {
      text: messageIsSaved
        ? 'Saved'
        : 'Save message to library',
      onPress: () => this.saveToLibrary(item.message)
    }
    return <MessageItem
      item={item}
      button={button}
      idx={index} />
  }

  saveToLibrary = (message) => {
    const { addNewMessage } = this.props
    console.log('messageIsSaved')
    this.setState({messageIsSaved: true}, () => addNewMessage(message))
  }

  onPressViewIntroduction = () => {
    const { navigation, setMakeIntroductionData } = this.props
    const detailsData = navigation.state && navigation.state.params && navigation.state.params.detailsData
    console.log(this.props)
    console.log(detailsData)
    const { user1, user2, message, relationType } = detailsData
    const bothPersonsValid = Object.keys(user1).length && Object.keys(user2).length
    if (bothPersonsValid) {
      setMakeIntroductionData({
        fPerson: user1,
        sPerson: user2,
        otherData: {
          relationType: relationType,
          message: message
        }
      })
      const navigateAction = NavigationActions.navigate({
        routeName: 'Main',
        action: NavigationActions.navigate({
          routeName: 'MakeIntroductions',
          action: NavigationActions.navigate({ routeName: 'SelectAndEditMsg' }),
          params: { prevScreen: 'IntroductionDetatils' }
        })
      })
      navigation.dispatch(navigateAction)
    }
  }

  render() {
    const { navigation } = this.props
    const detailsData = navigation.state && navigation.state.params && navigation.state.params.detailsData
    const navBarProps = {
      leftPart: {
        image: iconImages.navBarBackIconWhite,
        action: () => navigation.goBack()
      },
      centerPart: {
        text: 'My Introduction',
        fontSize: width(4.2),
        subText: 'People you have introduced'
      },
    }
    const itemMoment = moment.unix(detailsData.date)
    const itemTime = itemMoment.format('hh:mm a')
    const messageData = [
      {
        key: 1,
        nameBy: 'You',
        avatar: detailsData.ownerAvatar,
        middleText: 'introduced ' + detailsData.user1.fName + ' & ' + detailsData.user2.fName,
        message: detailsData.message || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
        dateText: dayNames[itemMoment.isoWeekday() - 1] + ', ' + monthNames[itemMoment.month()] + ' ' + itemMoment.date() + 'th ' + itemTime
      }
    ]
    return (
      <View style={styles.wrapper}>
        <View style={styles.topPartWrapper}>
          <ImageBackground source={getBackgroundImageByType(detailsData.relationType)} style={styles.topPart}>
            <NavBar {...navBarProps} statusBarBackgroundColor={getColorByType(detailsData.relationType)} transparent navigation={navigation} />
            <View style={styles.topPartContent}>
              <View style={styles.row}>
                <View style={styles.middleComp}>
                  <View style={styles.lineImageWrapper}>
                    <Image style={styles.lineImage} source={iconImages.introductionLineImage} />
                  </View>
                  <View style={styles.middleCompOverlay}>
                    <View style={styles.roundView}>
                      <Text style={styles.roundViewText}>
                        TO
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.personItem}>
                  <View style={styles.avatarImageWrapper}>
                    <Image resizeMethod="scale" source={detailsData.user1 && detailsData.user1.avatar && {uri: detailsData.user1.avatar} || iconImages.avatarPlaceholder} style={styles.avatarImage} />
                  </View>
                  <Text style={styles.personName}>
                    {detailsData.user1.fName + ' ' + detailsData.user1.sName}
                  </Text>
                </View>
                <View style={styles.personItem}>
                  <View style={styles.avatarImageWrapper}>
                    <Image resizeMethod="scale" source={detailsData.user2 && detailsData.user2.avatar && {uri: detailsData.user2.avatar} || iconImages.avatarPlaceholder} style={styles.avatarImage} />
                  </View>
                  <Text style={styles.personName}>
                  {detailsData.user2.fName + ' ' + detailsData.user2.sName}
                  </Text>
                </View>
              </View>
              <View style={styles.invitationBtnWrapper}>
                <TouchableOpacity onPress={this.onPressViewIntroduction}>
                  <View style={styles.invitationBtnInner}>
                    <Text style={styles.invitationBtnText}>
                      View Introduction
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.content}>
          <View style={styles.listWrapper}>
            <FlatList
              data={messageData}
              extraData={this.state}
              keyExtractor={this._keyExtractor}
              renderItem={this.renderItem}/>
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
  topPartWrapper: {
    width: width(100),
    height: Platform.OS == 'ios'
      ? isIphoneX()
          ? width(95)
          : width(80)
      : width(66)
  },
  topPart: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  topPartContent: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width(100),
    flex: 1,
    paddingTop: isIphoneX()
      ? width(10)
      : width(2)
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: width(2.5)
  },
  personItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  personName: {
    marginTop: width(2.2),
    color: 'white',
    fontSize: width(4),
  },
  avatarImageWrapper: {
    height: width(25),
    width: width(25),
    borderRadius: width(25),
    overflow: 'hidden',
    marginHorizontal: width(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  avatarImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  middleComp: {
    width: width(90),
    height: width(27),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  middleCompOverlay: {
    width: width(90),
    height: width(27),
    position: 'absolute',
    left: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineImageWrapper: {
    width: width(70),
    height: 3,
  },
  lineImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  roundView: {
    height: width(7),
    width: width(7),
    borderRadius: width(7),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  roundViewText: {
    color: '#4CD0D9',
    fontSize: width(2.5),
    fontWeight: 'bold'
  },
  invitationBtnWrapper: {

  },
  invitationBtnInner: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width(100),
    height: width(12),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  invitationBtnText: {
    color: 'white',
    fontSize: width(4.2),
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  listWrapper: {
    flex: 1,
    width: width(90),
  }
})
