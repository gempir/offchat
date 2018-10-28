import TabbedChannelsView from './navigation/TabbedChannelsView';
import SettingsView from './navigation/SettingsView';
import {createStackNavigator} from "react-navigation";

export default App = createStackNavigator({
    Channels: { screen: TabbedChannelsView },
    Settings: { screen: SettingsView },
});
