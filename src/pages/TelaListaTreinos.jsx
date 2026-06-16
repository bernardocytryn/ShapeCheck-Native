import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Alert,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { CardExercicioModal } from "../features/treinos/components/CardExercicio";
import { useCriarSerie } from "../contexts/SeriesContext.jsx";
import { useStatusTreino } from "../contexts/StatusTreinoContext.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { useExercicios } from "../contexts/ExerciciosContext.jsx";
import { colors } from "../theme/colors";

function CardExercicioSwipe({ ex, done, onToggle, onRemove, onClick }) {
  const translateX = useSharedValue(0);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (e.translationX < -100) {
        runOnJS(onToggle)();
      } else if (e.translationX > 100) {
        runOnJS(onRemove)();
      }
      translateX.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => {
    let bg = "transparent";
    if (translateX.value < -50) bg = colors.verde;
    else if (translateX.value > 50) bg = colors.vermelhoSwipe;

    return {
      transform: [{ translateX: translateX.value }],
      backgroundColor: bg,
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          styles.cardGrid,
          done && styles.cardConcluido,
          animatedStyle,
        ]}
      >
        <Pressable onPress={onClick} style={styles.cardPressable}>
          <Image
            source={{ uri: ex.imageUrl }}
            style={styles.imagemGrid}
            resizeMode="cover"
          />
          <View style={styles.infoGrid}>
            <Text style={styles.nomeGrid} numberOfLines={2}>
              {ex.name || "Exercício sem nome"}
            </Text>
            <Pressable
              style={[styles.botaoCheck, done && styles.botaoCheckAtivo]}
              onPress={(e) => {
                e.stopPropagation?.();
                onToggle();
              }}
            >
              <Feather name="check" size={14} color={done ? "#fff" : colors.textoSuave} />
            </Pressable>
          </View>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}

export default function TelaListaTreinos({ navigation, route }) {
  const { id } = route.params;
  const [serie, setSerie] = useState(null);
  const [exercicioAberto, setExercicioAberto] = useState(null);
  const [traduzindo, setTraduzindo] = useState(false);
  const { width } = useWindowDimensions();
  const numColumns = width >= 768 ? 3 : 2;

  const { iniciarEdicao } = useCriarSerie();
  const {
    statusSeries,
    treinosConcluidos,
    alternarStatus,
    setEstadoConcluido,
  } = useStatusTreino();
  const { usuario, finalizarCadastroWizard } = useAuth();
  const { fetchDetalhes } = useExercicios();

  const temTraduzido = useRef(false);

  useEffect(() => {
    const series = usuario?.treinos || [];
    setSerie(series.find((s) => s.id === id));
  }, [id, usuario]);

  useEffect(() => {
    if (!serie || !serie.exercicios) return;
    const todosConcluidos = serie.exercicios.every((ex) => {
      const eid = ex.exerciseId || ex.id;
      return !!statusSeries[`${serie.id}_${eid}`];
    });
    setEstadoConcluido(serie.id, todosConcluidos);
  }, [statusSeries, serie, setEstadoConcluido]);

  useEffect(() => {
    temTraduzido.current = false;
  }, [id]);

  useEffect(() => {
    const traduzirSerie = async () => {
      if (!serie || !serie.exercicios || temTraduzido.current || traduzindo)
        return;
      const precisaTraduzir = serie.exercicios.some(
        (ex) => ex.name && /[A-Z][a-z]{4,}/.test(ex.name),
      );
      if (precisaTraduzir) {
        temTraduzido.current = true;
        setTraduzindo(true);
        const novosExercicios = await Promise.all(
          serie.exercicios.map(async (ex) => {
            const detalhes = await fetchDetalhes(ex.id || ex.exerciseId);
            return detalhes ? { ...ex, ...detalhes } : ex;
          }),
        );
        const serieAtualizada = { ...serie, exercicios: novosExercicios };
        const seriesAtualizadas = usuario.treinos.map((s) =>
          s.id === id ? serieAtualizada : s,
        );
        finalizarCadastroWizard(usuario.perfil, seriesAtualizadas);
        setTraduzindo(false);
      }
    };
    traduzirSerie();
  }, [serie]);

  if (!serie) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.estadoVazio}>Série não encontrada.</Text>
      </SafeAreaView>
    );
  }

  const isSerieConcluida = !!treinosConcluidos[serie.id];

  const handleExcluirExercicio = (eid) => {
    Alert.alert("Confirmar", "Remover este exercício?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => {
          const exerciciosFiltrados = serie.exercicios.filter(
            (item) => (item.exerciseId || item.id) !== eid,
          );
          const serieAtualizada = { ...serie, exercicios: exerciciosFiltrados };
          const seriesAtualizadas = usuario.treinos.map((s) =>
            s.id === id ? serieAtualizada : s,
          );
          finalizarCadastroWizard(usuario.perfil, seriesAtualizadas);
        },
      },
    ]);
  };

  const handleEditar = () => {
    if (isSerieConcluida) {
      Alert.alert(
        "Atenção",
        "Desfaça a conclusão do treino antes de editar.",
      );
      return;
    }
    iniciarEdicao(serie);
    navigation.navigate("CriarSerie");
  };

  const handleExcluir = () => {
    Alert.alert("Confirmar", "Excluir série?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          const series = usuario?.treinos || [];
          const seriesAtualizadas = series.filter((s) => s.id !== id);
          finalizarCadastroWizard(usuario?.perfil, seriesAtualizadas);
          navigation.navigate("TreinosList");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {traduzindo && (
        <Text style={styles.traduzindo}>
          Atualizando para Português...
        </Text>
      )}

      <View style={styles.header}>
        <View style={styles.tituloContainer}>
          <Pressable
            onPress={() => navigation.navigate("TreinosList")}
            style={styles.botaoVoltar}
          >
            <Feather name="arrow-left" size={18} color={colors.texto} />
            <Text style={styles.botaoVoltarTexto}>Voltar</Text>
          </Pressable>
          <View>
            <Text style={styles.titulo}>{serie.nome}</Text>
            {isSerieConcluida && (
              <View style={styles.concluidoRow}>
                <Feather name="check" size={14} color={colors.verde} />
                <Text style={styles.concluidoTexto}>Treino Concluído!</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.botoesAcao}>
          <Pressable onPress={handleExcluir} style={styles.botaoExcluir}>
            <Feather name="trash-2" size={18} color={colors.vermelho} />
          </Pressable>
          <Pressable
            onPress={handleEditar}
            style={[
              styles.botaoCriar,
              isSerieConcluida && styles.botaoDesabilitado,
            ]}
          >
            <Feather name="edit-2" size={18} color={colors.amarelo} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.gridLista}>
        <View style={[styles.gridRow, { flexWrap: "wrap" }]}>
          {serie.exercicios &&
            serie.exercicios.map((ex) => {
              const eid = ex.exerciseId || ex.id;
              return (
                <View
                  key={eid}
                  style={{ width: `${100 / numColumns}%`, padding: 6 }}
                >
                  <CardExercicioSwipe
                    ex={ex}
                    done={!!statusSeries[`${serie.id}_${eid}`]}
                    onToggle={() => alternarStatus(serie.id, eid)}
                    onRemove={() => handleExcluirExercicio(eid)}
                    onClick={() => setExercicioAberto(ex)}
                  />
                </View>
              );
            })}
        </View>
      </ScrollView>

      <CardExercicioModal
        exercicio={exercicioAberto}
        handleClose={() => setExercicioAberto(null)}
        treinoId={serie.id}
        modoSerie
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  traduzindo: {
    fontSize: 12,
    color: colors.amarelo,
    textAlign: "center",
    padding: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    paddingBottom: 8,
  },
  tituloContainer: {
    flex: 1,
    gap: 8,
  },
  botaoVoltar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  botaoVoltarTexto: {
    color: colors.texto,
    fontSize: 14,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.texto,
  },
  concluidoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  concluidoTexto: {
    fontSize: 12,
    color: colors.verde,
    fontWeight: "700",
  },
  botoesAcao: {
    flexDirection: "row",
    gap: 8,
  },
  botaoExcluir: {
    padding: 8,
  },
  botaoCriar: {
    padding: 8,
  },
  botaoDesabilitado: {
    opacity: 0.4,
  },
  gridLista: {
    paddingBottom: 100,
  },
  gridRow: {
    flexDirection: "row",
    paddingHorizontal: 14,
  },
  cardGrid: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.borda,
  },
  cardConcluido: {
    borderColor: colors.verde,
    opacity: 0.8,
  },
  cardPressable: {
    flex: 1,
  },
  imagemGrid: {
    width: "100%",
    height: 120,
    backgroundColor: colors.card2,
  },
  infoGrid: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nomeGrid: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.texto,
    flex: 1,
    marginRight: 8,
  },
  botaoCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
    color: colors.textoSuave,
    textAlign: "center",
    padding: 32,
  },
});
