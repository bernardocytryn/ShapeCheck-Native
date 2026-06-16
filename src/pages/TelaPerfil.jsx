import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CardPerfil from "../features/perfil/CardPerfil";
import CardStatus from "../features/perfil/CardStatus";
import ListaConfiguracoes from "../features/perfil/ListaConfiguracoes";
import { colors } from "../theme/colors";

export default function TelaPerfil() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.main}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.rotulo}>Perfil</Text>
          <CardPerfil />
        </View>

        <View style={styles.section}>
          <Text style={styles.rotulo}>Status Fitness</Text>
          <CardStatus />
        </View>

        <View style={[styles.section, styles.fullWidth]}>
          <Text style={styles.rotulo}>Conta</Text>
          <ListaConfiguracoes />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  main: {
    padding: 20,
    paddingBottom: 100,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  fullWidth: {
    width: "100%",
  },
  rotulo: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.texto,
  },
});
