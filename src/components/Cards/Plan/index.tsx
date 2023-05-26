import { Text, View } from 'react-native';
import ImageView from '@src/components/ImageView';
import { Feather, Foundation, FontAwesome } from '@expo/vector-icons';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@src/utils/deviceDimensions';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@src/styles/colors';
import Button from '@src/components/Button';
import { store } from '@src/redux/store';
import { routePlan } from '@src/redux/actions/params';
import { useNavigation } from '@react-navigation/native';

const JournalCard = ({
  id,
  destination,
  duration,
  endDate,
}: {
  id: string;
  destination: string;
  duration: number;
  endDate: string;
}) => {
  const navigation = useNavigation();

  const handleEdit = () => {
    store.dispatch(routePlan({ plan: id }));
    navigation.navigate('EditPlan' as never);
  };
  return (
    <LinearGradient
      colors={['#73C5B6', '#156B5D']}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={{ borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10 }}>
      <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <View>
          <Text style={{ fontSize: 24, color: colors.white, fontFamily: 'ssprobold' }}>{destination}</Text>
          <Text style={{ marginTop: 5, fontSize: 15, color: colors.white, fontFamily: 'ssprosemibold' }}>
            Duration: {duration} days
          </Text>
          <Text style={{ marginTop: 5, fontSize: 15, color: colors.white, fontFamily: 'ssprosemibold' }}>
            {endDate}
          </Text>
        </View>
        <View>
          <Button
            label={'Edit'}
            type='primary'
            onPress={handleEdit}
            width={100}
            borderRadius={10}
            paddingVertical={5}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

export default JournalCard;
