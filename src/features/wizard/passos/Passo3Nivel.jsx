import React from "react";
import { View, StyleSheet } from "react-native";
import ImagemPasso from "../components/ImagemPasso";
import Pergunta from "../components/Pergunta";
import BotaoOpcao from "../components/BotaoOpcao";
import { nivelTreino } from "../../../assets/wizardImages";

const Passo3Nivel = ({ respostasWizard, selecionarOpcao }) => {
  return (
    <View style={styles.container}>
      <ImagemPasso imagemSource={nivelTreino} />
      <Pergunta pergunta="Qual seu nível atual de treino?" />
      <View style={styles.options}>
        <BotaoOpcao
          opcao="Iniciante"
          isSelecionado={respostasWizard.nivel === "Iniciante"}
          onClick={() => selecionarOpcao("nivel", "Iniciante")}
        />
        <BotaoOpcao
          opcao="Intermediário"
          isSelecionado={respostasWizard.nivel === "Intermediário"}
          onClick={() => selecionarOpcao("nivel", "Intermediário")}
        />
        <BotaoOpcao
          opcao="Avançado"
          isSelecionado={respostasWizard.nivel === "Avançado"}
          onClick={() => selecionarOpcao("nivel", "Avançado")}
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

export default Passo3Nivel;
