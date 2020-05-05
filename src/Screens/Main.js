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

export default class MainScreen extends Component {
    _connectionSubscription = null;

    static navigationOptions = {headerMode: 'none'};

    constructor(props) {

        super(props);

        this.state = {
            globalInfectedPeopleCount: 0,
            globalDeathCount: 0,
            dayList: [],
            lastUpdate: '-',
            totalConfirmedCases: 0,
            totalDeathsCases: 0,
            totalRecoveredCases: 0,
            PopUpVisible: false,
            PopUpText: 'Thanks for sharing your mood \n Be safe!',
            showNoInternetPopup: false,
            tabBarHeight: 0,
        };
        this.hasInternet = false;
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        StatusBar.setBarStyle('dark-content', true);

        this.setState({tabBarHeight: this.props.screenProps.tabBarHeight});

        FetchGet(global.data_url, {}, false, (responseJSON) => {
            let lastUpdateDate = new Date(responseJSON['lastUpdate']);
            let dateReturn = lastUpdateDate.toISOString().substring(0, 10) + ' ' + lastUpdateDate.toISOString().substring(12, 19) + ' (Pacific Daylight Time)';
            this.setState({
                totalConfirmedCases: responseJSON['confirmed']['value'],
                totalDeathsCases: responseJSON['deaths']['value'],
                totalRecoveredCases: responseJSON['recovered']['value'],
                lastUpdate: dateReturn,

            });
        }, (error) => {
            console.log(error);
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            tabBarHeight: nextProps.screenProps.tabBarHeight,
        });
    }

    componentWillMount() {
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
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

    openPopUp = () => {
        this.setState({
            PopUpVisible: true,
        });
    };

    navigateToGraphs = ({navigation}) => {
        navigation.navigate('Graphs', {
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
                <ScrollView style={{backgroundColor: '#FFFFFF'}}>
                    <StatusBar translucent={true} backgroundColor="transparent"/>

                    <View style={styles.container}>
                        <View style={styles.viewStyle}>
                            <View style={styles.shadowViewStyle}>
                                <LinearGradient style={styles.linearGradientStyle}
                                                start={{x: 0, y: 0}}
                                                end={{x: 1, y: 1}}
                                                colors={['#02aab0', '#00cdac']}>
                                    <Text style={styles.textStyle}>Total Confirmed Cases</Text>
                                    <AnimateNumber initial={1} timing='easeOut' value={this.state.totalConfirmedCases}
                                                   formatter={(val) => {
                                                       return parseInt(val).toFixed(0);
                                                   }}
                                                   style={styles.animateNumberStyle}/>
                                    <LinearGradient style={styles.linearGradientStyle_2}
                                                    start={{x: 0, y: 0}}
                                                    end={{x: 1, y: 1}}
                                                    colors={['#ffecd2', '#fcb69f']}/>
                                    <Text style={styles.textStyle}>Total Confirmed Deaths</Text>
                                    <AnimateNumber initial={1} timing='easeOut' value={this.state.totalDeathsCases}
                                                   formatter={(val) => {
                                                       return parseInt(val).toFixed(0);
                                                   }}
                                                   style={styles.animateNumberStyle}/>
                                    <LinearGradient style={styles.linearGradientStyle_2}
                                                    start={{x: 0, y: 0}}
                                                    end={{x: 1, y: 1}}
                                                    colors={['#ffecd2', '#fcb69f']}/>
                                    <Text style={styles.textStyle}>Total Recovered Cases</Text>
                                    <AnimateNumber initial={1} timing='easeOut' value={this.state.totalRecoveredCases}
                                                   formatter={(val) => {
                                                       return parseInt(val).toFixed(0);
                                                   }} style={styles.animateNumberStyle}/>
                                    <LinearGradient style={styles.linearGradientStyle_2}
                                                    start={{x: 0, y: 0}}
                                                    end={{x: 1, y: 1}}
                                                    colors={['#ffecd2', '#fcb69f']}/>

                                    <TouchableOpacity style={styles.touchableStyle_2}
                                                      onPress={() => {
                                                          this.navigateToGraphs({navigation});
                                                      }}>
                                        <Text style={styles.textStyle_2}>Check the Graph</Text>
                                        <Image
                                            source={require('../Assets/arrow3.png')}
                                            style={styles.imageStyle_2}/>
                                    </TouchableOpacity>

                                    <Text style={styles.textStyle_3}>Last Update: {this.state.lastUpdate}</Text>
                                </LinearGradient>
                            </View>
                            <View style={styles.viewStyle_2}>
                                <View style={styles.howDoYouFeelView}>
                                    <Text style={styles.textStyle_4}>How Do You Feel Today?</Text>
                                </View>
                                <View style={{flex: 5, flexDirection: 'row'}}>
                                    <TouchableOpacity style={styles.touchableStyle__3}
                                                      onPress={() => {
                                                          this.openPopUp();
                                                      }}>
                                        <LinearGradient style={styles.linearGradientStyle_3}
                                                        start={{x: 1, y: 0}}
                                                        end={{x: 0, y: 1}}
                                                        colors={['#a3bded', '#6991c7']}>
                                            <Image
                                                source={require('../Assets/sad-face.png')}
                                                style={styles.imageStyle_3}/>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.touchableStyle__4}
                                                      onPress={() => {
                                                          this.openPopUp();
                                                      }}>
                                        <LinearGradient style={styles.linearGradientStyle_4}
                                                        start={{x: 0, y: 0}}
                                                        end={{x: 1, y: 1}}
                                                        colors={['#89f7fe', '#66a6ff']}>
                                            <Image
                                                source={require('../Assets/happy.png')}
                                                style={styles.imageStyle_3}/>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </View>
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
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        top: global.isIphoneX ? 55 : 35,
    },
    viewStyle: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        height: global.isIphoneX ? screenHeight - 55 : screenHeight - 35,
    },
    shadowViewStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 38,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11,
    },
    linearGradientStyle: {
        flex: 1,
        width: Math.round(screenWidth * 0.9),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 38,
    },
    textStyle: {
        fontFamily: 'Iowan Old Style',
        fontWeight: 'bold',
        color: 'white',
        alignSelf: 'center',
        fontSize: 18,
    },
    animateNumberStyle: {
        fontFamily: 'Avenir',
        color: 'white',
        alignSelf: 'center',
        fontSize: 17,
    },
    linearGradientStyle_2: {
        alignItems: 'center',
        width: Math.round(screenWidth * 0.4),
        height: 1,
    },
    touchableStyle_2: {
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
    textStyle_2: {
        fontFamily: 'Iowan Old Style',
        fontWeight: 'bold',
        color: 'white',
        alignSelf: 'center',
        fontSize: 20,
        top: 5,
    },
    imageStyle_2: {
        width: 25,
        height: 25,
        top: 5,
        tintColor: '#fcb69f',
        resizeMode: 'contain',
    },
    textStyle_3: {
        fontFamily: 'Iowan Old Style',
        color: 'white',
        alignSelf: 'center',
        fontSize: 10,
        top: 15,
    },
    viewStyle_2: {
        flex: 1,
        flexDirection: 'column',
        width: Math.round(screenWidth * 0.9),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 38,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 1.68,
        elevation: 11,
    },
    textStyle_4: {
        fontFamily: 'Iowan Old Style',
        fontWeight: 'bold',
        color: '#191919',
        alignSelf: 'center',
        fontSize: 20,
    },
    howDoYouFeelView: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 10,
    },
    touchableStyle__3: {
        height: '70%',
        width: Math.round(screenWidth * 0.45),
    },
    linearGradientStyle_3: {
        flex: 1,
        marginHorizontal: 20,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 45,
    },
    imageStyle_3: {
        width: '100%',
        resizeMode: 'contain',
    },
    touchableStyle__4: {
        height: '70%',
        width: Math.round(screenWidth * 0.45),
    },
    linearGradientStyle_4: {
        flex: 1,
        marginHorizontal: 20,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 45,
    },


});
