import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "../../../theme/colors";

const PassoFinal = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tudo pronto</Text>
      <View style={styles.check}>
        <FontAwesome name="check-circle" size={80} color={colors.amarelo} />
      </View>
      <Text style={styles.description}>
        Clique em finalizar para gerar suas fichas de treinos e comece a
        transformar sua vida.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.texto,
    marginBottom: 24,
  },
  check: {
    marginBottom: 24,
  },
  description: {
    fontSize: 15,
    color: colors.textoSuave,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 320,
  },
});

export default PassoFinal;
