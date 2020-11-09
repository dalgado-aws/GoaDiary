import React from "react";
import {ActivityIndicator, FlatList, Text, View, TouchableHighlight} from "react-native";
import NewsSource from "./NewsSourceComponent";
import {Styles} from "./Styles"
import {UserPreferences} from "./UserPreferences";

/**
 * This component is a container for NewsSources.
 * A NewsSource is a publication like The Times of India, or The Navhind Times.
 * An individual NewsSource is modelled using a NewsSourceComponent.tsx
 * This component fetches json list containing metadata for multiple NewsSources.
 * It then instantiates a NewsSourceComponent.tsx for each item from the list.
 */
export default class NewsSourceList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newsSources:null,
            loading:false,
            error:null};
    }

    async sortNewsSourceDisplayOrder(data) {
        let enabledSources = [];
        let disabledSources = [];
        let newsSources = data['dynamic_sections'];
        //enabled NewsSources should be displayed before disabled NewsSources
        for(let newsSource of newsSources) {
            let newsSourceName = newsSource['name'];
            //UserPreference has tri state logic. enabled, disabled, and unknown
            //!enabled is not the same as disabled
            let enabledByUser = await UserPreferences.isEnabled(newsSourceName);
            let disabledByUser = await UserPreferences.isDisabled(newsSourceName);
            let enabledByDefault = newsSource['isEnabledByDefault'];

            if(enabledByUser || (enabledByDefault && !disabledByUser)) {
                newsSource['enabled'] = true;
                enabledSources.push(newsSource);
            }
            else {
                newsSource['enabled'] = false;
                disabledSources.push(newsSource);
            }
        }
        //this will cause NewsSources to be rendered in the new order
        this.setState({newsSources:enabledSources.concat(disabledSources)});
    }

    //@override
    /**
     * This is called after the component is drawn for the very first time.
     * When first drawn, the component does not have any data, so an "empty" component will be drawn.
     * In this callback, we will fetch data with an ajax call and redraw the component with fetched data
     */
    componentDidMount() {
        this.loadAjaxAndRedrawComponent();
        //this.setState({error:'Newtork Connection Failed', loading:true})
    }

    loadAjaxAndRedrawComponent() {
        this.setState({newsSources:null, loading:true, error:null});
        let headers = {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        };
        fetch( 'http://www.omgoa.com/scripts/newsSources.py', {headers})
            .then((response) => response.json())
            .then((json) => this.sortNewsSourceDisplayOrder(json))
            .catch((error) => this.setState({error:error.message}))
            .finally(() => this.setState({loading:false}));
    }

    renderSeparator() {
        return <View style = {{height:38, borderRadius:4}}></View>
    }

    render() {
        let error = this.state.error && <Text key='error' style={Styles.error}>{`${this.state.error}`}</Text>;

        let retry = this.state.error &&  <TouchableHighlight  key='retry' onPress={() => this.loadAjaxAndRedrawComponent()} >
            <Text  style = {Styles.retry}>Retry</Text>
        </TouchableHighlight>;

        let loading = this.state.loading && <ActivityIndicator key='loading' size="large" color="#00ff00" />;

        let newsSources = this.state.newsSources || [];
        let newsList = <FlatList key='headlineList' data={newsSources}
                                 renderItem = {({item}) => <NewsSource {...item}></NewsSource>}
                                 keyExtractor = {(item, index) => index.toString()}
                                 ItemSeparatorComponent={this.renderSeparator}
                                 ListHeaderComponent={this.renderSeparator} />;
        return (
            <View style={{width:'100%', height:'100%'}}>
                {[error, retry, loading, newsList]}
            </View>
        )
    }
}
