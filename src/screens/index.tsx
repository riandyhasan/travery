import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from '@src/navigations';
import AppStackNavigator from '@src/navigations/auth-navigator';
import { View } from 'react-native';

const AppComponent = () => {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef}>
        <AppStackNavigator />
      </NavigationContainer>
    </View>
  );
};

export default AppComponent;
