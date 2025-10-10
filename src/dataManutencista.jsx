import { useEffect, useState } from "react";

export function useDashboardData() {
  const [barRegularData, setBarRegularData] = useState([]);
  const [initialEvents, setInitialEvents] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [annualComparison, setAnnualComparison] = useState(null);

  useEffect(() => {
    async function fetchParadasData() {
      try {
        const res = await fetch("http://localhost:8080/api/manutencao/listar"); 
        const registros = await res.json();

        const meses = [
          "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
          "Jul", "Ago", "Set", "Out", "Nov", "Dez"
        ];

        const valoresPorMes = Array(12).fill(0);
        registros.forEach((r) => {
          const mes = new Date(r.dataInicio).getMonth(); 
          valoresPorMes[mes] += r.tempoParada ?? 0; 
        });

        const dadosGrafico = meses.map((m, i) => ({
          name: m,
          value: valoresPorMes[i],
        }));

        setBarRegularData(dadosGrafico);

        const eventos = registros.map((r) => ({
          title: `${r.motivo} - Setor ${r.setor}`,
          start: r.dataInicio,
          end: r.dataFim,
          className: r.motivo.toLowerCase().includes("manutenção")
            ? "event-manutencao"
            : "event-parada",
        }));
        setInitialEvents(eventos);

        const total = registros.length;
        const manutencoes = registros.filter((r) =>
          r.motivo.toLowerCase().includes("manutenção")
        ).length;
        const paradas = total - manutencoes;

        setPieData([
          { id: 0, name: "Manutenção", value: manutencoes, color: "#2563eb" },
          { id: 1, name: "Parada", value: paradas, color: "#94a3b8" },
        ]);

        // --- Comparação anual ---
        const anoAtual = new Date().getFullYear();
        const anoAnterior = anoAtual - 1;

        const paradasAnoAtual = registros.filter(
          r => new Date(r.dataInicio).getFullYear() === anoAtual
        ).length;

        const paradasAnoAnterior = registros.filter(
          r => new Date(r.dataInicio).getFullYear() === anoAnterior
        ).length;

        let aumento = 0;
        if (paradasAnoAnterior > 0) {
          aumento = ((paradasAnoAtual - paradasAnoAnterior) / paradasAnoAnterior) * 100;
        } else if (paradasAnoAtual > 0) {
          aumento = 100; 
        }

        setAnnualComparison({
          paradasAnoAtual,
          paradasAnoAnterior,
          aumento: aumento.toFixed(1) + "%"
        });

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
  };
}
