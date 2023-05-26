import React from 'react';
import { View, ImageBackground, ImageSourcePropType, useWindowDimensions } from 'react-native';
import Button from '@src/components/Button';
import { useNavigation } from '@react-navigation/native';

const Page = ({ backgroundSource, isEnd }: { backgroundSource: ImageSourcePropType; name: string; isEnd: boolean }) => {
  const windowHeight = useWindowDimensions().height;
  const MARGIN = windowHeight * 0.55;
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate('Login' as never);
  };

  const handleRegister = () => {
    navigation.navigate('SignUp' as never);
  };

  return (
    <View
      style={{
        flex: 1,
        height: '100%',
        width: '100%',
      }}>
      <ImageBackground
        source={backgroundSource}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        resizeMode={'contain'}
      />
      {isEnd ? (
        <View style={{ position: 'absolute', top: MARGIN, left: 0, right: 0, bottom: 0, zIndex: 100 }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button label={'Login'} type={'gradient'} onPress={handleLogin} />
            <View style={{ marginBottom: 10 }} />
            <Button label={'Create an Account'} type={'outline'} onPress={handleRegister} />
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default Page;
