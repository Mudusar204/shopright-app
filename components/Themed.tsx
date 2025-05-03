import React, { forwardRef } from "react";
import {
  Text as DefaultText,
  View as DefaultView,
  TextInput as DefaultInput,
  TouchableOpacity as DefaultTouchableOpacity,
  ActivityIndicator,
  Button as DefaultButton,
  StyleProp,
  ViewStyle,
} from "react-native";
import clsx from "clsx";

import {
  SafeAreaView as DefaultSafeAreaView,
  // SafeAreaViewProps as DefaultSafeAreaViewProps,
} from "react-native";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";
import StarsIcon from "@/assets/images/svgs/StarsIcon";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

type ButtonOtherProps = {
  variant: "primary" | "secondary" | "outline" | "disabled";
  title?: string;
  size: "small" | "medium" | "large";
  isLoading?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
  disabled?: boolean;
  onPress?: () => void;
};

type TextOtherProps = {
  variant?: "primary" | "light" | "dark" | "white";
};

export type TextProps = ThemeProps & DefaultText["props"] & TextOtherProps;
export type ViewProps = ThemeProps & DefaultView["props"];
export type TextInputProps = ThemeProps & DefaultInput["props"];
export type SafeAreaViewProps = ThemeProps & DefaultSafeAreaView["props"];
export type TouchableOpacityProps = ThemeProps;
export type ButtonProps = TouchableOpacityProps & ButtonOtherProps;
export type TouchableTextProps = ThemeProps & DefaultText["props"];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();

  return props[theme] || Colors[theme][colorName];
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, variant, ...otherProps } = props;
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    variant ? `text_${variant}` : "text"
  );

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export const TextInput = forwardRef<DefaultInput, TextInputProps>(
  (props, ref) => {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
    const backgroundColor = useThemeColor(
      { light: lightColor, dark: darkColor },
      "background"
    );
    const placeholderColor = useThemeColor(
      { light: lightColor, dark: darkColor },
      "text_light"
    );
    const borderColor = useThemeColor(
      { light: lightColor, dark: darkColor },
      "border"
    );
    return (
      <DefaultInput
        ref={ref}
        style={[{ color, backgroundColor, borderColor }, style]}
        placeholderTextColor={placeholderColor}
        {...otherProps}
      />
    );
  }
);

export function SafeAreaView(props: SafeAreaViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <DefaultSafeAreaView style={[{ backgroundColor }, style]} {...otherProps} />
  );
}

export function TouchableOpacity(props: TouchableOpacityProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <DefaultTouchableOpacity
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
}

export function TouchableText(props: TouchableTextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function Button({
  onPress = () => {
    console.log("crashFix");
  },
  ...props
}: ButtonProps) {
  const {
    size = "medium",
    isLoading,
    title,
    style,
    icon,
    variant = "primary",
    textColor,
    disabled,
  } = props;

  const colorScheme = useColorScheme() as "light" | "dark";

  const getVariantStyle = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: Colors[colorScheme].primary_color,
          borderRadius: 12,
          paddingVertical: 12,
          alignItems: "center" as const,
        };
      case "secondary":
        return {
          backgroundColor: Colors[colorScheme].text_secondary,
          borderRadius: 12,
          paddingVertical: 12,
          alignItems: "center" as const,
          borderWidth: 1,
          borderColor: Colors[colorScheme].border,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          paddingVertical: 12,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: Colors[colorScheme].primary_color,
          alignItems: "center" as const,
        };
      case "disabled":
        return {
          backgroundColor: Colors[colorScheme].primary_light_color,
          borderRadius: 12,
          paddingVertical: 12,
          alignItems: "center" as const,
          opacity: 0.5,
        };
      default:
        return {};
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case "large":
        return {
          width: "100%",
          paddingHorizontal: 24,
          paddingVertical: 16,
          borderRadius: 12,
        };
      case "medium":
        return {
          width: "48%", // Takes roughly half the container width
          paddingHorizontal: 16,
          borderRadius: 12,
        };
      case "small":
        return {
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
        };
      default:
        return {};
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "primary":
        return {
          color: textColor ? textColor : Colors[colorScheme].text_white,
          fontSize: 16,
          fontWeight: "600" as const,
        };
      case "secondary":
        return {
          color: textColor ? textColor : Colors[colorScheme].text_white,
          fontSize: 16,
          fontWeight: "600" as const,
        };
      case "outline":
        return {
          color: textColor ? textColor : Colors[colorScheme].primary_color,
          fontSize: 16,
          fontWeight: "500" as const,
        };
      case "disabled":
        return {
          color: textColor ? textColor : Colors[colorScheme].text_light,
          fontSize: 16,
          fontWeight: "600" as const,
        };
      default:
        return {};
    }
  };

  return (
    <DefaultTouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || variant === "disabled" || isLoading}
      style={[getVariantStyle(), getSizeStyle(), style]}
    >
      {isLoading ? (
        <ActivityIndicator
          color={
            variant === "primary" ? "#FFFFFF" : Colors[colorScheme].text_white
          }
        />
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
          }}
        >
          {title && <Text style={getTextStyle()}>{title}</Text>}
          {icon && (
            <View style={{ marginLeft: 4, backgroundColor: "transparent" }}>
              {icon}
            </View>
          )}
        </View>
      )}
    </DefaultTouchableOpacity>
  );
}

export function Divider(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "divider"
  );
  return (
    <DefaultView
      style={[{ height: 1, backgroundColor: color }, style]}
      {...otherProps}
    />
  );
}
