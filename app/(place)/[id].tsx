import { useLocalSearchParams, Stack } from "expo-router";
import { Text, View } from "../../components/Themed";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Image, ScrollView } from "react-native";

const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;

type Place = {
  id: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  region: string[];
  x_featured_media_medium: string;
  x_metadata: {
    gallery: string[];
    location: {
      lat: string;
      lng: string;
      zoom: string;
      address: string;
    };
  };
};

type ImageId = {
  id: string,
  x_featured_media: string,
  x_featured_media_medium: string,
  x_featured_media_large: string,
  x_featured_media_original: string,
}

export default function Place() {
  const { id } = useLocalSearchParams();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Place>();
  const [gallery, setGallery] = useState<ImageId[]>([]);

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

  const getImageGallery = async () => {
    try {
      const galleryIds = data?.x_metadata.gallery;
      const requests = galleryIds?.map(async (imageId) => {
        return fetch(`${baseUrl}/media/${imageId}`).then((response) =>
          response.json()
        );
      });
      const images = await Promise.all(requests || []);
      return images;
    } catch (error) {
      console.error("Ошибка при получении изображений:", error);
      throw error;
    }
  };

  useEffect(() => {
    getPlace();
  }, []);

  useEffect(() => {
    if (data?.x_metadata.gallery) {
      getImageGallery().then(images => {
        setGallery(images);
      });
    }
  }, [data]); 

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
          {gallery.map(item => (
            <Image style={styles.image} key={item.id} source={{ uri: item.x_featured_media_medium }} />
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
