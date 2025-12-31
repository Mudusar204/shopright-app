import Colors from "@/constants/Colors";
import { useInitiateJazzCashPayment } from "@/hooks/mutations/payments/payments.mutation";
import { useColorScheme } from "@/components/useColorScheme";
import Header from "@/components/Header";
import { Button, Text, TextInput, View } from "@/components/Themed";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import Toast from "react-native-toast-message";

type SearchParams = {
  reference?: string;
  transactionId?: string;
  amount?: string;
};

const CreatePayment = () => {
  const theme = useColorScheme() as "light" | "dark";
  const styles = createStyles(theme);
  const { reference, transactionId, amount } =
    useLocalSearchParams<SearchParams>();
  const [mobileNumber, setMobileNumber] = useState("");
  const [cnic, setCnic] = useState("");

  const { mutate: initiatePayment, isPending } = useInitiateJazzCashPayment();

  const formattedAmount = useMemo(() => {
    if (!amount) return "";
    const numeric = Number(amount);
    return Number.isFinite(numeric) ? `Rs.${numeric.toFixed(2)}` : amount;
  }, [amount]);
  const handleInitiatePayment = () => {
    if (!reference) {
      Toast.show({
        type: "error",
        text1: "Missing reference",
        text2: "Payment reference is required to continue.",
      });
      return;
    }

    if (!mobileNumber.trim() || !cnic.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing details",
        text2: "Please enter mobile number and CNIC.",
      });
      return;
    }

    initiatePayment(
      {
        reference,
        mobile_number: mobileNumber.trim(),
        cnic: cnic.trim(),
      },
      {
        onSuccess: (response: any) => {
          console.log(response, "response in initiatePayment");
          Toast.show({
            type: "success",
            text1: "Payment initiated",
            text2: "Please follow JazzCash instructions to complete.",
          });
          router.push("/(auth)/order-success");
        },
        onError: (error: any) => {
          Toast.show({
            type: "error",
            text1: error?.message || "Payment initiation failed",
          });
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header title="Create Payment" />
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.label}>Reference</Text>
          <Text style={styles.valueText}>{reference || "-"}</Text>
          {transactionId ? (
            <>
              <Text style={[styles.label, { marginTop: 12 }]}>
                Transaction ID
              </Text>
              <Text style={styles.valueText}>{transactionId}</Text>
            </>
          ) : null}
          {formattedAmount ? (
            <>
              <Text style={[styles.label, { marginTop: 12 }]}>Amount</Text>
              <Text style={styles.valueText}>{formattedAmount}</Text>
            </>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="03XXXXXXXXX"
            keyboardType="phone-pad"
            value={mobileNumber}
            onChangeText={setMobileNumber}
          />

          <Text style={[styles.label, { marginTop: 16 }]}>CNIC</Text>
          <TextInput
            style={styles.input}
            placeholder="CNIC without dashes"
            keyboardType="number-pad"
            value={cnic}
            onChangeText={setCnic}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          variant="primary"
          size="large"
          title={isPending ? "Processing..." : "Initiate Payment"}
          onPress={handleInitiatePayment}
          disabled={isPending}
        />
      </View>
    </View>
  );
};

const createStyles = (theme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },
    headerContainer: {
      paddingHorizontal: 15,
    },
    scrollView: {
      flex: 1,
      padding: 15,
    },
    section: {
      backgroundColor: Colors[theme].background_light,
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
    },
    label: {
      fontSize: 14,
      color: Colors[theme].text_secondary,
      marginBottom: 6,
    },
    valueText: {
      fontSize: 16,
      color: Colors[theme].text,
      fontWeight: "600",
    },
    input: {
      backgroundColor: Colors[theme].background,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: Colors[theme].text,
      borderWidth: 1,
      borderColor: Colors[theme].border,
    },
    footer: {
      padding: 15,
      borderTopWidth: 1,
      borderTopColor: Colors[theme].text_light,
    },
  });

export default CreatePayment;
