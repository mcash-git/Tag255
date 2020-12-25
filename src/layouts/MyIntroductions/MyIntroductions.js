import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SectionList, Alert } from 'react-native'
import BusyIndicator from 'react-native-busy-indicator'
import moment from 'moment'

import { width, height, iconImages, alphabet, dayNames, monthNames } from 'constants/config'
import { checkNextProps, connectWithNavigationIsFocused } from 'utils'

import * as Models from 'models'

import NavBar from 'components/NavBar'
import Sep from 'components/Sep'
import MessageItem from 'components/MessageItem'
import RelationHeader from 'components/RelationHeader'
import RelationItem from 'components/RelationItem'

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
        text: 'Lorem ipsum dolor sit amet, consecte…'
      },
      {
        key: '2',
        time: '3:12',
        midnight: 'pm',
        fName: 'From',
        sName: 'name',
        relationType: 'Business',
        text: 'Lorem ipsum dolor sit amet, consecte…'
      },
    ]
  }
]

@connectWithNavigationIsFocused(
  state => ({
    getMyIntroductions: state.getMyIntroductions,
    userData: state.userData
  }),
  dispatch => ({
    actionGetMyIntroductions: (userId) => {
      dispatch(Models.introduction.getMyIntroductions(userId))
    }
  })
)
export default class MyIntroductions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      data: []
    }
  }


  componentWillMount() {
    const { actionGetMyIntroductions, userData } = this.props
    const userId = userData.userModel.user_uid
    if (userId) {
      this.setState({ isLoading: true }, () => {
        actionGetMyIntroductions(userId)
      })
    }
  }


  componentWillReceiveProps(nextProps) {
    const { navigation, userData } = this.props
    const propsCheckerGetMyIntroductions = checkNextProps(nextProps, this.props, 'getMyIntroductions')
    if (propsCheckerGetMyIntroductions == 'error') {
			const error = nextProps.getMyIntroductions.error
			this.setState({
				isLoading: false,
      }, () => {
        Alert.alert(error.msg, null, [
          {text: 'OK', onPress: () => navigation.goBack()}
        ], {
          onDismiss: () => navigation.goBack()
        })
      });
    } else if (propsCheckerGetMyIntroductions && propsCheckerGetMyIntroductions != 'empty') {
      const dataGroupedByDay = nextProps.getMyIntroductions.response
      this.setState({
        isLoading: false,
        data: dataGroupedByDay
      })
    } else if (propsCheckerGetMyIntroductions == 'empty') {
			this.setState({isLoading: false})
		}
  }

  _keyExtractor = (item, index) => item.key;

  renderItem = ({item, index}) => {
    const { navigation } = this.props
    return <RelationItem type="twoPersons" onPress={() => navigation.navigate('IntroductionDetatils', {detailsData: item.fullDetails})} key={item.key} item={item} idx={index} />
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
        text: 'My Introductions',
        fontSize: width(4.2),
        subText: 'People you have introduced'
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
              : null
          }
          {
            this.state.isLoading === false && data.length === 0
            ? <Text style={styles.noData}>
                You do not have any introductions
              </Text>
            : null
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
  noData: {
    marginTop: width(6),
    alignSelf: 'center',
    fontSize: width(3.5)
  }
})
