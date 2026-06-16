import React, { useState } from "react";
import { DIAS_SEMANA, montarCelulas } from "../../data/dadosPerfil";
import { IcoSetaEsq, IcoSetaDir } from "./Icones";
import styles from "./Calendario.module.css";

export default function Calendario() {
  const [_nav, setNav] = useState(0);
  const celulas = montarCelulas();

  return (
    <div className={styles.calendario}>
      <div className={styles.cabecalho}>
        <div className={styles.mes}>
          Maio <span>2026</span>
        </div>
        <div className={styles.nav}>
          <button
            className={styles.btnNav}
            onClick={() => setNav((n) => n - 1)}
            aria-label="Anterior"
          >
            <IcoSetaEsq />
          </button>
          <button
            className={styles.btnNav}
            onClick={() => setNav((n) => n + 1)}
            aria-label="Próximo"
          >
            <IcoSetaDir />
          </button>
        </div>
      </div>

      <div className={styles.semana}>
        {DIAS_SEMANA.map((d) => (
          <div key={d} className={styles.diaNome}>
            {d}
          </div>
        ))}
      </div>

      <div className={styles.grade}>
        {celulas.map((c, i) => (
          <div key={i} className={`${styles.celula} ${styles[c.tipo] || ""}`}>
            {c.dia}
          </div>
        ))}
      </div>

      <div className={styles.legenda}>
        <div className={styles.legItem}>
          <div className={`${styles.legPonto} ${styles.pontoTreinado}`} />{" "}
          Treinado
        </div>
        <div className={styles.legItem}>
          <div className={`${styles.legPonto} ${styles.pontoHoje}`} /> Hoje
        </div>
        <div className={styles.legItem}>
          <div className={`${styles.legPonto} ${styles.pontoDescanso}`} />{" "}
          Descanso
        </div>
      </div>
    </div>
  );
}
