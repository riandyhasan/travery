import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { MaterialIcons, Octicons, Feather, Fontisto } from '@expo/vector-icons';
import colors from '@src/styles/colors';
import { useNavigation } from '@react-navigation/native';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@src/utils/deviceDimensions';
import Button from '@src/components/Button';
import { db } from '@src/utils/firebase';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getUserByUsername } from '@src/services/user';
import Toast from 'react-native-toast-message';
import { store } from '@src/redux/store';
import { userData } from '@src/redux/actions/user';
import { authLogin } from '@src/redux/actions/auth';
import { encode } from 'base-64';

const SignUp = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rePassword, setRePassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isShowRePassword, setIsShowRePassword] = useState<boolean>(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleToLogin = () => {
    navigation.navigate('Login' as never);
  };

  const handleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const handleShowRePassword = () => {
    setIsShowRePassword(!isShowRePassword);
  };

  const validationForm = (): string => {
    let errors = '';

    if (password != rePassword) {
      errors = 'Confirm password is not equal to password';
    }
    if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phone)) {
      errors = 'Phone number is not valid';
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors = 'Username can only contain aplhanumeric and underscore';
    }

    if (email === '' || password === '' || username === '' || rePassword === '' || phone == '') {
      errors = 'Please fill the form!';
    }
    return errors;
  };

  const handleSignUp = async () => {
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
    if (db_username !== null) {
      Toast.show({
        type: 'error',
        text1: 'Username is already taken',
      });
      return;
    }

    try {
      const auth = getAuth();
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'user', user.uid), {
        username: username,
        name: '',
        email: user.email,
        phone: phone,
        avatar: '',
        age: 0,
        gender: '',
        bio: '',
        followers: [],
        followings: [],
      });
      store.dispatch(authLogin({ auth: encode(password) }));
      store.dispatch(userData({ id: user.uid, email: email, username: username, name: '', avatar: '' }));
      Toast.show({
        type: 'success',
        text1: 'Successfully registered',
      });
      setTimeout(() => {
        navigation.navigate('TabNavigator' as never);
      }, 2000);
    } catch (error: Error | any) {
      // Handle sign up error, e.g., display an error message
      if (error.code === 'auth/email-already-in-use') {
        Toast.show({
          type: 'error',
          text1: 'Email already exists',
        });
      } else if (error.code === 'auth/invalid-email') {
        Toast.show({
          type: 'error',
          text1: 'Email is invalid',
        });
      } else if (error.code === 'auth/weak-password') {
        Toast.show({
          type: 'error',
          text1: 'Weak password',
          text2: 'Password should be at least 6 characters',
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
        <Text style={styles.header}>Create an Account</Text>
        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <Octicons name='person' size={24} color={colors.ternaryGray} style={styles.icon} />
          </View>
          <TextInput style={styles.input} placeholder='Username' value={username} onChangeText={setUsername} />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <Feather name='phone' size={24} color={colors.ternaryGray} style={styles.icon} />
          </View>
          <TextInput style={styles.input} placeholder='Phone' value={phone} onChangeText={setPhone} />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <Fontisto name='email' size={24} color={colors.ternaryGray} style={styles.icon} />
          </View>
          <TextInput style={styles.input} placeholder='Email' value={email} onChangeText={setEmail} />
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
        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <Octicons name='key' size={24} color={colors.ternaryGray} style={styles.icon} />
          </View>
          <TextInput
            style={styles.input}
            placeholder='Re-enter password'
            secureTextEntry={!isShowPassword}
            value={rePassword}
            onChangeText={setRePassword}
          />
          <View style={styles.iconRightContainer}>
            <TouchableOpacity onPress={handleShowRePassword}>
              <Octicons
                name={isShowRePassword ? 'eye' : 'eye-closed'}
                size={20}
                color={colors.ternaryGray}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Button label={'Sign Up'} type={'gradient'} onPress={handleSignUp} />
        <Text style={styles.login}>
          Have an account?{' '}
          <Pressable style={{ marginBottom: -3 }} onPress={handleToLogin}>
            <Text style={styles.loginLink}>Login</Text>
          </Pressable>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: SCREEN_HEIGHT * 0.15,
    alignItems: 'center',
  },
  header: {
    color: colors.primaryGreen,
    fontSize: 36,
    fontFamily: 'ssprobold',
    marginTop: 40,
    marginBottom: 60,
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
  login: {
    fontSize: 16,
    fontFamily: 'sspro',
    marginTop: SCREEN_HEIGHT * 0.125,
  },
  loginLink: {
    fontSize: 16,
    color: colors.primaryGreen,
    fontFamily: 'ssprobold',
  },
});

export default SignUp;
