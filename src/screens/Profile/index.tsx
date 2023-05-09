import { SafeAreaView } from "react-native-safe-area-context"
import { Button, StyleProp, StyleSheet, Text, TextInput, View } from 'react-native';
import ImageView from "@src/components/ImageView";
import { SCREEN_WIDTH } from "@src/utils/deviceDimensions";
import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { useState } from "react";
import { navigate } from "@src/navigations";

const Profile = () => {
    const [currTab, setCurrTab] = useState('airplane')

    const imgSize = 100
    const iconSize = 20
    const iconSize2 = 22

    const ContainerText = ({title, value}:{title: string, value: string}) => {
        return (
            <View style={{marginTop: 5, alignItems: 'center', width: '33.3%'}}>
                <Text style={{fontSize: 20, fontFamily: 'ssprobold'}}>{value}</Text>
                <Text style={{fontSize: 16, fontFamily: 'ssprosemibold', color: 'rgb(161, 161, 161)'}}>{title}</Text>
            </View>
        )
    }

    const ContainerIcon = ({iconName, isActive}:{iconName: any, isActive:boolean}) => {
        return (
            <View  style={{width: '33.3%'}}>
                <TouchableOpacity onPress={() => {setCurrTab(iconName)}} activeOpacity={0.8}>
                    <View style={{paddingBottom: 10, borderBottomWidth: 2, borderColor: isActive ? 'black' : 'white', alignItems: 'center'}}>
                        <Ionicons name={iconName} size={iconSize2} color={isActive ? 'black':'rgb(161, 161, 161)'}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    const DestinationCard = ({imgName, title, date, location, isTravel = false, travel, style}: {imgName: string, title: string, date: string, location: string, isTravel?: boolean, travel?: string, style?: StyleProp<any>}) => {
        return (
            <View style={[styles.destinationCardContainer, style]}>
                <ImageView name={imgName ?? 'city'} style={[styles.destinationCardImageContainer]}  resizeMode="contain" background={true}/>
                <View style={{width: '100%', paddingHorizontal: 8}}>
                    <Text style={[styles.font, {fontSize: 16, marginTop: 4, marginBottom: 12}]}>{title}</Text>
                    {isTravel &&
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Ionicons name='airplane' size={20} color={'#A1A1A1'} style={{marginRight: 4, marginTop: 4}}/>
                        <Text style={[styles.font, {color: '#A1A1A1'}]}>{travel}</Text>
                    </View>
                    }
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Ionicons name='calendar-outline' size={20} color={'#A1A1A1'} style={{marginRight: 4}}/>
                        <Text style={[styles.font, {color: '#A1A1A1'}]}>{date}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Ionicons name='location' size={20} color={'#A1A1A1'} style={{marginRight: 4, marginTop: 4}}/>
                        <Text style={[styles.font, {color: '#A1A1A1'}]}>{location}</Text>
                    </View>
                </View>
            </View>
        )
    }

    const InformationCard = ({name, age, gender, review}: {name: string, age: number, gender: string, review: string}) => {
        return (
            <View style={styles.informationCardContainer}>
                <Text style={[styles.fontBold, {fontSize: 20}]}>{name}</Text>
                <Text style={[styles.fontLight, {fontSize: 16, marginTop: 8, color: 'rgba(21, 21, 21, 0.5)'}]}>{`${age} years old, ${gender}`}</Text>
                <Text style={[styles.fontLight, {fontSize: 16, textAlign: 'justify', marginTop: 6}]}>{review}</Text>
            </View>
        )
    }

    return (
        // <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1}}>
                <ScrollView style={{flex: 1}}>
                    <View style={{ position: 'relative'}}>
                        <ImageView name="header" style={{height: 188}} resizeMode="cover" background={true} />
                        <View style={{width: imgSize, height: imgSize, borderRadius: imgSize/2, borderWidth: 1, borderColor: 'white', position: 'absolute', bottom: -(imgSize/2), left: (SCREEN_WIDTH/2) - imgSize/2 }}>
                            <ImageView name="profile" style={{height: '100%', width: '100%'}} resizeMode="contain"/>
                        </View>
                        <View style={{position: 'absolute', top: 50, right: 20}}>
                            <TouchableOpacity onPress={() => {navigate('EditProfile')}} activeOpacity={0.75}>
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
                    <View style={{paddingTop:  20, alignItems: 'center', flexDirection: "row", width: "100%", justifyContent: "space-between", alignSelf: "center"}}>
                        <ContainerText title="followers" value="2.3k"/>
                        <ContainerText title="posts" value="7"/>
                        <ContainerText title="followings" value="978"/>
                    </View>  
                    <View style={{paddingTop:  20, alignItems: 'center', flexDirection: "row", width: "100%", justifyContent: "space-between", alignSelf: "center"}}>
                        <ContainerIcon iconName='airplane' isActive={currTab==='airplane'}/>
                        <ContainerIcon iconName='grid' isActive={currTab==='grid'}/>
                        <ContainerIcon iconName='information-circle' isActive={currTab==='information-circle'}/>
                    </View> 
                    {currTab === 'airplane' &&
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly', gap: 4, marginBottom: 40}}>
                        <DestinationCard imgName="city" title="France Trip" date="25 March - 29 March" location="Paris, France"/>
                        <DestinationCard imgName="city2" title="France Trip" date="25 March - 29 March" location="Paris, France"/>
                        <DestinationCard imgName="city" title="France Trip" date="25 March - 29 March" location="Paris, France"/>
                        <DestinationCard imgName="city" title="France Trip" date="25 March - 29 March" location="Paris, France"/>
                        <DestinationCard imgName="city" title="France Trip" date="25 March - 29 March" location="Paris, France"/>
                        <DestinationCard imgName="city" title="France Trip" date="25 March - 29 March" location="Paris, France"/>
                    </View>
                    }
                    {currTab === 'grid' &&
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 40, justifyContent: 'center'}}>
                        <DestinationCard imgName="city" title="France Trip" date="25 March - 29 March" location="Paris, France" isTravel={true} travel="France Trip"/>
                        <DestinationCard imgName="city" title="France Trip" date="25 March - 29 March" location="Paris, France" isTravel={true} travel="France Trip"/>
                        <DestinationCard imgName="city" title="France Trip" date="25 March - 29 March" location="Paris, France" isTravel={true} travel="France Trip"/>
                        <DestinationCard imgName="city" title="France Trip" date="25 March - 29 March" location="Paris, France" isTravel={true} travel="France Trip"/>
                        <DestinationCard imgName="city" title="France Trip" date="25 March - 29 March" location="Paris, France" isTravel={true} travel="France Trip"/>
                        <DestinationCard imgName="city" title="France Trip" date="25 March - 29 March" location="Paris, France" isTravel={true} travel="France Trip"/>
                        <DestinationCard imgName="city" title="France Trip" date="25 March - 29 March" location="Paris, France" isTravel={true} travel="France Trip"/>
                    </View>
                    }
                    {currTab === 'information-circle' && 
                    <View style={{ marginBottom: 40}}>
                        <InformationCard name={'Salsabila Asyifa S'} age={20} gender={'Female'} review={'Travel is the movement of people between distant geographical locations. Travel can be done by foot, bicycle, automobile, train, boat, bus, airplane, ship or other means, with or without luggage, and can be one way or round trip.'} />    
                        <InformationCard name={'Salsabila Asyifa S'} age={20} gender={'Female'} review={'Travel is the movement of people between distant geographical locations. Travel can be done by foot, bicycle, automobile, train, boat, bus, airplane, ship or other means, with or without luggage, and can be one way or round trip.'} />    
                        <InformationCard name={'Salsabila Asyifa S'} age={20} gender={'Female'} review={'Travel is the movement of people between distant geographical locations. Travel can be done by foot, bicycle, automobile, train, boat, bus, airplane, ship or other means, with or without luggage, and can be one way or round trip.'} />    
                        <InformationCard name={'Salsabila Asyifa S'} age={20} gender={'Female'} review={'Travel is the movement of people between distant geographical locations. Travel can be done by foot, bicycle, automobile, train, boat, bus, airplane, ship or other means, with or without luggage, and can be one way or round trip.'} />    
                        <InformationCard name={'Salsabila Asyifa S'} age={20} gender={'Female'} review={'Travel is the movement of people between distant geographical locations. Travel can be done by foot, bicycle, automobile, train, boat, bus, airplane, ship or other means, with or without luggage, and can be one way or round trip.'} />    
                    </View>
                    }
                </ScrollView>
            </View>
        // </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    destinationCardContainer: {
        width: '45%',
        flexBasis: '45%',
        paddingBottom: 20,
        borderRadius: 20,
        marginTop: 8, 
        shadowOffset: {
            width: 0,
            height: 4,
          },
        shadowRadius: 4,
        shadowOpacity: 0.4,
        shadowColor: '#000',
        backgroundColor: 'white'
    },
    destinationCardImageContainer: {
        height: 152,
        // borderRadius: 20
    },
    font: {
        fontFamily: 'ssprosemibold'
    },
    fontBold: {
        fontFamily: 'ssprobold'
    },
    fontLight: {
        fontFamily: 'ssprolight',
    },
    informationCardContainer: {
        marginTop: 12,
        alignSelf: 'center',
        borderRadius: 16,
        width: '92%',
        padding: 12,
        shadowOffset: {
            width: 0,
            height: 4,
          },
        shadowRadius: 4,
        shadowOpacity: 0.4,
        shadowColor: '#000',
        backgroundColor: 'white',
    }
})

export default Profile