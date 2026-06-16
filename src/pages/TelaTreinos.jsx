import { View, Text, StyleSheet } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useStatusTreino } from "../contexts/StatusTreinoContext.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { colors } from "../theme/colors";

export default function TelaTreinos({ navigation }) {
  const { treinosConcluidos, toggleTreinoConcluido } = useStatusTreino();
  const { usuario } = useAuth();

  const series = usuario?.treinos || [];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.main}>
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate("TreinoHub")}
            style={styles.botaoVoltar}
          >
            <Feather name="arrow-left" size={18} color={colors.texto} />
            <Text style={styles.botaoVoltarTexto}>Voltar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.rotulo}>Minhas Séries</Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("CriarSerie")}
          style={styles.botaoCriar}
        >
          <Text style={styles.botaoCriarTexto}>Criar Nova Série</Text>
        </TouchableOpacity>

        <View style={styles.lista}>
          {series.length > 0 ? (
            series.map((serie) => {
              const concluida = !!treinosConcluidos[serie.id];
              const idsExercicios =
                serie.exercicios?.map((ex) => ex.exerciseId || ex.id) || [];

              return (
                <TouchableOpacity
                  key={serie.id}
                  activeOpacity={0.9}
                  onPress={() =>
                    navigation.navigate("SeriesDetail", { id: serie.id })
                  }
                  style={[styles.cardSerie, concluida && styles.cardConcluido]}
                >
                  <View style={styles.cardInfo}>
                    <Text style={styles.nomeSerie}>{serie.nome}</Text>
                    <Text style={styles.infoSerie}>
                      {serie.exercicios?.length || 0} exercícios
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                      styles.botaoCheck,
                      concluida && styles.botaoCheckAtivo,
                    ]}
                    onPress={(e) => {
                      e.stopPropagation?.();
                      toggleTreinoConcluido(serie.id, idsExercicios);
                    }}
                  >
                    <Feather
                      name="check"
                      size={18}
                      color={concluida ? "#fff" : colors.textoSuave}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.estadoVazio}>
              <Text style={styles.vazioTextoPrincipal}>
                Você ainda não possui nenhuma série de treino criada.
              </Text>
              <Text style={styles.vazioTextoSecundario}>
                Clique no botão acima para começar.
              </Text>
            </View>
          )}
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
  },
  header: {
    marginBottom: 16,
  },
  botaoVoltar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  botaoVoltarTexto: {
    color: colors.texto,
    fontSize: 14,
  },
  rotulo: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.texto,
    marginBottom: 16,
  },
  botaoCriar: {
    backgroundColor: colors.amarelo,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  botaoCriarTexto: {
    color: "#000",
    fontWeight: "700",
    fontSize: 15,
  },
  lista: {
    gap: 12,
  },
  cardSerie: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borda,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardConcluido: {
    borderColor: colors.verde,
    opacity: 0.85,
  },
  cardInfo: {
    flex: 1,
  },
  nomeSerie: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.texto,
  },
  infoSerie: {
    fontSize: 13,
    color: colors.textoSuave,
    marginTop: 4,
  },
  botaoCheck: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.borda,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoCheckAtivo: {
    backgroundColor: colors.verde,
    borderColor: colors.verde,
  },
  estadoVazio: {
    alignItems: "center",
    padding: 32,
  },
  vazioTextoPrincipal: {
    color: colors.texto,
    fontSize: 15,
    textAlign: "center",
    marginBottom: 8,
  },
  vazioTextoSecundario: {
    color: colors.textoSuave,
    fontSize: 13,
    textAlign: "center",
  },
});
