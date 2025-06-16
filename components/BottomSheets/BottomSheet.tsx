import { useGlobalStore } from "@/store/global.store";
import {
  BottomSheetBackdrop,
  BottomSheetHandleProps,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useRef,
} from "react";
import { Platform, StyleSheet, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "../useColorScheme";
import Colors from "@/constants/Colors";

export interface BottomSheetScrollHandle {
  handleBottomSheet: () => void;
  handleClose: () => void;
}
type BottomSheetScrollProps = {
  children: ReactNode;
  handleComponent?: React.FC<BottomSheetHandleProps> | null;
  FixedFooter?: React.FC;
  bodyStyle?: ViewStyle;
  scrollable?: boolean;
  snapPoints?: string[];
};
const BottomModal = forwardRef<BottomSheetScrollHandle, BottomSheetScrollProps>(
  (
    {
      children,
      handleComponent,
      FixedFooter,
      bodyStyle,
      scrollable = false,
      snapPoints = ["50%"],
    },
    ref
  ) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { isBottomSheetOpen, setIsBottomSheetOpen } = useGlobalStore();
    const theme = useColorScheme();
    const style = styles(theme);
    const insets = useSafeAreaInsets();

    useImperativeHandle(ref, () => ({
      handleBottomSheet: () => {
        bottomSheetModalRef.current?.present();
        setIsBottomSheetOpen(true);
        console.log("isBottomSheetOpen", isBottomSheetOpen);
      },
      handleClose: () => {
        bottomSheetModalRef.current?.close();
        setIsBottomSheetOpen(false);
        console.log("isBottomSheetOpen", isBottomSheetOpen);
      },
    }));

    // Renders
    return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          handleComponent={handleComponent}
          backgroundComponent={() => <Animated.View style={style.bg} />}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
              pressBehavior="close"
              onPress={() => {
                setIsBottomSheetOpen(false);
              }}
            />
          )}
          style={{
            marginTop: insets.top,
          }}
          onDismiss={() => {
            setIsBottomSheetOpen(false);
          }}
        >
          {scrollable ? (
            <BottomSheetScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              style={[bodyStyle, { paddingBottom: insets.bottom }]}
            >
              {children}
              {FixedFooter && <FixedFooter />}
            </BottomSheetScrollView>
          ) : (
            <BottomSheetView
              style={[
                bodyStyle,
                {
                  paddingBottom:
                    Platform.OS === "ios" ? insets.bottom * 2.5 : 60,
                },
              ]}
            >
              {children}
              {FixedFooter && <FixedFooter />}
            </BottomSheetView>
          )}
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  }
);
export default BottomModal;
const styles = (theme: "light" | "dark") =>
  StyleSheet.create({
    bg: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: Colors[theme].background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
  });
