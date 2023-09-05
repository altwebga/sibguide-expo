import { StyleSheet, ActivityIndicator, FlatList, Image, Pressable } from "react-native";
import { Text, View } from "../../components/Themed";
import { useEffect, useState } from "react";
import { Link } from "expo-router";

type Places = {
  id: string;
  slug: string;
  title: {
    rendered: string;
  };
  region: string[];
  x_featured_media_medium: string;
};

const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;

export default function Places() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Places[]>([]);

  const getPlaces = async () => {
    try {
      const response = await fetch(`${baseUrl}/places`);
      const places = await response.json();
      setData(places);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPlaces();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => (           
            <Link href={{
              pathname: "/(place)/[id]",
              params: { 
                id: item.id,
                slug: item.slug,
                title: item.title.rendered
               }
            }} asChild>
              <Pressable>
              <Image
                source={{ uri: item.x_featured_media_medium }}
                style={{ width: 300, height: 200 }}
              />
              <Text style={styles.title}>{item.title.rendered}</Text>
              </Pressable>
            </Link>
    
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  placeCard:{
    display:'flex',
    flexDirection:'row',
    marginTop: 5
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
