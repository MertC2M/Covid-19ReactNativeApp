import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';

export default class Loader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaderVisible: props.isLoading,
            text: props.text,
            isRed: props.isRed | false,
            isConnected: typeof props.isConnected != "undefined" ? props.isConnected : true,
            isFlex: props.isFlex || false,
            hasMargin: props.hasMargin || false,
            isTrans: props.isTrans || false,
            isDisabled: props.isDisabled || false,
            isMini: props.isMini || false
        };
    }

    async componentWillReceiveProps(nextProps) {
        await this.setState({ text: nextProps.text, loaderVisible: nextProps.isLoading, isDisabled: nextProps.isDisabled, isConnected: typeof nextProps.isConnected != "undefined" ? nextProps.isConnected : true })
        if (this.state.isDisabled) {
            this.loaderButton.setOpacityTo(0.6);
        }
    }

    render() {
        let style = [styles.redButton, styles.smallButton];
        let textStyle = [styles.redButtonText];
        let color = "#ffffff";
        if (!this.state.isRed && !this.state.isTrans) {
            style = [styles.whiteButton];
            textStyle = [styles.whiteButtonText];
            color = "#EF3A4B"
        }
        if (this.state.isTrans) {
            style = [styles.transButton, styles.smallButton];
            textStyle = [styles.transButtonText];
            color = "#EF3A4B"
        }
        if (this.state.hasMargin) {
            style.push(styles.flexButtonMargin)
        }
        if (this.state.isMini) {
            style.push(styles.miniButton)
        }
        if (this.state.isFlex) {
            style.push(styles.flexButton)
        }
        if (this.state.isDisabled) {
            style.push(styles.disabledButton)
        }
        return (
            <TouchableOpacity ref={(btn) => this.loaderButton = btn} disabled={this.state.loaderVisible || this.state.isDisabled || !this.state.isConnected} title="" style={style} onPress={() => this.props.onPress()} >
                <View style={styles.buttonInnerContainer}>
                    <Text style={textStyle}>{this.state.text}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    redButton: {
        backgroundColor: "#EF3A4B",
        padding: 20,
        width: "100%",
        alignItems: "center",
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#EF3A4B"
    },
    smallButton: {
        paddingTop: 15,
        paddingBottom: 15,
        marginBottom: 20
    },
    confirmationRedButtonText: {
        color: "#ffffff"
    },
    whiteButton: {
        backgroundColor: "#fff",
        padding: 20,
        marginTop: 24,
        width: "100%",
        alignItems: "center",
        borderRadius: 50,
    },
    whiteButtonText: {
        color: "#EF3A4B",
        fontFamily: "Avenir-Black",
        fontSize: 13
    },
    transButton: {
        padding: 20,
        width: "100%",
        alignItems: "center",
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#EF3A4B"
    },
    transButtonText: {
        color: "#EF3A4B",
        fontFamily: "Avenir-Black",
        fontSize: 13,
    },
    flexButton: {
        flexShrink: 1,
    },
    flexButtonMargin: {
        marginRight: 8,
        paddingLeft: 2,
        paddingRight: 2
    },
    miniButton: {
        paddingTop: 5,
        paddingBottom: 5,
        marginTop: 5,
        marginBottom: 5,
        height: 40
    },
    disabledButton: {
        opacity: 0.6
    },
    buttonInnerContainer: {
        flex: 1,
        flexDirection: "row",
        flexBasis: 19,
        alignItems: "center",
        justifyContent: "center"
    },
    redButtonText: {
        color: "#ffffff",
        fontFamily: "Avenir-Black",
        fontSize: 13
    },
});
