import React from "react";
import { View, StyleSheet } from "react-native";
import ImagemPasso from "../components/ImagemPasso";
import Pergunta from "../components/Pergunta";
import BotaoOpcao from "../components/BotaoOpcao";
import { casaAcademia } from "../../../assets/wizardImages";

const Passo2Lugar = ({ respostasWizard, selecionarOpcao }) => {
  return (
    <View style={styles.container}>
      <ImagemPasso imagemSource={casaAcademia} />
      <Pergunta pergunta="Onde pretende treinar?" />
      <View style={styles.options}>
        <BotaoOpcao
          opcao="Casa"
          isSelecionado={respostasWizard.lugar === "Casa"}
          onClick={() => selecionarOpcao("lugar", "Casa")}
        />
        <BotaoOpcao
          opcao="Academia"
          isSelecionado={respostasWizard.lugar === "Academia"}
          onClick={() => selecionarOpcao("lugar", "Academia")}
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

export default Passo2Lugar;
