import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
import { useCriarSerie } from "../../../contexts/SeriesContext.jsx";
import { useExercicios } from "../../../contexts/ExerciciosContext.jsx";
import { useStatusTreino } from "../../../contexts/StatusTreinoContext.jsx";
import { getItem, setItem } from "../../../utils/storage";
import { colors } from "../../../theme/colors";

export function CardExercicioModal({
  exercicio,
  handleClose,
  modoCriacao,
  modoSerie,
  treinoId,
}) {
  const [detalhes, setDetalhes] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [carga, setCarga] = useState("");
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const { adicionarExercicio, exerciciosSelecionados } = useCriarSerie();
  const { fetchDetalhes } = useExercicios();
  const { statusSeries, treinosConcluidos } = useStatusTreino();

  const idDeBusca = exercicio?.exerciseId || exercicio?.id;
  const isConcluido =
    statusSeries[`${treinoId}_${idDeBusca}`] || treinosConcluidos[treinoId];

  useEffect(() => {
    if (!exercicio) {
      setDetalhes(null);
      return;
    }

    async function carregarCarga() {
      const cargasSalvas = JSON.parse(
        (await getItem("shapecheck_cargas")) || "{}",
      );
      const idParaBuscar =
        exercicio.exerciseId || exercicio.id || exercicio.name;
      setCarga(cargasSalvas[idParaBuscar] || "");
    }

    carregarCarga();

    async function obterDadosRealTime() {
      setCarregando(true);
      if (idDeBusca) {
        const dados = await fetchDetalhes(idDeBusca);
        if (dados) {
          setDetalhes(dados);
        }
      }
      setCarregando(false);
    }

    obterDadosRealTime();
  }, [exercicio, fetchDetalhes, idDeBusca]);

  const handleCargaChange = async (novoValor) => {
    setCarga(novoValor);

    if (exercicio) {
      const idParaSalvar =
        exercicio.exerciseId || exercicio.id || exercicio.name;
      const cargasSalvas = JSON.parse(
        (await getItem("shapecheck_cargas")) || "{}",
      );
      cargasSalvas[idParaSalvar] = novoValor;
      await setItem("shapecheck_cargas", JSON.stringify(cargasSalvas));
    }
  };

  if (!exercicio) return null;

  const ex = detalhes || exercicio;
  const video = detalhes?.videoUrl;
  const imagem =
    detalhes?.imageUrls?.["480p"] ||
    detalhes?.imageUrls?.["360p"] ||
    detalhes?.imageUrl ||
    detalhes?.gifUrl ||
    exercicio.imageUrl;

  const jaAdicionado = exerciciosSelecionados.find(
    (item) =>
      (item.exerciseId || item.id || item.name) ===
      (exercicio.exerciseId || exercicio.id || exercicio.name),
  );

  return (
    <Modal
      visible={!!exercicio}
      animationType="slide"
      transparent
      statusBarTranslucent={Platform.OS === "android"}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.bottom : 0}
      >
        <Pressable style={styles.overlay} onPress={handleClose}>
          <Pressable
            style={[
              styles.modalMobile,
              {
                maxHeight: Platform.OS === "ios" ? "88%" : "90%",
                paddingBottom:
                  Platform.OS === "ios"
                    ? insets.bottom + 16
                    : Math.max(insets.bottom, 24),
              },
            ]}
            onPress={(e) => e.stopPropagation?.()}
          >
          <View style={styles.tracoArrastar} />

          <View style={styles.cabecalho}>
            <Text style={styles.tituloModal} numberOfLines={2}>
              {ex.name}
            </Text>
            <Pressable onPress={handleClose} style={styles.botaoFecharX}>
              <Feather name="x" size={18} color={colors.texto} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.conteudoRolavel}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={Platform.OS === "android"}
          >
            {carregando ? (
              <Text style={styles.textoCarregando}>
                Carregando execução...
              </Text>
            ) : (
              <View style={[styles.desktopGrid, width >= 768 && styles.desktopGridWide]}>
                <View style={styles.leftColumn}>
                  {video && video !== "string" ? (
                    <Video
                      source={{ uri: video }}
                      style={styles.gif}
                      resizeMode={
                        Platform.OS === "android"
                          ? ResizeMode.COVER
                          : ResizeMode.CONTAIN
                      }
                      shouldPlay
                      isLooping
                      isMuted
                      useNativeControls={Platform.OS === "android"}
                    />
                  ) : imagem ? (
                    <Image
                      source={{ uri: imagem }}
                      style={styles.gif}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.gif, styles.gifPlaceholder]}>
                      <Text style={styles.placeholderTexto}>Sem imagem</Text>
                    </View>
                  )}

                  <View style={styles.tagsContainer}>
                    {ex.targetMuscles?.[0] && (
                      <Text style={styles.tagAmarela}>
                        {ex.targetMuscles[0]}
                      </Text>
                    )}
                    {ex.equipments?.[0] && (
                      <Text style={styles.tagCinza}>{ex.equipments[0]}</Text>
                    )}
                    {ex.bodyParts?.[0] && (
                      <Text style={styles.tagCinza}>{ex.bodyParts[0]}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.rightColumn}>
                  <Text style={styles.tituloDesktop}>{ex.name}</Text>

                  <View style={styles.instrucoes}>
                    {ex.overview && (
                      <Text style={styles.overview}>{ex.overview}</Text>
                    )}
                    {ex.instructions?.length > 0 && (
                      <>
                        <Text style={styles.subtituloModal}>
                          Como executar
                        </Text>
                        {ex.instructions.map((p, i) => (
                          <Text key={i} style={styles.passo}>
                            {i + 1}. {p}
                          </Text>
                        ))}
                      </>
                    )}
                  </View>

                  {modoSerie && (
                    <View style={styles.cargaContainer}>
                      <Text style={styles.cargaLabel}>Carga (kg):</Text>
                      <TextInput
                        value={carga}
                        onChangeText={handleCargaChange}
                        style={styles.inputCarga}
                        placeholder="0"
                        placeholderTextColor={colors.textoSuave}
                        keyboardType={
                          Platform.OS === "ios" ? "decimal-pad" : "numeric"
                        }
                        returnKeyType="done"
                        editable={!isConcluido}
                      />
                    </View>
                  )}

                  {modoCriacao && (
                    <Pressable
                      onPress={() => {
                        adicionarExercicio(ex);
                        handleClose();
                      }}
                      disabled={!!jaAdicionado}
                      style={[
                        styles.botaoAdicionarBase,
                        jaAdicionado
                          ? styles.botaoAdicionarInativo
                          : styles.botaoAdicionarAtivo,
                      ]}
                    >
                      <Text
                        style={[
                          styles.botaoAdicionarTexto,
                          jaAdicionado && styles.botaoAdicionarTextoInativo,
                        ]}
                      >
                        {jaAdicionado ? "Já adicionado" : "Adicionar à Série"}
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            )}
          </ScrollView>
        </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalMobile: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  tracoArrastar: {
    width: 40,
    height: 4,
    backgroundColor: colors.textoSuave,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borda,
  },
  tituloModal: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.texto,
    flex: 1,
    marginRight: 12,
  },
  botaoFecharX: {
    padding: 8,
  },
  conteudoRolavel: {
    paddingHorizontal: 20,
  },
  textoCarregando: {
    color: colors.textoSuave,
    textAlign: "center",
    padding: 32,
  },
  desktopGrid: {
    gap: 16,
    paddingVertical: 16,
  },
  desktopGridWide: {
    flexDirection: "row",
  },
  leftColumn: {
    flex: 1,
    gap: 12,
  },
  rightColumn: {
    flex: 1,
    gap: 12,
  },
  gif: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    backgroundColor: colors.card2,
  },
  gifPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderTexto: {
    color: colors.textoSuave,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagAmarela: {
    backgroundColor: colors.amareloDim,
    color: colors.amarelo,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: "700",
    overflow: "hidden",
  },
  tagCinza: {
    backgroundColor: colors.card2,
    color: colors.textoSuave,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: "600",
    overflow: "hidden",
  },
  tituloDesktop: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.texto,
  },
  instrucoes: {
    gap: 8,
  },
  overview: {
    color: colors.textoSuave,
    fontSize: 14,
    lineHeight: 20,
  },
  subtituloModal: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.texto,
    marginTop: 8,
  },
  passo: {
    color: colors.texto,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  cargaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  cargaLabel: {
    color: colors.texto,
    fontSize: 14,
    fontWeight: "600",
  },
  inputCarga: {
    backgroundColor: colors.inputBg,
    color: colors.texto,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 80,
    fontSize: 16,
  },
  botaoAdicionarBase: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  botaoAdicionarAtivo: {
    backgroundColor: colors.amarelo,
  },
  botaoAdicionarInativo: {
    backgroundColor: colors.inputBg,
  },
  botaoAdicionarTexto: {
    color: "#000",
    fontWeight: "700",
    fontSize: 15,
  },
  botaoAdicionarTextoInativo: {
    color: colors.desabilitado,
  },
});
