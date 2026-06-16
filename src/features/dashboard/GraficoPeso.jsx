import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { colors } from "../../theme/colors";

function GraficoPeso() {
  const { width } = useWindowDimensions();
  const chartWidth = Math.min(width - 72, 400);

  const data = [
    { value: 2 },
    { value: 3 },
    { value: 5.5 },
    { value: 8.5 },
    { value: 1.5 },
    { value: 5 },
    { value: 1 },
    { value: 4 },
    { value: 3 },
    { value: 8 },
  ];

  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        curved
        height={200}
        width={chartWidth}
        color={colors.laranja}
        dataPointsColor={colors.laranja}
        yAxisColor={colors.borda}
        xAxisColor={colors.borda}
        yAxisTextStyle={styles.axisText}
        noOfSections={4}
        backgroundColor="transparent"
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

export default GraficoPeso;
