import moment from 'moment';
import { Text, View, TouchableOpacity, Pressable } from 'react-native';
import ImageView from '@src/components/ImageView';
import React, { useState } from 'react';
import { Octicons } from '@expo/vector-icons';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@src/utils/deviceDimensions';
import colors from '@src/styles/colors';

interface FeedCardProps {
  avatar: string;
  username: string;
  posted: Date;
  story: string;
  imageUrl: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isShowConnect: boolean;
  onPressConnect?: (item: any) => void;
}

const FeedsCard = ({
  avatar,
  username,
  posted,
  story,
  imageUrl,
  likes,
  comments,
  isLiked,
  isShowConnect,
}: FeedCardProps) => {
  const [showFullText, setShowFullText] = useState(false);
  const toggleTextDisplay = () => {
    setShowFullText(!showFullText);
  };

  const renderText = (text: string) => {
    const shortText = text.length > 50 ? text.substring(0, 50) + '...' : text;
    const longText = text;

    return showFullText ? longText : shortText;
  };

  const formatPostedAt = (postedAt: Date) => {
    const now = moment();
    const postedMoment = moment(postedAt);

    // Calculate the difference in seconds between now and the postedAt timestamp
    const diffInSeconds = now.diff(postedMoment, 'seconds');

    // Use moment.js to format the difference in a human-readable way
    const formattedPostedAt = moment.duration(diffInSeconds, 'seconds').humanize();

    return formattedPostedAt;
  };

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
        padding: 20,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ overflow: 'hidden' }}>
            <ImageView
              name={'avatar'}
              remoteAssetFullUri={avatar}
              style={{ borderRadius: 100, width: 50, height: 50 }}
              resizeMode='cover'
            />
          </View>
          <View style={{ marginLeft: 20 }}>
            <Text style={{ fontFamily: 'ssprobold', fontSize: 18 }}>{username}</Text>
            <Text style={{ fontFamily: 'sspro', color: '#C0C0C0' }}>{formatPostedAt(posted)} ago</Text>
          </View>
        </View>
        {isShowConnect ? (
          <TouchableOpacity
            style={{ backgroundColor: '#ECECEC', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }}>
            <Text style={{ fontFamily: 'ssprosemibold', color: colors.primaryGreen }}>Connect</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={{ marginTop: 15, marginBottom: 10 }}>
        <Text style={{ fontFamily: 'ssprobold', fontSize: 16 }}>{renderText(story)}</Text>
        {!showFullText && (
          <TouchableOpacity onPress={toggleTextDisplay}>
            <Text style={{ fontFamily: 'sspro', color: colors.primaryGreen }}>Read more</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={{ overflow: 'hidden' }}>
        <ImageView
          name={'header'}
          remoteAssetFullUri={imageUrl}
          resizeMode='cover'
          style={{
            borderRadius: 15,
            width: '100%',
            height: SCREEN_HEIGHT * 0.25,
          }}
        />
      </View>
      <View style={{ flexDirection: 'row', marginTop: 15 }}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Octicons name={isLiked ? 'heart-fill' : 'heart'} size={24} color={isLiked ? '#E74C3C' : '#C0C0C0'} />
          <Text style={{ fontFamily: 'sspro', marginLeft: 5, color: '#C0C0C0' }}>{likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
          <Octicons name='comment' size={24} color={'#c0c0c0'} />
          <Text style={{ fontFamily: 'sspro', marginLeft: 5, color: '#C0C0C0' }}>{comments}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FeedsCard;
