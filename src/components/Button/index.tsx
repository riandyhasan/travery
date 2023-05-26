import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '@src/styles/colors';
import { LinearGradient } from 'expo-linear-gradient';

export interface ButtonProps {
  type: 'gradient' | 'primary' | 'outline';
  label: string;
  onPress: () => void;
  width?: number;
  borderRadius?: number;
  paddingVertical?: number;
}

const CustomButton = ({ type = 'primary', label, onPress, width, borderRadius, paddingVertical }: ButtonProps) => {
  switch (type) {
    case 'gradient':
      return (
        <TouchableOpacity
          style={[
            styles.greenGradient,
            {
              width: width !== null && width !== undefined ? width : 250,
              borderRadius: borderRadius !== null && borderRadius !== undefined ? borderRadius : 80,
            },
          ]}
          onPress={onPress}>
          <LinearGradient
            colors={['#73C5B6', '#156B5D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.greenGradient,
              {
                width: width !== null && width !== undefined ? width : 250,
                borderRadius: borderRadius !== null && borderRadius !== undefined ? borderRadius : 80,
              },
            ]}>
            <Text style={styles.textPrimary}>{label}</Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    case 'outline':
      return (
        <TouchableOpacity
          style={[
            styles.outline,
            {
              width: width !== null && width !== undefined ? width : 250,
              borderRadius: borderRadius !== null && borderRadius !== undefined ? borderRadius : 80,
            },
          ]}
          onPress={onPress}>
          <Text style={styles.textPrimary}>{label}</Text>
        </TouchableOpacity>
      );
    default:
      return (
        <TouchableOpacity
          style={[
            styles.greenPrimary,
            {
              width: width !== null && width !== undefined ? width : 250,
              borderRadius: borderRadius !== null && borderRadius !== undefined ? borderRadius : 80,
              paddingVertical: paddingVertical !== null && paddingVertical !== undefined ? paddingVertical : 15,
            },
          ]}
          onPress={onPress}>
          <Text style={styles.textPrimary}>{label}</Text>
        </TouchableOpacity>
      );
  }
};

const styles = StyleSheet.create({
  greenPrimary: {
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    // paddingVertical: 15,
  },
  outline: {
    borderWidth: 3,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  greenGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  textPrimary: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'ubuntubold',
  },
  textOutline: {
    fontSize: 20,
    color: colors.primaryGreen,
    fontFamily: 'ubuntubold',
  },
});

export default CustomButton;
