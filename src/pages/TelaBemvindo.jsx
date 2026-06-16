import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BotaoAmarelo from "../components/ui/BotaoAmarelo";
import { colors } from "../theme/colors";

const TelaBemvindo = ({ navigation }) => {
  const irParaQuestionario = () => {
    navigation.navigate("Auth");
  };

  return (
    <SafeAreaView style={styles.boasvindas}>
      <Text style={styles.titulo}>Bem-vindo ao ShapeCheck</Text>
      <Text style={styles.subtitulo}>Transforme sua visão em forma.</Text>
      <BotaoAmarelo texto="Começar sua jornada" onClick={irParaQuestionario} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  boasvindas: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.texto,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitulo: {
    fontSize: 18,
    color: colors.textoSuave,
    textAlign: "center",
    marginBottom: 40,
  },
});

export default TelaBemvindo;
