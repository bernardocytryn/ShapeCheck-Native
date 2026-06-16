import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  Modal,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { CameraView, useCameraPermissions } from "expo-camera";
import showError from "../../utils/showError";
import { useAuth } from "../../hooks/useAuth";
import { colors } from "../../theme/colors";

export default function CardPerfil() {
  const insets = useSafeAreaInsets();
  const { usuario, finalizarCadastroWizard } = useAuth();
  const perfil = usuario?.perfil || {};

  const nome = perfil?.nome || usuario?.email || "Usuário";
  const idade = perfil?.idade || "--";
  const email = usuario?.email;
  const photo = perfil?.photo;

  const [menuOpen, setMenuOpen] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = React.useRef(null);

  const calcularIniciais = (nomeStr) => {
    if (!nomeStr) return "U";
    const partes = nomeStr.trim().split(" ");
    const a = partes[0]?.[0] || "";
    const b = partes[1]?.[0] || "";
    return (a + b).toUpperCase();
  };

  const processImageUri = async (uri) => {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800, height: 800 } }],
      { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG, base64: true },
    );
    return `data:image/jpeg;base64,${result.base64}`;
  };

  const salvarFoto = async (dataUrl) => {
    const novoPerfil = { ...(perfil || {}), photo: dataUrl };
    finalizarCadastroWizard(novoPerfil);
    setMenuOpen(false);
    setShowCamera(false);
  };

  const escolherImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showError(
        Platform.OS === "ios"
          ? "Permita o acesso às Fotos em Ajustes do iOS."
          : "Permita o acesso à galeria nas configurações do Android.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: Platform.OS === "ios",
      aspect: Platform.OS === "ios" ? [1, 1] : undefined,
      quality: 0.9,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        const dataUrl = await processImageUri(result.assets[0].uri);
        await salvarFoto(dataUrl);
      } catch (e) {
        console.error(e);
        showError("Erro ao processar imagem.");
      }
    }
  };

  const abrirCamera = async () => {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        showError(
          Platform.OS === "ios"
            ? "Permita o acesso à Câmera em Ajustes do iOS."
            : "Permita o acesso à câmera nas configurações do Android.",
        );
        return;
      }
    }
    setShowCamera(true);
    setMenuOpen(false);
  };

  const captureFromCamera = async () => {
    if (!cameraRef.current) return;
    try {
      const photoResult = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        skipProcessing: Platform.OS === "android",
      });
      const dataUrl = await processImageUri(photoResult.uri);
      await salvarFoto(dataUrl);
    } catch (e) {
      showError("Não foi possível capturar a foto.");
    }
  };

  const removePhoto = () => {
    Alert.alert("Remover foto", "Deseja remover sua foto de perfil?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => {
          const novoPerfil = { ...(perfil || {}) };
          delete novoPerfil.photo;
          finalizarCadastroWizard(novoPerfil);
          setMenuOpen(false);
        },
      },
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={styles.inner}>
        <View style={styles.avatarWrapper}>
          <Pressable
            style={styles.avatar}
            onPress={() => setMenuOpen((s) => !s)}
          >
            {photo ? (
              <Image source={{ uri: photo }} style={styles.avatarImg} />
            ) : (
              <Text style={styles.avatarTxt}>{calcularIniciais(nome)}</Text>
            )}
          </Pressable>
          <View style={styles.onlineBadge} />

          {menuOpen && (
            <View style={styles.avatarMenu}>
              <Pressable style={styles.avatarMenuBtn} onPress={abrirCamera}>
                <Text style={styles.avatarMenuBtnTexto}>Tirar foto</Text>
              </Pressable>
              <Pressable style={styles.avatarMenuBtn} onPress={escolherImagem}>
                <Text style={styles.avatarMenuBtnTexto}>Escolher imagem</Text>
              </Pressable>
              <Pressable style={styles.avatarMenuBtn} onPress={removePhoto}>
                <Text style={styles.avatarMenuBtnTexto}>Remover foto</Text>
              </Pressable>
            </View>
          )}
        </View>

        <Modal
          visible={showCamera}
          animationType="slide"
          presentationStyle={Platform.OS === "ios" ? "fullScreen" : undefined}
          statusBarTranslucent={Platform.OS === "android"}
          onRequestClose={() => setShowCamera(false)}
        >
          <SafeAreaView style={styles.cameraOverlay} edges={["top", "bottom"]}>
            <CameraView ref={cameraRef} style={styles.camera} facing="front" />
            <View
              style={[
                styles.cameraBotoes,
                {
                  paddingBottom: Math.max(
                    insets.bottom,
                    Platform.OS === "android" ? 20 : 12,
                  ),
                },
              ]}
            >
              <Pressable
                style={styles.cameraBtn}
                onPress={captureFromCamera}
              >
                <Text style={styles.cameraBtnTexto}>Capturar</Text>
              </Pressable>
              <Pressable
                style={styles.cameraBtn}
                onPress={() => setShowCamera(false)}
              >
                <Text style={styles.cameraBtnTexto}>Cancelar</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </Modal>

        <View style={styles.info}>
          <View style={styles.nomeRow}>
            <Text style={styles.nome}>{nome}</Text>
            <Text style={styles.idade}>{idade} anos</Text>
          </View>
          <Text style={styles.handle}>
            {email || "E-mail não informado"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borda,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.amareloDim,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarTxt: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.amarelo,
  },
  onlineBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.verde,
    borderWidth: 2,
    borderColor: colors.card,
  },
  avatarMenu: {
    position: "absolute",
    top: 80,
    left: 0,
    backgroundColor: colors.card2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borda,
    zIndex: 100,
    minWidth: 160,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  avatarMenuBtn: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borda,
  },
  avatarMenuBtnTexto: {
    color: colors.texto,
    fontSize: 14,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  camera: {
    flex: 1,
  },
  cameraBotoes: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    justifyContent: "center",
    backgroundColor: colors.card,
  },
  cameraBtn: {
    flex: 1,
    maxWidth: 160,
    padding: 14,
    borderRadius: 10,
    backgroundColor: colors.card2,
    alignItems: "center",
  },
  cameraBtnTexto: {
    color: colors.texto,
    fontSize: 15,
    fontWeight: "600",
  },
  info: {
    flex: 1,
    gap: 4,
  },
  nomeRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    flexWrap: "wrap",
  },
  nome: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.texto,
  },
  idade: {
    fontSize: 13,
    color: colors.textoSuave,
  },
  handle: {
    fontSize: 13,
    color: colors.textoSuave,
  },
});
