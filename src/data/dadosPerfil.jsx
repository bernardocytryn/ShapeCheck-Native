export const dadosUsuario = {
  nome: "Rafael Costa",
  iniciais: "RC",
  idade: 28,
  arroba: "@rafael.costa",
  email: "rafael@email.com",
  online: true,
};

export const statsData = [
  { val: "Massa",  lbl: "Objetivo atual",    streak: false, icon: "mira" },
  { val: "82 kg",  lbl: "Peso atual",         streak: false, icon: "peso" },
  { val: "5×",     lbl: "Frequência semanal", streak: false, icon: "calendario" },
  { val: "11 sem", lbl: "Sequência ativa",    streak: true,  icon: "fogo" },
];

export const configsData = [
  { titulo: "Alterar senha",  sub: "Última alteração há 3 meses", perigo: false, icon: "cadeado" },
  { titulo: "Dados da conta", sub: "Nome, e-mail, CPF",           perigo: false, icon: "usuario" },
  { titulo: "Privacidade",    sub: "Visibilidade e dados",        perigo: false, icon: "escudo" },
  { titulo: "Preferências",   sub: "Unidades, idioma, tema",      perigo: false, icon: "ajustes" },
  { titulo: "Sair da conta",  sub: "Encerrar sessão atual",       perigo: true,  icon: "sair" },
];

export const DIAS_TREINADOS = new Set([1,3,5,6,8,10,13,15,17,19,20,22]);
export const DIA_HOJE = 23;
export const DIAS_SEMANA = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

export function montarCelulas() {
  const celulas = [];
  [26,27,28,29,30].forEach(d => celulas.push({ dia: d, tipo: "outro" }));
  for (let d = 1; d <= 31; d++) {
    if (d === DIA_HOJE)              celulas.push({ dia: d, tipo: "hoje" });
    else if (DIAS_TREINADOS.has(d))  celulas.push({ dia: d, tipo: "treinado" });
    else                             celulas.push({ dia: d, tipo: "descanso" });
  }
  let n = 1;
  while (celulas.length % 7) celulas.push({ dia: n++, tipo: "outro" });
  return celulas;
}