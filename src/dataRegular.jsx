import { useEffect, useState } from "react";

export function useDashboardData() {
  const [barRegularData, setBarRegularData] = useState([]);
  const [initialEvents, setInitialEvents] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [annualComparison, setAnnualComparison] = useState(null);
  const [paradasAnoAtual, setParadasAnoAtual] = useState(0);

  useEffect(() => {
    async function fetchParadasData() {
      try {
        const res = await fetch(`${import.meta.env.API_URL}api/manutencao/listar`, {
          method: "GET",
          headers: {
            "Authorization": "Basic " + btoa(`${import.meta.env.USERNAME_CREDENTIAL}:${import.meta.env.PASSWORD_CREDENTIAL}`),
          },
        });
        
        const registros = await res.json();

        // --- CALENDÁRIO ---
        const eventos = registros.map((r) => {
          const dataInicio = new Date(`${r.data}T${r.hora_inicio}`);
          const dataFim = new Date(`${r.data}T${r.hora_fim}`);
          return {
            title: `${r.descricao} - Máquina ${r.id_maquina}`,
            start: dataInicio,
            end: dataFim,
            className: r.tipo_parada.toLowerCase() === "preventiva"
              ? "event-manutencao"
              : "event-parada",
          };
        });
        setInitialEvents(eventos);

        // --- PIE CHART ---
        const total = registros.length;
        const manutencoes = registros.filter(r => r.tipo_parada.toLowerCase() === "preventiva").length;
        const paradas = total - manutencoes;

        setPieData([
          { id: 0, name: "Manutenção", value: manutencoes, color: "#2563eb" },
          { id: 1, name: "Parada", value: paradas, color: "#94a3b8" },
        ]);

        // --- GRÁFICO DE BARRAS ---
        const valoresPorMes = Array(12).fill(0);
        const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

        registros.forEach(r => {
          if (!r.date) return;
          const dataParada = new Date(r.date);
          if (!isNaN(dataParada)) {
            const mes = dataParada.getMonth();
            valoresPorMes[mes] += 1;
          }
        });

        const dadosGrafico = meses.map((m, i) => ({ name: m, value: valoresPorMes[i] }));
        setBarRegularData(dadosGrafico);

        // --- COMPARAÇÃO ANUAL ---
        const anoAtual = new Date().getFullYear();

        // Usar r.date em vez de r.data
        const paradasAtual = registros.filter(r => {
          const dataRegistro = new Date(r.date);
          return !isNaN(dataRegistro) && dataRegistro.getFullYear() === anoAtual;
        }).length;

        const paradasAnterior = registros.filter(r => {
          const dataRegistro = new Date(r.date);
          return !isNaN(dataRegistro) && dataRegistro.getFullYear() === anoAtual - 1;
        }).length;

        const aumento = paradasAnterior === 0 ? "N/A" : `${(((paradasAtual - paradasAnterior)/paradasAnterior)*100).toFixed       (2)}%`;

        setAnnualComparison({
          paradasAnoAtual: paradasAtual,
          paradasAnoAnterior: paradasAnterior,
          aumento,
        });

        setParadasAnoAtual(paradasAtual); 

      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchParadasData();
  }, []);

  return {
    barRegularData,
    initialEvents,
    pieData,
    loading,
    annualComparison,
    paradasAnoAtual,
  };
}
