import React, { useContext } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ErrorContext } from "../contexts/ErrorContext";
import { colors } from "../theme/colors";

export default function ErrorBanner() {
  const { msg, clearError } = useContext(ErrorContext);

  if (!msg) return null;

  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Text style={styles.text}>{msg}</Text>
      <Pressable onPress={clearError} accessibilityLabel="Fechar">
        <Text style={styles.close}>×</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
    backgroundColor: colors.vermelho,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  text: {
    color: "#fff",
    fontSize: 14,
    flex: 1,
    marginRight: 12,
  },
  close: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
});
