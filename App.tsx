import { NavigationContainer } from '@react-navigation/native';
import AppComponent from '@src/screens';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '@src/redux/store';

export default function App() {
  const [fontsLoaded] = useFonts({
    sspro: require('./src/assets/fonts/SourceSansPro-Regular.ttf'),
    ssprosemibold: require('./src/assets/fonts/SourceSansPro-SemiBold.ttf'),
    ssprobold: require('./src/assets/fonts/SourceSansPro-Bold.ttf'),
    ubuntu: require('./src/assets/fonts/Ubuntu-Regular.ttf'),
    ubuntumed: require('./src/assets/fonts/Ubuntu-Medium.ttf'),
    ubuntulight: require('./src/assets/fonts/Ubuntu-Light.ttf'),
    ubuntubold: require('./src/assets/fonts/Ubuntu-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <AppComponent />
          </GestureHandlerRootView>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
