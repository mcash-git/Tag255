import React, { Component} from 'react';

import { View, Text, Image, Platform, TouchableNativeFeedback, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

import Background from '../Background';
import Logo from '../Logo';
import Avatar from './Avatar'

import { width, height, iconImages } from 'constants/config'

export class Page2 extends Component {
    render () {
        return (
            <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: 'transparent' }}>
							<Background />
                <View>
									<View
										style={{ 
											alignSelf: 'center', 
											flexDirection: 'row', 
											marginTop: width(7.8), 
											marginBottom: width(13) 
										}}>
										<Icon 
											name='circle-o'
											type='font-awesome'
											size={width(2.6)}
											color='white'/>
										<Icon 
											name='circle'
											type='font-awesome'
											color='white'
											containerStyle={{
													marginHorizontal: width(3)
											}}
											size={width(2.6)}/>
										<Icon 
											name='circle-o'
											type='font-awesome'
											color='white'
											size={width(2.6)}/>
									</View>
									<Logo />
                </View>
                <Text
									style={{ 
										fontSize: width(4.4), 
										color: 'white', 
										textAlign: 'center', 
										width: width(70), 
										alignSelf: 'center' 
									}}>
									Select two of your friends
								</Text>
                <View
									style={{
										flexDirection: 'row', 
										paddingHorizontal: width(14), 
										justifyContent: 'space-around' 
									}}>
									<Avatar image={iconImages.fakeWomanAvatar}/>
									<Avatar image={iconImages.fakeManAvatar}/>  
                </View>
                <Text
									style={{ 
										fontSize: width(4.4), 
										color: 'white', 
										textAlign: 'center', 
										width: width(80), 
										alignSelf: 'center' 
									}}>
									Suggest they get together for:
								</Text>
                <View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-around',
										paddingHorizontal: width(4)
									}}>
									<View style={{ flex: 0.25, alignItems: 'center', alignSelf: 'center'}}>
										<Image 
											style={{ 
													width: width(12), 
													height: width(12),
													marginBottom: width(2.8)
											}}
											source={iconImages.martiniGlassIconWhite}
											resizeMode='contain'/>
										<Text
											style={{ 
												fontSize: width(4), 
												color: 'white',                                
												// alignSelf: 'center' 
											}}>
											Social
											</Text>
                    </View>
                    <View style={{ flex: 0.25, alignItems: 'center', alignSelf: 'center'}}>
											<Image 
												style={{ 
													width: width(12), 
													height: width(12),
													marginBottom: width(2.8)
												}}
												source={iconImages.buildingIconWhite}
												resizeMode='contain'/>
                        <Text
													style={{ 
															fontSize: width(4), 
															color: 'white',                                    
															// alignSelf: 'center' 
													}}>
													Bussines
												</Text>
                    </View>
                   	<View style={{ flex: 0.25, alignItems: 'center', alignSelf: 'center'}}>
											<Image 
												style={{ 
													width: width(12), 
													height: width(12),
													marginBottom: width(2.8)
												}}
												source={iconImages.heartOutlineIconWhite}
												resizeMode='contain'/>
                        <Text
													style={{ 
														fontSize: width(4), 
														color: 'white',
													}}>
													Romance
												</Text>
                    </View>
                </View>
                <View style={styles.walkthroughWrapper}>
									<TouchableOpacity style={styles.walkthroughBtnWrapper} onPress={() => this.props.navigation.navigate('Main')}>
										<View style={styles.walkthroughInner}>
											<Text style={{ color: 'white', fontSize: width(3.6)}}>
												SKIP
											</Text>
										</View>
									</TouchableOpacity>
									<TouchableOpacity style={[styles.walkthroughBtnWrapper, {borderLeftWidth: 1, borderLeftColor: 'white'}]} onPress={() => this.props.navigation.navigate('Page3')}>
										<View style={styles.walkthroughInner}>
											<Text style={{ color: 'white', fontSize: width(3.6)}}>
												NEXT
											</Text>
										</View>
									</TouchableOpacity>
								</View>
            </View>
        );
    }    
}

const styles = StyleSheet.create({
	walkthroughWrapper: {
		width: width(100),
		height: width(14),
		flexDirection: 'row'
	},
	walkthroughBtnWrapper: {
		flex: 1
	},
	walkthroughInner: {
		flex: 1, 
		justifyContent: 'center', 
		alignItems: 'center', 
		borderColor: 'white',
		borderTopWidth: 1, 
	}
})
