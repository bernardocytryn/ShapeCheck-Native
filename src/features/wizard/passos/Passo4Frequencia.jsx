import React from "react";
import { View, StyleSheet } from "react-native";
import ImagemPasso from "../components/ImagemPasso";
import Pergunta from "../components/Pergunta";
import BotaoOpcao from "../components/BotaoOpcao";
import { frequenciaTreino } from "../../../assets/wizardImages";

const Passo4Frequencia = ({ respostasWizard, selecionarOpcao }) => {
  return (
    <View style={styles.container}>
      <ImagemPasso imagemSource={frequenciaTreino} />
      <Pergunta pergunta="Frequência semanal de treino?" />
      <View style={styles.options}>
        <BotaoOpcao
          opcao="1-2 dias"
          isSelecionado={respostasWizard.frequencia === "1-2 dias"}
          onClick={() => selecionarOpcao("frequencia", "1-2 dias")}
        />
        <BotaoOpcao
          opcao="3-4 dias"
          isSelecionado={respostasWizard.frequencia === "3-4 dias"}
          onClick={() => selecionarOpcao("frequencia", "3-4 dias")}
        />
        <BotaoOpcao
          opcao="5+ dias"
          isSelecionado={respostasWizard.frequencia === "5+ dias"}
          onClick={() => selecionarOpcao("frequencia", "5+ dias")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 8,
  },
  options: {
    width: "100%",
    maxWidth: 400,
    gap: 12,
    marginTop: 8,
  },
});

export default Passo4Frequencia;
