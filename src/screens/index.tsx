import { DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { navigationRef } from "@src/navigations"
import AppStackNavigator from "@src/navigations/app-navigator"
import { View } from "react-native"

const AppComponent = () => {
    const MyTheme = {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
        //   primary: 'rgb(255, 45, 85)',
          background:'white'
        },
      };

    return (
        <View style={{flex: 1}}>
            <NavigationContainer theme={MyTheme} ref={navigationRef}>
                <AppStackNavigator />
            </NavigationContainer>
        </View>
    )
}

export default AppComponent