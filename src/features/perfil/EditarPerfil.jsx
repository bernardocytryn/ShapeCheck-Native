import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import LabelInput from "../../components/ui/LabelInput";
import BotaoAmarelo from "../../components/ui/BotaoAmarelo";
import showError from "../../utils/showError";
import { getItemSync, setItemSync } from "../../utils/storage";
import { colors } from "../../theme/colors";

export default function EditarPerfil() {
  const { usuario, finalizarCadastroWizard } = useAuth();
  const perfil = usuario?.perfil || {};

  const [nome, setNome] = React.useState(perfil?.nome || "");
  const [email, setEmail] = React.useState(usuario?.email || "");
  const [senhaAtual, setSenhaAtual] = React.useState("");
  const [novaSenha, setNovaSenha] = React.useState("");
  const [confirmarSenha, setConfirmarSenha] = React.useState("");
  const [expanded, setExpanded] = React.useState(null);

  const toggle = (key) => setExpanded((s) => (s === key ? null : key));

  const salvarNome = () => {
    if (!nome || nome.trim().length < 3)
      return showError("Nome deve ter ao menos 3 caracteres.");
    const novoPerfil = { ...(perfil || {}), nome: nome.trim() };
    finalizarCadastroWizard(novoPerfil);
  };

  const salvarEmail = () => {
    const re = /^\S+@\S+\.\S+$/;
    if (!re.test(email)) return showError("E-mail inválido.");

    try {
      const usuarios = JSON.parse(
        getItemSync("shapecheck_usuarios") || "[]",
      );
      const idSessao = getItemSync("shapecheck_sessao");
      const idx = usuarios.findIndex((u) => u.id === idSessao);
      if (idx !== -1) {
        usuarios[idx].email = email.toLowerCase();
        setItemSync("shapecheck_usuarios", JSON.stringify(usuarios));
        finalizarCadastroWizard(perfil);
      } else {
        showError("Não foi possível localizar usuário para atualizar e-mail.");
      }
    } catch (e) {
      showError("Erro ao salvar e-mail localmente.");
    }
  };

  const alterarSenha = () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha)
      return showError("Preencha todos os campos de senha.");
    if (novaSenha === senhaAtual)
      return showError("A nova senha deve ser diferente da atual.");
    if (novaSenha !== confirmarSenha)
      return showError("A confirmação da senha não confere.");
  };

  return (
    <View style={styles.containerSmall}>
      <Pressable style={styles.row} onPress={() => toggle("nome")}>
        <Text style={styles.sectionTitle}>Alterar Nome</Text>
        <Feather name="chevron-right" size={18} color={colors.textoSuave} />
      </Pressable>
      {expanded === "nome" && (
        <View style={styles.sectionContent}>
          <Text style={styles.sectionSub}>Atual: {perfil?.nome || "—"}</Text>
          <LabelInput label="Nome" valorInput={nome} onChange={setNome} />
          <View style={styles.smallBtn}>
            <BotaoAmarelo texto="Salvar" onClick={salvarNome} />
          </View>
        </View>
      )}

      <Pressable style={styles.row} onPress={() => toggle("email")}>
        <Text style={styles.sectionTitle}>Alterar E-mail</Text>
        <Feather name="chevron-right" size={18} color={colors.textoSuave} />
      </Pressable>
      {expanded === "email" && (
        <View style={styles.sectionContent}>
          <Text style={styles.sectionSub}>
            Atual: {usuario?.email || "—"}
          </Text>
          <LabelInput
            label="E-mail"
            valorInput={email}
            onChange={setEmail}
            type="email"
          />
          <View style={styles.smallBtn}>
            <BotaoAmarelo texto="Salvar" onClick={salvarEmail} />
          </View>
        </View>
      )}

      <Pressable style={styles.row} onPress={() => toggle("senha")}>
        <Text style={styles.sectionTitle}>Alterar Senha</Text>
        <Feather name="chevron-right" size={18} color={colors.textoSuave} />
      </Pressable>
      {expanded === "senha" && (
        <View style={styles.sectionContent}>
          <Text style={styles.sectionSub}>Mantenha sua senha segura</Text>
          <LabelInput
            label="Senha atual"
            type="password"
            valorInput={senhaAtual}
            onChange={setSenhaAtual}
          />
          <LabelInput
            label="Nova senha"
            type="password"
            valorInput={novaSenha}
            onChange={setNovaSenha}
          />
          <LabelInput
            label="Confirmar nova senha"
            type="password"
            valorInput={confirmarSenha}
            onChange={setConfirmarSenha}
          />
          <View style={styles.smallBtn}>
            <BotaoAmarelo texto="Alterar senha" onClick={alterarSenha} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  containerSmall: {
    backgroundColor: colors.card2,
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borda,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.texto,
  },
  sectionContent: {
    paddingVertical: 12,
    gap: 8,
  },
  sectionSub: {
    fontSize: 12,
    color: colors.textoSuave,
  },
  smallBtn: {
    marginTop: 8,
  },
});
