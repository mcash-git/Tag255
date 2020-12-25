import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';

import { width, height, iconImages } from 'constants/config';

export default (props) => {
	return (
		<View style={styles.wrapper}>
      <View style={styles.row}>
        <TouchableOpacity style={[styles.introButton, styles.btnCenter]} activeOpacity={ 0.5 } onPress={ props.onMakeIntoductionPress }>
          <Image style={styles.btnIcon} source={ iconImages.handshakeIconWhite } resizeMode='contain' />
          <Text style={styles.btnText}>Make Introduction</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.sBtn, styles.sBtnBorder]} onPress={ props.onMyIntoductionsPress } activeOpacity={ 0.5 }>
          <Image style={styles.btnIcon} source={ iconImages.peopleIconWhite } resizeMode='contain' />
          <Text style={styles.btnText}>My Introductions</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={[styles.fBtn, {borderBottomWidth: 0}]} activeOpacity={ 0.5 } onPress={ props.onMyConnectionsPress }>
          <Image style={styles.btnIcon} source={ iconImages.connectionIconWhite } resizeMode='contain' />
          <Text style={styles.btnText}>My Connections</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.sBtn, {borderBottomWidth: 0}]} onPress={ props.onInvitePress } activeOpacity={ 0.5 }>
          <Image style={styles.btnIcon} source={ iconImages.addIconWhite } resizeMode='contain' />
          <Text style={styles.btnText}>Invite Friends</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: width(100)
  },
  row: {
    flexDirection: 'row'
  },
  fBtn: {
    flex: 0.5,
    borderColor: 'rgba(107, 232, 255, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'center',
    paddingVertical: width(7),
    alignItems: 'center'
  },
	introButton: {
    flex: 0.5,
    borderColor: 'rgba(107, 232, 255, 1)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'center',
    paddingVertical: width(7),
    alignItems: 'center'
  },
  btnCenter: {

  },
  btnIcon: {
    width: width(12),
    height: width(12),
    marginBottom: width(4)
  },
  btnText: {
    color: 'white',
    fontSize: width(4)
  },
  sBtn: {
    flex: 0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: width(7)
  },
  sBtnBorder: {
    borderBottomWidth: 1,
    borderColor: 'rgba(107, 232, 255, 0.5)'
  }
})
