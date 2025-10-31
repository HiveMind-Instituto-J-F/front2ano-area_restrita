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
        const res = await fetch(`${import.meta.env.VITE_API_URL}api/registro/listar`, {
          method: "GET",
          headers: {
            "Authorization": "Basic " + btoa(`${import.meta.env.VITE_USERNAME_CREDENTIAL}:${import.meta.env.VITE_PASSWORD_CREDENTIAL}`),
          },
          mode: "cors",
          credentials: "include",
        });

        const registros = await res.json();
        console.log(registros);

        // --- CALENDÁRIO ---
        const eventos = registros.map((r) => {
          const dataInicio = new Date(`${r.dt_parada}T${r.hora_inicio}`);
          const dataFim = new Date(`${r.dt_parada}T${r.hora_fim}`);

          const isManutencao = r.id_manutencao !== null;

          return {
            title: `${r.des_parada ?? "Parada"} - Máquina ${r.id_maquina}`,
            start: dataInicio,
            end: dataFim,
            className: isManutencao ? "event-manutencao" : "event-parada",
          };
        });
        setInitialEvents(eventos);

        // --- PIE CHART ---
        const manutencoes = registros.filter(r => r.id_manutencao !== null).length;
        const paradas = registros.length - manutencoes;

        setPieData([
          { id: 0, name: "Manutenção", value: manutencoes, color: "#2563eb" },
          { id: 1, name: "Parada", value: paradas, color: "#94a3b8" },
        ]);

        // --- BARRAS MÊS ---
        const valoresPorMes = Array(12).fill(0);
        const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

        registros.forEach(r => {
          const dataParada = new Date(r.dt_parada);
          if (!isNaN(dataParada)) {
            const mes = dataParada.getMonth();
            valoresPorMes[mes] += 1;
          }
        });

        const dadosGrafico = meses.map((m, i) => ({ name: m, value: valoresPorMes[i] }));
        setBarRegularData(dadosGrafico);

        // --- COMPARAÇÃO ANUAL ---
        const anoAtual = new Date().getFullYear();

        const paradasAtual = registros.filter(r => {
          const d = new Date(r.dt_parada);
          return !isNaN(d) && d.getFullYear() === anoAtual;
        }).length;

        const paradasAnterior = registros.filter(r => {
          const d = new Date(r.dt_parada);
          return !isNaN(d) && d.getFullYear() === anoAtual - 1;
        }).length;

        const aumento = paradasAnterior === 0
          ? "N/A"
          : `${(((paradasAtual - paradasAnterior) / paradasAnterior) * 100).toFixed(2)}%`;

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
