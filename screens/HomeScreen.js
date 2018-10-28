import React from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import ChatView from "../components/ChatView";

export default class HomeScreen extends React.Component {
    styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
        }
    });

    render() {
        return (
            <View style={this.styles.container}>
                <ChatView />
            </View>
        );
    }
}