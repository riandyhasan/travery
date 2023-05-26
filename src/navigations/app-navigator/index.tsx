import { createStackNavigator } from '@react-navigation/stack';
import Onboarding from '@src/screens/Onboarding';
import Login from '@src/screens/Login';
import SignUp from '@src/screens/SignUp';
const App = createStackNavigator<Record<string, any>>();

const AppStackNavigator = () => {
  return (
    <App.Navigator initialRouteName='Onboarding'>
      <App.Screen name={'Onboarding'} component={Onboarding} options={{ headerShown: false }} />
      <App.Screen name={'Login'} component={Login} options={{ headerShown: false }} />
      <App.Screen name={'SignUp'} component={SignUp} options={{ headerShown: false }} />
    </App.Navigator>
  );
};

export default AppStackNavigator;
