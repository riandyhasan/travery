import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import colors from '@src/styles/colors';
import { useNavigation } from '@react-navigation/native';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@src/utils/deviceDimensions';
import Button from '@src/components/Button';
import Toast from 'react-native-toast-message';
import { db } from '@src/utils/firebase';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getUserByUsername } from '@src/services/user';
import { store } from '@src/redux/store';
import { userData } from '@src/redux/actions/user';
import { authLogin } from '@src/redux/actions/auth';
import { encode } from 'base-64';

const Login = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const validationForm = (): string => {
    let errors = '';

    if (password === '' || username === '') {
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

    const db_username = await getUserByUsername(username);
    if (db_username === null) {
      Toast.show({
        type: 'error',
        text1: 'Username or password is wrong',
      });
      return;
    }

    const email = db_username.email;

    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      store.dispatch(authLogin({ auth: encode(password) }));
      store.dispatch(
        userData({
          id: db_username.id,
          email: db_username.email,
          username: db_username.username,
          name: db_username.name,
          avatar: db_username.avatar,
        })
      );
      Toast.show({
        type: 'success',
        text1: 'Successfully logged in',
      });
      setTimeout(() => {
        navigation.navigate('TabNavigator' as never);
      }, 2000);
    } catch (error: Error | any) {
      // Handle sign up error, e.g., display an error message
      if (error.code === 'auth/wrong-password') {
        Toast.show({
          type: 'error',
          text1: 'Username or password is wrong',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Internal server error',
        });
      }
      console.log('Sign Up Error:', error.message);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const handleToForgetPassword = () => {
    navigation.navigate('ForgetPassword' as never);
  };

  const handleToSignUp = () => {
    navigation.navigate('SignUp' as never);
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
        <Text style={styles.header}>Travery</Text>
        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <Octicons name='person' size={24} color={colors.ternaryGray} style={styles.icon} />
          </View>
          <TextInput style={styles.input} placeholder='Username' value={username} onChangeText={setUsername} />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <Octicons name='key' size={24} color={colors.ternaryGray} style={styles.icon} />
          </View>
          <TextInput
            style={styles.input}
            placeholder='Password'
            secureTextEntry={!isShowPassword}
            value={password}
            onChangeText={setPassword}
          />
          <View style={styles.iconRightContainer}>
            <TouchableOpacity onPress={handleShowPassword}>
              <Octicons
                name={isShowPassword ? 'eye' : 'eye-closed'}
                size={20}
                color={colors.ternaryGray}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Button label={'Login'} type={'gradient'} onPress={handleLogin} />
        <Pressable onPress={handleToForgetPassword}>
          <Text style={styles.forgotPass}>Forgot Password?</Text>
        </Pressable>
        <Text style={styles.signup}>
          Don't have an account?{' '}
          <Pressable style={{ marginBottom: -3 }} onPress={handleToSignUp}>
            <Text style={styles.signUpLink}>Sign Up</Text>
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
    fontSize: SCREEN_WIDTH * 0.2,
    fontFamily: 'ssprobold',
    marginBottom: 70,
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
