import { useLocalSearchParams, Stack } from 'expo-router';
import { Text, View } from '../../components/Themed';

export default function Place() {
  const { id, slug, title } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Stack.Screen options={{ headerShown: false }} />
    <Text>{title}</Text>
    </View>
  );
}
