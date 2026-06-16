import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import LabelInput from "../../../components/ui/LabelInput";
import BotaoOpcao from "../components/BotaoOpcao";
import { colors } from "../../../theme/colors";

const Passo1Form = ({ respostasForm, camposVazios, atualizarForm }) => {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Vamos montar seu perfil</Text>
        <Text style={styles.subtitle}>
          Preencha seus dados básicos para podermos personalizar sua ficha de
          treino.
        </Text>
      </View>
      <View style={styles.inputs}>
        <LabelInput
          label="Nome"
          placeholder="Digite seu nome"
          taVazio={camposVazios?.nome}
          valorInput={respostasForm.nome}
          onChange={(valor) => {
            const valorFiltrado = valor
              .replace(/[^a-zA-ZÀ-ÿ\s]/g, "")
              .slice(0, 15);
            atualizarForm("nome", valorFiltrado);
          }}
        />
        <View style={styles.inputsPequenos}>
          <View style={styles.inputPequeno}>
            <LabelInput
              label="Idade"
              placeholder="Idade"
              taVazio={camposVazios?.idade}
              valorInput={respostasForm.idade}
              onChange={(valor) => {
                let valorFiltrado = valor.replace(/\D/g, "");
                if (Number(valorFiltrado) > 100) valorFiltrado = "100";
                atualizarForm("idade", valorFiltrado);
              }}
            />
          </View>
          <View style={styles.inputPequeno}>
            <LabelInput
              label="Peso (kg):"
              placeholder="Ex: 72,5"
              taVazio={camposVazios?.peso}
              valorInput={respostasForm.peso}
              onChange={(valor) => {
                let valorFiltrado = valor.replace(/[^0-9.,]/g, "");
                if (parseFloat(valorFiltrado.replace(",", ".")) > 500)
                  valorFiltrado = "500";
                atualizarForm("peso", valorFiltrado);
              }}
            />
          </View>
          <View style={styles.inputPequeno}>
            <LabelInput
              label="Altura (cm):"
              placeholder="Ex: 180"
              taVazio={camposVazios?.altura}
              valorInput={respostasForm.altura}
              onChange={(valor) => {
                let valorFiltrado = valor.replace(/[^0-9.,]/g, "");
                if (parseFloat(valorFiltrado.replace(",", ".")) > 300)
                  valorFiltrado = "300";
                atualizarForm("altura", valorFiltrado);
              }}
            />
          </View>
        </View>
        <View style={styles.sexoContainer}>
          <Text style={styles.sexoLabel}>Sexo biológico:</Text>
          <View style={styles.sexoRadios}>
            <BotaoOpcao
              opcao="Masculino"
              isSelecionado={respostasForm.sexo === "Masculino"}
              onClick={() => atualizarForm("sexo", "Masculino")}
            />
            <BotaoOpcao
              opcao="Feminino"
              isSelecionado={respostasForm.sexo === "Feminino"}
              onClick={() => atualizarForm("sexo", "Feminino")}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    paddingBottom: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.texto,
    marginBottom: 8,
    textAlign: "center"
  },
  subtitle: {
    fontSize: 14,
    color: colors.textoSuave,
    lineHeight: 20,
    textAlign: "center"
  },
  inputs: {
    gap: 4,
  },
  inputsPequenos: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  inputPequeno: {
    flex: 1,
    minWidth: 100,
  },
  sexoContainer: {
    marginTop: 8,
  },
  sexoLabel: {
    color: colors.texto,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  sexoRadios: {
    gap: 10,
  },
});

export default Passo1Form;
