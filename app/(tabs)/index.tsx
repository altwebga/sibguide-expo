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
  x_featured_media_large: string;
};

const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;

export default function Places() {
  const [isLoading, setLoading] = useState(true);
  const [isFooterLoading, setFooterLoading] = useState(false); // Стейт для индикатора загрузки внизу
  const [data, setData] = useState<Places[]>([]);
  const [pagination, setPagination] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const getPlaces = async (page = 1) => {
    try {
      setFooterLoading(true);
      const response = await fetch(`${baseUrl}/places?page=${page}`);
      const places = await response.json();
      setData(prevData => [...prevData, ...places]);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
    } else {
        setError('Произошла неизвестная ошибка.');
    }
    } finally {
      setLoading(false);
      setFooterLoading(false);
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
          onEndReached={() => {
            setPagination(prevPage => prevPage + 1); // увеличить страницу
            getPlaces(pagination + 1); // загрузить данные следующей страницы
          }}
          onEndReachedThreshold={0.5}
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
              <Pressable style={styles.placeCard}>
                <Image
                  source={{ uri: item.x_featured_media_large }}
                  style={{ width: 300, height: 200 }}
                />
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{item.title.rendered}</Text>
                </View>
              </Pressable>
            </Link>
          )}
          ListFooterComponent={() => {
            return isFooterLoading ? <ActivityIndicator /> : null;
          }}
        />
      )}

      {error && <Text>{error}</Text>}
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
    padding: 10,
    width: 320,
    display:'flex',
    flexDirection:'column',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 5,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  titleContainer:{
    paddingVertical: 20,
    paddingHorizontal:5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
