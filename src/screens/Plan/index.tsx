import { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import ImageView from '@src/components/ImageView';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@src/utils/deviceDimensions';
import { SimpleLineIcons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { RootState } from '@src/types/Root';
import { UserData } from '@src/types/User';
import { getUserByUsername } from '@src/services/user';
import colors from '@src/styles/colors';
import JournalDrafs from './Draft';
import { getUserPlans } from '@src/services/plan';
import { PlanData } from '@src/types/Plan';
import { store } from '@src/redux/store';
import { routePlan } from '@src/redux/actions/params';

const Plan = () => {
  const navigation = useNavigation();
  const [plans, setPlans] = useState<PlanData[]>([]);
  const user = useSelector((state: RootState) => state.user);

  const fetchUserPlans = async () => {
    const data = await getUserPlans(user.id ?? '');
    if (data !== null) {
      setPlans(data);
    }
  };
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleNewPlan = () => {
    store.dispatch(routePlan({ plan: null }));
    navigation.navigate('EditPlan' as never);
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserPlans();
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'white', position: 'relative' }}>
      <View style={{ position: 'relative', zIndex: 100 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            position: 'absolute',
            top: 50,
            paddingHorizontal: 20,
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={handleGoBack} activeOpacity={0.75}>
            <MaterialIcons name='keyboard-backspace' size={32} color={colors.primaryGreen} />
          </TouchableOpacity>
          <Text style={{ color: colors.primaryGreen, fontSize: 24, fontFamily: 'ssprobold' }}>My Plan</Text>
          <TouchableOpacity onPress={() => null} activeOpacity={0.75} style={{ backgroundColor: 'white' }}>
            <View style={{ backgroundColor: 'white', padding: 6, borderRadius: 20 }}>
              <AntDesign name='logout' size={24} color={'white'} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1, paddingTop: SCREEN_HEIGHT * 0.12, paddingHorizontal: 20 }}>
        <Text style={{ color: colors.primaryGreen, fontSize: 20, fontFamily: 'ssprobold' }}>Draft</Text>
        <View style={{ flex: 1 }}>
          <JournalDrafs data={plans} />
        </View>
      </View>
      <View style={{ flex: 0, height: SCREEN_HEIGHT * 0.152 }}>
        <View
          style={{
            width: '100%',
            backgroundColor: colors.ternaryGreen,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 20,
          }}>
          <Text style={{ fontFamily: 'ssprosemibold', color: colors.primaryGreen }}>{plans.length} Notes</Text>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={handleNewPlan}>
            <Text style={{ fontFamily: 'ssprosemibold', marginRight: 5, color: colors.primaryGreen }}>New Plan</Text>
            <SimpleLineIcons name='note' size={24} color={colors.primaryGreen} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Plan;
