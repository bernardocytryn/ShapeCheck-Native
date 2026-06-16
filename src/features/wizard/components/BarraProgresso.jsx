import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../theme/colors";

const BarraProgresso = ({ passoAtual, totalPassos }) => {
  const porcentagemProgresso = (passoAtual / totalPassos) * 100;

  return (
    <View style={styles.barraProgresso}>
      <LinearGradient
        colors={["#2563eb", "#3b82f6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.preenchimento, { width: `${porcentagemProgresso}%` }]}
      />
      <Text style={styles.texto}>
        Passo {passoAtual} de {totalPassos}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  barraProgresso: {
    height: 36,
    backgroundColor: colors.card2,
    borderRadius: 18,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  preenchimento: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
  },
  texto: {
    color: colors.texto,
    fontSize: 13,
    fontWeight: "600",
    zIndex: 1,
  },
});

export default BarraProgresso;
