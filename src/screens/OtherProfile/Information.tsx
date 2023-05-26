import { Text, View } from 'react-native';

const ProfileInfo = ({ name, age, gender, bio }: { name: string; age: number; gender: string; bio: string }) => {
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
        padding: 20,
        borderRadius: 20,
      }}>
      <Text style={{ fontFamily: 'ssprobold', fontSize: 24 }}>{name}</Text>
      <View style={{ flexDirection: 'row' }}>
        {age !== 0 ? <Text style={{ color: '#151515', fontFamily: 'sspro' }}>{age} years old</Text> : null}
        {age !== 0 && gender !== '' ? <Text style={{ color: '#151515', fontFamily: 'sspro' }}>, </Text> : null}
        {gender !== '' ? (
          <Text style={{ color: '#151515', fontFamily: 'sspro' }}>
            {gender.charAt(0).toUpperCase() + gender.slice(1)}
          </Text>
        ) : null}
      </View>
      <Text style={{ color: '#151515', fontFamily: 'sspro', textAlign: 'justify', fontSize: 16, marginTop: 10 }}>
        {bio}
      </Text>
    </View>
  );
};

export default ProfileInfo;
