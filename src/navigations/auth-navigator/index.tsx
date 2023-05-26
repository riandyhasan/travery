import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './tab-navigator';
import Onboarding from '@src/screens/Onboarding';
import Login from '@src/screens/Login';
import SignUp from '@src/screens/SignUp';
import Profile from '@src/screens/Profile';
import EditProfile from '@src/screens/Profile/EditProfile';
import EditPlan from '@src/screens/Plan/Editor';
import NewJournal from '@src/screens/Post/Create/Journal';
import ListJournal from '@src/screens/Post/List/Journal';
import NewStory from '@src/screens/Post/Create/Story';

const App = createStackNavigator<Record<string, any>>();

const AppStackNavigator = () => {
  return (
    <App.Navigator initialRouteName='Onboarding'>
      {/* Buttom Nav */}
      <App.Screen name={'TabNavigator'} component={TabNavigator} options={{ headerShown: false }} />
      {/* Unlogged Account */}
      <App.Screen name={'Onboarding'} component={Onboarding} options={{ headerShown: false }} />
      <App.Screen name={'Login'} component={Login} options={{ headerShown: false }} />
      <App.Screen name={'SignUp'} component={SignUp} options={{ headerShown: false }} />

      {/* Logged Account */}
      <App.Screen name={'Profile'} component={Profile} options={{ headerShown: false }} />
      <App.Screen name={'EditProfile'} component={EditProfile} options={{ headerShown: false }} />
      <App.Screen name={'EditPlan'} component={EditPlan} options={{ headerShown: false }} />
      <App.Screen name={'NewJournal'} component={NewJournal} options={{ headerShown: false }} />
      <App.Screen name={'ListJournal'} component={ListJournal} options={{ headerShown: false }} />
      <App.Screen name={'NewStory'} component={NewStory} options={{ headerShown: false }} />
    </App.Navigator>
  );
};

export default AppStackNavigator;
