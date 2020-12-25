import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SectionList, Alert } from 'react-native'
import BusyIndicator from 'react-native-busy-indicator'
import moment from 'moment'

import { width, height, iconImages, alphabet, dayNames, monthNames } from 'constants/config'
import { connectWithNavigationIsFocused } from 'utils'

import NavBar from 'components/NavBar'
import Sep from 'components/Sep'
import RelationHeader from 'components/RelationHeader'
import RelationItem from 'components/RelationItem'

import * as ApiUtils from 'actions/utils'

const fakeData = [
  {
    date: '123123',
    title: 'TUESDAY, JAN 9',
    data: [
      {
        key: '1',
        time: '3:12',
        midnight: 'pm',
        fName: 'From',
        sName: 'name',
        relationType: 'Social',
        text: 'Lorem ipsum dolor sit amet, consecte…',
        notificationData: {
          key: '1',
          name: 'Maurice Davidson',
          message: 'Thanks for the introduction! It is much appreciated. I look forward to connecting with John. ',
          dateText: 'Tuesday, Jan 9th 2:01 pm'
        }
      },
      {
        key: '2',
        time: '3:12',
        midnight: 'pm',
        fName: 'From',
        sName: 'name',
        relationType: 'Business',
        text: 'Lorem ipsum dolor sit amet, consecte…',
        notificationData: {
          key: '2',
          name: 'Maurice Davidson',
          message: 'Thanks for the introduction! It is much appreciated. I look forward to connecting with John. ',
          dateText: 'Tuesday, Jan 9th 2:01 pm',
          fNameSecond: 'Lilian',
          sNameSecond: 'Mathis'
        }
      },
    ]
  },
  {
    date: '123123',
    title: 'SATURDAY, JAN 6',
    data: [
      {
        key: '1',
        time: '3:12',
        midnight: 'pm',
        fName: 'From',
        sName: 'name',
        relationType: 'Social',
        text: 'Lorem ipsum dolor sit amet, consecte…',
        notificationData: {
          key: '1',
          name: 'Maurice Davidson',
          message: 'Thanks for the introduction! It is much appreciated. I look forward to connecting with John. ',
          dateText: 'Tuesday, Jan 9th 2:01 pm'
        }
      },
      {
        key: '2',
        time: '3:12',
        midnight: 'pm',
        fName: 'From',
        sName: 'name',
        relationType: 'Business',
        text: 'Lorem ipsum dolor sit amet, consecte…',
        notificationData: {
          key: '2',
          name: 'Maurice Davidson',
          message: 'Thanks for the introduction! It is much appreciated. I look forward to connecting with John. ',
          dateText: 'Tuesday, Jan 9th 2:01 pm',
          fNameSecond: 'Lilian',
          sNameSecond: 'Mathis'
        }
      },
    ]
  },
]

@connectWithNavigationIsFocused(
  state => ({
    userData: state.userData,
    getNotifications: state.getNotifications,
    watchedNotifications: state.watchedNotifications
  }),
  dispatch => ({
    addWatchedNotificationIds: (data) => {
			dispatch(ApiUtils.addWatchedNotificationIds(data))
		},
  })
)
export default class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      date: []
    }
  }

  componentDidMount() {
    const { addWatchedNotificationIds, watchedNotifications, getNotifications } = this.props
    if (getNotifications.response) {
      addWatchedNotificationIds(getNotifications.response.filter(notif => watchedNotifications.data.indexOf(notif.id) == -1).map(notif => notif.id))
    }
  }

  
  componentWillMount() {
    const { userData, getNotifications } = this.props
    const data = this.props.getNotifications.response
    let dataGroupedByDay = []
    console.log('data')
    console.log(data)
    data.forEach(item => {
      const dateDay = Math.floor(item.date / (86400))
      const itemMoment = moment.unix(item.date)
      const itemTime = itemMoment.format('hh:mm a')
      console.log('item.userBy')
      console.log(item.userBy)
      let itemObj;
      console.log(item.type)
      switch (item.type) {
      	case 'message':
	      	itemObj = {
		        key: item.id,
		        time: itemTime.split(' ')[0],
		        midnight: itemTime.split(' ')[1],
		        topText: item.userBy.firstName + ' ' + item.userBy.lastName,
		        relationType: item.relationType,
		        avatar: item.userBy.avatar,
		        text: item.message || 'Test message',
		        fullDetails: item,
		        userIdFrom: item.userIdBy,
		        userIdTo: item.userIdTo,
			   }
         break
  		case 'makeIntroduction':
  			itemObj = {
		        key: item.id,
		        time: itemTime.split(' ')[0],
		        midnight: itemTime.split(' ')[1],
		        topText: item.userBy.firstName + ' ' + item.userBy.lastName,
		        relationType: item.relationType,
		        avatar: item.userBy.avatar,
		        text: item.message || 'Test message',
		        fullDetails: {
		          ...item,
		          fNameSecond: item.user2.fName,
		          sNameSecond: item.user2.sName
		        },
		        userIdFrom: item.userIdBy,
		        userIdTo: item.userIdTo,
			   }
         break
      }
      const findIndexOfDataByDateDay = dataGroupedByDay.findIndex(item => item.dateDay == dateDay)
      if (dataGroupedByDay.findIndex(item => item.dateDay == dateDay) == -1) {
        dataGroupedByDay.push(
          {
            title: dayNames[itemMoment.isoWeekday() - 1].toUpperCase() + ' ' + monthNames[itemMoment.month()].toUpperCase() + ' ' + itemMoment.date(),
            data: [itemObj],
            date: item.date,
            dateDay: dateDay
          }
        )
      } else {
        dataGroupedByDay[findIndexOfDataByDateDay].data.push(itemObj)
      }
    })
    console.log(dataGroupedByDay)
    this.setState({
      isLoading: false,
      data: dataGroupedByDay
    })
  }
  

  _keyExtractor = (item, index) => item.key;

  renderItem = ({item, index}) => {
    const { navigation } = this.props
    return <RelationItem type="onePerson" onPress={() => navigation.navigate('NotificationDetatils', {detailsData: item.fullDetails})} key={item.key} item={item} idx={index} />
  }

  renderSectionHeader = ({section}) => {
    return <RelationHeader item={section} />
  }

  render() {
    const { navigation } = this.props
    const { isLoading, data } = this.state
    const navBarProps = {
      leftPart: {
        image: iconImages.navBarCrossIconWhite,
        action: () => navigation.navigate('HomeStack')
      },
      centerPart: {
        text: 'My Notifications',
        fontSize: width(4.2),
        subText: 'People you have been introduced to'
      },
    }
    return (
      <View style={styles.wrapper}>
        <NavBar {...navBarProps} navigation={navigation} />
        <View style={styles.content}>
          {
            data && data.length 
              ? <SectionList
                  sections={data}
                  renderSectionHeader={this.renderSectionHeader}
                  keyExtractor={this._keyExtractor}
                  initialNumToRender={50}
                  removeClippedSubviews={true}
                  renderItem={this.renderItem}/>
              : <Text style={styles.noData}>
                  You do not have any notifications
                </Text>  
          } 
        </View>  
        <BusyIndicator isVisible={isLoading} overlayColor="rgba(0,0,0,0.4)" overlayWidth={60} overlayHeight={60} size="small"/>
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

  titleWrapper: {
    borderLeftWidth: 4,
    borderLeftColor: '#E1E1E2',
    backgroundColor: '#F8F8F8',
    width: width(100)
  },
  titleInner: {
    marginVertical: width(5),
    marginLeft: width(6)
  },
  titleText: {
    fontSize: width(3),
    color: '#A4A4A7'
  },


  itemWrapper: {
    width: width(100)
  },
  itemInner: {
    marginVertical: width(5),
    marginHorizontal: width(6),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  timeWrapper: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  hoursText: {
    fontSize: width(3),
    color: 'black',
    textAlign: 'center'
  },
  mdText: {
    fontSize: width(2.8),
    color: '#A2A2A5',
    textAlign: 'center'
  },
  infoWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarWrapper: {
    height: width(15),
    width: width(15)
  },
  avatarImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover'
  },
  textsWrapper: {
    marginLeft: width(6)
  },
  nameText: {
    fontSize: width(3.8),
    color: 'black',
  },
  infoText: {
    fontSize: width(3),
    color: '#A2A2A5',
    marginTop: width(0.4)
  },
  nextIconWrapper: {
    height: '100%',
    width: width(4),
  },
  nextIconInner: {
    height: width(2.5),
    width: width(2.5),
    marginTop: width(4)
  },
  nextIconImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  sepWrapper: {
    width: width(90),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  noData: {
    marginTop: width(6),
    alignSelf: 'center',
    fontSize: width(4)
  }
})