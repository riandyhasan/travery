import { createStackNavigator } from "@react-navigation/stack";
import Profile from "@src/screens/Profile";
import EditProfile from "@src/screens/Profile/EditProfile";
// import Profile from "src/screens/Profile";

const App = createStackNavigator<Record<string, any>>();

const AppStackNavigator = () => {
    return (
        <App.Navigator initialRouteName="Profile">
            <App.Screen name={'Profile'} component={Profile} options={{ headerShown: false }} />
            <App.Screen name={'EditProfile'} component={EditProfile} options={{ headerShown: false }} />
        </App.Navigator>
    )
}

export default AppStackNavigator
