import { createContext, useContext, useState, useEffect } from "react";
import { getItem, setItem, getItemSync, setItemSync, preloadStorage } from "../utils/storage";

const StatusTreinoContext = createContext();

const STORAGE_KEYS = [
  "shapecheck_status_series",
  "shapecheck_treinos_concluidos",
];

export function StatusTreinoProvider({ children }) {
  const [statusSeries, setStatusSeries] = useState({});
  const [treinosConcluidos, setTreinosConcluidos] = useState({});
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    async function carregar() {
      await preloadStorage(STORAGE_KEYS);
      const salvosStatus = JSON.parse(
        getItemSync("shapecheck_status_series") || "{}",
      );
      const salvosTreinos = JSON.parse(
        getItemSync("shapecheck_treinos_concluidos") || "{}",
      );
      setStatusSeries(salvosStatus);
      setTreinosConcluidos(salvosTreinos);
      setPronto(true);
    }
    carregar();
  }, []);

  const alternarStatus = (treinoId, exercicioId) => {
    const chave = `${treinoId}_${exercicioId}`;
    setStatusSeries((prev) => {
      const atual = prev[chave] || false;
      const novoStatus = { ...prev, [chave]: !atual };
      setItemSync(
        "shapecheck_status_series",
        JSON.stringify(novoStatus),
      );
      return novoStatus;
    });
  };

  const finalizarTreino = (treinoId, listaExerciciosIds) => {
    const novosTreinos = { ...treinosConcluidos, [treinoId]: true };
    setTreinosConcluidos(novosTreinos);
    setItemSync(
      "shapecheck_treinos_concluidos",
      JSON.stringify(novosTreinos),
    );

    setStatusSeries((prev) => {
      const novoStatus = { ...prev };
      listaExerciciosIds.forEach(
        (id) => (novoStatus[`${treinoId}_${id}`] = true),
      );
      setItemSync("shapecheck_status_series", JSON.stringify(novoStatus));
      return novoStatus;
    });
  };

  const toggleTreinoConcluido = (treinoId, listaExerciciosIds) => {
    const estaConcluido = !!treinosConcluidos[treinoId];
    const novosTreinos = { ...treinosConcluidos, [treinoId]: !estaConcluido };
    setTreinosConcluidos(novosTreinos);
    setItemSync(
      "shapecheck_treinos_concluidos",
      JSON.stringify(novosTreinos),
    );

    setStatusSeries((prev) => {
      const novoStatus = { ...prev };
      listaExerciciosIds.forEach(
        (id) => (novoStatus[`${treinoId}_${id}`] = !estaConcluido),
      );
      setItemSync("shapecheck_status_series", JSON.stringify(novoStatus));
      return novoStatus;
    });
  };

  const setEstadoConcluido = (treinoId, status) => {
    setTreinosConcluidos((prev) => {
      if (prev[treinoId] === status) return prev;
      const novosTreinos = { ...prev, [treinoId]: status };
      setItemSync(
        "shapecheck_treinos_concluidos",
        JSON.stringify(novosTreinos),
      );
      return novosTreinos;
    });
  };

  if (!pronto) return null;

  return (
    <StatusTreinoContext.Provider
      value={{
        statusSeries,
        treinosConcluidos,
        alternarStatus,
        finalizarTreino,
        toggleTreinoConcluido,
        setEstadoConcluido,
      }}
    >
      {children}
    </StatusTreinoContext.Provider>
  );
}

export function useStatusTreino() {
  const context = useContext(StatusTreinoContext);
  if (!context)
    throw new Error(
      "useStatusTreino deve ser usado dentro de um StatusTreinoProvider",
    );
  return context;
}
