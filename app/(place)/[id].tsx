import { useLocalSearchParams, Stack } from "expo-router";
import { Text, View } from "../../components/Themed";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Image, ScrollView } from "react-native";
import { IPlace, ImageSizes } from "../../config/types";

const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;

export default function Place() {
  const { id } = useLocalSearchParams();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<IPlace>();

  const getPlace = async () => {
    try {
      const response = await fetch(`${baseUrl}/places/${id}`);
      const places = await response.json();
      setData(places);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPlace();
  }, []);

  return (
    <ScrollView>
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen options={{ title: 'назад' }} />
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.content}>
          <Text style={styles.title}>{data?.title.rendered}</Text>
          <Text>{data?.content.rendered}</Text>
          <View style={styles.gallery}>
          {data?.acf.gallery.map(item => (
            <Image style={styles.image} key={item.id} source={{ uri: item.sizes.medium }} />
          ))}
          </View>
        </View>
      )}
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    margin: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 15,
  },
  gallery:{
    display: 'flex',
    gap: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image:{
    width: 300,
    height: 200,
  }
});
