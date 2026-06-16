import { createContext, useContext, useState, useEffect } from "react";
import { dicMusculos, dicEquipamentos } from "../utils/dicionarios";
import { traduzirTexto } from "../utils/tradutor";
import { getItem, setItem, getItemSync, setItemSync } from "../utils/storage";
import { RAPIDAPI_KEY } from "../utils/env";

const ExerciciosContext = createContext();

export function ExerciciosProvider({ children }) {
  const [exercicios, setExercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function carregarCatalogo() {
      try {
        setLoading(true);
        const cacheChave = "shapecheck_catalogo_base";
        const cacheLocal = await getItem(cacheChave);

        if (cacheLocal) {
          const { timestamp, data } = JSON.parse(cacheLocal);
          if (Date.now() - timestamp < 3600000 && data.length > 0) {
            setExercicios(data);
            setLoading(false);
            return;
          }
        }

        const options = {
          method: "GET",
          headers: {
            "x-rapidapi-key": RAPIDAPI_KEY,
            "x-rapidapi-host":
              "edb-with-videos-and-images-by-ascendapi.p.rapidapi.com",
          },
        };

        let todosExercicios = [];
        let proximaPagina = null;
        const delay = (ms) => new Promise((res) => setTimeout(res, ms));

        do {
          const url = `https://edb-with-videos-and-images-by-ascendapi.p.rapidapi.com/api/v1/exercises?limit=25${proximaPagina ? `&after=${proximaPagina}` : ""}`;
          const res = await fetch(url, options);

          if (!res.ok) break;

          const json = await res.json();
          const dados = json.data || [];

          if (dados.length === 0) break;

          const dadosMapeados = dados.map((ex) => ({
            id: ex.id || ex.exerciseId,
            name: ex.name,
            bodyPart:
              dicMusculos[ex.bodyPart?.toLowerCase()] || ex.bodyPart || "",
            equipment:
              dicEquipamentos[ex.equipment?.toLowerCase()] ||
              ex.equipment ||
              "",
            target:
              dicMusculos[ex.target?.toLowerCase()] || ex.target || "",
            imageUrl:
              ex.imageUrl ||
              ex.gifUrl ||
              ex.imageUrls?.["360p"] ||
              null,
          }));

          todosExercicios = [...todosExercicios, ...dadosMapeados];
          proximaPagina = json.meta?.hasNextPage ? json.meta.nextCursor : null;

          if (proximaPagina && todosExercicios.length < 200) {
            await delay(800);
          }
        } while (proximaPagina && todosExercicios.length < 200);

        const unicos = Array.from(
          new Map(todosExercicios.map((item) => [item.id, item])).values(),
        );

        if (unicos.length > 0) {
          await setItem(
            cacheChave,
            JSON.stringify({ timestamp: Date.now(), data: unicos }),
          );
          setExercicios(unicos);
        } else {
          throw new Error("Falha ao carregar a lista da API");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    carregarCatalogo();
  }, []);

  const fetchDetalhes = async (idParaBusca) => {
    try {
      const cacheChave = `shapecheck_detalhe_${idParaBusca}`;
      const cacheLocal = await getItem(cacheChave);

      if (cacheLocal) {
        return JSON.parse(cacheLocal);
      }

      const res = await fetch(
        `https://edb-with-videos-and-images-by-ascendapi.p.rapidapi.com/api/v1/exercises/${idParaBusca}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key": RAPIDAPI_KEY,
            "x-rapidapi-host":
              "edb-with-videos-and-images-by-ascendapi.p.rapidapi.com",
          },
        },
      );

      if (!res.ok) return null;

      const json = await res.json();
      let dados = json.data;

      if (dados) {
        dados.name = await traduzirTexto(dados.name);

        if (dados.overview) {
          dados.overview = await traduzirTexto(dados.overview);
        }
        if (dados.description) {
          if (Array.isArray(dados.description)) {
            dados.description = await Promise.all(
              dados.description.map((d) => traduzirTexto(d)),
            );
          } else {
            dados.description = await traduzirTexto(dados.description);
          }
        }
        if (dados.summary) {
          dados.summary = await traduzirTexto(dados.summary);
        }

        if (dados.instructions && dados.instructions.length > 0) {
          dados.instructions = await Promise.all(
            dados.instructions.map((linha) => traduzirTexto(linha)),
          );
        }

        const processarTags = async (lista, dicionario) => {
          if (!lista || !Array.isArray(lista)) return [];

          return await Promise.all(
            lista.map(async (item) => {
              const chave = item.toLowerCase();
              const valor =
                dicionario[chave] || (await traduzirTexto(item));
              return valor.toUpperCase();
            }),
          );
        };

        if (dados.targetMuscles?.length > 0) {
          dados.targetMuscles = await processarTags(
            dados.targetMuscles,
            dicMusculos,
          );
        }

        if (dados.equipments?.length > 0) {
          dados.equipments = await processarTags(
            dados.equipments,
            dicEquipamentos,
          );
        }

        if (dados.bodyParts?.length > 0) {
          dados.bodyParts = await processarTags(
            dados.bodyParts,
            dicMusculos,
          );
        }

        await setItem(cacheChave, JSON.stringify(dados));
      }

      return dados;
    } catch (e) {
      console.error("Erro ao buscar detalhes:", e);
      return null;
    }
  };

  return (
    <ExerciciosContext.Provider
      value={{ exercicios, loading, error, fetchDetalhes }}
    >
      {children}
    </ExerciciosContext.Provider>
  );
}

export function useExercicios() {
  const context = useContext(ExerciciosContext);
  if (!context) throw new Error("Contexto vazio");
  return context;
}
