import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

export default function TelaTreino({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.main}>
        <Text style={styles.rotulo}>Exercícios</Text>

        <View style={styles.cardsContainer}>
          <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => navigation.navigate("TreinosList")}
          >
            <Text style={styles.cardTitulo}>Séries</Text>
            <Text style={styles.cardDescricao}>
              Crie, organize e acesse suas rotinas de treino personalizadas.
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => navigation.navigate("Consultar")}
          >
            <Text style={styles.cardTitulo}>Consultar Exercícios</Text>
            <Text style={styles.cardDescricao}>
              Explore a biblioteca completa e veja detalhes e execuções de cada
              movimento.
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  main: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
  },
  rotulo: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.texto,
    marginBottom: 20,
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.borda,
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardTitulo: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.amarelo,
    marginBottom: 8,
  },
  cardDescricao: {
    fontSize: 14,
    color: colors.textoSuave,
    lineHeight: 20,
  },
});
