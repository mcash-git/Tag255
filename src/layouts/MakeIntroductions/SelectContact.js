import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Keyboard } from 'react-native'
import { connect } from 'react-redux'
import NestedScrollView from 'react-native-nested-scroll-view'

import { width, height, iconImages, alphabet } from 'constants/config'

import NavBar from 'components/NavBar'
import SearchInput from 'components/SearchInput'
import RoundInput from 'components/RoundInput'
import ContactList from 'components/ContactList'
import RoundedBtn from 'components/RoundedBtn'

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

@connect(
  state => ({
    contacts: state.contacts,
  })
)
export default class SelectContact extends Component {
  constructor(props) {
    super(props);
    const fields = {
      search: '',
      customContact: ''
    }
    this.state = {
      fields,
      list: alphabet,
    }
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  _keyboardDidShow = () => {
    this.setState({keyboardIsOpened: true})
  }

  _keyboardDidHide = () => {
    this.setState({keyboardIsOpened: false})
  }


  // list: Object.keys(alphabet).map(itemKey => ({ itemKey: itemKey, data: alphabet[itemKey] })).filter(item => item.data && item.data.length).reduce((acc, cur, i) => {
  //   acc[cur.itemKey] = cur.data;
  //   return acc;
  // }, {})


  onFieldChange = (fieldName, value) => {
    let newStateFields = this.state.fields
    newStateFields[fieldName] = value
    this.setState({fields: newStateFields})
  }

  close = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  onListItemPress = (item, sectionId, idx) => {
    const { navigation } = this.props
    const personKey = navigation.state && navigation.state.params && navigation.state.params.personKey
    // navigation.navigate('MakeIntroAddContactInfo', { contactInfo: item, personKey: personKey })
    navigation.navigate('AddCustomContact', {contactInfo: item, personKey: personKey})
  }

  addCustomContact = () => {
    const { navigation } = this.props
    const personKey = navigation.state.params && navigation.state.params.personKey
    // navigation.navigate('AddCustomContact', {personKey: personKey})
    navigation.navigate('AddCustomContact', {personKey: personKey, newContact: true})
  }

  render() {
    const { navigation, contacts } = this.props
    const { list, fields, keyboardIsShown, keyboardIsOpened } = this.state
    const { search, customContact } = fields
    const navBarProps = {
      leftPart: {
        image: iconImages.navBarCrossIconWhite,
        action: () => this.close()
      },
      centerPart: {
        text: 'Select Contact'
      },
    }
    const listProps = {
      rowProps: {
        onItemPress: this.onListItemPress
      }
    }
    console.log('contacts.data')
    console.log(contacts)
    const contactsData = contacts.data && contacts.data
      .filter(item => (item.fName + ' ' + item.sName).toLowerCase().indexOf(search.toLowerCase()) != -1)
      .reduce((acc, cur, i) => {
        const getSection = (isLetter(cur.fName.charAt(0)) ? cur.fName.charAt(0).toUpperCase() : "#")
        // if (acc) {
        //   if (!Array.isArray(acc)) acc = []
        //   const findIndex = acc.findIndex(item => item.title == getSection)
        //   console.log('acc')
        //   console.log(acc)
        //   if (findIndex != -1) {
        //     acc[findIndex].data.push(cur)
        //   } else {
        //     acc.push({
        //       title: getSection,
        //       data: [
        //         cur
        //       ]
        //     })
        //   }
        // } else {
        //   acc = [
        //     {
        //       title: getSection,
        //       data: [
        //         cur
        //       ]
        //     }
        //   ]
        // }
        if (acc[getSection]) {
          acc[getSection].push(cur)
        } else {
          acc[getSection] = [cur]
        }
        return acc;
      }, {}) || {}
    return (
      <View style={styles.wrapper}>
        <NavBar {...navBarProps} navigation={navigation} />
        <KeyboardAvoidingView style={{flex: 1}}  keyboardVerticalOffset={24} behavior={'padding'} enabled={false}>
          <View style={styles.content}>
            <View style={styles.controlsPart}>
              <View style={styles.searchWrapper}>
                <SearchInput
                  placeholder="Search address book..."
                  placeholderTextColor="#5C5C5C"
                  value={search}
                  onChangeText={text => this.onFieldChange('search', text)}
                  returnKeyType="done"
                  onChangeText={text => this.onFieldChange('search', text)} />
              </View>
            </View>
            <View style={styles.listPart}>
              <ContactList {...listProps} data={{...alphabet, ...contactsData}} />
            </View>
            {
              !keyboardIsOpened ?
                <View style={styles.bottomPartWrapper}>
                  <Text style={styles.hintText}>
                    Can’t find friend in your address book?
                  </Text>
                  <View style={styles.customContactWrapper}>
                    <RoundedBtn
                      innerStyle={{
                        height: width(10),
                        width: width(80),
                        borderRadius: width(8),
                        borderWidth: 1,
                        borderColor: '#E4E6E8'
                      }}
                      textStyle={{
                        color: '#8D8D8D',
                        marginTop: 0,
                        fontSize: width(3)
                      }}
                      onPress={this.addCustomContact}
                      backgroundColor="transparent"
                      text="Add Custom Contact" />
                  </View>
                </View>
                : null
            }
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
  },
  controlsPart: {
    height: width(15),
    width: width(100),
    paddingHorizontal: width(4),
    alignItems: 'center'
  },
  searchWrapper: {
    marginTop: width(6),
    marginHorizontal: width(4)
  },
  hintText: {
    marginTop: width(6),
    marginBottom: width(3),
    fontSize: width(3.8),
    color: '#9F9F9F'
  },
  customContactWrapper: {
    marginBottom: width(3),
    width: width(100),
    paddingHorizontal: width(2),
    height: width(14)
  },
  listPart: {
    flex: 1,
    marginTop: width(6),
  },
  bottomPartWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    backgroundColor: '#fff',
    width: width(100),
    paddingHorizontal: width(4),
    alignItems: 'center'
  }
})
