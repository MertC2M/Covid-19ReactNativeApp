import React, {Component} from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    Platform
} from 'react-native';

const {width} = Dimensions.get('window');

export default class NoInternetPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible != this.state.visible) {
            this.setState({visible: nextProps.visible});
        }
    }

    render() {
        if (this.state.visible) {
            return (
                <View style={noInternetStyles.offlineContainer}>
                    <Text style={noInternetStyles.offlineText}>No Internet Connection!</Text>
                </View>
            );
        } else {
            return null;
        }
    }
}
const noInternetStyles = StyleSheet.create({
    offlineContainer: {
        backgroundColor: '#EF3A4B',
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width,
        position: 'absolute',
        bottom: 0,
        zIndex: (Platform.OS == 'ios') ? 1 : 0,
        elevation: 5
    },
    offlineText: {
        color: '#ffffff',
        fontFamily: 'Avenir-Black',
        fontSize: 13
    }
});
