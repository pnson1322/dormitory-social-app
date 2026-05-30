import React, { useEffect, useRef } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";

export function ConversationListSkeleton() {
  const pulseAnim = useRef(new Animated.Value(0.25)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.25,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [pulseAnim]);

  const items = Array.from({ length: 6 });

  return (
    <ScrollView scrollEnabled={false} showsVerticalScrollIndicator={false}>
      {items.map((_, index) => (
        <View key={index} style={styles.container}>
          <Animated.View
            style={[styles.avatar, { opacity: pulseAnim }]}
          />

          <View style={styles.textContainer}>
            <View style={styles.row}>
              <Animated.View
                style={[styles.title, { opacity: pulseAnim }]}
              />
              <Animated.View
                style={[styles.time, { opacity: pulseAnim }]}
              />
            </View>
            <Animated.View
              style={[styles.message, { opacity: pulseAnim }]}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

export function MessageListSkeleton() {
  const pulseAnim = useRef(new Animated.Value(0.25)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.25,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [pulseAnim]);

  const bubbleAlignments = [
    { isMe: false, width: "65%", height: 50 },
    { isMe: true, width: "45%", height: 40 },
    { isMe: false, width: "70%", height: 75 },
    { isMe: true, width: "55%", height: 50 },
    { isMe: false, width: "35%", height: 40 },
    { isMe: true, width: "60%", height: 60 },
    { isMe: false, width: "50%", height: 45 },
  ];

  return (
    <View style={styles.messageScroll}>
      {bubbleAlignments.map((bubble, index) => (
        <View
          key={index}
          style={[
            styles.messageRow,
            { justifyContent: bubble.isMe ? "flex-end" : "flex-start" },
          ]}
        >
          {!bubble.isMe && (
            <Animated.View
              style={[styles.bubbleAvatar, { opacity: pulseAnim }]}
            />
          )}
          
          <Animated.View
            style={[
              styles.bubble,
              {
                width: bubble.width as any,
                height: bubble.height,
                opacity: pulseAnim,
                borderTopRightRadius: bubble.isMe ? 4 : 16,
                borderTopLeftRadius: bubble.isMe ? 16 : 4,
                backgroundColor: bubble.isMe ? "#DBEAFE" : "#F1F5F9",
              },
            ]}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: "#FFFFFF",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E2E8F0",
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    height: 16,
    width: "40%",
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
  },
  time: {
    height: 12,
    width: 40,
    borderRadius: 6,
    backgroundColor: "#E2E8F0",
    marginLeft: "auto",
  },
  message: {
    height: 14,
    width: "75%",
    borderRadius: 7,
    backgroundColor: "#E2E8F0",
  },
  messageScroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  bubbleAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E2E8F0",
    marginRight: 8,
  },
  bubble: {
    borderRadius: 16,
  },
});
