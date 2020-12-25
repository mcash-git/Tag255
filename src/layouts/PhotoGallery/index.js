import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    CameraRoll,
    Platform,
    Dimensions,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';

import { Icon } from 'react-native-elements';

export default class Photos extends Component{   

    state = {
            photos: [],
            imageUri: '',
            type: 'back',
            cameraPhotos: [],
            loadingMore: false,
            lastCursor: null,
            noMorePhotos: false
    }

    componentWillMount() {
        this.getInitialPhotos();
    }

    getInitialPhotos = () => {
        if (!this.noMorePhotos) {
            CameraRoll.getPhotos(this.getFetchParams())
            .then((res) => {
                this.noMorePhotos = !res.page_info.has_next_page;
                this.photos = this.photos.concat(this.cameraPhotos, res.edges);
                console.log(this.photos);
            })
            .catch((err) => console.log(err));
        }
    }

    getFetchParams = (newProps) => {
        const params = {
            first: 35,
            groupName: 'Camera',
            groupTypes: 'All',
            assetType: 'Photos',
            ...newProps
        };

        if (Platform.OS === 'android') {
            delete params.groupTypes;
        } else {
            delete params.groupName;
        }

        return params;
    }

    tryPhotoLoad = () => {
        if (!this.loadingMore && !this.noMorePhotos) {
            this.loadingMore = true;
            this.loadPhotos();
        }
    }
    
       tryPhotoLoad = () => {        
        if (!this.loadingMore && !this.noMorePhotos) {
            this.loadingMore = true;
            this.loadPhotos();
        }
    }

    loadPhotos = () => {
        // if (this.lastCursor) {
            const newParams = this.getFetchParams({after: this.lastCursor})
        // }

        CameraRoll.getPhotos(newParams)
            .then((data) => {
                this.appendAssets(data);
            })
            .catch((e) => console.log(e));
    }

    appendAssets = (data) => {
        const assets = data.edges;
        const nextState = {
            loadingMore: false,
        };

        if (!data.page_info.has_next_page) {
            nextState.noMorePhotos = true;
        }

        if (assets.length > 0) {
            nextState.lastCursor = data.page_info.end_cursor;
            this.photos = this.photos.concat(assets);
            this._dataSource = this._dataSource.cloneWithRows(
            _.chunk(nextState.assets, 3)
            );
        }

        this.loadingMore = nextState.loadingMore;
        this.lastCursor = nextState.lastCursor;
        this.noMorePhotos = nextState.noMorePhotos;
    }

    endReached = () => {
        if (!this.noMorePhotos) {
            this.tryPhotoLoad();
        }
    }

    selectImage = (uri) => {
        this.imageUri = uri;
        this.props.navigation.navigate.levelTwo.moveBack();
    }

    onCameraIconPress = () => {
        this.setState({ photos: []})
        this.props.navigation.navigate('Camera');
        
    }

    renderRow = (data) => {        
        const uri = data.node.image.uri;
        const { photos : store } = this.props.store.register;
        
        return(
            <TouchableOpacity
                onPress={() => store.selectImage(uri)}
                style={[styles.row, { 
                    borderColor: 'white', 
                    borderWidth: 1,
                    borderStyle: 'solid',  }]}
            >
                <Image 
                    style={{ flex: 1 }}
                    source={{ uri }}
                />
            </TouchableOpacity>
        );
    }

    render(){
        const { photos : store } = this.props.store.register;

        return(
            <View style = {{ flex: 1 }} >
                <ListView
                    style={styles.container}
                    contentContainerStyle={styles.grid}                    
                    dataSource={store.dataSource}
                    renderRow={this.renderRow}
                    enableEmptySections
                    pageSize={15}
                    onEndReached={store.endReached}                    
                >
                </ListView>
                <View
                    style={styles.header}
                >
                    <Text
                        style={styles.headerText}
                    >Photos</Text>

                    <TouchableWithoutFeedback 
                        onPress={store.onCameraIconPress}
                    >
                        <Icon 
                            name={'camera'}
                            size={width(13.8)}
                            style={styles.cameraIcon}
                        />
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }
}

const { height, width } = Dimensions.get('window');

const percentH = (num) => {
    return (height / 100) * num;
};

const percentW = (num) => {
    return (width / 100) * num;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: width(23)
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    row : {
        height: width / 4,
        width: width / 4
    },
    header: {
        position: 'absolute',
        top: width(1.8),
        left: width(37),
        width: width(63),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerText: {
        fontSize: width(8),
        fontWeight: '500',
        fontFamily: 'Arial',
        color: 'rgb(255, 255, 255)'
    },
    cameraIcon: {
        marginTop: width(1.8),
        marginRight: width(3),
        color: 'rgb(255, 255, 255)'
    }
})