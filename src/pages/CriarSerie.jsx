import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useCriarSerie } from "../contexts/SeriesContext.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { colors } from "../theme/colors";

export default function CriarSerie({ navigation }) {
  const {
    nomeSerie,
    setNomeSerie,
    exerciciosSelecionados,
    removerExercicio,
    limparRascunho,
    idSerieEdicao,
  } = useCriarSerie();

  const { usuario, finalizarCadastroWizard } = useAuth();

  const irParaBusca = () => {
    navigation.navigate("Consultar", { modoCriacao: true });
  };

  const salvarSerie = () => {
    if (!nomeSerie || exerciciosSelecionados.length === 0) return;

    const serieFinal = {
      id: idSerieEdicao || Date.now().toString(),
      nome: nomeSerie,
      exercicios: exerciciosSelecionados,
    };

    const seriesAntigas = usuario?.treinos || [];
    let seriesAtualizadas;

    if (idSerieEdicao) {
      seriesAtualizadas = seriesAntigas.map((s) =>
        s.id === idSerieEdicao ? serieFinal : s,
      );
    } else {
      seriesAtualizadas = [...seriesAntigas, serieFinal];
    }

    finalizarCadastroWizard(usuario.perfil, seriesAtualizadas);

    limparRascunho();
    navigation.navigate(
      idSerieEdicao ? "SeriesDetail" : "TreinosList",
      idSerieEdicao ? { id: idSerieEdicao } : undefined,
    );
  };

  const handleVoltar = () => {
    limparRascunho();
    navigation.navigate(
      idSerieEdicao ? "SeriesDetail" : "TreinosList",
      idSerieEdicao ? { id: idSerieEdicao } : undefined,
    );
  };

  const podeSalvar = nomeSerie && exerciciosSelecionados.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.cabecalhoSerie}>
        <Pressable onPress={handleVoltar} style={styles.botaoVoltar}>
          <Feather name="arrow-left" size={18} color={colors.texto} />
          <Text style={styles.botaoVoltarTexto}>Voltar</Text>
        </Pressable>

        <TextInput
          style={styles.inputNomeSerie}
          placeholder="Nome da Série"
          placeholderTextColor={colors.textoSuave}
          value={nomeSerie}
          onChangeText={setNomeSerie}
        />
        <Text style={styles.contadorExercicios}>
          Total: {exerciciosSelecionados.length} exercício(s)
        </Text>
      </View>

      <ScrollView style={styles.conteudoPrincipal}>
        <Pressable style={styles.botaoAdicionar} onPress={irParaBusca}>
          <Text style={styles.botaoAdicionarTexto}>+ Adicionar Exercício</Text>
        </Pressable>

        <View style={styles.listaExercicios}>
          {exerciciosSelecionados.map((exercicio) => (
            <View
              key={exercicio.exerciseId || exercicio.id}
              style={styles.itemExercicio}
            >
              <Text style={styles.nomeExercicio}>
                {exercicio.name || "Exercício sem nome"}
              </Text>
              <Pressable
                style={styles.botaoRemover}
                onPress={() =>
                  removerExercicio(exercicio.exerciseId || exercicio.id)
                }
              >
                <Text style={styles.botaoRemoverTexto}>Remover</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.rodapeAcoes}>
        <Pressable style={styles.botaoCancelar} onPress={handleVoltar}>
          <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
        </Pressable>
        <Pressable
          style={[styles.botaoSalvar, !podeSalvar && styles.botaoSalvarDisabled]}
          onPress={salvarSerie}
          disabled={!podeSalvar}
        >
          <Text style={styles.botaoSalvarTexto}>
            {idSerieEdicao ? "Salvar Alterações" : "Salvar Lista"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  cabecalhoSerie: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borda,
    gap: 12,
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
  inputNomeSerie: {
    backgroundColor: colors.inputBg,
    color: colors.texto,
    borderRadius: 10,
    padding: 14,
    fontSize: 18,
    fontWeight: "600",
  },
  contadorExercicios: {
    color: colors.textoSuave,
    fontSize: 13,
  },
  conteudoPrincipal: {
    flex: 1,
    padding: 20,
  },
  botaoAdicionar: {
    backgroundColor: colors.amareloDim,
    borderWidth: 1,
    borderColor: colors.amarelo,
    borderStyle: "dashed",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  botaoAdicionarTexto: {
    color: colors.amarelo,
    fontWeight: "700",
    fontSize: 15,
  },
  listaExercicios: {
    gap: 10,
  },
  itemExercicio: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borda,
  },
  nomeExercicio: {
    color: colors.texto,
    fontSize: 14,
    flex: 1,
    marginRight: 12,
  },
  botaoRemover: {
    padding: 6,
  },
  botaoRemoverTexto: {
    color: colors.vermelho,
    fontSize: 13,
    fontWeight: "600",
  },
  rodapeAcoes: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borda,
    paddingBottom: 100,
  },
  botaoCancelar: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borda,
  },
  botaoCancelarTexto: {
    color: colors.texto,
    fontWeight: "600",
  },
  botaoSalvar: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: colors.amarelo,
  },
  botaoSalvarDisabled: {
    backgroundColor: colors.inputBg,
  },
  botaoSalvarTexto: {
    color: "#000",
    fontWeight: "700",
  },
});
