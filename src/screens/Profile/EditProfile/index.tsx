import { useNavigation } from '@react-navigation/native'
import ImageView from '@src/components/ImageView'
import React, { useState } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { Text, View } from 'react-native'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker';

const DATA = [
    {
        label: 'Display Name', value: 'Salsabila Asyifa S'
    },
    {
        label: 'Username', value: 'salsabilaasyifa'
    },
    {
        label: 'Age', value: '20'
    },
    {
        label: 'Gender', value: 'Female'
    },
    {
        label: 'Bio', value: 'Travel is the movement of people between distant geographical locations. Travel can be done by foot, bicycle, automobile, train, boat, bus, airplane, ship or other means, with or without luggage, and can be one way or round trip.'
    },
]

const imgSize = 88

const EditProfile = () => {
    const [image, setImage] = useState<string | null>();
    const [name, setName] = useState<string>(DATA[0].value)

    const { goBack, canGoBack } = useNavigation()

    const handleBack = () => {
        if (canGoBack()) {
            goBack()
        }
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {
          const uri = result.assets[0].uri;
    
          setImage(uri);
        }
      };

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1}}>
                <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#C0C0C0'}}>
                    <TouchableOpacity activeOpacity={0.5} onPress={handleBack}>
                        <Text style={{fontFamily: 'sspro'}}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.greenText}>Done</Text>
                </View>
                <TouchableOpacity activeOpacity={0.5} onPress={pickImage}>
                    <View style={{alignSelf: 'center', width: imgSize, height: imgSize, marginTop: 16}}>
                        <ImageView name="profile" remoteAssetFullUri={image} style={{height: '100%', width: '100%', borderRadius: imgSize/2}} resizeMode="contain"/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} style={{alignSelf: 'center', marginBottom: 16, marginTop: 16}} onPress={pickImage}>
                    <Text style={[styles.greenText]}>Edit Picture</Text>
                </TouchableOpacity>
                {
                    DATA.map((item, idx) => {
                        if (idx === DATA.length - 1) {
                            return (
                            <View key={idx.toString()} style={[styles.dataBoxLast]}>
                                <Text style={[styles.normalFont,{flex: 2}]}>{item.label}</Text>
                                <TextInput style={[styles.normalFont,{flex: 5, textAlign: 'justify'}]} multiline={true} value={item.value}/>
                            </View>
                            )
                        }
                        return (
                            <View key={idx.toString()} style={[styles.dataBox]}>
                                <Text style={[styles.normalFont,{flex: 2}]}>{item.label}</Text>
                                <TextInput style={[styles.normalFont,{flex: 5, textAlign: 'justify'}]} value={item.value}/>
                            </View>
                        )
                    })
                }
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    normalFont: {
        fontFamily: 'sspro',
    },
    greenText: {
        fontFamily: 'ssprobold', 
        color: '#227466'
    },
    dataBox: {
        padding: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        flexDirection: 'row',
        borderTopColor: '#C0C0C0'
    },
    dataBoxLast: {
        padding: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderTopColor: '#C0C0C0',
        borderBottomColor: '#C0C0C0',
    }
})

export default EditProfile