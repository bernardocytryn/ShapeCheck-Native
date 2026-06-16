import React from "react";
import { View, StyleSheet } from "react-native";
import BotaoOpcao from "../components/BotaoOpcao";
import Pergunta from "../components/Pergunta";
import ImagemPasso from "../components/ImagemPasso";
import { objetivoTreino } from "../../../assets/wizardImages";

const Passo5Objetivo = ({ respostasWizard, selecionarOpcao }) => {
  return (
    <View style={styles.container}>
      <ImagemPasso imagemSource={objetivoTreino} />
      <Pergunta pergunta="Defina seu objetivo:" />
      <View style={styles.options}>
        <BotaoOpcao
          opcao="Ganho de músculo"
          isSelecionado={respostasWizard.objetivo === "Ganho de músculo"}
          onClick={() => selecionarOpcao("objetivo", "Ganho de músculo")}
        />
        <BotaoOpcao
          opcao="Emagrecimento"
          isSelecionado={respostasWizard.objetivo === "Emagrecimento"}
          onClick={() => selecionarOpcao("objetivo", "Emagrecimento")}
        />
        <BotaoOpcao
          opcao="Força"
          isSelecionado={respostasWizard.objetivo === "Força"}
          onClick={() => selecionarOpcao("objetivo", "Força")}
        />
        <BotaoOpcao
          opcao="Condicionamento"
          isSelecionado={respostasWizard.objetivo === "Condicionamento"}
          onClick={() => selecionarOpcao("objetivo", "Condicionamento")}
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

export default Passo5Objetivo;
