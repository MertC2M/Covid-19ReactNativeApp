import React, {Component} from 'react';
import {
    Platform,
    Text,
    View,
    TouchableOpacity,
    Keyboard,
    TouchableHighlight,
    TouchableNativeFeedback,
    Modal,
    Picker,
} from 'react-native';

export default class iOSDatePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValue: typeof props.selectedKey != "undefined" ? props.selectedKey : Object.keys(props.items)[0],
            pickerVisible: false,
            items: props.items
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            pickerVisible: nextProps.visible,
            selectedValue: nextProps.selectedKey !== "" ? nextProps.selectedKey : Object.keys(this.state.items)[0]
        })
    }

    openPicker() {
        this.setState({pickerVisible: true});
        Keyboard.dismiss()
    }

    closePicker() {
        this.setState({pickerVisible: false});
        this.props.closePicker()
    }

    setPicker() {
        this.props.updateValue(this.state.selectedValue)
    }

    setValue(value) {
        this.setState({selectedValue: value})
    }

    setPickerWithValue(value) {
        this.props.updateValue(value)
    }

    render() {
        var items = [];
        var keys = Object.keys(this.state.items);
        for (var i = 0; i < keys.length; i++) {
            items.push(<Picker.Item key={i} label={this.state.items[keys[i]]} value={keys[i]}/>)
        }
        return (
            <Modal
                animationType={Platform.OS === "ios" ? "slide" : "fade"}
                transparent={true}
                visible={this.state.pickerVisible}
                onRequestClose={() => {
                    this.closePicker();
                }}>
                <View style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: Platform.OS === "ios" ? "transparent" : "rgba(0,0,0,0.7)"
                }}>
                    <TouchableHighlight
                        style={{width: "100%", height: "100%", flex: 1, alignItems: "center", justifyContent: "center"}}
                        onPress={() => this.closePicker()}>
                        {Platform.OS === "ios" ?
                            <View style={{position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: "#fff"}}>
                                <View style={{
                                    flex: 1,
                                    paddingLeft: 12,
                                    paddingRight: 12,
                                    flexDirection: "row",
                                    flexBasis: 40,
                                    alignItems: "center",
                                    flexGrow: 0,
                                    borderBottomWidth: 1,
                                    borderColor: "#D9D9D9",
                                    borderTopWidth: 1
                                }}>
                                    <TouchableOpacity onPress={() => this.closePicker()}
                                                      hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
                                                      style={{paddingTop: 15, paddingBottom: 15}}><Text
                                        style={{color: "#007AFF"}}>{'cancel'}</Text></TouchableOpacity>
                                    <View style={{flex: 1}}/>
                                    <TouchableOpacity onPress={() => this.setPicker()}
                                                      hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
                                                      style={{paddingTop: 15, paddingBottom: 15}}><Text
                                        style={{color: "#007AFF"}}>{'choose'}</Text></TouchableOpacity>
                                </View>
                                <Picker
                                    selectedValue={this.state.selectedValue}
                                    onValueChange={(value) => this.setValue(value)}
                                    style={{backgroundColor: "#efefef"}}
                                >
                                    {items}
                                </Picker>
                            </View> :
                            <View style={{
                                backgroundColor: "#FFF",
                                borderRadius: 3,
                                position: "absolute",
                                left: 20,
                                right: 20
                            }}>
                                <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#666666')}
                                                         onPress={() => this.setPickerWithValue("f")}>
                                    <View style={{padding: 10}}>
                                        <Text>{'Female'}</Text>
                                    </View>
                                </TouchableNativeFeedback>
                                <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#666666')}
                                                         onPress={() => this.setPickerWithValue("m")}>
                                    <View style={{padding: 10}}>
                                        <Text>{'Male'}</Text>
                                    </View>
                                </TouchableNativeFeedback>
                                <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#666666')}
                                                         onPress={() => this.setPickerWithValue("o")}>
                                    <View style={{padding: 10}}>
                                        <Text>{'Other'}</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                        }
                    </TouchableHighlight>
                </View>
            </Modal>
        )
    }
}