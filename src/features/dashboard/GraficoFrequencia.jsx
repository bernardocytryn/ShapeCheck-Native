import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { colors } from "../../theme/colors";

function GraficoFrequencia() {
  const { width } = useWindowDimensions();
  const chartWidth = Math.min(width - 72, 400);

  const barData = [
    {
      value: 4,
      label: "A",
      spacing: 6,
      labelWidth: 30,
      frontColor: colors.amarelo,
    },
    { value: 3, frontColor: colors.laranja },
    { value: 5, frontColor: colors.azul },
    {
      value: 1,
      label: "B",
      spacing: 6,
      labelWidth: 30,
      frontColor: colors.amarelo,
    },
    { value: 6, frontColor: colors.laranja },
    { value: 3, frontColor: colors.azul },
    {
      value: 2,
      label: "C",
      spacing: 6,
      labelWidth: 30,
      frontColor: colors.amarelo,
    },
    { value: 5, frontColor: colors.laranja },
    { value: 6, frontColor: colors.azul },
  ];

  return (
    <View style={styles.container}>
      <BarChart
        data={barData}
        height={200}
        width={chartWidth}
        barWidth={16}
        yAxisColor={colors.borda}
        xAxisColor={colors.borda}
        yAxisTextStyle={styles.axisText}
        noOfSections={4}
        backgroundColor="transparent"
        isAnimated
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    overflow: "hidden",
  },
  axisText: {
    color: colors.textoSuave,
    fontSize: 10,
  },
});

export default GraficoFrequencia;
