import { Pressable, Text, StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

const BotaoOpcao = ({ opcao, isSelecionado, onClick, style }) => {
  return (
    <Pressable
      style={[
        styles.botaoOpcao,
        isSelecionado && styles.selecionado,
        style,
      ]}
      onPress={onClick}
    >
      <Text
        style={[
          styles.texto,
          isSelecionado && styles.textoSelecionado,
        ]}
      >
        {opcao}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  botaoOpcao: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.borda,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
  },
  selecionado: {
    borderColor: colors.amarelo,
    backgroundColor: colors.amareloDim,
  },
  texto: {
    color: colors.texto,
    fontSize: 16,
    fontWeight: "600",
  },
  textoSelecionado: {
    color: colors.amarelo,
  },
});

export default BotaoOpcao;
