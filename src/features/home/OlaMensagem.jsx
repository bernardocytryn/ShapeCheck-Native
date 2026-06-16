import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { colors } from "../../theme/colors";

export default function OlaMensagem() {
  const { usuario } = useAuth();

  const perfil = usuario?.perfil || {};
  const nomeCompleto = perfil?.nome || "Atleta";
  const primeiroNome = nomeCompleto.split(" ")[0];

  return (
    <View style={styles.header}>
      <Text style={styles.label}>Home</Text>
      <Text style={styles.title}>Olá, {primeiroNome}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
  },
  label: {
    fontSize: 13,
    color: colors.textoSuave,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.texto,
  },
});
