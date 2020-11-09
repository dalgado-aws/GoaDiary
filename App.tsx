import React from 'react';
import {Linking, Text, View, ImageBackground} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {Asset} from "expo-asset";
import {Styles} from './Styles'
import {UserPreferences} from './UserPreferences'
import NewsSourceList from './NewsSourceComponentList'

export default function App() {

    let newsSourcesRef = React.createRef();

    const facebookPage  = 'https://www.facebook.com/Goa-Diary-100396581877453/';
    const subscribeLink = 'http://www.omgoa.com/emailSubscribeSubmit';

    let clearAction = async () => { await UserPreferences.clear();
        newsSourcesRef.current.loadAjaxAndRedrawComponent();
    };

    let refresh = <Text key = 'k1' style={Styles.topMenuItem} onPress = { () => newsSourcesRef.current.loadAjaxAndRedrawComponent()}>Refresh</Text>;
    let clear = <Text key = 'k2' style={Styles.topMenuItem} onPress = { () => clearAction()}>Clear Selections</Text>;
    let contact = <Text key = 'k3' style={Styles.topMenuItem} onPress = { () => Linking.openURL(facebookPage)}>Contact Us</Text>;
    let subscribe = <Text key = 'k4' style={Styles.topMenuItem} onPress = { () => Linking.openURL(subscribeLink)}>Subscribe To Our Daily E-Mail</Text>;

    let topMenu = <View key='k9'>
        <ImageBackground source={Asset.fromModule(require('./assets/images/goa_diary.png'))} style={{}} resizeMode="cover">
            {[refresh, clear, contact, subscribe]}
        </ImageBackground>
    </View>;

    let status = <StatusBar  key = 'k5' hidden={true}/>;
    let sourceList = <NewsSourceList key = 'k6' ref = {newsSourcesRef}/>;

    return <View key = 'k7' style={Styles.topContainer}>
        <ImageBackground key = 'k8' source={Asset.fromModule(require('./assets/images/neon_green.png'))} style = {{}}>
            {[status, topMenu, sourceList]}
        </ImageBackground>
    </View>;
}

