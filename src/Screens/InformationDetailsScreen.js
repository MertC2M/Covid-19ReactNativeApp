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
import StatusPopup from '../Components/LoginPopUp.js';
import NoInternetPopup from '../Components/NoInternetPopup.js';

import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

export default class InformationDetailsScreen extends Component {
    _connectionSubscription = null;

    static navigationOptions = {headerMode: 'none'};

    constructor(props) {

        super(props);

        this.state = {};
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        StatusBar.setBarStyle('dark-content', true);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            tabBarHeight: nextProps.screenProps.tabBarHeight,
        });
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
        if ((nextAppState === 'background' || nextAppState === 'inactive')) {
            Keyboard.dismiss();
        } else if (nextAppState === 'active') {

        }
    };

    handleFirstConnectivityChange = (connectionInfo) => {
        this.setState({
            isConnected: connectionInfo.type !== 'none',
            showNoInternetPopup: connectionInfo.type === 'none',
        });
        this.hasInternet = connectionInfo.type !== 'none';

    };

    navigateToInfoGraphs = ({navigation}) => {
        navigation.navigate('InformationDetailsScreen', {
            totalConfirmedCases: this.state.totalConfirmedCases,
            totalDeathsCases: this.state.totalDeathsCases,
            totalRecoveredCases: this.state.totalRecoveredCases,
        });
    };

    render() {
        const navigation = this.props.navigation;

        return ([
                <NoInternetPopup
                    visible={this.state.showNoInternetPopup}
                />,
                <ScrollView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
                    <StatusBar translucent={true} backgroundColor="transparent"/>

                    <View style={styles.container}>
                        <View style={styles.cardStyle}>
                            <LinearGradient style={styles.linearGradientStyle_5}
                                            start={{x: 0, y: 0}}
                                            end={{x: 1, y: 1}}
                                            colors={['#f5f7fa', '#c3cfe2']}>
                                <View style={{flex: 1, top: 30}}>
                                    <Text style={styles.textStyle}>
                                        If you have any of these emergency warning signs* for COVID-19 get medical
                                        attention
                                        immediately: </Text>

                                    <Text style={styles.textStyleList}>- Trouble breathing</Text>
                                    <Text style={styles.textStyleList}>- Persistent pain or pressure in the chest</Text>
                                    <Text style={styles.textStyleList}>- New confusion or inability to arouse</Text>
                                    <Text style={styles.textStyleList}>- Bluish lips or face</Text>
                                    <Text style={styles.textStyleList}>*This list is not all inclusive. Please consult
                                        your medical provider for any other symptoms that are severe or concerning to
                                        you.</Text>
                                    <Text style={styles.textStyleList}>Call 911 if you have a medical emergency: Notify
                                        the
                                        operator that you have, or think you might have, COVID-19. If possible, put on a
                                        cloth face covering before medical help arrives. </Text>
                                </View>
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
        width: screenWidth,
        height: isIphoneX ? screenHeight - 55 : screenHeight - 35,
    },
    cardStyle: {
        flex: 1,
        width: screenWidth,
        backgroundColor: '#FFFFFF',
        borderRadius: 36,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    textStyle: {
        fontFamily: 'Iowan Old Style',
        fontWeight: 'bold',
        color: 'black',
        alignSelf: 'center',
        fontSize: 20,
        top: 5,
    },
    textStyleList: {
        top: 5,
        fontFamily: 'Iowan Old Style',
        fontWeight: 'bold',
        color: 'black',
        alignSelf: 'center',
        fontSize: 14,
    },
    linearGradientStyle_5: {
        flex: 1,
        width: Math.round(screenWidth),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 38,
    }


});
