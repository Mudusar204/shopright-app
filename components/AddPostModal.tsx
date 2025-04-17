import React from 'react';
import { Modal, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Button, Text, View } from './Themed';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useGlobalStore } from '@/store/global.store';
import { useColorScheme } from './useColorScheme';
import Colors from '@/constants/Colors';
import StarsIcon from '@/assets/images/svgs/StarsIcon';
import PencilIcon from '@/assets/images/svgs/Pencil';
import MicIcon from '@/assets/images/svgs/Mic';



const AddPostModal = () => {
  const colorScheme = useColorScheme() as "light" | "dark"
  const styles = createStyles(colorScheme)
  const { isModalVisible, setIsModalVisible } = useGlobalStore(
    (state) => state
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => {
        setIsModalVisible(false);
      }}
    >
      <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.sheetTopLineContainer}
          >
            <View style={styles.sheetTopLine}></View>
          </View>

          <View style={styles.postWithAiCard}>
            <View style={styles.postWithAiCardContent}>
              <View style={styles.postWithAiCardIcon}>
                <StarsIcon color={Colors[colorScheme].primary_color} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>Create Post with AI Assistance</Text>
                <Text style={styles.subtitle}>Let AI help you craft the perfect post</Text>
              </View>
            </View>
            <Button textColor={Colors[colorScheme].text} style={styles.button} variant="primary" size="large" title="Get Started" onPress={() => {
              router.push('/(addListings)/AiListings');
              setIsModalVisible(false);
            }} />
          </View>
          <View style={styles.manualPostCardContainer}>

            <View style={styles.manualPostCard}>
              <View style={styles.manualPostCardIcon}>
                <MicIcon color={Colors[colorScheme].primary_color} />  
              </View>
              <Text style={styles.manualPostCardTitle}>Post by Voice</Text>
              <Text style={styles.manualPostCardDescription}>Create a post manually</Text>
              <Button style={styles.manualPostCardButton} variant="primary" size="large" title="Record" onPress={() => {
                router.push('/(addListings)/VoiceListings');
                setIsModalVisible(false);
              }} />
            </View>
            <View style={styles.manualPostCard}>
              <View style={styles.manualPostCardIcon}>
                <PencilIcon color={Colors[colorScheme].primary_color} />  
              </View>
              <Text style={styles.manualPostCardTitle}>Write a Post</Text>
              <Text style={styles.manualPostCardDescription}>Create a post manually</Text>
              <Button style={styles.manualPostCardButton} variant="primary" size="large" title="Create" onPress={() => {
                router.push('/(addListings)/ManualListings');
                setIsModalVisible(false);
              }} />
            </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const createStyles = (colorScheme: "light" | "dark") => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContainer: {

    borderRadius: 15,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 30,
    backgroundColor: Colors[colorScheme].background,
  },
  postWithAiCard: {
    flexDirection: 'column',
    gap: 10,
    backgroundColor: Colors[colorScheme].primary_color,
    padding: 15,
    borderRadius: 12,
  },
  sheetTopLineContainer: {
    alignItems: 'center',
  },
  sheetTopLine: {
   height: 5,
   width: 40,
   backgroundColor: Colors[colorScheme].icon_color,
   borderRadius: 10,
   marginBottom: 10,
   marginTop: 5,
  },
  postWithAiCardContent: {
    backgroundColor: "transparent",
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  postWithAiCardIcon: {

    padding: 12,
    backgroundColor: Colors[colorScheme].background,
    borderRadius: 12,
  },
  textContainer: {
    backgroundColor: "transparent",
    flexDirection: 'column',
    gap: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors[colorScheme].text_white,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors[colorScheme].text_white,
  },
  button: {
    color: Colors[colorScheme].text,
    backgroundColor: Colors[colorScheme].background,
    marginTop: 10,
  },
  manualPostCardContainer: {
    flexDirection: 'row',

    gap: 10,
    marginTop: 10,
  },
  manualPostCard: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 5,
    backgroundColor: Colors[colorScheme].background_light,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors[colorScheme].border,
  },
  manualPostCardIcon: {
    padding: 12,
    backgroundColor: "rgba(254,149,45,0.1)",
    borderRadius: 12,
  },
  manualPostCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors[colorScheme].text,
  },
  manualPostCardDescription: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors[colorScheme].text_secondary,
  },
  manualPostCardButton: {
    marginTop: 10,
  },
});

export default AddPostModal;

