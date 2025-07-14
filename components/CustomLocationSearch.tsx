import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

interface Place {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface CustomLocationSearchProps {
  placeholder?: string;
  onLocationSelect: (data: any, details: any) => void;
  leftIcon?: React.ReactNode;
}

const CustomLocationSearch: React.FC<CustomLocationSearchProps> = ({
  placeholder = "Search location",
  onLocationSelect,
  leftIcon,
}) => {
  const theme = useColorScheme() as "light" | "dark";
  const styles = createStyles(theme);

  const [searchText, setSearchText] = useState("");
  const [predictions, setPredictions] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasError, setHasError] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const API_KEY = "AIzaSyAsQaw80JUEAI_a82j_1bp366sei7GibWY";

  // Fetch place predictions
  const fetchPredictions = async (input: string) => {
    if (input.length < 2) {
      setPredictions([]);
      setShowSuggestions(false);
      setHasError(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          input
        )}&key=${API_KEY}&language=en&types=geocode`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "OK") {
        setPredictions(data.predictions);
        setShowSuggestions(true);
        setHasError(false);
      } else if (data.status === "REQUEST_DENIED") {
        console.error("Places API access denied. Check API key and billing.");
        setHasError(true);
        setPredictions([]);
        setShowSuggestions(false);
      } else if (data.status === "OVER_QUERY_LIMIT") {
        console.error("Places API quota exceeded.");
        setHasError(true);
        setPredictions([]);
        setShowSuggestions(false);
      } else {
        console.log("Places API error:", data.status);
        setPredictions([]);
        setShowSuggestions(false);
        setHasError(true);
      }
    } catch (error) {
      console.error("Error fetching predictions:", error);
      setPredictions([]);
      setShowSuggestions(false);
      setHasError(true);

      // Show user-friendly error message
      if (
        error instanceof TypeError &&
        error.message.includes("Network request failed")
      ) {
        console.log("Network connectivity issue detected");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch place details
  const fetchPlaceDetails = async (placeId: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_address,geometry,name&key=${API_KEY}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "OK") {
        const place = data.result;
        const details = {
          geometry: {
            location: {
              lat: place.geometry.location.lat,
              lng: place.geometry.location.lng,
            },
          },
          formatted_address: place.formatted_address,
          name: place.name,
        };

        onLocationSelect(
          { place_id: placeId, description: place.formatted_address },
          details
        );
      } else {
        console.error("Error fetching place details:", data.status);
        Alert.alert(
          "Error",
          "Unable to fetch location details. Please try again."
        );
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
      Alert.alert(
        "Error",
        "Network error. Please check your connection and try again."
      );
    }
  };

  // Handle text input changes with debouncing
  const handleTextChange = (text: string) => {
    setSearchText(text);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debouncing
    searchTimeoutRef.current = setTimeout(() => {
      fetchPredictions(text);
    }, 300);
  };

  // Handle place selection
  const handlePlaceSelect = (place: Place) => {
    setSearchText(place.description);
    setShowSuggestions(false);
    setPredictions([]);
    setHasError(false);
    fetchPlaceDetails(place.place_id);
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (predictions.length > 0 && !hasError) {
      setShowSuggestions(true);
    }
  };

  // Handle input blur
  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for touch events
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  // Render prediction item
  const renderPrediction = ({ item }: { item: Place }) => (
    <Pressable
      style={styles.predictionItem}
      onPress={() => handlePlaceSelect(item)}
    >
      <View style={styles.predictionContent}>
        <Text style={styles.mainText}>
          {item.structured_formatting?.main_text || item.description}
        </Text>
        {item.structured_formatting?.secondary_text && (
          <Text style={styles.secondaryText}>
            {item.structured_formatting.secondary_text}
          </Text>
        )}
      </View>
    </Pressable>
  );

  // Render error message
  const renderErrorMessage = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>
        Unable to fetch locations. Please check your internet connection.
      </Text>
    </View>
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors[theme].text_secondary}
          value={searchText}
          onChangeText={handleTextChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          autoCorrect={false}
          autoCapitalize="none"
        />

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color={Colors[theme].primary_color}
            />
          </View>
        )}
      </View>

      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          {hasError ? (
            renderErrorMessage()
          ) : (
            <FlatList
              data={predictions}
              renderItem={renderPrediction}
              keyExtractor={(item) => item.place_id}
              style={styles.suggestionsList}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </View>
      )}
    </View>
  );
};

const createStyles = (theme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors[theme].background_light,
      borderWidth: 1,
      borderColor: Colors[theme].border,
      borderRadius: 12,
      marginTop: 12,
      zIndex: 50,
      elevation: 50,
      position: "relative",
    },
    iconContainer: {
      paddingLeft: 15,
      paddingVertical: 17,
      zIndex: 51,
    },
    inputContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },
    input: {
      flex: 1,
      fontSize: 16,
      fontWeight: "500",
      backgroundColor: "transparent",
      color: Colors[theme].text,
      height: 54,
      marginLeft: 10,
      paddingVertical: 0,
    },
    loadingContainer: {
      paddingRight: 15,
    },
    suggestionsContainer: {
      position: "absolute",
      top: 60,
      left: 0,
      width: Dimensions.get("window").width - 38,
      backgroundColor: Colors[theme].background_light,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors[theme].border,
      zIndex: 999,
      elevation: 999,
      maxHeight: 200,
    },
    suggestionsList: {
      borderRadius: 12,
    },
    predictionItem: {
      padding: 15,
      backgroundColor: "transparent",
    },
    predictionContent: {
      flex: 1,
    },
    mainText: {
      color: Colors[theme].text,
      fontSize: 16,
      fontWeight: "500",
      marginBottom: 2,
    },
    secondaryText: {
      color: Colors[theme].text_secondary,
      fontSize: 14,
    },
    separator: {
      height: 1,
      backgroundColor: Colors[theme].border,
      marginHorizontal: 15,
    },
    errorContainer: {
      padding: 15,
      alignItems: "center",
    },
    errorText: {
      color: Colors[theme].text_secondary,
      fontSize: 14,
      textAlign: "center",
    },
  });

export default CustomLocationSearch;
