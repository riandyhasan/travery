import { useState, useCallback, useEffect } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import ImageView from '@src/components/ImageView';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@src/utils/deviceDimensions';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { RootState } from '@src/types/Root';
import colors from '@src/styles/colors';
import DatePicker from '@src/components/DatePicker';
import { differenceInDays } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '@src/components/Button';
import { db } from '@src/utils/firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { getPlanById } from '@src/services/plan';
import Toast from 'react-native-toast-message';
import { PlanData } from '@src/types/Plan';
import { routePlan } from '@src/redux/actions/params';
import { store } from '@src/redux/store';

const Plan = () => {
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.user);
  const param = useSelector((state: RootState) => state.params);
  const [from, setFrom] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isDatePickerActive, setDatePickerActive] = useState<boolean>(false);
  const [isDatePickerActiveEnd, setDatePickerActiveEnd] = useState<boolean>(false);
  const [fetched, setFetched] = useState<boolean>(false);

  const handleGoBack = () => {
    store.dispatch(routePlan({ plan: null }));
    navigation.goBack();
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

  const calculateDateDifference = (): number => {
    return differenceInDays(endDate, startDate) + 1;
  };

  const handleSavePlan = async () => {
    if (from === '' || destination === '') {
      Toast.show({
        type: 'error',
        text1: 'Please specify destination',
      });
      return;
    }

    if ((param.plan_id === '' || param.plan_id === null) && !fetched) {
      try {
        await addDoc(collection(db, 'plan'), {
          user: user.id,
          from: from,
          destination: destination,
          startDate: startDate,
          endDate: endDate,
        });
        Toast.show({
          type: 'success',
          text1: 'Plan successfully added',
        });
        handleGoBack();
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'Internal server error',
        });
      }
    } else {
      try {
        const docRef = doc(db, `plan`, param.plan_id);
        await updateDoc(docRef, {
          from: from,
          destination: destination,
          startDate: startDate,
          endDate: endDate,
        });
        Toast.show({
          type: 'success',
          text1: 'Plan successfully edited',
        });
        handleGoBack();
      } catch (err) {
        // console.log(err);
        Toast.show({
          type: 'error',
          text1: 'Internal server error',
        });
      }
    }
  };

  const fetchPlanDetail = async () => {
    if (param.plan_id) {
      const data = (await getPlanById(param.plan_id)) as PlanData;
      if (data !== null) {
        setFrom(data?.from);
        setDestination(data?.destination);
        setStartDate(data?.startDate);
        setEndDate(data?.endDate);
      }
      setFetched(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      !fetched && fetchPlanDetail();
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
        <TouchableOpacity onPress={handleGoBack} activeOpacity={0.75}>
          <View style={{ backgroundColor: 'white', padding: 6, borderRadius: 20 }}>
            <MaterialIcons name='keyboard-backspace' size={32} color={colors.primaryGreen} />
          </View>
        </TouchableOpacity>
        <Text style={{ color: colors.primaryGreen, fontSize: 24, fontFamily: 'ssprobold' }}>Select Detail</Text>
        <TouchableOpacity onPress={handleSavePlan} activeOpacity={0.75}>
          <Text style={{ color: colors.primaryGreen, fontSize: 18, fontFamily: 'ssprobold' }}>Save</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, paddingTop: SCREEN_HEIGHT * 0.15, paddingHorizontal: 20 }}>
        <View
          style={{
            flexDirection: 'column',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: colors.primaryGreen,
            paddingVertical: 10,
            paddingLeft: 30,
            paddingHorizontal: 20,
            borderRadius: 12,
            position: 'relative',
          }}>
          <View style={{ position: 'absolute', top: 15, left: 15, width: 2, height: '100%', alignItems: 'center' }}>
            <View style={{ width: 10, height: 10, backgroundColor: colors.primaryGreen, borderRadius: 100 }} />
            <View style={{ width: 2, height: '50%', backgroundColor: colors.primaryGreen }} />
            <View style={{ width: 10, height: 10, backgroundColor: colors.primaryGreen, borderRadius: 100 }} />
          </View>

          <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: 'ssprosemibold', color: colors.primaryGreen }}>From</Text>
            <TextInput
              style={{ fontFamily: 'ssprobold', color: colors.primaryGreen, fontSize: 16 }}
              value={from}
              placeholder={'Type your start point'}
              onChangeText={setFrom}
            />
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            <Text style={{ fontFamily: 'ssprosemibold', color: colors.primaryGreen }}>To</Text>
            <TextInput
              style={{ fontFamily: 'ssprobold', color: colors.primaryGreen, fontSize: 16 }}
              value={destination}
              placeholder={'Type your start destinaton'}
              onChangeText={setDestination}
            />
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'ssprobold', color: colors.primaryGreen, fontSize: 16 }}>Start Date</Text>
            <TouchableOpacity
              onPress={handleOpenDatePicker}
              style={{
                borderWidth: 2,
                borderColor: colors.primaryGreen,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 20,
              }}>
              <Text style={{ fontFamily: 'ssprobold', color: colors.primaryGreen, fontSize: 16 }}>
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
              marginTop: 30,
            }}>
            <Text style={{ fontFamily: 'ssprobold', color: colors.primaryGreen, fontSize: 16 }}>End Date</Text>
            <TouchableOpacity
              onPress={handleOpenEndDatePicker}
              style={{
                borderWidth: 2,
                borderColor: colors.primaryGreen,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 20,
              }}>
              <Text style={{ fontFamily: 'ssprobold', color: colors.primaryGreen, fontSize: 16 }}>
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
        <View style={{ marginTop: 20 }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            <Text style={{ fontFamily: 'ssprobold', color: colors.primaryGreen, fontSize: 24 }}>Duration</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: colors.primaryGray,
                  borderRadius: 15,
                  paddingVertical: 10,
                  paddingHorizontal: 25,
                  marginRight: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'ssprobold',
                    color: colors.black,
                    fontSize: 20,
                  }}>
                  {calculateDateDifference()}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: colors.primaryGreen,
                  borderRadius: 15,
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                }}>
                <Text
                  style={{
                    fontFamily: 'ssprobold',
                    color: colors.white,
                    fontSize: 20,
                  }}>
                  Days
                </Text>
              </View>
            </View>
          </View>
        </View>
        <LinearGradient
          colors={['#73C5B6', '#156B5D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1.8 }}
          style={{ borderRadius: 10, paddingHorizontal: 20, paddingVertical: 20, marginTop: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
            }}>
            <View>
              <Text
                style={{
                  maxWidth: '70%',
                  fontSize: 20,
                  color: colors.white,
                  fontFamily: 'ssprobold',
                  textAlign: 'center',
                }}>
                {dateToFormat(startDate) + ' - ' + dateToFormat(endDate)}
              </Text>
            </View>
            <View>
              <Button
                label={'Continue'}
                type='primary'
                onPress={handleSavePlan}
                width={120}
                borderRadius={10}
                paddingVertical={10}
              />
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

export default Plan;
