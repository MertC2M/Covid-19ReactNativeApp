import React, {Component} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    PermissionsAndroid,
    StatusBar,
    AppState,
    BackHandler,
    Platform,
    Dimensions,
    Image,
    Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {FetchGet} from '../Utils/Fetch.js';
//import NetInfo from "@react-native-community/netinfo";

import AnimateNumber from 'react-native-countup';
import StatusPopup from "../Components/LoginPopUp.js";
import NoInternetPopup from "../Components/NoInternetPopup.js";

import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

export default class InformationScreen extends Component {
    _connectionSubscription = null;

    static navigationOptions = {headerMode: 'none'};

    constructor(props) {

        super(props);

        this.state = {

        };
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        StatusBar.setBarStyle('dark-content', true);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            tabBarHeight: nextProps.screenProps.tabBarHeight,
        })
    }

    componentWillMount() {
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        try {
            this._connectionSubscription && this._connectionSubscription();
        } catch (ex) {
        }
    }

    handleBackPress = () => {
        Keyboard.dismiss();
        return false;
    };

    handleAppStateChange = async (nextAppState) => {
        if ((nextAppState === "background" || nextAppState === "inactive")) {
            Keyboard.dismiss();
        } else if (nextAppState === "active") {

        }
    };

    handleFirstConnectivityChange = (connectionInfo) => {
        this.setState({
            isConnected: connectionInfo.type !== "none",
            showNoInternetPopup: connectionInfo.type === "none"
        });
        this.hasInternet = connectionInfo.type !== "none";

    };

    navigateToInformationDetailsScreen = ({navigation}) => {
        navigation.navigate("InformationDetailsScreen");
    };

    render() {
        const navigation = this.props.navigation;

        return ([
                <NoInternetPopup
                    visible={this.state.showNoInternetPopup}
                />,
                <ScrollView style={styles.scrollViewStyle}>
                    <StatusBar translucent={true} backgroundColor="transparent"/>

                    <View style={styles.container}>
                        <View style={styles.cardStyle}>
                            <LinearGradient style={styles.linearGradientStyle}
                                            start={{x: 0, y: 0}}
                                            end={{x: 1, y: 1}}
                                            colors={['#02aab0', '#00cdac']}>
                                <TouchableOpacity style={styles.touchableStyle}
                                                  onPress={() => {this.navigateToInformationDetailsScreen({navigation})}}>
                                    <Text style={styles.textStyle}>When to Seek Medical Attention</Text>
                                    <Image
                                        source={require('../Assets/arrow3.png')}
                                        style={styles.imageStyle}/>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    </View>
                    <StatusPopup visible={this.state.PopUpVisible} text={this.state.PopUpText}/>
                </ScrollView>]
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        top: global.isIphoneX ? 55 : 35,
        width: screenWidth,
        height: global.isIphoneX ? screenHeight - 55 : screenHeight - 35
    },
    cardStyle: {
        width: screenWidth,
        backgroundColor:'#FFFFFF',
        height: screenHeight / 4,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollViewStyle : {
        flex:1,
        backgroundColor: '#FFFFFF'
    },
    linearGradientStyle: {
        flex: 1,
        width: Math.round(screenWidth * 0.9),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 38
    },
    touchableStyle: {
        flexDirection: 'row',
        height: 25,
        borderRadius: 38,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 1,
    },
    textStyle: {
        fontFamily: 'Iowan Old Style',
        fontWeight: 'bold',
        color: 'white',
        alignSelf: 'center',
        fontSize: 20,
        top: 5
    },
    imageStyle: {
        width: 25,
        height: 25,
        top: 5,
        tintColor: '#fcb69f',
        resizeMode: 'contain'
    }
});
