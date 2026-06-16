import { useState } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BarraProgresso from "../features/wizard/components/BarraProgresso";
import BotoesVoltarAvancar from "../features/wizard/components/BotoesVoltarAvancar";
import Passo1Form from "../features/wizard/passos/Passo1Form";
import Passo2Lugar from "../features/wizard/passos/Passo2Lugar";
import Passo3Nivel from "../features/wizard/passos/Passo3Nivel";
import Passo4Frequencia from "../features/wizard/passos/Passo4Frequencia";
import Passo5Objetivo from "../features/wizard/passos/Passo5Objetivo";
import PassoFinal from "../features/wizard/passos/PassoFinal";
import { useAuth } from "../hooks/useAuth";
import { useExercicios } from "../contexts/ExerciciosContext";
import { MISTRAL_API_KEY } from "../utils/env";
import { colors } from "../theme/colors";

const Wizard = ({ navigation }) => {
  const { finalizarCadastroWizard } = useAuth();
  const { exercicios } = useExercicios();

  const [passoAtual, setPassoAtual] = useState(1);
  const [isCarregando, setIsCarregando] = useState(false);
  const [camposVazios, setCamposVazios] = useState({});

  const [respostasForm, setRespostasForm] = useState({
    nome: "",
    idade: "",
    peso: "",
    altura: "",
    sexo: "",
  });

  const [respostasWizard, setRespostasWizard] = useState({
    lugar: "",
    nivel: "",
    frequencia: "",
    objetivo: "",
  });

  const atualizarForm = (campo, valor) => {
    setRespostasForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const voltar = () => setPassoAtual((prev) => Math.max(prev - 1, 1));

  const avancar = () => {
    if (passoAtual === 1) {
      const vazios = {};
      if (!respostasForm.nome) vazios.nome = true;
      if (!respostasForm.idade) vazios.idade = true;
      if (!respostasForm.peso) vazios.peso = true;
      if (!respostasForm.altura) vazios.altura = true;
      if (!respostasForm.sexo) vazios.sexo = true;
      if (Object.keys(vazios).length > 0) {
        setCamposVazios(vazios);
        return;
      }
      setCamposVazios({});
    }

    if (passoAtual === 2 && !respostasWizard.lugar) return;
    if (passoAtual === 3 && !respostasWizard.nivel) return;
    if (passoAtual === 4 && !respostasWizard.frequencia) return;
    if (passoAtual === 5 && !respostasWizard.objetivo) return;

    if (passoAtual === 6) {
      finalizarWizard();
    } else {
      setPassoAtual((prev) => prev + 1);
    }
  };

  const selecionarOpcao = (campo, valor) => {
    setRespostasWizard((prev) => ({ ...prev, [campo]: valor }));
  };

  const verificarSePodeAvancar = () => {
    if (passoAtual === 1) {
      const nomeValido = respostasForm.nome.trim().length >= 3;
      const idadeValida = Number(respostasForm.idade) >= 1;
      const pesoValido = parseFloat(respostasForm.peso.replace(",", ".")) >= 10;
      const alturaValida =
        parseFloat(respostasForm.altura.replace(",", ".")) >= 40;
      return (
        respostasForm.sexo &&
        nomeValido &&
        idadeValida &&
        pesoValido &&
        alturaValida
      );
    }
    if (passoAtual === 2) return respostasWizard.lugar !== "";
    if (passoAtual === 3) return respostasWizard.nivel !== "";
    if (passoAtual === 4) return respostasWizard.frequencia !== "";
    if (passoAtual === 5) return respostasWizard.objetivo !== "";
    return true;
  };

  const renderizarPasso = () => {
    switch (passoAtual) {
      case 1:
        return (
          <Passo1Form
            respostasForm={respostasForm}
            camposVazios={camposVazios}
            atualizarForm={atualizarForm}
          />
        );
      case 2:
        return (
          <Passo2Lugar
            respostasWizard={respostasWizard}
            selecionarOpcao={selecionarOpcao}
          />
        );
      case 3:
        return (
          <Passo3Nivel
            respostasWizard={respostasWizard}
            selecionarOpcao={selecionarOpcao}
          />
        );
      case 4:
        return (
          <Passo4Frequencia
            respostasWizard={respostasWizard}
            selecionarOpcao={selecionarOpcao}
          />
        );
      case 5:
        return (
          <Passo5Objetivo
            respostasWizard={respostasWizard}
            selecionarOpcao={selecionarOpcao}
          />
        );
      case 6:
        return <PassoFinal />;
      default:
        return null;
    }
  };

  const finalizarWizard = async () => {
    setIsCarregando(true);
    const dadosDoUsuario = {
      ...respostasForm,
      ...respostasWizard,
      fotoAdicionada: false,
    };
    const listaDisponivel = exercicios.map((ex) => ({
      id: ex.id,
      name: ex.name,
    }));
    let seriesGeradas = [];

    try {
      const promptParaIA = `Crie uma ficha de treino para ${dadosDoUsuario.nome}.
      Objetivo: ${dadosDoUsuario.objetivo}
      Frequência: ${dadosDoUsuario.frequencia}
      Nível: ${dadosDoUsuario.nivel}
      
      REGRA CRÍTICA E INEGOCIÁVEL: 
      Selecione os exercícios APENAS e EXCLUSIVAMENTE da lista abaixo. 
      Se um exercício não estiver exatamente nesta lista, NÃO o inclua.
      Lista: ${JSON.stringify(listaDisponivel)}
      
      Retorne APENAS um JSON válido no formato:
      [
        {
          "nome": "Treino A",
          "exercicios": [{ "nome": "nome do exercicio exatamente como na lista" }]
        }
      ]`;

      const respostaIA = await fetch(
        "https://api.mistral.ai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${MISTRAL_API_KEY}`,
          },
          body: JSON.stringify({
            model: "mistral-small-latest",
            messages: [
              {
                role: "system",
                content: "Atue como um personal trainer experiente.",
              },
              {
                role: "user",
                content: promptParaIA,
              },
            ],
            temperature: 0.7,
          }),
        },
      );

      if (!respostaIA.ok) {
        const erroReal = await respostaIA.text();
        throw new Error(`Erro na API: ${respostaIA.status}`);
      }

      const dadosDaAPI = await respostaIA.json();
      const textoResposta = dadosDaAPI.choices[0].message.content;
      const jsonMatch = textoResposta.match(/\[[\s\S]*\]/);

      if (!jsonMatch) {
        throw new Error("JSON não encontrado na resposta");
      }

      const jsonGerado = JSON.parse(jsonMatch[0]);

      seriesGeradas = jsonGerado.map((serie) => {
        const exerciciosDaSerie = serie.exercicios
          .map((ex) => {
            const correspondente = exercicios.find(
              (item) =>
                item.name.toLowerCase().trim() === ex.nome.toLowerCase().trim(),
            );

            if (correspondente) {
              return {
                exerciseId: correspondente.id,
                name: correspondente.name,
                bodyPart: correspondente.bodyPart,
                equipment: correspondente.equipment,
                imageUrl: correspondente.imageUrl,
              };
            }
            return null;
          })
          .filter((ex) => ex !== null);

        return {
          id:
            Date.now().toString() + Math.random().toString(36).substring(2, 9),
          nome: serie.nome,
          exercicios: exerciciosDaSerie,
        };
      });

      finalizarCadastroWizard(dadosDoUsuario, seriesGeradas);
    } catch (erro) {
      showError(
        "Não foi possível gerar seu treino. Verifique a API e tente novamente.",
      );
    } finally {
      setIsCarregando(false);
    }
  };

  if (isCarregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.amarelo} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.wizard}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {passoAtual < 6 && (
            <BarraProgresso passoAtual={passoAtual} totalPassos={5} />
          )}
          <View style={styles.passoAnimado}>{renderizarPasso()}</View>
          <BotoesVoltarAvancar
            voltar={voltar}
            avancar={avancar}
            passoAtual={passoAtual}
            gerarFichas={finalizarWizard}
            podeAvancar={verificarSePodeAvancar()}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  wizard: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    padding: 24,
    flexGrow: 1,
  },
  passoAnimado: {
    flex: 1,
    minHeight: 300,
  },
  loading: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Wizard;
