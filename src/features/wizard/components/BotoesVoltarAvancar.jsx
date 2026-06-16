import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../../theme/colors";

const BotoesVoltarAvancar = ({
  voltar,
  avancar,
  passoAtual,
  gerarFichas,
  podeAvancar,
}) => {
  return (
    <View
      style={[
        styles.botoes,
        passoAtual === 1 ? styles.botoesCentro : styles.botoesEspaco,
      ]}
    >
      {passoAtual > 1 && (
        <Pressable onPress={voltar} style={styles.voltar}>
          <Feather name="arrow-left" size={18} color={colors.texto} />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </Pressable>
      )}
      <Pressable
        onPress={passoAtual < 6 ? avancar : gerarFichas}
        disabled={!podeAvancar}
        style={[styles.avancar, !podeAvancar && styles.avancarDisabled]}
      >
        <Text
          style={[
            styles.avancarTexto,
            !podeAvancar && styles.avancarTextoDisabled,
          ]}
        >
          {passoAtual < 6 ? "Avançar" : "Finalizar"}
        </Text>
        <Feather
          name="arrow-right"
          size={18}
          color={podeAvancar ? "#1f2122" : colors.desabilitado}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  botoes: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#323537",
    borderRadius: 15,
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  botoesCentro: {
    justifyContent: "center",
  },
  botoesEspaco: {
    justifyContent: "space-between",
  },
  voltar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    width: "50%",
  },
  voltarTexto: {
    color: colors.texto,
    fontSize: 16,
    fontWeight: "600",
  },
  avancar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.amarelo,
    paddingVertical: 14,
    borderRadius: 12,
    width: "50%",
  },
  avancarDisabled: {
    backgroundColor: colors.inputBg || "#2c2c2e",
  },
  avancarTexto: {
    color: "#1f2122",
    fontSize: 16,
    fontWeight: "700",
  },
  avancarTextoDisabled: {
    color: colors.desabilitado || "#939496",
  },
});

export default BotoesVoltarAvancar;
