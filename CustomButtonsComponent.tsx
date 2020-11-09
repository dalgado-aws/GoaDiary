import React from "react";
import {ActivityIndicator, Text, TouchableOpacity, View} from "react-native";

export class CustomButton extends React.Component {

    constructor(props, buttonStyle, buttonTextStyle) {
        super(props);
        this.buttonStyle = buttonStyle;
        this.buttonTextStyle = buttonTextStyle;
    }

    render() {
        let buttonText = <Text key = 'k1' style={this.buttonTextStyle}>{this.props.name}</Text>;
        let hint = this.props.hint && <Text key = 'k2' style={{fontSize:9}}>{this.props.hint}</Text>;
        let loadingIndicator = this.props.loading &&
            <ActivityIndicator key = 'k3' style={{position:'absolute'}} size='small' color='#00ff00' />;

        let buttonView = <View key='k4'>{[buttonText, loadingIndicator]}</View>;
        let hintView = hint && <View key='k5'>{[hint]}</View>;
        return <TouchableOpacity key = 'k6' style={this.buttonStyle}
                                 onPress={()=>{
                                     if(!this.props.loading) this.props.clickHandler();
                                     else console.log('Please retry after loading is done!');
                                 }}>
            <View>
                {[buttonView, hintView]}
            </View>
        </TouchableOpacity>;
    }
}

export class SmallCustomButton extends CustomButton {

    static customSmallButtonStyle = {
        backgroundColor: '#518279',
        borderColor: '#4aff8f',
        borderRadius:5,
        borderWidth:1,
        margin:1,
        padding:0,
    };

    static customButtonSmallTextStyle = {
        fontFamily: "normal",
        fontSize:29,
        fontWeight:"bold",
        padding:0,
    };

    constructor(props) {
        super(props, SmallCustomButton.customSmallButtonStyle,
            SmallCustomButton.customButtonSmallTextStyle);
    }
}

export class LargeCustomButton extends CustomButton {

    static customButtonStyle = {
        backgroundColor: "#518480",
        borderColor: '#4aff8f',
        borderRadius:6,
        borderWidth:3,
        margin:1,
        padding:1,
    };

    static customButtonTextStyle = {
        alignSelf: 'stretch',
        color:'#1c6eff',
        fontFamily: "Roboto",
        fontSize:20,
        fontStyle :'italic',
        fontWeight:'bold'
    };

    constructor(props) {
        super(props, LargeCustomButton.customButtonStyle
            , LargeCustomButton.customButtonTextStyle);
    }
}

export class RoundCustomButton extends  CustomButton {

    static refreshCircle = {
        alignSelf:'center',
        backgroundColor: "#518480",
        borderColor: '#4aff8f',
        borderRadius: 21,
        borderWidth: 0,
        height: 42,
        width: 42,
    };

    static refreshText = {
        alignSelf:'center',
        color:'#120529',
        fontSize:8,
        fontWeight:'bold',
        justifyContent:'center',
        margin:7,
    };

    constructor(props) {
        super(props, RoundCustomButton.refreshCircle,
            RoundCustomButton.refreshText);
    }
}

