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
          mode: "cors",
          credentials: "include",
        });

        const registros = await res.json();
        console.log("Dados brutos da API de manutenções:", registros);

        // --- FILTRAR REGISTROS VÁLIDOS ---
        const registrosValidos = registros.filter(r => 
          r.dt_manutencao !== null && 
          r.hora_inicio !== null && 
          r.hora_fim !== null &&
          r.id_maquina !== null
        );

        console.log("Registros válidos de manutenção:", registrosValidos);

        // --- PROCESSAR DATAS ---
        const registrosComDatas = registrosValidos.map((r) => {
          const dataInicio = new Date(`${r.dt_manutencao}T${r.hora_inicio}`);
          let dataFim = new Date(`${r.dt_manutencao}T${r.hora_fim}`);
          
          // Se início e fim forem iguais, adicionar 1 hora de duração mínima
          if (dataInicio.getTime() === dataFim.getTime()) {
            dataFim = new Date(dataInicio.getTime() + (60 * 60 * 1000));
          }

          return { 
            ...r, 
            dataInicio, 
            dataFim,
            dataManutencao: new Date(r.dt_manutencao)
          };
        });

        // --- BARRAS MÊS (SEMPRE DO ANO ATUAL) ---
        const anoAtual = new Date().getFullYear();
        const valoresPorMes = Array(12).fill(0);
        const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

        registrosComDatas.forEach((r) => {
          if (!isNaN(r.dataInicio) && r.dataInicio.getFullYear() === anoAtual) {
            const mes = r.dataInicio.getMonth();
            valoresPorMes[mes] += 1;
          }
        });

        const dadosGrafico = meses.map((m, i) => ({ 
          name: m, 
          value: valoresPorMes[i],
          mes: i + 1
        }));
        
        setBarRegularData(dadosGrafico);
        console.log(`Dados barras (manutenções ${anoAtual}):`, dadosGrafico);

        // --- CALENDÁRIO ---
        const eventos = registrosComDatas.map((r) => {
          const descricao = r.des_acao_realizada || "Manutenção não especificada";
          
          return {
            id: r.id_manutencao,
            title: `${descricao} - Máquina ${r.id_maquina}`,
            start: r.dataInicio,
            end: r.dataFim,
            className: "event-manutencao",
            extendedProps: {
              setor: r.des_setor,
              maquina: r.id_maquina,
              usuario: r.id_usuario,
              tipo: "manutencao",
              descricao: descricao,
              idManutencao: r.id_manutencao
            }
          };
        });

        setInitialEvents(eventos);
        console.log("Eventos do calendário (manutenções):", eventos);

        // --- PIE CHART (SEMPRE DO ANO ATUAL) ---
        const manutencoesAnoAtual = registrosComDatas.filter(
          (r) => !isNaN(r.dataInicio) && r.dataInicio.getFullYear() === anoAtual
        ).length;
        
        setPieData([
          { 
            id: 0, 
            name: "Manutenção", 
            value: manutencoesAnoAtual, 
            color: "#2563eb" 
          },
          { 
            id: 1, 
            name: "Parada", 
            value: 0, 
            color: "#94a3b8" 
          },
        ]);

        console.log("Dados pizza (manutenções):", { 
          manutencoes: manutencoesAnoAtual, 
          paradas: 0 
        });

        // --- COMPARAÇÃO ANUAL (ANO ATUAL vs ANO ANTERIOR) ---
        const anoAnterior = anoAtual - 1;

        const manutencoesAnoAnterior = registrosComDatas.filter(
          (r) => !isNaN(r.dataInicio) && r.dataInicio.getFullYear() === anoAnterior
        ).length;

        let aumento;
        if (manutencoesAnoAnterior === 0) {
          aumento = manutencoesAnoAtual > 0 ? "+100.0%" : "0.0%";
        } else {
          const percentual = ((manutencoesAnoAtual - manutencoesAnoAnterior) / manutencoesAnoAnterior) * 100;
          aumento = `${percentual > 0 ? "+" : ""}${percentual.toFixed(1)}%`;
        }

        const comparacao = {
          manutencoesAnoAtual: manutencoesAnoAtual,
          manutencoesAnoAnterior: manutencoesAnoAnterior,
          aumento,
          anoAtual,
          anoAnterior
        };

        setAnnualComparison(comparacao);
        setParadasAnoAtual(manutencoesAnoAtual);

        console.log("Comparação anual (manutenções):", comparacao);

      } catch (err) {
        console.error("Erro ao buscar dados de manutenções:", err);
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