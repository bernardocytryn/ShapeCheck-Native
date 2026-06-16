import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

export default function TreinoDoDia({ treinoDados, onFinalizar, navigation }) {
  if (
    !treinoDados ||
    !treinoDados.exercicios ||
    treinoDados.exercicios.length === 0
  ) {
    return (
      <View style={styles.workoutCard}>
        <Text style={styles.emptyMessage}>
          Você não tem treinos pendentes para hoje. Dia de descanso!
        </Text>
      </View>
    );
  }

  const nomesExercicios = treinoDados.exercicios
    .slice(0, 3)
    .map((ex) => ex.name || ex.nome);

  let textoResumo = nomesExercicios.join(", ");
  if (treinoDados.exercicios.length > 3) {
    textoResumo += "...";
  }

  const handleIniciarTreino = () => {
    navigation.navigate("Treino", {
      screen: "SeriesDetail",
      params: { id: treinoDados.id },
    });
  };

  return (
    <View style={styles.workoutCard}>
      <View style={styles.workoutContent}>
        <View>
          <Text style={styles.cardLabel}>Treino de Hoje:</Text>
          <Text style={styles.workoutTitle}>{treinoDados.nome}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.resumoTexto}>{textoResumo}</Text>
          <Text style={styles.exerciseCount}>
            {treinoDados.exercicios.length} exercícios
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <Pressable
          style={styles.playButton}
          onPress={handleIniciarTreino}
          accessibilityLabel="Iniciar Treino"
        >
          <Ionicons name="play-circle" size={48} color={colors.amarelo} />
        </Pressable>

        <Pressable style={styles.finishButton} onPress={onFinalizar}>
          <Feather name="check" size={18} color="#000" />
          <Text style={styles.finishButtonText}>Concluir</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  workoutCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borda,
  },
  emptyMessage: {
    color: colors.textoSuave,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  workoutContent: {
    gap: 12,
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 12,
    color: colors.textoSuave,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  workoutTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.amarelo,
    marginTop: 4,
  },
  infoContainer: {
    gap: 4,
  },
  resumoTexto: {
    fontSize: 14,
    color: colors.texto,
    lineHeight: 20,
  },
  exerciseCount: {
    fontSize: 12,
    color: colors.textoSuave,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  playButton: {
    padding: 4,
  },
  finishButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.amarelo,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  finishButtonText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 14,
  },
});
