import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute, RouteProp, Router, RouterConfigOptions } from '@react-navigation/native';
import { DEVICE_OS, FULL_TAB_BAR_HEIGHT, SCREEN_WIDTH } from '@utils/deviceDimensions';
import { StyleSheet, View, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import Home from '@src/screens/Home';
import Search from '@src/screens/Search';
import NewPost from '@src/screens/Post';
import Plan from '@src/screens/Plan';
import Profile from '@src/screens/Profile';
import colors from '@src/styles/colors';
import { useSelector } from 'react-redux';
import { RootState } from '@src/types/Root';

const Tab = createBottomTabNavigator<any>();

const TabNavigator = () => {
  const getTabBarVisibility = (route: RouteProp<any>) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? '';
    const hideOnScreens = ['DivideChooseFriends'];
    // return;
    if (hideOnScreens.indexOf(routeName) <= -1) return 'flex';
    return 'none';
  };
  const user = useSelector((state: RootState) => state.user);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          left: -1,
          height: 80,
          paddingTop: 4,
          borderWidth: 1,
          shadowRadius: 0,
          paddingBottom: 20,
          borderTopWidth: 1,
          position: 'absolute',
          width: SCREEN_WIDTH + 2,
          borderColor: 'rgba(41, 176, 41, 0.4)',
          borderTopColor: 'rgba(41, 176, 41, 0.4)',
          backgroundColor: colors.primaryGreen,
        },
      }}
      initialRouteName='Home'>
      <Tab.Screen
        name='Home'
        component={Home}
        options={({ navigation, route }) => {
          const isFocused = navigation.isFocused();
          return {
            // tabBarStyle: { display: getTabBarVisibility(route) },
            headerShown: false,
            tabBarLabel: ({ focused, color }: { focused: boolean; color: string }) => null,
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={32} color={colors.white} />
            ),
          };
        }}
      />
      <Tab.Screen
        name='Search'
        component={Search}
        options={({ navigation, route }) => {
          const isFocused = navigation.isFocused();
          return {
            // tabBarStyle: { display: getTabBarVisibility(route) },
            headerShown: false,
            tabBarLabel: ({ focused, color }: { focused: boolean; color: string }) => null,
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <Ionicons name={focused ? 'search' : 'search-outline'} size={32} color={colors.white} />
            ),
          };
        }}
      />
      <Tab.Screen
        name='NewPost'
        component={NewPost}
        options={({ navigation, route }) => {
          const isFocused = navigation.isFocused();
          return {
            // tabBarStyle: { display: getTabBarVisibility(route) },
            headerShown: false,
            tabBarLabel: ({ focused, color }: { focused: boolean; color: string }) => null,
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <View
                style={{
                  marginTop: -40,
                  backgroundColor: colors.white,
                  borderRadius: 100,
                  shadowColor: colors.black,
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                }}>
                <AntDesign name={'pluscircle'} size={68} color={colors.primaryGreen} />
              </View>
            ),
          };
        }}
      />
      <Tab.Screen
        name='Plan'
        component={Plan}
        options={({ navigation, route }) => {
          const isFocused = navigation.isFocused();
          return {
            // tabBarStyle: { display: getTabBarVisibility(route) },
            headerShown: false,
            tabBarLabel: ({ focused, color }: { focused: boolean; color: string }) => null,
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={32} color={colors.white} />
            ),
          };
        }}
      />
      <Tab.Screen
        name='Profile'
        component={Profile}
        options={({ navigation, route }) => {
          const isFocused = navigation.isFocused();
          return {
            // tabBarStyle: { display: getTabBarVisibility(route) },
            headerShown: false,
            tabBarLabel: ({ focused, color }: { focused: boolean; color: string }) => null,
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={
                    user.avatar !== null && user.avatar !== ''
                      ? { uri: user.avatar }
                      : require('../../../assets/images/default-avatar.png')
                  }
                  resizeMode='cover'
                  style={{
                    width: 36,
                    height: 36,
                    borderColor: 'white',
                    borderWidth: focused ? 2 : 0,
                    borderRadius: 100,
                  }}
                />
              </View>
            ),
          };
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 73,
    alignItems: 'center',
    paddingHorizontal: 2,
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginTop: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginVertical: 2,
    // fontFamily: fontFamily.bold,
  },
});

export default TabNavigator;
