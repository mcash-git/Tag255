import React, { Component } from 'react';
import { View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-elements';

import { width, height, iconImages } from 'constants/config'

export default class Avatar extends Component {
		render() {
				return (            
					<View
						style={{ 
							position: 'relative', 
							width: width(24), 
							height: width(24), 
							// justifyContent: 'flex-end',
							// alignSelf: 'center',
						}}>                
						<View style={{
							flex: 1,
							borderRadius: 100,
							borderColor: 'rgba(255, 255, 255, 0.6)',
							borderWidth: 2,
							elevation: 5,
							alignItems: 'center',
							justifyContent: 'center'
						}}>
							<View style={{
								height: '100%',
								width: '100%',
								borderRadius: width(12),
								overflow: 'hidden',
								alignItems: 'center',
								justifyContent: 'center',
							}}>	
								<Image 
									style={{
										width: '120%',
										height: '120%',
										resizeMode: 'cover'
									}}
									source={this.props.image} />
							</View>
						</View>
						<LinearGradient colors={['#36D1DC', '#5B86E5',]}
							style={{
								width: width(7),
								height: width(7),
								borderWidth: 1,
								borderColor: 'white',
								// backgroundColor: 'blue',
								borderRadius: width(7),
								position: 'absolute',
								bottom: 0, 
								right: 0,
								justifyContent: 'center', 
								alignItems: 'center',
								elevation: 6,
								overflow: 'hidden'
							}}>
							<Text style={{ color: 'white', fontSize: width(6)}}>
								+
							</Text>
						</LinearGradient>
					</View>
				);
		}
}