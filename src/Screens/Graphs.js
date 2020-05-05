import React, {Component} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    Modal,
    BackHandler,
    Dimensions,
    Image,
    Keyboard,
    FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {FetchGet} from '../Utils/Fetch.js';
import {
    LineChart,
} from 'react-native-chart-kit';
import NoInternetPopup from '../Components/NoInternetPopup.js';
import data from '../Assets/Countries.js';
import data_with_flags from '../Assets/Countries_with_flags.js';
import AnimateNumber from 'react-native-countup';


const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

const dateRanges = {
    WorldWideAll: 'WorldWide All Times',
    WorldWideLastMonth: 'WorldWide Last Month',
    WorldWideLastWeek: 'WorldWide Last Week',
};

global.isIphoneX = Dimensions.get('window').height == 812 || Dimensions.get('window').height == 896;
global.isNarrowWidth = Dimensions.get('window').width <= 320;

export default class GraphsScreen extends Component {
    _connectionSubscription = null;
    static navigationOptions = {header: null};


    constructor(props) {
        super(props);

        this.state = {
            dayList: [],
            dailyTotalConfirmed: [{'count': 0}],
            dailyTotalDeaths: [{'count': 0}],
            deltaConfirmedDetail: [{'count': 0}],
            showNoInternetPopup: false,
            worldWideText: 'Worldwide',
            countryISOCode: '',

            propsTotalConfirmedCases: 0,
            propsTotalDeathCases: 0,
            propsTotalRecoveredCases: 0,
            dailyRangeGraph: 'Worldwide All times',
            modalVisible: false,

            selectedCountryTotalConfirmed: 0,
            selectedCountryTotalRecovered: 0,
            selectedCountryTotalDeaths: 0,

            selectedTimeRange: dateRanges.WorldWideAll,
        };
    }

    componentDidMount() {
        //AppState.addEventListener('change', this.handleAppStateChange);
        //this._connectionSubscription = NetInfo.addEventListener('connectionChange', this.handleFirstConnectivityChange);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        StatusBar.setBarStyle('dark-content', true);
        let dailyDatesList = [];
        let dailyTotalConfirmedList = [];
        let dailyTotalDeathsList = [];

        this.setState({
            selectedCountryTotalConfirmed: this.props.route.params.totalConfirmedCases,
            selectedCountryTotalRecovered: this.props.route.params.totalDeathsCases,
            selectedCountryTotalDeaths: this.props.route.params.totalRecoveredCases,
        });

        FetchGet(global.daily_data_url, {}, false, (responseJSON) => {
            responseJSON.forEach((item) => {
                dailyDatesList.push({
                    'count': item['deltaConfirmedDetail']['total'],
                });
                dailyTotalConfirmedList.push({'count': item['confirmed']['total']});
                dailyTotalDeathsList.push({'count': item['deaths']['total']});
            });

            this.setState({
                deltaConfirmedDetail: dailyDatesList,
                dailyTotalConfirmed: dailyTotalConfirmedList,
                dailyTotalDeaths: dailyTotalDeathsList,
            });
        }, (error) => {
            console.log(error);
        });
    }

    componentWillMount() {

    }

    componentWillUnmount() {
        //AppState.removeEventListener('change', this.handleAppStateChange);
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

    CountrySelection = () => {
        this.showModal();
    };

    showModal = () => {
        this.setState({modalVisible: true});
    };

    hideModal = () => {
        this.setState({modalVisible: false});
    };

    renderSeparator = () => {
        return (
            <View style={{backgroundColor: '#FFFFFF'}}>
                <LinearGradient style={styles.linearGradientStyle}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                                colors={['#ffecd2', '#fcb69f']}/>

            </View>
        );
    };

    modal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modalVisible}>
                <SafeAreaView style={styles.safeAreaViewStyle}>
                    <View
                        style={styles.country_list_view}>
                        <FlatList
                            ItemSeparatorComponent={this.renderSeparator}
                            data={data}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={
                                ({item}) =>
                                    <TouchableOpacity
                                        onPress={() => this.getCountry(item.name)}
                                        style={
                                            [
                                                styles.country_style,
                                                {
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    backgroundColor: '#FFFFFF',
                                                },
                                            ]
                                        }>
                                        <Text style={{color: '#FFFFFF', fontSize: 28}}>
                                            {item.flag}
                                        </Text>
                                        <Text
                                            style={styles.country_name_and_phone_number_prefix_text}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                            }
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => this.hideModal()}
                        style={styles.close_button_style}>
                        <Text
                            style={styles.close_text_style}>Close</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </Modal>

        );
    };

    async getCountry(country) {
        console.log(data.length);
        console.log(data_with_flags.length);
        const countryData = await data;
        const countryFlagData = await data_with_flags;
        try {
            const countryName = await countryData.filter(
                obj => obj.name === country,
            )[0].name;
            const countryIsoCode = await countryData.filter(
                obj => obj.name === country,
            )[0].iso2;
            // Set data from user choice of country
            FetchGet(global.country_data_url + countryIsoCode, {}, false, (responseJSON) => {

                this.setState({
                    selectedCountryTotalConfirmed: responseJSON['confirmed']['value'],
                    selectedCountryTotalRecovered: responseJSON['recovered']['value'],
                    selectedCountryTotalDeaths: responseJSON['deaths']['value'],
                });
            }, (error) => {
                console.log(error);
            });
            this.setState({worldWideText: countryName, countryISOCode: countryIsoCode});
            await this.hideModal();
        } catch (err) {
            console.log(error);
        }
    }

    render() {

        return ([
                <NoInternetPopup
                    visible={this.state.showNoInternetPopup}
                />,
                <ScrollView style={{backgroundColor: '#FFFFFF'}}>
                    <View style={styles.viewStyle}>
                        <StatusBar translucent={true} backgroundColor="transparent"/>
                        <View style={styles.viewStyle_2}>
                            <TouchableOpacity style={styles.touchableStyle}
                                              hitSlop={{top: 30, left: 30, bottom: 30, right: 30}}
                                              onPress={() => {
                                                  this.CountrySelection();
                                              }}>
                                <Text style={styles.textStyle}>{this.state.worldWideText}</Text>
                                <Image
                                    source={require('../Assets/dropdown.png')}
                                    style={styles.imageStyle_4}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.viewStyle_5}>
                            <View style={styles.viewStyle_6}>
                                <View style={styles.viewStyle_7}>
                                    <View style={styles.viewStyle_8}/>
                                    <Text style={styles.textStyle_2}> Total Confirmed Cases:</Text>
                                </View>
                                <View style={styles.viewStyle_9}>
                                    <AnimateNumber initial={1} timing='easeOut'
                                                   value={this.state.selectedCountryTotalConfirmed}
                                                   formatter={(val) => {
                                                       return parseInt(val).toFixed(0);
                                                   }}
                                                   style={styles.textStyle}/>
                                </View>
                            </View>
                            <LinearGradient style={styles.linearGradientStyle_1}
                                            start={{x: 0, y: 0}}
                                            end={{x: 1, y: 1}}
                                            colors={['#ffecd2', '#fcb69f']}/>
                            <View style={styles.viewStyle_10}>
                                <View style={styles.viewStyle_12}>
                                    <View style={{backgroundColor: '#eb3349', width: 16, height: 16, borderRadius: 8}}/>
                                    <Text style={styles.textStyle_3}> Total Death Cases:</Text>
                                </View>
                                <View style={styles.viewStyle_11}>
                                    <AnimateNumber initial={1} timing='easeOut'
                                                   value={this.state.selectedCountryTotalDeaths} formatter={(val) => {
                                        return parseInt(val).toFixed(0);
                                    }}
                                                   style={styles.textStyle}/>
                                </View>
                            </View>
                            <LinearGradient style={styles.linearGradientStyle_1}
                                            start={{x: 0, y: 0}}
                                            end={{x: 1, y: 1}}
                                            colors={['#ffecd2', '#fcb69f']}/>
                            <View style={styles.viewStyle_10}>
                                <View style={styles.viewStyle_12}>
                                    <View style={{backgroundColor: '#d66d75', width: 16, height: 16, borderRadius: 8}}/>
                                    <Text style={styles.textStyle_3}> New Confirmed Cases:</Text>
                                </View>
                                <View style={styles.viewStyle_11}>
                                    <AnimateNumber initial={1} timing='easeOut'
                                                   value={this.state.selectedCountryTotalRecovered}
                                                   formatter={(val) => {
                                                       return parseInt(val).toFixed(0);
                                                   }}
                                                   style={styles.textStyle}/>
                                </View>
                            </View>
                            <LinearGradient style={styles.linearGradientStyle_2}
                                            start={{x: 0, y: 0}}
                                            end={{x: 1, y: 1}}
                                            colors={['#ffecd2', '#fcb69f']}/>
                        </View>
                        <View style={styles.viewStyle_3}>
                            <Text style={styles.textStyle}>
                                {this.state.dailyRangeGraph}
                            </Text>
                        </View>
                        <View style={styles.container}>
                            <LineChart
                                data={{
                                    labels: [
                                        this.state.dailyRangeGraph,
                                    ],
                                    datasets: [
                                        {
                                            data: this.state.deltaConfirmedDetail.map(({count}) => count),
                                            strokeWidth: 1,
                                            borderColor: '#d66d75',
                                            color: (opacity = 1) => '#d66d75',
                                            fill: true,
                                        },
                                        {
                                            data: this.state.dailyTotalConfirmed.map(({count}) => count),
                                            strokeWidth: 1,
                                            borderColor: '#7b4397',
                                            color: (opacity = 1) => '#7b4397',
                                            fill: true,
                                        },
                                        {
                                            data: this.state.dailyTotalDeaths.map(({count}) => count),
                                            strokeWidth: 1,
                                            borderColor: '#eb3349',
                                            color: (opacity = 1) => '#eb3349',
                                            fill: true,
                                        },
                                    ],
                                }}
                                width={screenWidth * 0.9}
                                height={isIphoneX ? screenHeight - 55 : screenHeight - 35}
                                chartConfig={{
                                    backgroundGradientFrom: 'white',
                                    backgroundGradientTo: '#FFFFFF',
                                    decimalPlaces: 0,
                                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    style: {borderRadius: 16},
                                }}
                                style={{backgroundColor: 'white'}}
                            />
                        </View>
                    </View>
                    {this.modal()}
                </ScrollView>]
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
    country_list_view: {
        flex: 1,
    },
    safeAreaViewStyle: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    country_name_and_phone_number_prefix_text: {
        fontSize: 15,
        fontWeight: '400',
        color: 'black',
        fontFamily: 'Avenir-Medium',
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowRadius: 1,
        marginLeft: 10,
    },
    close_text_style: {
        fontSize: 15,
        fontFamily: 'Avenir-Heavy',
    },
    close_button_style: {
        padding: 15,
        margin: 12,
        marginBottom: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#5059ae',
        borderRadius: 15,
        borderColor: 'black',
    },
    country_style: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
    },
    linearGradientStyle: {
        height: 1,
        width: '94%',
        backgroundColor: 'yellow',
        marginLeft: '3%',
        marginRight: '3%',
    },
    viewStyle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewStyle_2: {
        flex: 1,
        top: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 0,
    },
    touchableStyle: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        height: '100%',
    },
    textStyle: {
        fontFamily: 'Iowan Old Style',
        fontWeight: 'bold',
        color: 'black',
        alignSelf: 'center',
        fontSize: 15,
    },
    viewStyle_3: {
        flex: 1,
        top: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 0,
    },
    viewStyle_4: {
        flex: 1,
        left: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
    },
    imageStyle_4: {
        width: 10,
        alignSelf: 'center',
        height: 10,
        tintColor: 'black',
        resizeMode: 'contain',
    },
    viewStyle_5: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        top: 10,
        borderRadius: 36,
        borderColor: 'red',
    },
    viewStyle_6: {
        flex: 1,
        left: 5,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
    },
    viewStyle_7: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    viewStyle_8: {
        backgroundColor: '#7b4397',
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    textStyle_2: {
        flex: 1,
        fontFamily: 'Iowan Old Style',
        fontWeight: 'bold',
        color: '#02aab0',
        alignSelf: 'center',
        fontSize: 15,
    },
    viewStyle_9: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    viewStyle_10: {
        flex: 1,
        left: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
    },
    textStyle_3: {
        fontFamily: 'Iowan Old Style',
        fontWeight: 'bold',
        color: '#02aab0',
        alignSelf: 'center',
        fontSize: 15,
    },
    viewStyle_11: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    linearGradientStyle_1: {
        alignSelf: 'center',
        width: Math.round(screenWidth * 0.8),
        height: 1,
    },
    viewStyle_12: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },
    linearGradientStyle_2: {
        alignSelf: 'center',
        width: Math.round(screenWidth * 0.8),
        height: 1,
    },
});
