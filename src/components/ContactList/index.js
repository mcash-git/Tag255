import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native'
import AtoZListView from 'react-native-atoz-listview';
import NestedScrollView from 'react-native-nested-scroll-view'

import { width, height, iconImages, alphabet } from 'constants/config'

import SectionTitle from './SectionTitle'
import ListRow from './ListRow'

export default class ContactList extends Component {
  render() {
    const { wrapperStyle, sectionListStyle, rowProps, sectionProps } = this.props
    return (
      <View style={[styles.wrapper, wrapperStyle && wrapperStyle]}>
        <AtoZListView
          removeClippedSubviews={false}
          {...this.props}
          sectionHeader={sectionData => <SectionTitle {...{...sectionProps, ...sectionData}}/>}
          renderRow={(item, sectionId, index) => <ListRow {...{...rowProps, item, sectionId, idx: index}} />}
          rowHeight={55}
          enableEmptySections={true}
          sectionListStyle={styles.sectionList}
          sectionListFontSize={{ fontSize: 3.2 }}
          sectionHeaderHeight={20}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  sectionList: {
    backgroundColor: 'transparent',
    paddingRight: width(2),
    zIndex: 600,
    top: width(0),
    bottom: width(0),
    marginTop: width(0),
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
})
