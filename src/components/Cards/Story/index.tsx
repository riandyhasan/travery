import { Text, View } from 'react-native';
import ImageView from '@src/components/ImageView';
import { Feather, Foundation, FontAwesome } from '@expo/vector-icons';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@src/utils/deviceDimensions';

const StoryCard = ({
  title,
  imageUrl,
  day,
  location,
  journal,
}: {
  title: string;
  imageUrl: string;
  day: string;
  location: string;
  journal: string;
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
      }}>
      <View style={{ overflow: 'hidden' }}>
        <ImageView
          name={'header'}
          remoteAssetFullUri={imageUrl}
          resizeMode='cover'
          style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            width: '100%',
            height: SCREEN_HEIGHT * 0.15,
          }}
        />
      </View>
      <View style={{ paddingHorizontal: 10, paddingBottom: 20 }}>
        <Text style={{ fontFamily: 'ssprosemibold', fontSize: 20 }}>{title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
          <FontAwesome name='plane' color='#808080' size={18} />
          <Text style={{ fontFamily: 'sspro', color: '#A1A1A1', marginLeft: 15 }}>{journal}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <FontAwesome name='calendar' color='#808080' size={16} />
          <Text style={{ fontFamily: 'sspro', color: '#A1A1A1', marginLeft: 15 }}>{day}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <FontAwesome name='map-marker' color='#808080' size={18} style={{ marginLeft: 2 }} />
          <Text style={{ fontFamily: 'sspro', color: '#A1A1A1', marginLeft: 18 }}>{location}</Text>
        </View>
      </View>
    </View>
  );
};

export default StoryCard;
