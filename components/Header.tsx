import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import React from "react";
import BackHandler from "./BackHandler";

const Header = ({
  title,
  backButton = true,
}: {
  title: string | null;
  backButton?: boolean;
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>{backButton && <BackHandler />}</View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.rightContainer}>
        <Text></Text>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingHorizontal: 15,
  },
  leftContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 2,
    alignItems: "center",
  },
  rightContainer: {
    flex: 1,
    alignItems: "flex-end",
  },

  title: {
    fontSize: 18,
    fontWeight: "medium",
  },
});
