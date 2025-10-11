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
        const res = await fetch("http://localhost:8081/api/manutencao/listar"); 
        const registros = await res.json();

        const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
        const valoresPorMes = Array(12).fill(0);

        // --- Gerar datas fictícias caso não existam ---
        const registrosComDatas = registros.map((r, index) => {
          // Criar datas fictícias dentro do ano atual
          const dia = index + 1 <= 28 ? index + 1 : 28; // evitar datas inválidas
          const dataInicio = new Date(new Date().getFullYear(), 9, dia, 8, 0); // outubro
          const dataFim = new Date(new Date().getFullYear(), 9, dia, 9, 30);
          const motivo = r.acao_realizada; // usar ação como motivo

          return { ...r, dataInicio, dataFim, motivo };
        });

        // --- GRÁFICO DE BARRAS ---
        registrosComDatas.forEach(r => {
          const mes = r.dataInicio.getMonth();
          valoresPorMes[mes] += 1; // somar 1 hora/fictício
        });

        setBarRegularData(meses.map((m, i) => ({ name: m, value: valoresPorMes[i] })));

        // --- CALENDÁRIO ---
        const eventos = registrosComDatas.map(r => ({
          title: `${r.acao_realizada} - Máquina ${r.id_maquina}`,
          start: r.dataInicio,
          end: r.dataFim,
          className: r.acao_realizada.toLowerCase().includes("manutenção")
            ? "event-manutencao"
            : "event-parada",
        }));
        setInitialEvents(eventos);

        const total = registrosComDatas.length;
        const manutencoes = registrosComDatas.filter(r =>
          r.acao_realizada.toLowerCase().includes("manutenção")
        ).length;
        const paradas = total - manutencoes;

        setPieData([
          { id: 0, name: "Manutenção", value: manutencoes, color: "#2563eb" },
          { id: 1, name: "Parada", value: paradas, color: "#94a3b8" },
        ]);

        // --- COMPARAÇÃO ANUAL ---
        const anoAtual = new Date().getFullYear();
        const paradasAnoAtual = registrosComDatas.filter(
          r => r.dataInicio.getFullYear() === anoAtual
        ).length;

        const paradasAnoAnterior = registrosComDatas.filter(
          r => r.dataInicio.getFullYear() === anoAtual - 1
        ).length;

        let aumento = "0.0%";
        if (paradasAnoAnterior > 0) {
          aumento = `${(((paradasAnoAtual - paradasAnoAnterior) / paradasAnoAnterior) * 100).toFixed(1)}%`;
        } else if (paradasAnoAtual > 0) {
          aumento = "100.0%";
        }

        setAnnualComparison({ paradasAnoAtual, paradasAnoAnterior, aumento });
        setParadasAnoAtual(paradasAnoAtual);

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
