import { useEffect, useState } from "react";

export function useDashboardData() {
  const [barRegularData, setBarRegularData] = useState([]);
  const [initialEvents, setInitialEvents] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [annualComparison, setAnnualComparison] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // 🔹 Busca registros e manutenções em paralelo
        const [resRegistros, resManutencoes] = await Promise.all([
          fetch("http://localhost:8081/api/registro/listar"),
          fetch("http://localhost:8081/api/manutencao/listar"),
        ]);

        const registros = await resRegistros.json();
        const manutencoes = await resManutencoes.json();

        const todosEventos = [...registros, ...manutencoes];

        // === GERA GRÁFICO DE BARRAS ===
        const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const valoresPorMes = Array(12).fill(0);

        todosEventos.forEach((r) => {
          const mes = new Date(r.dataInicio).getMonth();
          valoresPorMes[mes] += r.tempoParada ?? 0;
        });

        const dadosGrafico = meses.map((m, i) => ({
          name: m,
          value: valoresPorMes[i],
        }));
        setBarRegularData(dadosGrafico);

        // === MONTA EVENTOS PARA O CALENDÁRIO ===
        const eventos = todosEventos.map((r) => ({
          title: `${r.motivo} - Setor ${r.setor}`,
          start: r.dataInicio,
          end: r.dataFim,
          className: r.motivo?.toLowerCase().includes("manutenção")
            ? "event-manutencao"
            : "event-parada",
        }));
        setInitialEvents(eventos);

        // === PIE CHART ===
        const total = todosEventos.length;
        const qtdManutencoes = todosEventos.filter((r) =>
          r.motivo?.toLowerCase().includes("manutenção")
        ).length;
        const qtdParadas = total - qtdManutencoes;

        setPieData([
          { id: 0, name: "Manutenção", value: qtdManutencoes, color: "#2563eb" },
          { id: 1, name: "Parada", value: qtdParadas, color: "#94a3b8" },
        ]);

        // === COMPARAÇÃO ANUAL ===
        const anoAtual = new Date().getFullYear();
        const anoAnterior = anoAtual - 1;

        const eventosAnoAtual = todosEventos.filter(
          (r) => new Date(r.dataInicio).getFullYear() === anoAtual
        ).length;

        const eventosAnoAnterior = todosEventos.filter(
          (r) => new Date(r.dataInicio).getFullYear() === anoAnterior
        ).length;

        let aumento = 0;
        if (eventosAnoAnterior > 0) {
          aumento = ((eventosAnoAtual - eventosAnoAnterior) / eventosAnoAnterior) * 100;
        } else if (eventosAnoAtual > 0) {
          aumento = 100;
        }

        setAnnualComparison({
          paradasAnoAtual: eventosAnoAtual,
          paradasAnoAnterior: eventosAnoAnterior,
          aumento: aumento.toFixed(1) + "%",
        });
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return {
    barRegularData,
    initialEvents,
    pieData,
    loading,
    annualComparison,
  };
}
