import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ImageView from '@src/components/ImageView';
import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';
import { RootState } from '@src/types/Root';
import { UserData } from '@src/types/User';
import { getUserByUsername } from '@src/services/user';
import RNPickerSelect from 'react-native-picker-select';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@src/utils/deviceDimensions';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '@src/utils/firebase';
import Toast from 'react-native-toast-message';
import { store } from '@src/redux/store';
import { userData as userDataStore } from '@src/redux/actions/user';

const imgSize = 88;

const EditProfile = () => {
  const user = useSelector((state: RootState) => state.user);
  const navigation = useNavigation();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [image, setImage] = useState<string | null>();
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>(user.username ?? '');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [imageFile, setImageFile] = useState<Blob | null>(null);

  const { goBack, canGoBack } = useNavigation();

  const handleBack = () => {
    if (canGoBack()) {
      goBack();
    }
  };

  const getUserData = async () => {
    if (user?.username) {
      const db_user = await getUserByUsername(user.username);
      setUserData(db_user);
      if (db_user) {
        setImage(db_user?.avatar);
        setName(db_user?.name);
        setAge(`${db_user?.age}`);
        setGender(db_user?.gender);
        setBio(db_user?.bio);
        setUsername(db_user?.username);
      }
    }
  };

  const handleEditProfile = async () => {
    const auth = getAuth();
    const storage = getStorage();
    if (imageFile !== null) {
      const storageRef = ref(storage, `user/avatar/${username}.jpg`);
      uploadBytes(storageRef, imageFile).then((snapshot) => {
        getDownloadURL(ref(storage, `user/avatar/${username}.jpg`)).then(async function (url) {
          try {
            if (user.id) {
              const docRef = doc(db, `user`, user.id);
              await updateDoc(docRef, {
                name: name,
                age: parseInt(age),
                gender: gender,
                bio: bio,
                avatar: url,
              });
              Toast.show({
                type: 'success',
                text1: 'Successfully update profile',
              });
              store.dispatch(
                userDataStore({
                  id: user.id,
                  email: user.email,
                  username: user.username,
                  name: name,
                  avatar: url,
                })
              );
              navigation.navigate('TabNavigator' as never);
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
      try {
        if (user.id) {
          const docRef = doc(db, `user`, user.id);
          await updateDoc(docRef, {
            name: name,
            age: parseInt(age),
            gender: gender,
            bio: bio,
          });
          Toast.show({
            type: 'success',
            text1: 'Successfully update profile',
          });
          store.dispatch(
            userDataStore({
              id: user.id,
              email: user.email,
              username: user.username,
              name: name,
              avatar: user.avatar,
            })
          );
          navigation.navigate('TabNavigator' as never);
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Internal server error',
        });
      }
    }
  };

  useEffect(() => {
    getUserData();
  }, [username]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ zIndex: 100 }}>
        <Toast position='top' topOffset={SCREEN_HEIGHT * 0.05} />
      </View>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#C0C0C0',
          }}>
          <TouchableOpacity activeOpacity={0.5} onPress={handleBack}>
            <Text style={{ fontFamily: 'sspro' }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} onPress={handleEditProfile}>
            <Text style={styles.greenText}>Done</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity activeOpacity={0.5} onPress={pickImage}>
          <View style={{ alignSelf: 'center', width: imgSize, height: imgSize, marginTop: 16 }}>
            <ImageView
              name='avatar'
              remoteAssetFullUri={image}
              style={{ height: '100%', width: '100%', borderRadius: imgSize / 2 }}
              resizeMode='cover'
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{ alignSelf: 'center', marginBottom: 16, marginTop: 16 }}
          onPress={pickImage}>
          <Text style={[styles.greenText]}>Edit Picture</Text>
        </TouchableOpacity>
        {/* Name */}
        <View style={[styles.dataBox]}>
          <Text style={[styles.normalFont, { flex: 2 }]}>Name</Text>
          <TextInput
            style={[styles.normalFont, { flex: 5, textAlign: 'justify' }]}
            multiline={true}
            value={name}
            onChangeText={setName}
          />
        </View>
        {/* Username */}
        <View style={[styles.dataBox]}>
          <Text style={[styles.normalFont, { flex: 2 }]}>Username</Text>
          <TextInput
            style={[styles.normalFont, { flex: 5, textAlign: 'justify' }]}
            multiline={true}
            value={username}
            onChangeText={() => null}
            editable={false}
          />
        </View>
        {/* Age */}
        <View style={[styles.dataBox]}>
          <Text style={[styles.normalFont, { flex: 2 }]}>Age</Text>
          <TextInput
            style={[styles.normalFont, { flex: 5, textAlign: 'justify' }]}
            multiline={true}
            value={age}
            onChangeText={setAge}
            keyboardType='numeric'
          />
        </View>
        {/* Gender */}
        <View style={[styles.dataBox]}>
          <Text style={[styles.normalFont, { flex: 5 }]}>Gender</Text>
          <RNPickerSelect
            style={
              gender === ''
                ? pickerSelectStylesPlaceholder
                : gender === 'male'
                ? pickerSelectStylesMale
                : pickerSelectStyles
            }
            value={gender}
            onValueChange={(value) => setGender(value)}
            items={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
            ]}
          />
        </View>
        {/* Bio */}
        <View style={[styles.dataBoxLast, { minHeight: 200 }]}>
          <Text style={[styles.normalFont, { flex: 2 }]}>Bio</Text>
          <TextInput
            style={[styles.normalFont, { flex: 5, textAlign: 'justify' }]}
            multiline={true}
            value={bio}
            onChangeText={setBio}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  normalFont: {
    fontFamily: 'sspro',
  },
  greenText: {
    fontFamily: 'ssprobold',
    color: '#227466',
  },
  dataBox: {
    padding: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    flexDirection: 'row',
    borderTopColor: '#C0C0C0',
  },
  dataBoxLast: {
    padding: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderTopColor: '#C0C0C0',
    borderBottomColor: '#C0C0C0',
  },
});

const pickerSelectStylesPlaceholder = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    borderWidth: 0,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: SCREEN_WIDTH * 0.43,
  },
  inputAndroid: {
    fontSize: 14,
    borderWidth: 0,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: SCREEN_WIDTH * 0.43,
  },
});

const pickerSelectStylesMale = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    borderWidth: 0,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: SCREEN_WIDTH * 0.6,
  },
  inputAndroid: {
    fontSize: 14,
    borderWidth: 0,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: SCREEN_WIDTH * 0.6,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    borderWidth: 0,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: SCREEN_WIDTH * 0.56,
  },
  inputAndroid: {
    fontSize: 14,
    borderWidth: 0,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: SCREEN_WIDTH * 0.56,
  },
});

export default EditProfile;
