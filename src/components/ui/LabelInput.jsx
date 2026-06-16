import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

const LabelInput = ({
  label,
  placeholder,
  taVazio,
  valorInput,
  onChange,
  type,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, taVazio ? styles.inputErro : null]}
        placeholder={placeholder}
        placeholderTextColor={colors.textoSuave}
        value={valorInput}
        onChangeText={onChange}
        secureTextEntry={type === "password"}
        keyboardType={
          type === "email"
            ? "email-address"
            : type === "number"
              ? "numeric"
              : "default"
        }
        autoCapitalize={type === "email" ? "none" : "sentences"}
      />
      {taVazio ? (
        <Text style={styles.erro}>
          {typeof taVazio === "string" ? taVazio : "Campo obrigatório"}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    color: colors.texto,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.inputBg,
    color: colors.texto,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  inputErro: {
    borderColor: "#ff4d4d",
  },
  erro: {
    color: colors.vermelho,
    fontSize: 12,
    marginTop: 6,
  },
});

export default LabelInput;
