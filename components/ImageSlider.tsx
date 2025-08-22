import React, { useState, useRef } from "react";
import {
  View,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  Pressable,
} from "react-native";
import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

const { width: screenWidth } = Dimensions.get("window");

interface ImageSliderProps {
  images: Array<{
    id: number;
    image: string;
    title?: string;
    description?: string;
  }>;
  height?: number;
  showDots?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  height = 200,
  showDots = true,
  autoPlay = true,
  autoPlayInterval = 4000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const colorScheme = useColorScheme() as "light" | "dark";

  React.useEffect(() => {
    if (autoPlay && images?.length > 1) {
      const interval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % images?.length;
        setCurrentIndex(nextIndex);
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [currentIndex, images?.length, autoPlay, autoPlayInterval]);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth);
    setCurrentIndex(index);
  };

  const renderImageItem = ({ item }: { item: any }) => (
    <View style={[styles.imageContainer, { height }]}>
      <Image
        source={
          item?.image?.includes("http")
            ? { uri: item?.image }
            : require("@/assets/images/banner1.png")
        }
        style={styles.image}
        resizeMode="cover"
        defaultSource={require("@/assets/images/banner1.png")}
      />
      {/* {(item.title || item.description) && (
        <View style={styles.overlay}>
          {item.title && <Text style={styles.title}>{item.title}</Text>}
          {item.description && (
            <Text style={styles.description}>{item.description}</Text>
          )}
        </View>
      )} */}
    </View>
  );

  const renderDot = (index: number) => (
    <Pressable
      key={index}
      style={[
        styles.dot,
        {
          backgroundColor:
            index === currentIndex
              ? Colors[colorScheme].primary_color
              : Colors[colorScheme].border,
        },
      ]}
      onPress={() => {
        setCurrentIndex(index);
        flatListRef.current?.scrollToIndex({
          index,
          animated: true,
        });
      }}
    />
  );

  if (!images || images?.length === 0) {
    return (
      <View style={[styles.placeholder]}>
        {/* <Text style={styles.placeholderText}>No Promotions Available</Text> */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderImageItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={screenWidth}
        decelerationRate="fast"
        getItemLayout={(data, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
      />

      {showDots && images?.length > 1 && (
        <View style={styles.dotsContainer}>
          {images?.map((_, index) => renderDot(index))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  imageContainer: {
    width: screenWidth, // Account for horizontal margins
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 0,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
    paddingBottom: 30,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    color: "white",
    fontSize: 14,
    opacity: 0.9,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  placeholder: {
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    // paddingTop: 70,
    // marginHorizontal: 20,
    width: "100%",
  },
  placeholderText: {
    color: "#666",
    fontSize: 16,
  },
});

export default ImageSlider;
