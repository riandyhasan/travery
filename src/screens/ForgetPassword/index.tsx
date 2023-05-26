import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { MaterialIcons, Octicons, Entypo, Fontisto } from '@expo/vector-icons';
import colors from '@src/styles/colors';
import { useNavigation } from '@react-navigation/native';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@src/utils/deviceDimensions';
import Button from '@src/components/Button';
import Toast from 'react-native-toast-message';
import { db } from '@src/utils/firebase';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState<string>('');

  const validationForm = (): string => {
    let errors = '';

    if (email === '') {
      errors = 'Please fill the form!';
    }
    return errors;
  };

  const handleLogin = async () => {
    const err = validationForm();
    if (err !== '') {
      Toast.show({
        type: 'error',
        text1: err,
      });
      console.log(err);
      return;
    }

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      Toast.show({
        type: 'success',
        text1: 'Reset email sent',
      });
    } catch (error: Error | any) {
      // Handle sign up error, e.g., display an error message
      Toast.show({
        type: 'error',
        text1: 'Internal server error',
      });
      console.log('Sign Up Error:', error.message);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleToForgetPassword = () => {
    navigation.navigate('SignUp' as never);
  };

  const handleToSignUp = () => {
    navigation.navigate('Login' as never);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ zIndex: 100 }}>
        <Toast position='top' topOffset={SCREEN_HEIGHT * 0.1} />
      </View>
      <TouchableOpacity
        style={{ position: 'absolute', top: SCREEN_HEIGHT * 0.08, left: SCREEN_WIDTH * 0.08, zIndex: 100 }}
        onPress={handleGoBack}>
        <MaterialIcons name='keyboard-backspace' size={32} color={colors.primaryGreen} />
      </TouchableOpacity>
      <View style={styles.container}>
        <LinearGradient
          colors={['#73C5B6', '#156B5D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1.2 }}
          style={{
            padding: 30,
            borderRadius: 100,
            marginBottom: 20,
          }}>
          <Entypo name='lock' size={100} color={colors.white} />
        </LinearGradient>
        <Text style={styles.header}>Trouble Logging in?</Text>
        <Text style={{ fontFamily: 'sspro', textAlign: 'center', maxWidth: '80%', marginBottom: 30 }}>
          Enter your email and we'll send you a link to get back into your account.
        </Text>
        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <Fontisto name='email' size={24} color={colors.ternaryGray} style={styles.icon} />
          </View>
          <TextInput style={styles.input} placeholder='Email' value={email} onChangeText={setEmail} />
        </View>
        <Button label={'Send'} type={'gradient'} onPress={handleLogin} />
        <Text style={styles.signup}>
          Back to{' '}
          <Pressable style={{ marginBottom: -3 }} onPress={handleToSignUp}>
            <Text style={styles.signUpLink}>Login</Text>
          </Pressable>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: SCREEN_HEIGHT * 0.2,
    alignItems: 'center',
  },
  header: {
    color: colors.primaryGreen,
    fontSize: 24,
    fontFamily: 'ssprobold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#D7D3D3',
    borderRadius: 80,
    marginTop: 10,
  },
  iconContainer: {
    position: 'absolute',
    top: 10,
    left: 20,
  },
  iconRightContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  icon: {
    marginRight: 10,
    opacity: 0.5,
  },
  input: {
    width: '80%',
    height: 40,
    paddingHorizontal: 55,
  },
  forgotPass: {
    fontFamily: 'ssprobold',
    fontSize: 16,
    marginTop: 15,
  },
  signup: {
    fontSize: 16,
    fontFamily: 'sspro',
    marginTop: SCREEN_HEIGHT * 0.2,
  },
  signUpLink: {
    fontSize: 16,
    color: colors.primaryGreen,
    fontFamily: 'ssprobold',
  },
});

export default Login;
