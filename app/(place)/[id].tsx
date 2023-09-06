import { useLocalSearchParams, Stack } from "expo-router";
import { Text, View } from "../../components/Themed";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Image, ScrollView, Button } from "react-native";
import { IPlace, RenderedText } from "../../config/types";
import ImageList from "../../components/ImageList";
import ImageView from "react-native-image-viewing";

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
            <Button title="Показать фото" onPress={() => setIsVisible(true)} />
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
  }
});
