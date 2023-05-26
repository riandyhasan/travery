import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import Page from '@src/screens/Onboarding/Page';
import { useSelector } from 'react-redux';
import { RootState } from '@src/types/Root';
import { useNavigation } from '@react-navigation/native';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@src/utils/deviceDimensions';
import colors from '@src/styles/colors';
import { db } from '@src/utils/firebase';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { decode } from 'base-64';

const ONBOARDING_SCREENS = [
  {
    key: '1',
    name: 'Onboarding Screen 1',
    backgroundSource: require('../../assets/images/onboarding/1.png'),
  },
  {
    key: '2',
    name: 'Onboarding Screen 2',
    backgroundSource: require('../../assets/images/onboarding/2.png'),
  },
  {
    key: '3',
    name: 'Onboarding Screen 3',
    backgroundSource: require('../../assets/images/onboarding/3.png'),
  },
  {
    key: '4',
    name: 'Onboarding Screen 4',
    backgroundSource: require('../../assets/images/onboarding/4.png'),
  },
  {
    key: '5',
    name: 'Onboarding Screen 5',
    backgroundSource: require('../../assets/images/onboarding/5.png'),
  },
];

const Onboarding = () => {
  const state = useSelector((state: RootState) => state);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  const checkIfLogin = async () => {
    const auth = getAuth();
    if (state.user.email !== null && state.auth.auth !== null) {
      const email = state.user.email as string;
      const password = decode(state.auth.auth);
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('TabNavigator' as never);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkIfLogin();
  }, []);

  return !loading ? (
    <View style={{ flex: 1 }}>
      <PagerView style={{ flex: 1 }} initialPage={0}>
        {ONBOARDING_SCREENS.map((screen, idx) => (
          <View key={screen.key}>
            <Page backgroundSource={screen.backgroundSource} name={screen.name} isEnd={idx === 4} />
          </View>
        ))}
      </PagerView>
    </View>
  ) : (
    <View
      style={{ flex: 1, width: SCREEN_WIDTH, height: SCREEN_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size='large' color={colors.primaryGreen} />
    </View>
  );
};

export default Onboarding;
