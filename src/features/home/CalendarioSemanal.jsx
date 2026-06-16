import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function obterDiasDaSemana(navOffset) {
  const hoje = new Date();
  const dataAlvo = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate() + navOffset * 7,
  );
  const domingo = new Date(
    dataAlvo.getFullYear(),
    dataAlvo.getMonth(),
    dataAlvo.getDate() - dataAlvo.getDay(),
  );

  const dias = [];
  for (let i = 0; i < 7; i++) {
    const diaAtual = new Date(
      domingo.getFullYear(),
      domingo.getMonth(),
      domingo.getDate() + i,
    );

    const isHoje =
      diaAtual.getDate() === hoje.getDate() &&
      diaAtual.getMonth() === hoje.getMonth() &&
      diaAtual.getFullYear() === hoje.getFullYear();

    dias.push({
      dia: diaAtual.getDate(),
      mes: diaAtual.getMonth(),
      ano: diaAtual.getFullYear(),
      dataISO: diaAtual.toISOString().split("T")[0],
      tipo: isHoje ? "hoje" : "",
    });
  }

  return dias;
}

export default function CalendarioSemanal() {
  const [nav, setNav] = useState(0);
  const [celulasSemana, setCelulasSemana] = useState([]);

  useEffect(() => {
    const diasCalculados = obterDiasDaSemana(nav);
    setCelulasSemana(diasCalculados);
  }, [nav]);

  if (celulasSemana.length === 0) return null;

  const mesAtual = MESES[celulasSemana[0].mes];
  const anoAtual = celulasSemana[0].ano;

  return (
    <View style={styles.cardCalendario}>
      <View style={styles.cabecalho}>
        <Text style={styles.mes}>
          {mesAtual}{" "}
          <Text style={styles.ano}>{anoAtual}</Text>
        </Text>
        <View style={styles.nav}>
          <Pressable
            style={styles.btnNav}
            onPress={() => setNav((n) => n - 1)}
            accessibilityLabel="Semana anterior"
          >
            <Feather name="chevron-left" size={20} color={colors.texto} />
          </Pressable>
          <Pressable
            style={styles.btnNav}
            onPress={() => setNav((n) => n + 1)}
            accessibilityLabel="Próxima semana"
          >
            <Feather name="chevron-right" size={20} color={colors.texto} />
          </Pressable>
        </View>
      </View>

      <View style={styles.gradeSemana}>
        {celulasSemana.map((c, i) => (
          <View key={c.dataISO} style={styles.colunaDia}>
            <Text style={styles.diaNome}>{DIAS_SEMANA[i]}</Text>
            <View
              style={[
                styles.celulaNumero,
                c.tipo === "hoje" && styles.hoje,
              ]}
            >
              <Text
                style={[
                  styles.celulaNumeroTexto,
                  c.tipo === "hoje" && styles.hojeTexto,
                ]}
              >
                {c.dia}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardCalendario: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borda,
  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  mes: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.texto,
  },
  ano: {
    color: colors.textoSuave,
    fontWeight: "400",
  },
  nav: {
    flexDirection: "row",
    gap: 8,
  },
  btnNav: {
    padding: 6,
    backgroundColor: colors.card2,
    borderRadius: 8,
  },
  gradeSemana: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  colunaDia: {
    alignItems: "center",
    flex: 1,
  },
  diaNome: {
    fontSize: 11,
    color: colors.textoSuave,
    marginBottom: 8,
    fontWeight: "600",
  },
  celulaNumero: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  celulaNumeroTexto: {
    fontSize: 14,
    color: colors.texto,
    fontWeight: "600",
  },
  hoje: {
    backgroundColor: colors.amarelo,
  },
  hojeTexto: {
    color: "#000",
  },
});
