import { useEffect, useState } from "react";

export function useDashboardData() {

  const [initialEvents, setInitialEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const headers = {
          "Authorization":
            "Basic " + btoa(`${import.meta.env.VITE_USERNAME_CREDENTIAL}:${import.meta.env.VITE_PASSWORD_CREDENTIAL}`),
        };

        const [resRegistros, resManutencoes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}api/registro/listar`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}api/manutencao/listar`, { headers }),
        ]);

        const registros = await resRegistros.json();
        const manutencoes = await resManutencoes.json();

        // --- Eventos de PARADA ---
        const eventosRegistros = registros
          .map((r) => {
            if (!r.dt_parada || !r.hora_inicio || !r.hora_fim) return null;

            const start = new Date(`${r.dt_parada}T${r.hora_inicio}`);
            const end = new Date(`${r.dt_parada}T${r.hora_fim}`);

            if (isNaN(start) || isNaN(end)) return null;

            return {
              title: `${r.des_parada || "Parada"} - Máquina ${r.id_maquina}`,
              start,
              end,
              className: "event-parada",
            };
          })
          .filter(Boolean);

        // --- Converter manutenções em eventos ---
        const eventosManutencao = manutencoes
          .map((m) => {
            if (!m.dt_manutencao || !m.hora_inicio || !m.hora_fim) return null;

            const start = new Date(`${m.dt_manutencao}T${m.hora_inicio}`);
            const end = new Date(`${m.dt_manutencao}T${m.hora_fim}`);

            if (isNaN(start) || isNaN(end)) return null;

            return {
              title: `${m.des_acao_realizada} - Máquina ${m.id_maquina}`,
              start,
              end,
              className: "event-manutencao",
            };
          })
          .filter(Boolean);

        // --- Unir tudo em um só calendário ---
        const todosEventos = [...eventosRegistros, ...eventosManutencao];

        setInitialEvents(todosEventos);

      } catch (err) {
        console.error("Erro ao buscar dados do calendário:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return { initialEvents, loading };
}
