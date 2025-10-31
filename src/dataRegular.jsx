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

        // Filtrar registros válidos
        const registrosValidos = registros.filter(r => 
          r && r.dt_parada && r.hora_inicio && r.hora_fim
        );

        console.log("Registros válidos:", registrosValidos);

        // --- CALENDÁRIO ---
        const eventos = registrosValidos.map((r) => {
          try {
            const dataInicio = new Date(`${r.dt_parada}T${r.hora_inicio}`);
            const dataFim = new Date(`${r.dt_parada}T${r.hora_fim}`);

            // Se datas são inválidas, pular
            if (isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())) {
              return null;
            }

            const isManutencao = r.id_manutencao !== null;
            const descricao = r.des_parada?.trim() || "Parada não especificada";

            return {
              id: r.id_registro_paradas,
              title: `${descricao} - Máquina ${r.id_maquina}`,
              start: dataInicio,
              end: dataFim,
              className: isManutencao ? "event-manutencao" : "event-parada",
              extendedProps: {
                tipo: isManutencao ? "manutencao" : "parada",
                setor: r.des_setor,
                maquina: r.id_maquina
              }
            };
          } catch (error) {
            console.warn("Erro ao processar evento:", r, error);
            return null;
          }
        }).filter(Boolean);

        setInitialEvents(eventos);

        // --- PIE CHART (CORRIGIDO) ---
        const manutencoes = registrosValidos.filter(r => 
          r.id_manutencao !== null && r.id_manutencao !== undefined
        ).length;
        
        const paradas = registrosValidos.filter(r => 
          r.id_manutencao === null || r.id_manutencao === undefined
        ).length;

        console.log("Contagem para pie chart:", { manutencoes, paradas });

        setPieData([
          { id: 0, name: "Manutenção", value: manutencoes, color: "#2563eb" },
          { id: 1, name: "Parada", value: paradas, color: "#dc2626" },
        ]);

        // --- BARRAS MÊS ---
        const valoresPorMes = Array(12).fill(0);
        const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

        registrosValidos.forEach(r => {
          try {
            const dataParada = new Date(r.dt_parada);
            if (!isNaN(dataParada)) {
              const mes = dataParada.getMonth();
              valoresPorMes[mes] += 1;
            }
          } catch (error) {
            console.warn("Erro ao processar data para gráfico de barras:", r);
          }
        });

        const dadosGrafico = meses.map((m, i) => ({ 
          name: m, 
          value: valoresPorMes[i] 
        }));
        
        setBarRegularData(dadosGrafico);
        console.log("Dados gráfico de barras:", dadosGrafico);

        // --- COMPARAÇÃO ANUAL ---
        const anoAtual = new Date().getFullYear();

        const paradasAtual = registrosValidos.filter(r => {
          try {
            const d = new Date(r.dt_parada);
            return !isNaN(d) && d.getFullYear() === anoAtual;
          } catch {
            return false;
          }
        }).length;

        const paradasAnterior = registrosValidos.filter(r => {
          try {
            const d = new Date(r.dt_parada);
            return !isNaN(d) && d.getFullYear() === anoAtual - 1;
          } catch {
            return false;
          }
        }).length;

        let aumento = "0%";
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