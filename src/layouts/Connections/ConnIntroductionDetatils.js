import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, FlatList } from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'

import { width, height, iconImages, getBackgroundImageByType, getColorByType, dayNames, monthNames, monthNamesFull } from 'constants/config'
import { connectWithNavigationIsFocused } from 'utils'

import * as ApiUtils from 'actions/utils'

import NavBar from 'components/NavBar'
import StdInput from 'components/StdInput'
import Sep from 'components/Sep'
import SmallRoundBtn from 'components/SmallRoundBtn'
import MessageItem from 'components/MessageItem'

@connect(
  state => ({
    makeIntroductionData: state.makeIntroductionData,
    routes: state.routes,
    userData: state.userData
  }),
  dispatch => ({
    setMakeIntroductionData: (data) => {
      dispatch(ApiUtils.setMakeIntroductionData(data))
    },
    addNewMessage: (data) => {
      dispatch(ApiUtils.addNewMessage(data))
    },
  })
)
export default class ConnIntroductionDetatils extends Component {
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
        : 'Save Message to Library',
      onPress: () => this.saveToLibrary(item.detailsData.message)
    }
    return <MessageItem 
      item={item} 
      button={button}
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
        text: 'Introduction',
      },
    }
    const mateUserModel = userData.userModel.user_uid == detailsData.userId1 || (detailsData.user1 && (userData.userModel.mobilePhone == detailsData.user1.phone || userData.userModel.user == detailsData.user1.phone))
      ? detailsData.user2
      : detailsData.user1
    const itemMoment = moment.unix(detailsData.date)
    const itemTime = itemMoment.format('hh:mm a')
    const messageData = [
      {
        key: '1',
        nameBy: detailsData.userBy && (detailsData.userBy.firstName + ' ' + detailsData.userBy.lastName),
        middleText: 'said:',
        message: detailsData.message,
        dateText: dayNames[itemMoment.isoWeekday() - 1] + ', ' + monthNames[itemMoment.month()] + ' ' + itemMoment.date() + 'th ' + itemTime,
        detailsData: detailsData,
        avatar: detailsData.userBy.avatar
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
                    <Image resizeMethod="scale" source={userData.userModel.avatar && {uri: userData.userModel.avatar} || iconImages.avatarPlaceholder} style={styles.avatarImage} />
                  </View>
                  <Text style={styles.personName}>
                    You
                  </Text>
                </View>
                <View style={styles.personItem}>
                  <View style={styles.avatarImageWrapper}>
                    <Image resizeMethod="scale" resizeMethod="scale" source={mateUserModel && mateUserModel.avatar && {uri: mateUserModel.avatar} || iconImages.avatarPlaceholder} style={styles.avatarImage} />
                  </View>
                  <Text style={styles.personName}>
                    {mateUserModel && (mateUserModel.fName + ' ' + mateUserModel.sName)}
                  </Text>
                </View>
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
    height: width(66)
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
    paddingTop: width(2)
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    overflow: 'hidden'
  },
  avatarImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover'
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
    fontSize: width(2)
  },
  invitationBtnWrapper: {

  },
  invitationBtnInner: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width(100),
    height: width(12),
    backgroundColor: 'rgba(255,255,255,0.4)'
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