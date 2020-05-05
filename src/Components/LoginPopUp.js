import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    TouchableWithoutFeedback,
    Image,
    Dimensions
} from 'react-native';
import Modal from 'react-native-modal';
import LoaderButton from './LoaderButton.js';
import { BlurView } from "@react-native-community/blur";


export default class StatusPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            text: '',
        };
    }

    componentDidMount() {
        this.setState({
            text: this.props.text,
            visible: this.props.visible,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible != this.state.visible
            || nextProps.text != this.state.text) {
            this.setState({
                visible: nextProps.visible,
                text: nextProps.text,
            });
        }
    }


    render() {
        return (
            <Modal
                animationIn="fadeInDown"
                animationInTiming={300}
                animationOut="fadeOutDown"
                animationOutTiming={100}
                isVisible={this.state.visible}
                backdropOpacity={0.5}
                backdropColor="#fff"
                style={[loginPopupStyle.modalStyle, loginPopupStyle.modal]}
                onRequestClose={() => {
                    this.setState({visible: false});
                }}
                onModalHide={() => {

                }}>
                <StatusBar
                    hidden={true}
                />
                {Platform.OS == 'ios' ?
                    <BlurView
                        style={loginPopupStyle.matched}
                        blurType="xlight"
                        blurAmount={8}
                    /> : null}
                <TouchableWithoutFeedback
                    onPressOut={() => this.setState({visible: false})}>
                    <View style={[loginPopupStyle.content]}>
                        <View style={loginPopupStyle.confirmationContainer}>
                            <Image source={require('../Assets/happy.png')}
                                   style={[loginPopupStyle.bigIcon, loginPopupStyle.icon]}/>
                            <Text style={[loginPopupStyle.h1, loginPopupStyle.header]}>We are better together</Text>
                            <Text style={[loginPopupStyle.p, loginPopupStyle.text]}>{this.state.text}</Text>
                        </View>

                        <LoaderButton text="Go back" isMini={false} isRed={true} onPress={() => {
                            this.setState({visible: false});
                        }}/>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    }
}

const loginPopupStyle = StyleSheet.create({
    modal: {
        backgroundColor: 'transparent',
    },
    matched: {
        position: 'absolute',
        top: -50,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        backgroundColor: Platform.OS == 'android' ? 'rgba(0,0,0,0.9)' : 'transparent',
    },
    content: {
        zIndex: 2,
        padding: 50,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        backgroundColor: Platform.OS == 'android' ? 'rgba(255,255,255,0.95)' : 'transparent',
    },
    stylesModal: {},
    header: {},
    text: {},
    modalStyle: {
        margin: 0,
        marginTop: Platform.OS == 'ios' ? Dimensions.get('window').height == 812 ? 40 : 25 : 0,
    },
    confirmationContainer: {
        padding: 30,
        alignItems: 'center',
    },
    bigIcon: {
        resizeMode: 'contain',
        marginBottom: 30,
        flexShrink: 1,
        flexBasis: 120,
        width: 120,
        height: 80,
        alignSelf: 'center',
    },
    h1: {
        fontFamily: 'AvenirNextCondensed-DemiBold',
        fontSize: 25,
        textAlign: 'center',
        color: '#222222',
    },
    h2: {
        fontFamily: 'AvenirNextCondensed-Medium',
        fontSize: 19,
        textAlign: 'center',
        color: '#222222',
    },
    p: {
        fontFamily: 'Avenir-Medium',
        fontSize: 13,
        textAlign: 'center',
        color: '#222',
        marginTop: 5,
        lineHeight: 20,
    },
});
