import { router } from "expo-router";
import React, { useState } from "react";
import {
  ImageBackground,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from "react-native";
import Images from "@/constants/Images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import clsx from "clsx";
import { Text, View, Button } from "@/components/Themed";
import i18n from "@/i18n";
import { useAuthStore } from "@/store/auth.store";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import LottieView from "lottie-react-native";
interface insets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

const SkipButton = ({
  insets,
  setOnboarded,
}: {
  insets: insets;
  setOnboarded: (prop: boolean) => void;
}) => {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);
  return (
    <TouchableOpacity
      style={[styles.skipButton, { top: 10 }]}
      onPress={() => {
        setOnboarded(true);
        router.replace("/(public)/login");
      }}
    >
      <Text style={styles.skipText}>{i18n.t("onboarding.skip")}</Text>
    </TouchableOpacity>
  );
};

const Indicator = ({
  currentStep,
  setStep,
}: {
  currentStep: number;
  setStep: (step: number) => void;
}) => {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);
  return (
    <View style={styles.indicatorContainer}>
      <Pressable
        onPress={() => setStep(1)}
        style={[
          styles.indicator,
          currentStep === 1 ? styles.indicatorActive : styles.indicatorInactive,
        ]}
      />
      <Pressable
        onPress={() => setStep(2)}
        style={[
          styles.indicator,
          currentStep === 2 ? styles.indicatorActive : styles.indicatorInactive,
        ]}
      />
      <Pressable
        onPress={() => setStep(3)}
        style={[
          styles.indicator,
          currentStep === 3 ? styles.indicatorActive : styles.indicatorInactive,
        ]}
      />
    </View>
  );
};

const SplashCard = ({
  title,
  subtitle,
  onPressContinue,
  currentStep,
  setStep,
  buttonText,
}: {
  title: string;
  subtitle: string;
  onPressContinue: () => void;
  currentStep: number;
  setStep: (step: number) => void;
  buttonText: string;
}) => {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
      <Indicator currentStep={currentStep} setStep={setStep} />
      <Button
        variant="primary"
        size="small"
        title={buttonText}
        onPress={onPressContinue}
        style={{ paddingVertical: 17, width: "55%", borderRadius: 15 }}
      />
    </View>
  );
};

const Onboarding = () => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);
  const { setOnboarded } = useAuthStore();
  const [splash, setSplash] = useState<1 | 2 | 3>(1);

  const handleSetStep = (step: number) => {
    setSplash(step as 1 | 2 | 3);
  };

  return (
    <View
      // source={Images.onboarding.splashBg}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: 20 }]}
    >
      <SkipButton insets={insets} setOnboarded={setOnboarded} />

      {splash === 1 && (
        <LottieView
          autoPlay
          // ref={animation}
          style={{
            width: 350,
            height: 350,
            backgroundColor: "transparent",
          }}
          source={require("@/assets/lotties/order.json")}
          imageAssetsFolder="assets/lotties"
        />
      )}
      {splash === 2 && (
        <LottieView
          autoPlay
          // ref={animation}
          style={{
            width: 350,
            height: 350,
            backgroundColor: "transparent",
          }}
          source={require("@/assets/lotties/shopping.json")}
          imageAssetsFolder="assets/lotties"
        />
      )}
      {splash === 3 && (
        <LottieView
          autoPlay
          // ref={animation}
          style={{
            width: 600,
            height: 600,
            backgroundColor: "transparent",
            marginBottom: -100,
          }}
          source={require("@/assets/lotties/delivery.json")}
          imageAssetsFolder="assets/lotties"
        />
      )}
      {splash === 1 ? (
        <SplashCard
          title={i18n.t("onboarding.splash_title_1")}
          subtitle={i18n.t("onboarding.splash_subtitle_1")}
          onPressContinue={() => setSplash(2)}
          currentStep={splash}
          setStep={handleSetStep}
          buttonText={i18n.t("onboarding.next")}
        />
      ) : splash === 2 ? (
        <SplashCard
          title={i18n.t("onboarding.splash_title_2")}
          subtitle={i18n.t("onboarding.splash_subtitle_2")}
          onPressContinue={() => {
            setSplash(3);
          }}
          currentStep={splash}
          setStep={handleSetStep}
          buttonText={i18n.t("onboarding.next")}
        />
      ) : (
        <SplashCard
          title={i18n.t("onboarding.splash_title_3")}
          subtitle={i18n.t("onboarding.splash_subtitle_3")}
          onPressContinue={() => {
            router.replace("/(public)/login");
            setOnboarded(true);
          }}
          currentStep={splash}
          setStep={handleSetStep}
          buttonText={i18n.t("onboarding.lets_start")}
        />
      )}
    </View>
  );
};

export default Onboarding;

const createStyles = (theme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      paddingHorizontal: 20,
      backgroundColor: Colors[theme].primary_color,
    },
    skipButton: {
      position: "absolute",
      right: 15,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 8,
    },
    skipText: {
      color: Colors[theme].text_white,
      fontSize: 14,
      fontWeight: "medium",
    },
    card: {
      width: "100%",
      padding: 15,
      paddingVertical: 40,
      borderRadius: 48,
      alignItems: "center",
    },
    cardTitle: {
      //   color: 'primary',
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
    },
    cardSubtitle: {
      //   color: 'light',
      textAlign: "center",
      fontSize: 14,
      fontWeight: "medium",
      marginVertical: 16,
      marginHorizontal: 15,
    },
    indicatorContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 30,
    },
    indicator: {
      height: 6,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    indicatorActive: {
      height: 18,
      width: 6,
      backgroundColor: Colors[theme].primary_color,
    },
    indicatorInactive: {
      width: 6,
      backgroundColor: Colors[theme].icon_color,
    },
  });
