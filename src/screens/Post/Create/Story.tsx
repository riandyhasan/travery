import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ImageView from '@src/components/ImageView';
import React, { useState, useCallback } from 'react';
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
import Button from '@src/components/Button';
import { getJournalById } from '@src/services/journal';
import { JournalData } from '@src/types/Journal';
import { differenceInDays } from 'date-fns';
import { resetParams } from '@src/redux/actions/params';

const EditProfile = () => {
  const user = useSelector((state: RootState) => state.user);
  const params = useSelector((state: RootState) => state.params);
  const navigation = useNavigation();
  const [title, setTitle] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [day, setDay] = useState<number>(0);
  const [story, setStory] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [journalData, setJournalData] = useState<JournalData | null>();

  const { goBack, canGoBack } = useNavigation();

  const handleBack = () => {
    if (canGoBack()) {
      goBack();
    }
  };

  const getJournalDetail = async () => {
    if (params.journal_id) {
      const journal = await getJournalById(params.journal_id);
      if (journal !== null) {
        setJournalData(journal);
      }
    }
  };

  const handlePostStory = async () => {
    if (title == '' || location == '' || day == 0 || category == '') {
      Toast.show({
        type: 'error',
        text1: 'Please enter title, location, category and day',
      });
      return;
    }
    try {
      if (user.username && journalData !== null && journalData !== undefined) {
        const date = getSpecificDay(journalData.startDate != undefined ? journalData?.startDate : new Date(), day);
        await addDoc(collection(db, 'story'), {
          user: user.username,
          journal: params.journal_id,
          title: title,
          location: location,
          image: params.image_url,
          day: date,
          journalTitle: journalData.title,
          category: category,
          story: story,
          postedAt: new Date(),
        });
        Toast.show({
          type: 'success',
          text1: 'Successfully post a story',
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

  useFocusEffect(
    useCallback(() => {
      getJournalDetail();
    }, [])
  );

  const calculateDateDifference = (startDate: Date, endDate: Date): number => {
    return differenceInDays(endDate, startDate) + 1;
  };

  const getSpecificDay = (startDate: Date, dayNumber: number): Date => {
    const specificDate = new Date(startDate);
    specificDate.setDate(startDate.getDate() + dayNumber - 1);
    return specificDate;
  };

  const generateListDay = () => {
    if (journalData != null) {
      const days = calculateDateDifference(journalData.startDate, journalData.endDate);
      const dayList = [];

      for (let i = 1; i <= days; i++) {
        dayList.push({
          label: `${i}`,
          value: i,
        });
      }

      return dayList;
    }

    return [];
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
        <TouchableOpacity onPress={handlePostStory} activeOpacity={0.75}>
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
                placeholder={'Add your story title'}
              />
            </View>
          </View>
        </View>

        {/* Day  */}
        <View style={[styles.dataBox]}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 10,
            }}>
            <Text style={{ fontFamily: 'ssprosemibold', color: colors.primaryGreen, fontSize: 20 }}>Day</Text>
            <RNPickerSelect
              style={pickerSelectStylesBg}
              value={day}
              onValueChange={(value) => setDay(value)}
              items={generateListDay()}
            />
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

        {/* Story */}
        <View style={[styles.dataBox]}>
          <Text
            style={{
              textAlign: 'justify',
              fontSize: 16,
              fontFamily: 'ssprosemibold',
              color: colors.primaryGreen,
            }}>
            Add story
          </Text>
          <TextInput
            style={[styles.normalFont, { textAlign: 'justify', minHeight: 100 }]}
            multiline={true}
            value={story}
            onChangeText={setStory}
            placeholder='Write story about your experience'
          />
        </View>
        {/* Category */}
        <View style={[styles.dataBox, { borderBottomColor: colors.primaryGreen }]}>
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
            value={category}
            onValueChange={(value) => setCategory(value)}
            items={[
              { label: 'Beach', value: 'beach' },
              { label: 'City', value: 'city' },
              { label: 'Nature', value: 'nature' },
              { label: 'Others', value: 'others' },
            ]}
          />
        </View>
      </View>
      <View style={{ position: 'absolute', right: 20, bottom: 50 }}>
        <Button label={'POST'} type={'gradient'} width={120} paddingVertical={5} onPress={handlePostStory} />
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    borderWidth: 0,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    marginTop: 5,
  },
  inputAndroid: {
    fontSize: 14,
    borderWidth: 0,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    marginTop: 5,
  },
});

const pickerSelectStylesBg = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    borderWidth: 0,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    backgroundColor: colors.ternaryGreen,
    paddingHorizontal: 20,
    paddingVertical: 5,
    fontWeight: 'bold',
  },
  inputAndroid: {
    fontSize: 16,
    borderWidth: 0,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    backgroundColor: colors.ternaryGreen,
    paddingHorizontal: 20,
    paddingVertical: 5,
    fontWeight: 'bold',
  },
});

export default EditProfile;
