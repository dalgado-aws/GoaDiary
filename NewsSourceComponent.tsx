import React from "react";
import {AppState, FlatList, Linking, Share, Text, TouchableOpacity, View} from "react-native";
import {differenceInCalendarDays, differenceInMinutes, format, formatDistance, parse} from "date-fns";
import {LargeCustomButton, RoundCustomButton, SmallCustomButton} from "./CustomButtonsComponent";
import {UserPreferences} from "./UserPreferences";
import {Styles} from "./Styles";

/**
 * This component displays the news headlines for one particular Publication
 * for e.g., one instance of this component can be created for "The Times of India",
 * another one  for "The Navhind Times", and so on.
 * Each NewsSource has an url to fetch news headlines.
 * The component has a List, with each List item showing a news headline for the publication.
 * On clicking on the headline, the news item is opened in a browser.
 * "Previous",  "Next" and "Refresh" buttons are provided.
 */
export default class NewsSource extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ajaxFetchTime:null, // the last time data was fetched for this component
            appState: AppState.currentState, // component in foreground or background
            enabled: props.enabled, // is this NewsSource enabled ... does user want to see headlines from this source
            error: null, // has there been an error while fetching headline with ajax call
            headlines: null, // the actual headline for this NewsSource
            loading: false, // is an ajax call in progress
            offset: 0, // the offset in the headlines table
            url: props.href, // the ajax url to fetch headlines for this NewsSource
        };
    }

    //@override
    /**
    * This is called after the component is drawn for the very first time.
    * When first drawn, the component does not have any data, so an "empty" component will be drawn.
    * In this callback, we will fetch data with an ajax call and redraw the component with fetched data.
    */
    componentDidMount() {
        //when app is first started, the component will be drawn without any ajax data
        //we will call loadAjaxDataAndRedrawComponent() which will cause ajax data to
        // be fetched and component to be re drawn.
        if(this.state.enabled)
            this.loadAjaxDataAndRedrawComponent();
        //set callback to be invoked when app goes into foreground or background
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    //@override
    componentWillUnmount() {
        //reset callback to be invoked when app goes into foreground or background
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    // when app goes into foreground or background ....
    _handleAppStateChange = nextAppState => {
        const fiveMinutes = 5;
        let currentState = this.state.appState;

        //if this component is "enabled" .... i.e. the user wishes to see headlines from this publication
        if (this.state.enabled) {

            //if app is transitioning from background to foreground ...
            if (currentState.match(/inactive|background/) && nextAppState === 'active') {
                let lastAjaxFetchTime = this.state.ajaxFetchTime;

                // if component has never been updated or if component has not be updated in the last 5 minutes ...
                if (lastAjaxFetchTime != null || differenceInMinutes(new Date(), lastAjaxFetchTime) > fiveMinutes) {
                    this.loadAjaxDataAndRedrawComponent();
                }
            }
        }
        this.setState({appState: nextAppState});
    };

    //fetch ajax data and redraw the component
    loadAjaxDataAndRedrawComponent(stateChanges = {}) {
        //first set loading:true. this will cause component to be redrawn with with activity indicator(rotating circle)
        this.setState({...stateChanges, ...{loading: true, error: null}});

        let url = stateChanges['url'] || this.state.url;

        // limit is hard coded in url, need to change here
        // could not find react native library to cleanly manipulate url parameters
        url = url.replace(/limit=\d+/, 'limit=5');
        let headers = {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        };
        fetch(url, {headers})
            .then((response) => response.json())
            //the setState call will cause the component to be redrawn with fetched data
            .then(json => this.setState({headlines: json['result'], loading: false, ajaxFetchTime: new Date()}))
            .catch(error => this.setState({error: error.message}))
            .finally(() =>  this.setState({loading: false}));
    }

    //click handler
    openUrl(url) {
        Linking.openURL(url).catch(error => {this.setState({error:error})});
    }

    //click handler
    share(publication, headline, url) {
        let shareOptions = { message:`${headline} (${publication}) ${url}`, url:url};
        Share.share(shareOptions).catch(error => alert(`${error}. Please download Goa Diary app to share this link!`));
    }

    //click handler
    async flipEnableDisable(publication) {
        let oldState = this.state.enabled;
        let newState = !oldState;
        if(newState)
            await UserPreferences.enable(publication);
        else
            await UserPreferences.disable(publication);
        this.setState({enabled:newState});
        this.loadAjaxDataAndRedrawComponent();
    }

    loadPageAtOffset(newOffset) {
        let url = this.props.href;
        let offsetRegex = RegExp('offset=\\d+');
        let newUrl = url.replace(offsetRegex, 'offset='+ newOffset);
        this.loadAjaxDataAndRedrawComponent({offset:newOffset, url:newUrl});
    }

    //click handler
    next() {
        this.loadPageAtOffset(this.state.offset + 10);
    }

    //click handler
    previous() {
        this.loadPageAtOffset(this.state.offset - 10);
    }

    //click handler
    refresh() {
        this.loadPageAtOffset(0);
    }

    dateDistanceFromToday(date)   {
        let parsedDate = parse(date, 'yyyyMMdd', new Date());
        let dayAndMonth = format(parsedDate, 'do MMM ');

        let daysAgo = differenceInCalendarDays(new Date(), parsedDate);
        switch (daysAgo) {
            case 0:
                dayAndMonth += '(Today)'; break;
            case 1:
                dayAndMonth += '(Yesterday)'; break;
            default:
                dayAndMonth += `(${daysAgo} days ago)`; break;
        }
        return dayAndMonth
    }

    timeSinceLastAjaxFetch() {
        if(this.state.ajaxFetchTime != null)
            return formatDistance(new Date(), this.state.ajaxFetchTime);
        return null;
    }

    renderHeader() {
        let timeSinceLastFetch = (this.state.enabled && this.timeSinceLastAjaxFetch() != null)?
            `Updated ${this.timeSinceLastAjaxFetch()} ago!`:null;

        let title = <LargeCustomButton key='title' name={this.props.name}
                                       hint={timeSinceLastFetch}
                                       loading={this.state.loading}
                                       clickHandler={() => this.flipEnableDisable(this.props.name)}/>;

        let refresh = this.state.enabled && <RoundCustomButton key='refresh' name="Refresh"
                                                               loading={this.state.loading}
                                                               clickHandler={() => this.refresh()}/>;

        let header = <View key='header' style={Styles.rowFlex}>{[title ,refresh]}</View>;
        return header;
    }

    renderPreviousNextNavigation() {
        if(this.state.headlines != null && this.state.headlines.length > 0 && this.state.enabled) {
            let previous = this.state.offset > 0 && <SmallCustomButton  key='previous' name='Previous' loading={this.state.loading}
                                                                        clickHandler={() => this.previous()}/>;
            let next = <SmallCustomButton  key='next' name='Next' loading={this.state.loading} clickHandler={() => this.next()}/>;
            let navigation = <View key='navigation' style={Styles.rowFlexReverse}>
                {[next, previous]}
            </View>;
            return navigation;
        }
        return null;
    }

    renderHeadline(headlineData) {
        let [date, headline, href, id] = headlineData;

        let newsHeadline = <TouchableOpacity key='headline' onPress={() => this.openUrl((href))}>
            <Text key='headlineText' style={{fontWeight:'bold', fontSize:17}}>{headline}</Text>
        </TouchableOpacity>;

        let sharing = <TouchableOpacity key='share'
            onPress={() => this.share(this.props.name, headline, href)}  style={{fontSize:8}}>
            <Text>Share</Text>
        </TouchableOpacity>;

        let age = <Text key='age'>{this.dateDistanceFromToday(date)}</Text>;

        let options = <View key='options' style={Styles.rowFlex}>{[sharing, age]}</View>;

        return <View key={id} style={Styles.newsItem} >{[newsHeadline, options]}</View>;
    }

    renderErrorMessage() {
        if(this.state.error)
            return <View key='error'><Text style={Styles.error}>{`${this.props.name}:${this.state.error}`}</Text></View>;
        return null;
    }

    render() {
        let headlines = null;
        if(this.state.enabled && this.state.headlines != null ) {
            //headlines have been fetched with ajax and should be shown in a list component
            if(this.state.headlines.length > 0)
                headlines = <FlatList key={this.props.name}
                                      data={this.state.headlines}
                                      renderItem={ ({item}) => this.renderHeadline(item) }
                                      keyExtractor={
                                          (item,index) => {
                                              let [date, headline, href, id] = item;
                                              return `${id}`;
                                          }
                                      }>
                </FlatList>;
            else headlines = <Text id = {`${this.props.name}-no-data`} style={Styles.error}>{` No data available for ${this.props.name}`}</Text>;
        } else {
            //no headlines to show at this time
        }
        let parts = [this.renderErrorMessage(), this.renderHeader(), headlines, this.renderPreviousNextNavigation()];
        return <View key = {this.props.name} id = {this.props.name} >{parts}</View>;
    }
}

