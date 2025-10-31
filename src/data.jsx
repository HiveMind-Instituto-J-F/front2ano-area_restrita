import { useEffect, useState } from "react";

export function useDashboardData() {
  const [initialEvents, setInitialEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);

        const headers = {
          "Authorization": "Basic " + btoa(`${import.meta.env.VITE_USERNAME_CREDENTIAL}:${import.meta.env.VITE_PASSWORD_CREDENTIAL}`),
        };

        const [resRegistros, resManutencoes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}api/registro/listar`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}api/manutencao/listar`, { headers }),
        ]);

        // Verificar se as respostas são OK
        if (!resRegistros.ok || !resManutencoes.ok) {
          throw new Error(`Erro na requisição: ${resRegistros.status} ${resManutencoes.status}`);
        }

        const [registros, manutencoes] = await Promise.all([
          resRegistros.json(),
          resManutencoes.json()
        ]);

        console.log("Dados brutos - Registros:", registros);
        console.log("Dados brutos - Manutenções:", manutencoes);

        // --- Eventos de PARADA ---
        const eventosRegistros = registros
          .map((r) => {
            // Validar campos obrigatórios
            if (!r.dt_parada || !r.hora_inicio || !r.hora_fim || !r.id_maquina) {
              console.warn("Registro inválido ignorado:", r);
              return null;
            }

            const start = new Date(`${r.dt_parada}T${r.hora_inicio}`);
            let end = new Date(`${r.dt_parada}T${r.hora_fim}`);

            // Validar datas
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
              console.warn("Datas inválidas no registro:", r);
              return null;
            }

            // Se início e fim forem iguais, adicionar 1 hora de duração
            if (start.getTime() === end.getTime()) {
              end = new Date(start.getTime() + (60 * 60 * 1000));
            }

            const descricao = r.des_parada?.trim() || "Parada não especificada";
            const setor = r.des_setor?.trim() || "Setor não informado";

            return {
              id: `parada-${r.id_registro_paradas}`,
              title: `${descricao} - Máquina ${r.id_maquina}`,
              start,
              end,
              className: "event-parada",
              extendedProps: {
                tipo: "parada",
                idRegistro: r.id_registro_paradas,
                maquina: r.id_maquina,
                setor: setor,
                descricao: descricao,
                idManutencao: r.id_manutencao,
                usuario: r.id_usuario
              }
            };
          })
          .filter(Boolean);

        // --- Eventos de MANUTENÇÃO ---
        const eventosManutencao = manutencoes
          .map((m) => {
            // Validar campos obrigatórios
            if (!m.dt_manutencao || !m.hora_inicio || !m.hora_fim || !m.id_maquina) {
              console.warn("Manutenção inválida ignorada:", m);
              return null;
            }

            const start = new Date(`${m.dt_manutencao}T${m.hora_inicio}`);
            let end = new Date(`${m.dt_manutencao}T${m.hora_fim}`);

            // Validar datas
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
              console.warn("Datas inválidas na manutenção:", m);
              return null;
            }

            // Se início e fim forem iguais, adicionar 1 hora de duração
            if (start.getTime() === end.getTime()) {
              end = new Date(start.getTime() + (60 * 60 * 1000));
            }

            const descricao = m.des_acao_realizada?.trim() || "Manutenção não especificada";
            const setor = m.des_setor?.trim() || "Setor não informado";

            return {
              id: `manutencao-${m.id_manutencao}`,
              title: `${descricao} - Máquina ${m.id_maquina}`,
              start,
              end,
              className: "event-manutencao",
              extendedProps: {
                tipo: "manutencao",
                idManutencao: m.id_manutencao,
                maquina: m.id_maquina,
                setor: setor,
                descricao: descricao,
                usuario: m.id_usuario,
                acaoRealizada: descricao
              }
            };
          })
          .filter(Boolean);

        const todosEventos = [...eventosRegistros, ...eventosManutencao];

        console.log(`Eventos carregados: ${todosEventos.length} (${eventosRegistros.length} paradas, ${eventosManutencao.length} manutenções)`);
        console.log("Todos os eventos:", todosEventos);
        
        setInitialEvents(todosEventos);

      } catch (err) {
        console.error("Erro ao buscar dados do calendário:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return { 
    initialEvents, 
    loading, 
    error 
  };
}