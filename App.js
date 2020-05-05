import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    StatusBar,
    AppState,
    BackHandler,
    Dimensions,
    Image,
    Keyboard,
    YellowBox,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import NetInfo from '@react-native-community/netinfo';
import NoInternetPopup from './src/Components/NoInternetPopup.js';

import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import MainScreen from './src/Screens/Main.js';
import GraphsScreen from './src/Screens/Graphs.js';
import InformationScreen from './src/Screens/Information.js';
import InformationDetailsScreen from './src/Screens/InformationDetailsScreen.js';

const InfoStack = createStackNavigator();
const StoryStack = createStackNavigator();
const Tab = createBottomTabNavigator();

global.isIphoneX = Dimensions.get('window').height == 812 || Dimensions.get('window').height == 896;
global.isNarrowWidth = Dimensions.get('window').width <= 320;

console.disableYellowBox = true;

export default class App extends Component {
    _connectionSubscription = null;
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            PopUpVisible: false,
            PopUpText: 'Thanks for sharing your mood \n Be safe!',
            showNoInternetPopup: false,
            isConnected: false,
            height: 0,


        };
        this.hasInternet = false;
    }

    componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange);
        this._connectionSubscription = NetInfo.addEventListener('connectionChange', this.handleFirstConnectivityChange);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        StatusBar.setBarStyle('dark-content', true);
    }

    componentWillMount() {
        this.setupGlobals();
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

    handleFirstConnectivityChange = (connectionInfo) => {
        this.setState({
            isConnected: connectionInfo.type !== 'none',
            showNoInternetPopup: connectionInfo.type === 'none',
        });
        this.hasInternet = connectionInfo.type !== 'none';

    };

    setupGlobals = () => {
        global.data_url = 'https://covid19.mathdro.id/api';
        global.daily_data_url = 'https://covid19.mathdro.id/api/daily';
        global.country_data_url = 'https://covid19.mathdro.id/api/countries/';
    };

    onLayout = event => {
        let height = event.nativeEvent.layout.height;
        if (this.height != this.state.height) {
            this.setState({height: height});
        }
        //console.warn(this.state.height)
    };

    InformationScreen = (props, {navigation}) => {
        return (
            <InformationScreen {...props} screenProps={{tabBarHeight: this.state.height, navigation: navigation}}/>
        );
    };

    InformationDetailsScreen = (props, {navigation}) => {
        return (
            <InformationDetailsScreen {...props}
                                      screenProps={{tabBarHeight: this.state.height, navigation: navigation}}/>
        );
    };

    MainScreen = (props, {navigation}) => {
        return (
            <MainScreen {...props} screenProps={{tabBarHeight: this.state.height, navigation: navigation}}/>
        );
    };

    GraphsScreen = (props, {navigation}) => {
        return (
            <GraphsScreen  {...props} screenProps={{tabBarHeight: this.state.height, navigation: navigation}}/>
        );
    };


    StoryStackScreen = () => {
        return (
            <StoryStack.Navigator initialRouteName='InformationScreen'>
                <StoryStack.Screen name="Information Screen" component={this.InformationScreen}
                                   options={{headerShown: false}}/>
                <StoryStack.Screen name="InformationDetailsScreen" component={this.InformationDetailsScreen}
                                   options={{headerTitle: ''}}/>
            </StoryStack.Navigator>
        );
    };

    InfoStackScreen = () => {
        return (
            <InfoStack.Navigator initialRouteName='Main'>
                <InfoStack.Screen name="Main" component={this.MainScreen} options={{headerShown: false}}/>
                <InfoStack.Screen name="Graphs" component={this.GraphsScreen} options={{headerShown: true}}/>
            </InfoStack.Navigator>
        );
    };


    render() {
        let mainScreen = null;

        mainScreen = <NavigationContainer>
            <Tab.Navigator initialRouteName='Info'
                           headerMode="none"
                           screenOptions={({route}) => ({
                               tabBarIcon: ({focused, color, size}) => {
                                   if (route.name === 'Stories') {
                                       return (<LinearGradient style={styles.linearGradientStyle} start={{x: 0, y: 1}}
                                                               end={{x: 1, y: 0}} colors={['#f5f7fa', '#c3cfe2']}>
                                               <View style={styles.viewStyle} onLayout={e => {
                                                   this.onLayout(e);
                                               }}>
                                                   <Image source={require('./src/Assets/phone-icon.png')}
                                                          style={{
                                                              width: '75%',
                                                              height: '60%',
                                                              tintColor: focused ? '#66a6ff' : '#131313',
                                                              resizeMode: 'contain',
                                                          }}/>
                                               </View>
                                           </LinearGradient>
                                       );
                                   } else if (route.name === 'Info') {
                                       return (<LinearGradient style={styles.linearGradientStyle} start={{x: 0, y: 1}}
                                                               end={{x: 1, y: 0}} colors={['#c3cfe2', '#f5f7fa']}>
                                               <View style={styles.viewStyleInfo} onLayout={e => {
                                                   this.onLayout(e);
                                               }}>
                                                   <Image source={require('./src/Assets/cards-icon.png')}
                                                          style={{
                                                              width: '75%',
                                                              height: '60%',
                                                              tintColor: focused ? '#66a6ff' : '#131313',
                                                              resizeMode: 'contain',
                                                          }}/>
                                               </View>
                                           </LinearGradient>
                                       );
                                   }
                               },
                           })}
                           tabBarOptions={{
                               showLabel: false,
                               lazy: true,
                               style: {
                                   backgroundColor: 'black', // TabBar background
                               },
                           }}
            >
                <Tab.Screen name="Stories" component={this.StoryStackScreen}/>
                <Tab.Screen name="Info" component={this.InfoStackScreen}/>
            </Tab.Navigator>
        </NavigationContainer>;

        return ([
                <NoInternetPopup
                    visible={this.state.showNoInternetPopup}
                />,
                <View style={{flex: 1}}>
                    {mainScreen}
                </View>,
            ]
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
        top: isIphoneX ? 55 : 35,
    },
    linearGradientStyle: {
        width: '100%',
        height: '100%',
    },
    viewStyle: {
        flex: 1,
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewStyleInfo: {
        flex: 1,
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
