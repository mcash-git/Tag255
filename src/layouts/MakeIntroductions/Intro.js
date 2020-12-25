import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation';

import { width, height, iconImages, alphabet, defaultImageBase64} from 'constants/config'

import * as ApiUtils from 'actions/utils'

import NavBar from 'components/NavBar'
import RoundBtn from 'components/RoundBtn'
import RoundedBtn from 'components/RoundedBtn'

@connect(
  state => ({
    makeIntroductionData: state.makeIntroductionData,
    routes: state.routes
  }),
  dispatch => ({
    setMakeIntroductionData: (data) => {
      dispatch(ApiUtils.setMakeIntroductionData(data))
    },
    resetMakeIntroductionData: () => {
      dispatch(ApiUtils.resetMakeIntroductionData())
    },
  })
)
export default class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  close = () => {

  }

  componentDidMount() {
    // setTimeout(() => {
    //   this.props.navigation.navigate('SelectAndEditMsg')
    // }, 2000)
  }

  addFirstFriend = () => {
    const { navigation, makeIntroductionData } = this.props
    console.log(makeIntroductionData.fPerson && Object.keys(makeIntroductionData.fPerson).length)
    if (makeIntroductionData.fPerson && Object.keys(makeIntroductionData.fPerson).length) {
      navigation.navigate('AddCustomContact', {personKey: 'fPerson', contactInfo: makeIntroductionData.fPerson})
    } else {
      navigation.navigate('MakeIntroSelectContact', {personKey: 'fPerson'})
    }
  }

  addSecondFriend = () => {
    const { navigation, makeIntroductionData } = this.props
    if (makeIntroductionData.sPerson && Object.keys(makeIntroductionData.sPerson).length) {
      navigation.navigate('AddCustomContact', {personKey: 'sPerson', contactInfo: makeIntroductionData.sPerson})
    } else {
      navigation.navigate('MakeIntroSelectContact', {personKey: 'sPerson'})
    }
  }

  pressRoundedBtn = (btnType) => {
    const { navigation, setMakeIntroductionData, makeIntroductionData } = this.props
    const { fPerson, sPerson, otherData } = makeIntroductionData
    const bothPersonsValid = Object.keys(fPerson).length && Object.keys(sPerson).length
    if (bothPersonsValid) {
      setMakeIntroductionData({
        otherData: {
          relationType: btnType
        }
      })
      navigation.navigate('SelectAndEditMsg')
    }
  }

  render() {
    const { navigation, makeIntroductionData, resetMakeIntroductionData, screenProps } = this.props
    const localPrevScreen = navigation && navigation.state && navigation.state.params && navigation.state.params.localPrevScreen
    const prevScreen = navigation.state && navigation.state.params && navigation.state.params.prevScreen
    const { fPerson, sPerson, otherData } = makeIntroductionData
    const navBarProps = {
      leftPart: {
        image: iconImages.navBarBackArrowLongIconWhite,
        action: () => {
          let action;
          if (!localPrevScreen && prevScreen) {
            if (prevScreen == 'Home') {
              resetMakeIntroductionData()
               action = NavigationActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({ routeName: 'Main'})
                ],
               key:null
              })
            } else {
              resetMakeIntroductionData()
              action = NavigationActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({routeName: prevScreen})
                ],
               key:null
              })
            }
          } else {
            if (!localPrevScreen) {
              resetMakeIntroductionData()
            }
            action = NavigationActions.back()
          }
          action && navigation.dispatch(action)
        }
      },
      centerPart: {
        text: 'Make an Introduction'
      },
    }
    const bothPersonsValid = Object.keys(fPerson).length && Object.keys(sPerson).length
    return (
      <View style={styles.wrapper}>
        <NavBar {...navBarProps} navigation={navigation} />
        <ScrollView showsVerticalScrollIndicator={true}>
          <View style={[styles.content, bothPersonsValid && {height: height(140)}]}>
            <View style={styles.topTextsWrapper}>
              <Text style={styles.titleText}>
                Add contact information
              </Text>
              <Text style={styles.infoText}>
                Which two friends will be struck by serendipity today?
              </Text>
            </View>
            <View style={styles.roundBtnsWrapper}>
              <RoundBtn
                onPress={this.addFirstFriend}
                widthShadow
                icon={iconImages.addContactIconBlue}
                wrapperStyle={{padding: width(1)}}
                innerStyle={{borderWidth: 1, borderColor:'#E4E4E4'}}
                avatar={fPerson.avatarUrl || fPerson.avatar || (Object.keys(fPerson).length && defaultImageBase64)}
                text={
                  (fPerson.fName && fPerson.fName + (fPerson.sName && ' ' + fPerson.sName) || '') || "Add First Friend"
                } />
              <RoundBtn
                widthShadow
                backgroundColor="#F2F4F6"
                onPress={this.addSecondFriend}
                avatar={sPerson.avatarUrl || sPerson.avatar || (Object.keys(sPerson).length && defaultImageBase64)}
                innerStyle={{borderWidth: 1, borderColor:'#E4E4E4'}}
                icon={iconImages.addContactIconGrey}
                text={
                  (sPerson.fName && sPerson.fName + (sPerson.sName && ' ' + sPerson.sName) || '') || "Add Second Friend"
                } />
            </View>
            {
              bothPersonsValid ?
                <View style={styles.middleTextsWrapper}>
                  <View style={styles.textsWrapper}>
                    <Text style={styles.titleText}>
                      Introduction type
                    </Text>
                    <Text style={styles.infoText}>
                      Select what type of introduction you’d like to make.
                    </Text>
                  </View>
                </View>
                : null
            }
            {
              bothPersonsValid ?
                <View style={styles.roundedBtnsWrapper}>
                  <RoundedBtn
                    gradient={{colors: ['#42E399', '#3CB5B7'], locations:[0,0.5,0.6],start:{x: 0.0, y: 0.25},end:{x: 0.5, y: 1.0}}}
                    disabled={!bothPersonsValid}
                    elevation
                    onPress={() => this.pressRoundedBtn('Business')}
                    icon={iconImages.buildingIconWhite}
                    backgroundColor="#3BB3B7"
                    text="Business" />
                  <RoundedBtn
                    gradient={{ colors: ['#F6519F', '#FE737A'], locations: [0, 0.5, 0.6], start: { x: 0.0, y: 0.25 }, end: { x: 0.5, y: 1.0 } }}
                    disabled={!bothPersonsValid}
                    elevation
                    onPress={() => this.pressRoundedBtn('Romance')}
                    icon={iconImages.heartOutlineIconWhite}
                    backgroundColor="#F54FA0"
                    text="Romance" />
                  <RoundedBtn
                    gradient={{ colors: ['#5F79E9', '#1CE2DB'], locations: [0, 0.5, 0.6], start: { x: 0.0, y: 0.25 }, end: { x: 0.5, y: 1.0 } }}
                    disabled={!bothPersonsValid}
                    elevation
                    onPress={() => this.pressRoundedBtn('Social')}
                    icon={iconImages.martiniGlassIconWhite}
                    backgroundColor="#3BB3B7"
                    text="Social" />
                </View>
              : null
            }
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FBFDFF'
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  contentContainerStyle: {
    flex: 1,
  },
  topTextsWrapper: {
    marginTop: width(10),
    width: width(80),
    flexShrink: 1
  },
  titleText: {
    fontSize: width(5.4),
    color: '#646464',
    fontWeight: 'bold'
  },
  infoText: {
    marginTop: width(2),
    fontSize: width(4.4),
    color: '#ADADAD',
    lineHeight: width(7)
  },
  roundBtnsWrapper: {
    marginTop: width(15),
    width: width(74),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  middleTextsWrapper: {
    marginTop: width(14),
    width: width(80),
  },
  roundedBtnsWrapper: {
    marginTop: width(5),
    width: width(86),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})
