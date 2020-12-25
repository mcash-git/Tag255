import React, { Component} from 'react';
import { ScrollView, View, StyleSheet, Modal, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

import { width, height } from 'constants/config'

export default class ShowImagePickModal extends Component {
  render() {
    const { show, callback } = this.props
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={show}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}>
        <TouchableWithoutFeedback style={styles.modalWrapper} onPress={() => callback('close')}>
          <View style={styles.modalWrapper}>
            <TouchableWithoutFeedback>
              <View style={styles.modalInner}>
                <TouchableOpacity style={styles.btnWrapper} onPress={() => callback('takePicture')}>
                  <Text style={styles.btnText}>
                    Take a picture
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnWrapper} onPress={() => callback('cameraRoll')}>
                  <Text style={styles.btnText}>
                    Open camera roll
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  modalWrapper: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalInner: {
    backgroundColor: 'transparent',
    borderRadius: width(1),
    overflow: 'hidden',
    width: width(70)
  },
  btnWrapper: {
    height: width(14),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: width(4),
    backgroundColor: '#F6F6F6',
    borderRadius: width(1)
  },
  btnText: {
    fontSize: width(4),
    color: 'black'
  }
})