import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth";
import LabelInput from "../components/ui/LabelInput";
import { colors } from "../theme/colors";

export default function TelaAutenticacao() {
  const { logarComEmail, cadastrarComEmail } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState({});

  const handleSubmit = () => {
    const novosErros = {};

    if (!email) novosErros.email = "O e-mail é obrigatório.";
    if (!senha) novosErros.senha = "A senha é obrigatória.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      novosErros.email = "Digite um e-mail válido.";
    }

    if (!isLogin && senha && senha.length < 6) {
      novosErros.senha = "A senha deve ter no mínimo 6 caracteres.";
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    let respostaBanco;
    if (isLogin) {
      respostaBanco = logarComEmail(email, senha);
    } else {
      respostaBanco = cadastrarComEmail(email, senha);
    }

    if (!respostaBanco.sucesso) {
      setErros({ senha: respostaBanco.erro });
    } else {
      setErros({});
    }
  };

  const trocarAba = (modoLogin) => {
    setIsLogin(modoLogin);
    setErros({});
    setEmail("");
    setSenha("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <View style={styles.abas}>
              <Pressable
                style={[styles.aba, isLogin && styles.abaAtiva]}
                onPress={() => trocarAba(true)}
              >
                <Text style={[styles.abaTexto, isLogin && styles.abaTextoAtiva]}>
                  Entrar
                </Text>
              </Pressable>
              <Pressable
                style={[styles.aba, !isLogin && styles.abaAtiva]}
                onPress={() => trocarAba(false)}
              >
                <Text style={[styles.abaTexto, !isLogin && styles.abaTextoAtiva]}>
                  Cadastrar
                </Text>
              </Pressable>
            </View>

            <View style={styles.formulario}>
              <Text style={styles.titulo}>
                {isLogin ? "Bem-vindo de volta!" : "Crie sua conta"}
              </Text>

              <LabelInput
                label="E-mail"
                placeholder="Digite seu e-mail"
                valorInput={email}
                taVazio={erros.email}
                onChange={setEmail}
                type="email"
              />

              <LabelInput
                label="Senha"
                placeholder="Digite sua senha"
                valorInput={senha}
                taVazio={erros.senha}
                onChange={setSenha}
                type="password"
              />

              <Pressable style={styles.btnEnviar} onPress={handleSubmit}>
                <Text style={styles.btnEnviarTexto}>
                  {isLogin ? "Entrar" : "Criar conta"}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.borda,
  },
  abas: {
    flexDirection: "row",
    marginBottom: 24,
    backgroundColor: colors.inputBg,
    borderRadius: 10,
    padding: 4,
  },
  aba: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  abaAtiva: {
    backgroundColor: colors.amarelo,
  },
  abaTexto: {
    color: colors.textoSuave,
    fontWeight: "600",
  },
  abaTextoAtiva: {
    color: "#000",
  },
  formulario: {
    gap: 4,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.texto,
    marginBottom: 20,
    textAlign: "center",
  },
  btnEnviar: {
    backgroundColor: colors.amarelo,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  btnEnviarTexto: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },
});
