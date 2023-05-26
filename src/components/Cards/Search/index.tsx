import { Text, View, TouchableOpacity, Pressable } from 'react-native';
import ImageView from '@src/components/ImageView';
import React, { useState } from 'react';
import { Octicons } from '@expo/vector-icons';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@src/utils/deviceDimensions';
import colors from '@src/styles/colors';

const SearchCard = ({
  name,
  imageUrl,
  likes,
  comment,
}: {
  name: string;
  imageUrl: string;
  likes: number;
  comment: number;
}) => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 10,
      }}>
      <View style={{ overflow: 'hidden' }}>
        <ImageView
          name={'header'}
          remoteAssetFullUri={imageUrl}
          resizeMode='cover'
          style={{
            borderRadius: 15,
            width: '100%',
            height: SCREEN_HEIGHT * 0.15,
          }}
        />
      </View>
      <View style={{ marginTop: 15, marginBottom: 10 }}>
        <Text style={{ fontFamily: 'ssprobold', fontSize: 16 }}>{name}</Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 0 }}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Octicons name='heart' size={24} color={'#C0C0C0'} />
          <Text style={{ fontFamily: 'sspro', marginLeft: 5, color: '#C0C0C0' }}>{likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
          <Octicons name='comment' size={24} color={'#c0c0c0'} />
          <Text style={{ fontFamily: 'sspro', marginLeft: 5, color: '#C0C0C0' }}>{comment}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchCard;
