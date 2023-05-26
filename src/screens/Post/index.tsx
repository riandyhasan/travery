import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ImageView from '@src/components/ImageView';
import React, { useState, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';
import { RootState } from '@src/types/Root';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@src/utils/deviceDimensions';
import { getAuth } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import colors from '@src/styles/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '@src/utils/firebase';
import { store } from '@src/redux/store';
import { tempImage } from '@src/redux/actions/params';

const imgSize = 88;

const EditProfile = () => {
  const user = useSelector((state: RootState) => state.user);
  const params = useSelector((state: RootState) => state.params);
  const navigation = useNavigation();
  const [image, setImage] = useState<string | null>();
  const [type, setType] = useState<string>('story');
  const [imageFile, setImageFile] = useState<Blob | null>(null);

  const { goBack, canGoBack } = useNavigation();

  const handleBack = () => {
    if (canGoBack()) {
      goBack();
    }
  };

  const handleNext = async () => {
    if (imageFile !== null) {
      const storage = getStorage();
      const fileName = `post/${user.id}-${new Date()}.jpg`;
      const storageRef = ref(storage, fileName);
      uploadBytes(storageRef, imageFile).then((snapshot) => {
        getDownloadURL(ref(storage, fileName)).then(async function (url) {
          try {
            store.dispatch(tempImage({ image_url: url }));
            if (type === 'journal') {
              navigation.navigate('NewJournal' as never);
            } else {
              navigation.navigate('ListJournal' as never);
            }
          } catch (error) {
            Toast.show({
              type: 'error',
              text1: 'Internal server error',
            });
          }
        });
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Please upload image first',
      });
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 2],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const response = await fetch(uri);
      const blob = await response.blob();
      setImageFile(blob);

      setImage(uri);
    }
  };

  useFocusEffect(
    useCallback(() => {
      !params.home && pickImage();
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'white', position: 'relative' }}>
      <View style={{ zIndex: 100 }}>
        <Toast position='top' topOffset={SCREEN_HEIGHT * 0.05} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          position: 'absolute',
          top: 50,
          paddingHorizontal: 20,
          alignItems: 'center',
          zIndex: 50,
        }}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.75}>
          <View style={{ padding: 6, borderRadius: 20 }}>
            <MaterialIcons name='keyboard-backspace' size={32} color={colors.primaryGreen} />
          </View>
        </TouchableOpacity>
        <Text style={{ color: colors.primaryGreen, fontSize: 24, fontFamily: 'ssprobold' }}>New Post</Text>
        <TouchableOpacity onPress={handleNext} activeOpacity={0.75}>
          <Text style={{ color: colors.primaryGreen, fontSize: 18, fontFamily: 'ssprobold' }}>Next</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, marginTop: 100 }}>
        <View style={{ position: 'relative', flex: 1 }}>
          {image != '' && image != null ? (
            <ImageView
              name='avatar'
              remoteAssetFullUri={image}
              style={{ height: '100%', width: '100%' }}
              resizeMode='cover'
            />
          ) : (
            <View style={{ width: '100%', height: '100%', backgroundColor: colors.secondaryGray }} />
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 10,
              paddingBottom: 10,
              position: 'absolute',
              top: 20,
              right: 20,
            }}>
            <LinearGradient
              colors={['#73C5B6', '#156B5D']}
              start={{ x: 0, y: 1.5 }}
              end={{ x: 0, y: 0 }}
              style={{ paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 }}>
              <TouchableOpacity
                onPress={pickImage}
                activeOpacity={0.75}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Ionicons name='images-outline' size={24} color={colors.white} />
                <Text style={{ color: colors.white, fontSize: 16, fontFamily: 'ssprobold', marginLeft: 10 }}>
                  Change Image
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          width: '100%',
          position: 'absolute',
          bottom: 120,
          paddingHorizontal: 20,
          alignItems: 'center',
          zIndex: 50,
        }}>
        {type === 'story' ? (
          <LinearGradient
            colors={['#73C5B6', '#156B5D']}
            start={{ x: 0, y: 1.5 }}
            end={{ x: 0, y: 0 }}
            style={{ paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginRight: 10 }}>
            <TouchableOpacity onPress={() => setType('story')} activeOpacity={0.75}>
              <Text style={{ color: colors.white, fontSize: 20, fontFamily: 'ssprobold' }}>STORY</Text>
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          <TouchableOpacity
            onPress={() => setType('story')}
            activeOpacity={0.75}
            style={{
              backgroundColor: colors.ternaryGray,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 20,
              marginRight: 10,
            }}>
            <Text style={{ color: colors.white, fontSize: 20, fontFamily: 'ssprobold' }}>STORY</Text>
          </TouchableOpacity>
        )}
        {type === 'journal' ? (
          <LinearGradient
            colors={['#73C5B6', '#156B5D']}
            start={{ x: 0, y: 1.5 }}
            end={{ x: 0, y: 0 }}
            style={{ paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginRight: 10 }}>
            <TouchableOpacity onPress={() => setType('journal')} activeOpacity={0.75}>
              <Text style={{ color: colors.white, fontSize: 20, fontFamily: 'ssprobold' }}>JOURNAL</Text>
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          <TouchableOpacity
            onPress={() => setType('journal')}
            activeOpacity={0.75}
            style={{
              backgroundColor: colors.ternaryGray,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 20,
              marginRight: 10,
            }}>
            <Text style={{ color: colors.white, fontSize: 20, fontFamily: 'ssprobold' }}>JOURNAL</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default EditProfile;
