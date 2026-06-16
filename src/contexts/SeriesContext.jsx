import { createContext, useState, useContext } from "react";

export const SeriesContext = createContext();

export function CriacaoSerieProvider({ children }) {
  const [nomeSerie, setNomeSerie] = useState("");
  const [exerciciosSelecionados, setExerciciosSelecionados] = useState([]);
  const [idSerieEdicao, setIdSerieEdicao] = useState(null);

  const adicionarExercicio = (exercicio) => {
    const jaExiste = exerciciosSelecionados.find(
      (item) => (item.exerciseId || item.id) === (exercicio.exerciseId || exercicio.id)
    );
    if (!jaExiste) {
      setExerciciosSelecionados([...exerciciosSelecionados, exercicio]);
    }
  };

  const removerExercicio = (idParaRemover) => {
    const novaLista = exerciciosSelecionados.filter(
      (item) => (item.exerciseId || item.id) !== idParaRemover
    );
    setExerciciosSelecionados(novaLista);
  };

  const iniciarEdicao = (serie) => {
    setIdSerieEdicao(serie.id);
    setNomeSerie(serie.nome);
    setExerciciosSelecionados(serie.exercicios || []);
  };

  const limparRascunho = () => {
    setNomeSerie("");
    setExerciciosSelecionados([]);
    setIdSerieEdicao(null);
  };

  return (
    <SeriesContext.Provider
      value={{
        nomeSerie,
        setNomeSerie,
        exerciciosSelecionados,
        adicionarExercicio,
        removerExercicio,
        limparRascunho,
        idSerieEdicao,
        iniciarEdicao,
      }}
    >
      {children}
    </SeriesContext.Provider>
  );
}

export function useCriarSerie() {
  return useContext(SeriesContext);
}