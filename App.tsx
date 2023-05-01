import { NavigationContainer } from '@react-navigation/native';
import AppComponent from '@src/screens';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [varA, setVarA] = useState('');
  const [name, setName] = useState('');

  const handleChangeNameInput = (text: string) => {
    setName(text)
  }

  return (
    <SafeAreaProvider style={{flex: 1}}>
      <GestureHandlerRootView style={{ flex: 1 }}>
       <AppComponent />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )

  // return (
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>

    //   <TextInput style={styles.inputTextNama} onChangeText={(a) => handleChangeNameInput(a)} />

    //   <Text>{varA}</Text>

    //   <Button onPress={function() {
    //     setVarA(name)
    //   }} title='Tambah'/>
    //   <StatusBar style='auto' />
    // </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputTextNama: {
    borderColor: 'black', 
    borderWidth: 1, 
    width: '80%', 
    height: 24
  }
});
