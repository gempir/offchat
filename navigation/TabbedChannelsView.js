import * as React from "react";
import { StyleSheet, View, Button, AsyncStorage } from "react-native";
import ChatView from "../components/ChatView";
import { createMaterialTopTabNavigator } from "react-navigation";

const styles = StyleSheet.create({})

export default class TabbedChannelsView extends React.Component {
    static navigationOptions = {
        title: "Channels",
    }

    constructor(props) {
        super(props)

        this.state = {
            channels: [],
            newChannel: "",
            Navigation: null,
        }
    }

    componentDidMount() {
        this.load()
    }

    render() {
        const config = {};

        for (const channel of this.state.channels) {
            config[channel] = () => (<ChatView key={channel} channel={channel} />)
        }

        config["+"] = () => (
            <View>
                <Button title="Settings" onPress={() => this.props.navigation.navigate("Settings")} />
            </View>
        )

        const Navigation = createMaterialTopTabNavigator(config)

        return (
            <View style={{ flex: 1 }}>
                <Navigation />
            </View>
        )
    }

    async load() {
        await Promise.all([
            this.loadChannels(),
        ])
    }

    async loadChannels() {
        const channels = await AsyncStorage.getItem("settings.channels")

        if (channels) {
            this.setState({
                channels: JSON.parse(channels),
            })
        }
    }
}