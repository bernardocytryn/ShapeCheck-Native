import { Text, StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

const Pergunta = ({ pergunta }) => {
  return <Text style={styles.pergunta}>{pergunta}</Text>;
};

const styles = StyleSheet.create({
  pergunta: {
    fontSize: 24,
    textAlign: "center",
    color: colors.texto,
    fontWeight: "700",
    marginVertical: 16,
  },
});

export default Pergunta;
