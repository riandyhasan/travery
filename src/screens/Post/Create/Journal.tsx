import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ImageView from '@src/components/ImageView';
import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { RootState } from '@src/types/Root';
import RNPickerSelect from 'react-native-picker-select';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@src/utils/deviceDimensions';
import { getAuth } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '@src/utils/firebase';
import Toast from 'react-native-toast-message';
import { store } from '@src/redux/store';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import colors from '@src/styles/colors';
import DatePicker from '@src/components/DatePicker';
import Button from '@src/components/Button';
import { resetParams } from '@src/redux/actions/params';

const EditProfile = () => {
  const user = useSelector((state: RootState) => state.user);
  const params = useSelector((state: RootState) => state.params);
  const navigation = useNavigation();
  const [title, setTitle] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isDatePickerActive, setDatePickerActive] = useState<boolean>(false);
  const [isDatePickerActiveEnd, setDatePickerActiveEnd] = useState<boolean>(false);
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

  const handleOpenDatePicker = () => {
    setDatePickerActive(true);
  };

  const handleOpenEndDatePicker = () => {
    setDatePickerActiveEnd(true);
  };

  const dateToFormat = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    };

    const formattedDate: string = date.toLocaleDateString('en-US', options);
    return formattedDate;
  };

  const handlePostJournal = async () => {
    if (title == '' || location == '') {
      Toast.show({
        type: 'error',
        text1: 'Please enter title and location',
      });
      return;
    }
    try {
      if (user.username) {
        await addDoc(collection(db, 'journal'), {
          user: user.username,
          title: title,
          location: location,
          startDate: startDate,
          endDate: endDate,
          image: params.image_url,
          comments: [],
          likes: [],
        });
        Toast.show({
          type: 'success',
          text1: 'Successfully post a journal',
        });
        store.dispatch(resetParams());
        navigation.navigate('Home' as never);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Internal server error',
      });
    }
  };

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
        <Text style={{ color: colors.primaryGreen, fontSize: 24, fontFamily: 'ssprobold' }}>New Journal</Text>
        <TouchableOpacity onPress={handlePostJournal} activeOpacity={0.75}>
          <Text style={{ color: colors.primaryGreen, fontSize: 18, fontFamily: 'ssprobold' }}>Post</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, marginTop: 100 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            paddingHorizontal: 20,
            paddingVertical: 10,
            marginBottom: 20,
          }}>
          <View style={[styles.imageShadow, { alignSelf: 'center', width: 80, height: 80 }]}>
            <ImageView
              name={user.name ?? ''}
              remoteAssetFullUri={params.image_url ?? ''}
              style={{ height: '100%', width: '100%' }}
              resizeMode='cover'
            />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{
                flex: 3,
                textAlign: 'justify',
                fontSize: 16,
                fontFamily: 'ssprosemibold',
                color: colors.primaryGreen,
              }}>
              Add a title
            </Text>
            <View style={{ flex: 8, width: '100%' }}>
              <TextInput
                style={{
                  fontFamily: 'ssprobold',
                  color: colors.black,
                  fontSize: 18,
                  width: '100%',
                  textAlign: 'left',
                }}
                value={title}
                multiline={true}
                onChangeText={setTitle}
                numberOfLines={2}
                placeholder={'Add your journal title'}
              />
            </View>
          </View>
        </View>

        {/* Location */}
        <View style={[styles.dataBox]}>
          <Text
            style={{
              textAlign: 'justify',
              fontSize: 16,
              fontFamily: 'ssprosemibold',
              color: colors.primaryGreen,
            }}>
            Add Location
          </Text>
          <TextInput
            style={[styles.normalFont, { textAlign: 'justify' }]}
            // multiline={true}
            value={location}
            onChangeText={setLocation}
            placeholder='Add your journal location'
          />
        </View>

        {/* Date  */}
        <View style={[styles.dataBox]}>
          <Text
            style={{
              textAlign: 'justify',
              fontSize: 16,
              fontFamily: 'ssprosemibold',
              color: colors.primaryGreen,
            }}>
            Add Your Date
          </Text>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Text style={{ fontFamily: 'sspro', color: colors.primaryGreen, fontSize: 16 }}>Start Date</Text>
            <TouchableOpacity
              onPress={handleOpenDatePicker}
              style={{
                borderWidth: 2,
                borderColor: colors.primaryGreen,
                paddingVertical: 5,
                paddingHorizontal: 20,
                borderRadius: 20,
              }}>
              <Text style={{ fontFamily: 'sspro', color: colors.primaryGreen, fontSize: 16 }}>
                {dateToFormat(startDate)}
              </Text>
            </TouchableOpacity>
            <DatePicker
              isVisible={isDatePickerActive}
              setSelectedDate={setStartDate}
              setVisibility={setDatePickerActive}
            />
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Text style={{ fontFamily: 'sspro', color: colors.primaryGreen, fontSize: 16 }}>End Date</Text>
            <TouchableOpacity
              onPress={handleOpenEndDatePicker}
              style={{
                borderWidth: 2,
                borderColor: colors.primaryGreen,
                paddingVertical: 5,
                paddingHorizontal: 20,
                borderRadius: 20,
              }}>
              <Text style={{ fontFamily: 'sspro', color: colors.primaryGreen, fontSize: 16 }}>
                {dateToFormat(endDate)}
              </Text>
            </TouchableOpacity>
            <DatePicker
              isVisible={isDatePickerActiveEnd}
              setSelectedDate={setEndDate}
              setVisibility={setDatePickerActiveEnd}
            />
          </View>
        </View>
        {/* Category */}
        {/* <View style={[styles.dataBox, { borderBottomColor: colors.primaryGreen }]}>
          <Text
            style={{
              textAlign: 'justify',
              fontSize: 16,
              fontFamily: 'ssprosemibold',
              color: colors.primaryGreen,
            }}>
            Select Journal Category
          </Text>
          <RNPickerSelect
            style={pickerSelectStyles}
            value={gender}
            onValueChange={(value) => setGender(value)}
            items={[
              { label: 'Beach', value: 'beach' },
              { label: 'City', value: 'city' },
              { label: 'City', value: 'city' },
            ]}
          />
        </View> */}
      </View>
      <View style={{ position: 'absolute', right: 20, bottom: 50 }}>
        <Button label={'POST'} type={'gradient'} width={120} paddingVertical={5} onPress={handlePostJournal} />
      </View>
    </View>
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
  imageShadow: {
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  dataBox: {
    flexDirection: 'column',
    // alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.primaryGreen,
  },
  dataBoxLast: {
    padding: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderTopColor: '#C0C0C0',
    borderBottomColor: '#C0C0C0',
  },
});

export default EditProfile;
