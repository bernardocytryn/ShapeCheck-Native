import React, { useMemo } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OlaMensagem from "../features/home/OlaMensagem";
import TreinoDoDia from "../features/home/TreinoDoDia";
import CalendarioSemanal from "../features/home/CalendarioSemanal";
import { useAuth } from "../hooks/useAuth";
import { useStatusTreino } from "../contexts/StatusTreinoContext";
import { colors } from "../theme/colors";

export default function Home({ navigation }) {
  const { usuario } = useAuth();
  const { treinosConcluidos, finalizarTreino } = useStatusTreino();
  const seriesSalvas = usuario?.treinos || [];

  const treinoDados = useMemo(() => {
    if (seriesSalvas.length === 0) return null;

    const treinoPendente = seriesSalvas.find(
      (serie) => !treinosConcluidos[serie.id],
    );

    if (!treinoPendente) return null;

    const exerciciosAtivos = treinoPendente.exercicios || [];
    const gruposUnicos = [
      ...new Set(exerciciosAtivos.map((ex) => ex.bodyPart)),
    ].filter(Boolean);

    return {
      id: treinoPendente.id,
      nome: treinoPendente.nome || "TREINO",
      gruposMusculares: gruposUnicos,
      exercicios: exerciciosAtivos,
      idsExercicios: exerciciosAtivos.map(
        (ex) => ex.exerciseId || ex.id,
      ),
    };
  }, [seriesSalvas, treinosConcluidos]);

  const handleFinalizarTreino = () => {
    if (treinoDados) {
      finalizarTreino(treinoDados.id, treinoDados.idsExercicios);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.main}
        showsVerticalScrollIndicator={false}
      >
        <OlaMensagem />
        <TreinoDoDia
          treinoDados={treinoDados}
          onFinalizar={handleFinalizarTreino}
          navigation={navigation}
        />
        <CalendarioSemanal />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  main: {
    padding: 20,
    paddingBottom: 100,
    gap: 20,
  },
});
