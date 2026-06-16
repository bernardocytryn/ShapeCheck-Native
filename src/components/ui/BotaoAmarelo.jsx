import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

const BotaoAmarelo = ({ texto, onClick, disabled }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.botao,
        pressed && styles.botaoPressed,
        disabled && styles.botaoDisabled,
      ]}
      onPress={onClick}
      disabled={disabled}
    >
      <Text style={[styles.texto, disabled && styles.textoDisabled]}>{texto}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  botao: {
    backgroundColor: colors.amarelo,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
  },
  botaoPressed: {
    backgroundColor: colors.amareloHover,
  },
  botaoDisabled: {
    backgroundColor: colors.inputBg,
  },
  texto: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
  textoDisabled: {
    color: colors.desabilitado,
  },
});

export default BotaoAmarelo;
