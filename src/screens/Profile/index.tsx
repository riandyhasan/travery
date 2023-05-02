import { SafeAreaView } from "react-native-safe-area-context"
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import ImageView from "@src/components/ImageView";
import { SCREEN_WIDTH } from "@src/utils/deviceDimensions";
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from "react-native-gesture-handler";

const Profile = () => {

    const imgSize = 100
    const iconSize = 20

    return (
        // <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1}}>
                <View style={{ position: 'relative'}}>
                    <ImageView name="header" style={{height: 188}} resizeMode="cover" background={true} />
                    <View style={{width: imgSize, height: imgSize, borderRadius: imgSize/2, borderWidth: 1, borderColor: 'white', position: 'absolute', bottom: -(imgSize/2), left: (SCREEN_WIDTH/2) - imgSize/2 }}>
                        <ImageView name="profile" style={{height: '100%', width: '100%'}} resizeMode="contain"/>
                    </View>
                    <View style={{position: 'absolute', top: 50, right: 20}}>
                        <TouchableOpacity onPress={() => {console.log('line 25')}} activeOpacity={0.75}>
                            <View style={{backgroundColor: 'white', padding: 6, borderRadius: iconSize}}>
                                <Ionicons name='pencil' size={iconSize}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                    <View style={{paddingTop: (imgSize/2) + 20, alignItems: 'center'}}>
                        <Text style={{fontSize: 20, fontFamily: 'ssprobold'}}>salsabilaasyifa</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
                            <Ionicons name='location' size={16} color={'black'} style={{marginRight: 8}}/>
                            <Text style={{fontSize: 16, fontFamily: 'ssprosemibold', color: 'rgb(161, 161, 161)'}}>Bandung, Indonesia</Text>
                        </View>
                    </View>     
            </View>
        // </SafeAreaView>
    )
}

export default Profile