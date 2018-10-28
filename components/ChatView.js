import React from "react";
import {
    ListView,
    Text,
    TouchableHighlight,
    View,
    FlatList,
    StyleSheet,
} from "react-native";
import Irc from "../service/Irc";

export default class ChatView extends React.Component {

    styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F5FCFF',
        },
        button: {
            padding: 20,
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: 'black',
        },
        row: {
            padding: 4,
        },
    });

    static MESSAGE_LIMIT = 100;

    constructor(props, context) {
        super(props, context);
        this._data = [];

        this.state = {
            messages: []
        };

        this.irc = new Irc();
        this.irc.connect();
    }

    componentDidMount() {
        this.irc.onNewMessage((message) => {
            this._data.push({...message, key: message.tags.id});

            if (this._data.length > ChatView.MESSAGE_LIMIT) {
                this._data.shift();
            }

            this.setState({
                ...this.state,
                messages: this._data.slice(0).reverse(),
            });
        })
    }

    render() {
        return (
            <FlatList
                inverted
                data={this.state.messages}
                renderItem={this.renderItem}
            />
        );
    }

    renderItem = (item) => {
        const message = item.item;
        console.log(message);
        return <Text key={message.tags.id} style={this.styles.row}>{message.username}: {message.text}</Text>
    }
}

