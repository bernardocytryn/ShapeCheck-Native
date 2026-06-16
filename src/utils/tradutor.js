export const traduzirTexto = async (texto) => {
    if (!texto) return "";
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=${encodeURIComponent(texto)}`;
        const res = await fetch(url);
        const json = await res.json();
        return json[0].map(item => item[0]).join('');
    } catch (error) {
        console.error("Erro ao traduzir:", error);
        return texto;
    }
};

export const traduzirEmLote = async (itens) => {
    if (!itens || itens.length === 0) return {};

    try {
        const textoUnico = itens.map(ex => ex.name).join(" @@@ ");
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=${encodeURIComponent(textoUnico)}`;
        const res = await fetch(url);
        const json = await res.json();

        const textoCompletoPt = json[0].map(item => item[0]).join('');
        const listaTraduzida = textoCompletoPt.split("@@@").map(str => str.trim());

        const resultado = {};
        itens.forEach((ex, index) => {
            resultado[ex.id || ex.exerciseId] = listaTraduzida[index] || ex.name;
        });

        return resultado;
    } catch (error) {
        console.error("Falha ao traduzir em lote:", error);
        return {};
    }
};