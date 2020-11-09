import {StyleSheet} from "react-native"

export const Styles = StyleSheet.create({
        topContainer: {
            alignSelf: 'center',
            backgroundColor:'#151515',
            width:'100%'
        },

        topMenuItem: {
            alignItems:'center',
            alignSelf:'flex-start',
            backgroundColor: '#578188',
            borderColor: '#4aff8f',
            borderRadius: 4,
            borderWidth:2,
            color:'black',
            fontSize:25,
            height:40,
            justifyContent:'center'
        },

        newsItem:{
            backgroundColor:'#518480',
            borderColor:'#ffffff',
            borderRadius:4,
            borderWidth: 0.5
        },

        rowFlex:{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between'
        },

        rowFlexReverse:{
            flex: 1,
            flexDirection: 'row-reverse',
            justifyContent: 'space-between'
        },

        error:{
            backgroundColor:'#2d4249',
            color:'#ff5a4f',
            fontSize:12,
            fontStyle:'italic',
            fontWeight: 'bold',
            margin:2,
            textAlign:'right'
        },

        retry:{
            alignSelf:'center',
            backgroundColor:'#1b981e',
            borderColor:'#4a9e70',
            borderRadius:5,
            borderWidth:2,
            color:'#142b32',
            fontSize:17,
            fontWeight:'bold',
        }

    }
);
