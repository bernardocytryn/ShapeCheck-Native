import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  TextInput,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useExercicios } from "../contexts/ExerciciosContext";
import { CardExercicioModal } from "../features/treinos/components/CardExercicio";
import { traduzirEmLote } from "../utils/tradutor";
import { getItem, setItem } from "../utils/storage";
import { colors } from "../theme/colors";

export default function TelaExercicio({ navigation, route }) {
  const { exercicios, loading, error } = useExercicios();
  const [busca, setBusca] = useState("");
  const [classeBusca, setClasseBusca] = useState("TODOS");
  const [menuAberto, setMenuAberto] = useState(false);
  const [exercicioSelecionado, setExercicioSelecionado] = useState(null);
  const [nomesTraduzidos, setNomesTraduzidos] = useState({});
  const { width } = useWindowDimensions();
  const numColumns = width >= 768 ? 3 : 2;

  const modoCriacao = route.params?.modoCriacao || false;

  const opcoes = {
    TODOS: "Todas as categorias",
    NOME: "Apenas no Nome",
    PARTE: "Parte do Corpo",
    ALVO: "Músculo Alvo",
    EQUIPAMENTO: "Equipamento",
  };

  const listaSegura = Array.isArray(exercicios) ? exercicios : [];

  useEffect(() => {
    async function carregarCache() {
      const cache = await getItem("shapecheck_nomes_pt");
      if (cache) setNomesTraduzidos(JSON.parse(cache));
    }
    carregarCache();
  }, []);

  const exerciciosFiltrados = listaSegura.filter((ex) => {
    if (busca.trim() === "") return true;
    const termo = busca.toLowerCase();

    const nomeBase = nomesTraduzidos[ex.id || ex.exerciseId] || ex.name;
    const nome = nomeBase.toLowerCase();

    const parte = ex.bodyParts?.join(" ").toLowerCase() || ex.bodyPart?.toLowerCase() || "";
    const alvo = ex.targetMuscles?.join(" ").toLowerCase() || ex.target?.toLowerCase() || "";
    const equipamento = ex.equipments?.join(" ").toLowerCase() || ex.equipment?.toLowerCase() || "";

    switch (classeBusca) {
      case "NOME":
        return nome.includes(termo);
      case "PARTE":
        return parte.includes(termo);
      case "ALVO":
        return alvo.includes(termo);
      case "EQUIPAMENTO":
        return equipamento.includes(termo);
      case "TODOS":
      default:
        return (
          nome.includes(termo) ||
          parte.includes(termo) ||
          alvo.includes(termo) ||
          equipamento.includes(termo)
        );
    }
  });

  const traduzirVisiveis = async (visiveis) => {
    const cacheAtual = JSON.parse(
      (await getItem("shapecheck_nomes_pt")) || "{}",
    );
    const paraTraduzir = visiveis.filter(
      (ex) => !cacheAtual[ex.id || ex.exerciseId],
    );

    if (paraTraduzir.length === 0) return;

    const novoCache = await traduzirEmLote(paraTraduzir);
    setNomesTraduzidos((prev) => {
      const estadoAtualizado = { ...prev, ...novoCache };
      setItem("shapecheck_nomes_pt", JSON.stringify(estadoAtualizado));
      return estadoAtualizado;
    });
  };

  const renderItem = ({ item: ex, index }) => {
    const idEx = ex.id || ex.exerciseId || index;
    const nomeExibicao = nomesTraduzidos[idEx] || ex.name;

    return (
      <Pressable
        style={[styles.cardGrid, { width: (width - 40 - (numColumns - 1) * 12) / numColumns }]}
        onPress={() => setExercicioSelecionado(ex)}
      >
        <Image
          source={{ uri: ex.imageUrl }}
          style={styles.imagemGrid}
          resizeMode="cover"
        />
        <View style={styles.infoGrid}>
          <Text style={styles.nomeGrid} numberOfLines={2}>
            {nomeExibicao}
          </Text>
        </View>
      </Pressable>
    );
  };

  const ListHeader = () => (
    <View>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.botaoVoltar}
        >
          <Feather name="arrow-left" size={18} color={colors.texto} />
          <Text style={styles.botaoVoltarTexto}>Voltar</Text>
        </Pressable>

        {modoCriacao && (
          <Pressable
            onPress={() => navigation.navigate("CriarSerie")}
            style={styles.botaoVoltarSerie}
          >
            <Text style={styles.botaoVoltarSerieTexto}>Voltar para a Série</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.rotulo}>Consultar</Text>

      <View style={styles.areaBusca}>
        <View style={styles.dropdownContainer}>
          <Pressable
            style={styles.selectClasse}
            onPress={() => setMenuAberto(!menuAberto)}
          >
            <Text style={styles.selectClasseTexto}>{opcoes[classeBusca]}</Text>
            <Feather
              name="chevron-down"
              size={18}
              color={colors.texto}
              style={menuAberto ? styles.iconeDropdownAberto : null}
            />
          </Pressable>

          {menuAberto && (
            <View style={styles.dropdownMenu}>
              {Object.entries(opcoes).map(([chave, rotulo]) => (
                <Pressable
                  key={chave}
                  style={[
                    styles.dropdownItem,
                    classeBusca === chave && styles.dropdownItemSelecionado,
                  ]}
                  onPress={() => {
                    setClasseBusca(chave);
                    setMenuAberto(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemTexto,
                      classeBusca === chave && styles.dropdownItemTextoSelecionado,
                    ]}
                  >
                    {rotulo}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={styles.inputBuscaContainer}>
          <Feather name="search" size={18} color={colors.textoSuave} />
          <TextInput
            style={styles.inputBusca}
            placeholder="Digite o que deseja encontrar..."
            placeholderTextColor={colors.textoSuave}
            value={busca}
            onChangeText={setBusca}
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {loading ? (
        <View style={styles.estadoVazio}>
          <Text style={styles.estadoVazioTexto}>
            Carregando biblioteca de exercícios...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.estadoVazio}>
          <Text style={styles.estadoVazioTexto}>Erro ao carregar: {error}</Text>
        </View>
      ) : (
        <FlatList
          data={exerciciosFiltrados}
          renderItem={renderItem}
          keyExtractor={(ex, index) => String(ex.id || ex.exerciseId || index)}
          numColumns={numColumns}
          key={numColumns}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : null}
          onEndReached={() => {
            const visiveis = exerciciosFiltrados.slice(0, 40);
            traduzirVisiveis(visiveis);
          }}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            <Text style={styles.estadoVazioTexto}>
              Nenhum exercício encontrado.
            </Text>
          }
        />
      )}

      <CardExercicioModal
        exercicio={exercicioSelecionado}
        handleClose={() => setExercicioSelecionado(null)}
        modoCriacao={modoCriacao}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  columnWrapper: {
    gap: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  botaoVoltarSerie: {
    backgroundColor: colors.amarelo,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  botaoVoltarSerieTexto: {
    color: "#000",
    fontWeight: "700",
    fontSize: 12,
  },
  rotulo: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.texto,
    marginBottom: 16,
  },
  areaBusca: {
    gap: 12,
    marginBottom: 16,
    zIndex: 10,
  },
  dropdownContainer: {
    position: "relative",
  },
  selectClasse: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borda,
  },
  selectClasseTexto: {
    color: colors.texto,
    fontSize: 14,
  },
  iconeDropdownAberto: {
    transform: [{ rotate: "180deg" }],
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: colors.card2,
    borderRadius: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.borda,
    zIndex: 100,
    elevation: 5,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borda,
  },
  dropdownItemSelecionado: {
    backgroundColor: colors.amareloDim,
  },
  dropdownItemTexto: {
    color: colors.texto,
    fontSize: 14,
  },
  dropdownItemTextoSelecionado: {
    color: colors.amarelo,
    fontWeight: "600",
  },
  inputBuscaContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBg,
    borderRadius: 10,
    paddingHorizontal: 14,
    gap: 10,
  },
  inputBusca: {
    flex: 1,
    color: colors.texto,
    fontSize: 15,
    paddingVertical: 14,
  },
  cardGrid: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.borda,
  },
  imagemGrid: {
    width: "100%",
    height: 110,
    backgroundColor: colors.card2,
  },
  infoGrid: {
    padding: 10,
  },
  nomeGrid: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.texto,
  },
  estadoVazio: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  estadoVazioTexto: {
    color: colors.textoSuave,
    textAlign: "center",
    fontSize: 15,
  },
});
