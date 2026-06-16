import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import EditarPerfil from "./EditarPerfil";
import { colors } from "../../theme/colors";

export default function ListaConfiguracoes() {
  const { sairDaConta } = useAuth();
  const [showConta, setShowConta] = useState(false);

  const items = [
    { titulo: "Conta", sub: "Gerenciar suas informações", icon: "user" },
  ];

  const lidarComClique = (item) => {
    if (item.icon === "user") {
      setShowConta((s) => !s);
    }
  };

  const handleSair = () => {
    sairDaConta();
  };

  return (
    <View style={styles.lista}>
      {items.map((config, i) => (
        <View key={i}>
          <Pressable
            style={styles.item}
            onPress={() => lidarComClique(config)}
          >
            <View style={styles.icone}>
              <Feather name="user" size={20} color={colors.amarelo} />
            </View>
            <View style={styles.textoContainer}>
              <Text style={styles.titulo}>{config.titulo}</Text>
              <Text style={styles.subtitulo}>{config.sub}</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textoSuave} />
          </Pressable>

          {config.icon === "user" && showConta && (
            <View style={styles.expand}>
              <EditarPerfil />
            </View>
          )}
        </View>
      ))}

      <Pressable style={[styles.item, styles.perigo]} onPress={handleSair}>
        <View style={styles.icone}>
          <Feather name="log-out" size={20} color={colors.vermelho} />
        </View>
        <View style={styles.textoContainer}>
          <Text style={[styles.titulo, styles.tituloPerigo]}>
            Sair da conta
          </Text>
          <Text style={styles.subtitulo}>Encerrar sessão atual</Text>
        </View>
        <Feather name="chevron-right" size={18} color={colors.textoSuave} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  lista: {
    gap: 8,
  },
  item: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borda,
    gap: 12,
  },
  perigo: {
    borderColor: "rgba(255, 77, 91, 0.3)",
  },
  icone: {
    width: 36,
    alignItems: "center",
  },
  textoContainer: {
    flex: 1,
  },
  titulo: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.texto,
  },
  tituloPerigo: {
    color: colors.vermelho,
  },
  subtitulo: {
    fontSize: 12,
    color: colors.textoSuave,
    marginTop: 2,
  },
  expand: {
    marginTop: 8,
    marginBottom: 8,
  },
});
