import React, { useState } from "react";
import { IcoSino, IcoEngrenagem } from "./Icones";
import styles from "./NavbarPerfil.module.css";

export default function NavbarPerfil() {
  const [notifLigada, setNotifLigada] = useState(true);

  return (
    <nav className={styles.nav}>
      <button
        className={`${styles.iconButton} ${notifLigada ? styles.notifOn : styles.notifOff}`}
        onClick={() => setNotifLigada((n) => !n)}
        aria-label="Alternar notificações"
        title={notifLigada ? "Notificações ativadas" : "Notificações desativadas"}
      >
        <IcoSino />
      </button>
      <button className={styles.iconButton} aria-label="Configurações">
        <IcoEngrenagem />
      </button>
    </nav>
  );
}