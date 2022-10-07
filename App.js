import { Fontisto } from "@expo/vector-icons";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const WEATHER_API_KEY = "3b9f9dab5de52a5498da660f5adfe008";
const icons = {
  Rain: "rain",
  Clear: "day-sunny",
  Clouds: "cloudy",
  Snow: "cloud-snow",
  Atmosphere: "weather-fog",
  Drizzle: "cloud-drizzle",
  Thunderstorm: "md-thunderstorm-outline",
};
export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [isOK, setIsOK] = useState(true);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setIsOK(false);
      console.log(false);
    }

    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const [location] = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location.city);

    const { daily } = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${WEATHER_API_KEY}&units=metric`
    ).then((response) => response.json());
    setDays(daily);
  };

  const weatherInfo = () => {
    return days.length == 0 ? (
      <View style={{ ...styles.day, alignItems: "center" }}>
        <ActivityIndicator
          color="white"
          size="large"
          style={{ marginTop: 10 }}
        />
      </View>
    ) : (
      days.map((day, index) => {
        const {
          weather: [{ main, description }],
          temp: { day: celsius },
        } = day;
        return (
          <View key={index} style={styles.day}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ ...styles.temp, color: "white" }}>
                {parseFloat(celsius).toFixed(1)}
                <Text style={{ ...styles.tinyText, color: "white" }}>°C</Text>
              </Text>
              <Fontisto name={icons[main]} size={70} color="white" />
            </View>

            <Text style={{ ...styles.description, color: "white" }}>
              {main}
            </Text>
            <Text style={{ ...styles.tinyText, color: "white" }}>
              {description}
            </Text>
          </View>
        );
      })
    );
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.constainer}>
      <View style={styles.city}>
        <Text style={{ ...styles.cityName, color: "white" }}>
          {isOK == true ? city : `😥`}
        </Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {isOK == true ? (
          weatherInfo()
        ) : (
          <View style={{ ...styles.day, alignItems: "center", paddingLeft: 0 }}>
            <Text style={{ ...styles.description, paddingTop: 30 }}>WHY?!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    padding: 20,
  },
  temp: {
    marginTop: 50,
    fontSize: 90,
  },
  description: {
    marginTop: -30,
    fontSize: 50,
  },
  tinyText: {
    marginTop: -10,
    fontSize: 20,
    paddingLeft: 5,
  },
});
