import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  getItem,
  setItem,
  removeItem,
  getItemSync,
  setItemSync,
  preloadStorage,
} from "../utils/storage";

export const AuthContext = createContext();

const STORAGE_KEYS = ["shapecheck_usuarios", "shapecheck_sessao"];

export const AuthProvider = ({ children }) => {
  const [carregando, setCarregando] = useState(true);
  const [idSessao, setIdSessao] = useState(null);
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [completouWizard, setCompletouWizard] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    async function inicializar() {
      await preloadStorage(STORAGE_KEYS);
      let usuarios = getItemSync("shapecheck_usuarios");
      if (!usuarios) {
        await setItem("shapecheck_usuarios", JSON.stringify([]));
        usuarios = "[]";
      }
      const sessao = getItemSync("shapecheck_sessao");
      if (sessao) {
        const lista = JSON.parse(usuarios);
        const user = lista.find((u) => u.id === sessao);
        if (user) {
          setIdSessao(sessao);
          setEstaAutenticado(true);
          setUsuario(user);
          setCompletouWizard(!!user.perfil);
        }
      }
      setCarregando(false);
    }
    inicializar();
  }, []);

  const cadastrarComEmail = useCallback((email, senha) => {
    const usuarios = JSON.parse(getItemSync("shapecheck_usuarios") || "[]");

    if (usuarios.some((u) => u.email === email.toLowerCase())) {
      return { sucesso: false, erro: "Este e-mail já está cadastrado!" };
    }

    const novoUsuario = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      email: email.toLowerCase(),
      senha: senha,
      perfil: null,
      treinos: [],
    };

    usuarios.push(novoUsuario);
    setItemSync("shapecheck_usuarios", JSON.stringify(usuarios));
    setItemSync("shapecheck_sessao", novoUsuario.id);
    setIdSessao(novoUsuario.id);
    setEstaAutenticado(true);
    setCompletouWizard(false);
    setUsuario(novoUsuario);

    return { sucesso: true };
  }, []);

  const logarComEmail = useCallback((email, senha) => {
    const usuarios = JSON.parse(getItemSync("shapecheck_usuarios") || "[]");

    const user = usuarios.find(
      (u) => u.email === email.toLowerCase() && u.senha === senha,
    );

    if (!user) {
      return { sucesso: false, erro: "E-mail ou senha incorretos!" };
    }

    setItemSync("shapecheck_sessao", user.id);
    setIdSessao(user.id);
    setEstaAutenticado(true);
    setCompletouWizard(!!user.perfil);
    setUsuario(user);

    return { sucesso: true };
  }, []);

  const finalizarCadastroWizard = useCallback(
    (dadosDoFormulario, seriesGeradas) => {
      const usuarios = JSON.parse(getItemSync("shapecheck_usuarios") || "[]");
      const index = usuarios.findIndex((u) => u.id === idSessao);

      if (index !== -1) {
        usuarios[index].perfil = dadosDoFormulario;
        if (seriesGeradas !== undefined) {
          usuarios[index].treinos = seriesGeradas || [];
        }

        setItemSync("shapecheck_usuarios", JSON.stringify(usuarios));
        setUsuario(usuarios[index]);
        setCompletouWizard(true);
      }
    },
    [idSessao],
  );

  const sairDaConta = useCallback(() => {
    removeItem("shapecheck_sessao");
    setIdSessao(null);
    setEstaAutenticado(false);
    setCompletouWizard(false);
    setUsuario(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        carregando,
        estaAutenticado,
        completouWizard,
        usuario,
        logarComEmail,
        cadastrarComEmail,
        finalizarCadastroWizard,
        sairDaConta,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
