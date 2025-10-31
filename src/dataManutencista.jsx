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

      const res = await fetch(`${import.meta.env.VITE_API_URL}api/manutencao/listar`, {
          method: "GET",
          headers: {
            "Authorization": "Basic " + btoa(`${import.meta.env.VITE_USERNAME_CREDENTIAL}:${import.meta.env.VITE_PASSWORD_CREDENTIAL}`),
          },
          mode: "cors",          // garante requisição CORS
          credentials: "include", // se o backend usar cookies/autenticação
        });

        const registros = await res.json();

        const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
        const valoresPorMes = Array(12).fill(0);

        const registrosComDatas = registros.map((r) => {
          const data = new Date(r.dt_manutencao);
          const dataInicio = new Date(`${r.dt_manutencao}T${r.hora_inicio}`);
          const dataFim = new Date(`${r.dt_manutencao}T${r.hora_fim}`);

          return { ...r, dataInicio, dataFim };
        });

        registrosComDatas.forEach((r) => {
          const mes = r.dataInicio.getMonth();
          valoresPorMes[mes] += 1;
        });

        setBarRegularData(meses.map((m, i) => ({ name: m, value: valoresPorMes[i] })));

        const eventos = registrosComDatas.map((r) => ({
          title: `${r.des_acao_realizada} - Máquina ${r.id_maquina}`,
          start: r.dataInicio,
          end: r.dataFim,
          className: "event-manutencao", // ✅ tudo aqui é manutenção
        }));

        setInitialEvents(eventos);

        const total = registrosComDatas.length;
        const manutencoes = total; // ✅ tudo é manutenção na rota manutencao
        const paradas = 0;

        setPieData([
          { id: 0, name: "Manutenção", value: manutencoes, color: "#2563eb" },
          { id: 1, name: "Parada", value: paradas, color: "#94a3b8" },
        ]);

        const anoAtual = new Date().getFullYear();
        const paradasAnoAtual = registrosComDatas.filter(
          (r) => r.dataInicio.getFullYear() === anoAtual
        ).length;

        const paradasAnoAnterior = registrosComDatas.filter(
          (r) => r.dataInicio.getFullYear() === anoAtual - 1
        ).length;

        let aumento = "0.0%";
        if (paradasAnoAnterior > 0) {
          aumento = `${(
            ((paradasAnoAtual - paradasAnoAnterior) / paradasAnoAnterior) *
            100
          ).toFixed(1)}%`;
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
