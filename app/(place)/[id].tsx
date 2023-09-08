import { useLocalSearchParams, Stack } from "expo-router";
import { Text, View } from "../../components/Themed";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { IPlace } from "../../config/types";
import ImageView from "react-native-image-viewing";
import { Ionicons } from '@expo/vector-icons';

const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;

export default function Place() {
  const { id } = useLocalSearchParams();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<IPlace>();
  const [visible, setIsVisible] = useState(false);

  function decodeHtmlNumericEntities(str: string | undefined) {
    if (!str) {
      return "";
    }
    return str.replace(/&#(\d+);/g, (match, dec) => {
      return String.fromCharCode(dec);
    });
  }

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

  const images =
    data?.acf.gallery.map((item) => ({
      uri: item.sizes.large,
    })) || [];

  return (
    <ScrollView>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Stack.Screen options={{ title: "К списку мест" }} />
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.content}>
            <Text style={styles.title}>{data?.title.rendered}</Text>
            <Text>{decodeHtmlNumericEntities(data?.content.rendered)}</Text>
            <Pressable style={styles.btn} onPress={() => setIsVisible(true)}>
            <Ionicons name="images-outline" size={24} color="black" />
            <Text>Показать фото</Text>
            </Pressable>
            <ImageView
              images={images}
              imageIndex={0}
              visible={visible}
              onRequestClose={() => setIsVisible(false)}
            />
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
  btn:{
    display: 'flex',
    alignItems: "center",
    flexDirection:'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 15,
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderWidth:2,
  }
});
