import React, { Component} from 'react';
import { View, Text, Image, Platform, TouchableNativeFeedback, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

import Background from '../Background';
import Logo from '../Logo';

import { width, height, iconImages } from 'constants/config'

const Button = (props) => { 
	return Platform.OS === 'android' 
		? <TouchableNativeFeedback {...props} />
		: <TouchableOpacity {...props}  />
};

export class Page1 extends Component {
		render () {
				return (
						<View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: 'rgba(80, 210, 194, 0.95)' }}>
							<Background />
								<View>
									<View
										style={{ 
												alignSelf: 'center', 
												flexDirection: 'row', 
												marginTop: width(3.8), 
												marginBottom: width(13) 
										}}>
											<Icon 
												name='circle'
												type='font-awesome'
												size={width(2.6)}
												color='white'/>
											<Icon 
												name='circle-o'
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
								<View
									style={{
											flexDirection: 'row', 
											paddingHorizontal: width(14), 
											justifyContent: 'space-around',
											marginTop: width(-4),
									}}>
										<Image 
											style={{ 
													width: width(14), 
													height: width(14),                            
											}}
											source={iconImages.buildingIconWhite}
											resizeMode='contain'/>
										<Image 
											style={{ 
												width: width(14), 
												height: width(14),                            
											}}
											source={iconImages.martiniGlassIconWhite}
											resizeMode='contain'/>
										<Image 
											style={{ 
												width: width(14), 
												height: width(14),                            
											}}
											source={iconImages.heartOutlineIconWhite}
											resizeMode='contain'/>
								</View>
								<Text
									style={{ 
											fontSize: width(4.6), 
											color: 'white', 
											textAlign: 'center', 
											width: width(60), 
											alignSelf: 'center',
											marginTop: width(-16),
											lineHeight: width(8)
									}}>
									Find friends, dates, relationship and anything in between
								</Text>
								<View style={styles.walkthroughWrapper}>
									<TouchableOpacity style={styles.walkthroughBtnWrapper} onPress={() => this.props.navigation.navigate('Main')}>
										<View style={styles.walkthroughInner}>
											<Text style={{ color: 'white', fontSize: width(3.4)}}>
												SKIP
											</Text>
										</View>
									</TouchableOpacity>
									<TouchableOpacity style={[styles.walkthroughBtnWrapper, {borderLeftWidth: 1, borderLeftColor: 'white'}]} onPress={() => this.props.navigation.navigate('Page2')}>
										<View style={styles.walkthroughInner}>
											<Text style={{ color: 'white', fontSize: width(3.4)}}>
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
		flexDirection: 'row',
		marginTop: width(2)
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
		borderLeftWidth: 0
	}
})
