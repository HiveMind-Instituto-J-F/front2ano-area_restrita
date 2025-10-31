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
        console.log("Dados brutos da API:", registros);

        // --- FILTRAR REGISTROS VÁLIDOS ---
        const registrosValidos = registros.filter(r => 
          r.dt_parada !== null && 
          r.hora_inicio !== null && 
          r.hora_fim !== null &&
          r.id_maquina !== null
        );

        console.log("Registros válidos:", registrosValidos);

        // --- CALENDÁRIO ---
        const eventos = registrosValidos.map((r) => {
          // Criar datas de início e fim
          const dataInicio = new Date(`${r.dt_parada}T${r.hora_inicio}`);
          let dataFim = new Date(`${r.dt_parada}T${r.hora_fim}`);
          
          // Se início e fim forem iguais, adicionar 1 hora de duração mínima
          if (dataInicio.getTime() === dataFim.getTime()) {
            dataFim = new Date(dataInicio.getTime() + (60 * 60 * 1000)); // +1 hora
          }

          const isManutencao = r.id_manutencao !== null;
          const descricao = r.des_parada || "Parada não especificada";

          return {
            id: r.id_registro_paradas,
            title: `${descricao} - Máquina ${r.id_maquina}`,
            start: dataInicio,
            end: dataFim,
            className: isManutencao ? "event-manutencao" : "event-parada",
            extendedProps: {
              setor: r.des_setor,
              maquina: r.id_maquina,
              tipo: isManutencao ? "manutencao" : "parada",
              descricao: descricao
            }
          };
        });

        setInitialEvents(eventos);
        console.log("Eventos do calendário:", eventos);

        // --- PIE CHART ---
        const manutencoes = registrosValidos.filter(r => r.id_manutencao !== null).length;
        const paradas = registrosValidos.filter(r => r.id_manutencao === null).length;

        setPieData([
          { id: 0, name: "Manutenção", value: manutencoes, color: "#2563eb" },
          { id: 1, name: "Parada", value: paradas, color: "#dc2626" },
        ]);

        console.log("Dados pizza:", { manutencoes, paradas });

        // --- BARRAS MÊS ---
        const valoresPorMes = Array(12).fill(0);
        const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

        registrosValidos.forEach(r => {
          const dataParada = new Date(r.dt_parada);
          if (!isNaN(dataParada)) {
            const mes = dataParada.getMonth();
            valoresPorMes[mes] += 1;
          }
        });

        const dadosGrafico = meses.map((m, i) => ({ 
          name: m, 
          value: valoresPorMes[i],
          mes: i + 1
        }));
        
        setBarRegularData(dadosGrafico);
        console.log("Dados barras:", dadosGrafico);

        // --- COMPARAÇÃO ANUAL ---
        const anoAtual = 2025; // Usando 2025 para compatibilidade com os dados
        const anoAnterior = 2024;

        const paradasAtual = registrosValidos.filter(r => {
          const d = new Date(r.dt_parada);
          return !isNaN(d) && d.getFullYear() === anoAtual;
        }).length;

        const paradasAnterior = registrosValidos.filter(r => {
          const d = new Date(r.dt_parada);
          return !isNaN(d) && d.getFullYear() === anoAnterior;
        }).length;

        let aumento;
        if (paradasAnterior === 0) {
          aumento = paradasAtual > 0 ? "+100%" : "0%";
        } else {
          const percentual = ((paradasAtual - paradasAnterior) / paradasAnterior) * 100;
          aumento = `${percentual > 0 ? "+" : ""}${percentual.toFixed(2)}%`;
        }

        const comparacao = {
          paradasAnoAtual: paradasAtual,
          paradasAnoAnterior: paradasAnterior,
          aumento,
          anoAtual,
          anoAnterior
        };

        setAnnualComparison(comparacao);
        setParadasAnoAtual(paradasAtual);

        console.log("Comparação anual:", comparacao);

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