import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import { getItemSync } from "../../utils/storage";
import { colors } from "../../theme/colors";

function getIcon(iconKey) {
  const iconProps = { size: 22, color: colors.amarelo };
  const icons = {
    mira: <MaterialCommunityIcons name="target" {...iconProps} />,
    peso: <MaterialCommunityIcons name="weight" {...iconProps} />,
    calendario: <Feather name="calendar" {...iconProps} />,
    fogo: <Feather name="zap" {...iconProps} />,
  };
  return icons[iconKey];
}

export default function CardStatus() {
  const { usuario } = useAuth();
  const { width } = useWindowDimensions();
  const perfil = usuario?.perfil || {};

  const objetivo = perfil?.objetivo || "—";
  const peso = perfil?.peso ? `${perfil.peso} kg` : "—";
  const frequencia = perfil?.frequencia || "—";

  let series = [];
  try {
    series =
      JSON.parse(getItemSync("minhasSeries") || "null") ||
      usuario?.treinos ||
      [];
  } catch (e) {
    series = usuario?.treinos || [];
  }

  const semanas = Array.isArray(series) ? series.length : 0;

  const stats = [
    { val: objetivo, lbl: "Objetivo atual", icon: "mira" },
    { val: peso, lbl: "Peso atual", icon: "peso" },
    { val: frequencia, lbl: "Frequência semanal", icon: "calendario" },
    {
      val: semanas > 0 ? `${semanas} sem` : "—",
      lbl: "Sequência ativa",
      icon: "fogo",
      streak: semanas > 0,
    },
  ];

  const cardWidth = width >= 768 ? "48%" : "48%";

  return (
    <View style={styles.grid}>
      {stats.map((stat, i) => (
        <View
          key={i}
          style={[
            styles.statCard,
            { width: cardWidth },
            stat.streak && styles.streak,
          ]}
        >
          <View style={styles.icone}>{getIcon(stat.icon)}</View>
          <Text style={styles.valor} numberOfLines={2}>
            {stat.val}
          </Text>
          <Text style={styles.rotulo}>{stat.lbl}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borda,
    alignItems: "center",
    gap: 6,
  },
  streak: {
    borderColor: colors.amarelo,
  },
  icone: {
    marginBottom: 4,
  },
  valor: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.texto,
    textAlign: "center",
  },
  rotulo: {
    fontSize: 11,
    color: colors.textoSuave,
    textAlign: "center",
  },
});
