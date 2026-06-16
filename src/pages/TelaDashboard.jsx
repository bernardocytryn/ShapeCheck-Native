import React from "react";
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GraficoFrequencia from "../features/dashboard/GraficoFrequencia";
import GraficoKcal from "../features/dashboard/GraficoKcal";
import GraficoPeso from "../features/dashboard/GraficoPeso";
import { colors } from "../theme/colors";

const TelaDashboard = () => {
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.main}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.rotulo}>Dashboard</Text>

        <View style={[styles.grid, isWide && styles.gridWide]}>
          <View style={[styles.card, isWide && styles.cardHalf]}>
            <Text style={styles.cardTitulo}>Calorias Queimadas</Text>
            <GraficoKcal />
          </View>

          <View style={[styles.card, isWide && styles.cardHalf]}>
            <Text style={styles.cardTitulo}>Peso</Text>
            <GraficoPeso />
          </View>

          <View style={[styles.card, styles.gridChild, isWide && styles.cardFull]}>
            <Text style={styles.cardTitulo}>Tempo em Atividade</Text>
            <GraficoFrequencia />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  main: {
    padding: 20,
    paddingBottom: 100,
  },
  rotulo: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.texto,
    marginBottom: 20,
  },
  grid: {
    gap: 16,
  },
  gridWide: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borda,
  },
  cardHalf: {
    width: "48%",
    flexGrow: 1,
  },
  cardFull: {
    width: "100%",
  },
  gridChild: {},
  cardTitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.texto,
    marginBottom: 12,
  },
});

export default TelaDashboard;
