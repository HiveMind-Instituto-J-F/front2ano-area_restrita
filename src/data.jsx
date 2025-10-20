import { useEffect, useState } from "react";

export function useDashboardData() {

  const [initialEvents, setInitialEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const headers = {
          "Authorization": "Basic " + btoa(`${import.meta.env.USERNAME_CREDENTIAL}:${import.meta.env.PASSWORD_CREDENTIAL}`),
        };

        const [resRegistros, resManutencoes] = await Promise.all([
          fetch(`${import.meta.env.API_URL}/api/registro/listar`, { headers }),
          fetch(`${import.meta.env.API_URL}/api/manutencao/listar`, { headers }),
        ]);

        const registros = await resRegistros.json();
        const manutencoes = await resManutencoes.json();

        const eventosRegistros = registros
          .map((r) => {
            if (!r.date || !r.hora_inicio || !r.hora_fim) return null;

            const start = new Date(`${r.date.split("T")[0]}T${r.hora_inicio}`);
            const end = new Date(`${r.date.split("T")[0]}T${r.hora_fim}`);

            if (isNaN(start) || isNaN(end)) return null;

            return {
              title: `${r.descricao || "Parada"} - Máquina ${r.id_maquina}`,
              start,
              end,
              className:
                r.tipo_parada?.toLowerCase() === "preventiva"
                  ? "event-manutencao"
                  : "event-parada",
            };
          })
          .filter(Boolean);

        // --- Converter manutenções em eventos ---
        const eventosManutencao = manutencoes
          .map((m) => {
            if (!m.date || !m.hora_inicio || !m.hora_fim) return null;

            const start = new Date(`${m.date.split("T")[0]}T${m.hora_inicio}`);
            const end = new Date(`${m.date.split("T")[0]}T${m.hora_fim}`);

            if (isNaN(start) || isNaN(end)) return null;

            return {
              title: `${m.acao_realizada} - Máquina ${m.id_maquina}`,
              start,
              end,
              className: "event-manutencao",
            };
          })
          .filter(Boolean);

        // --- Unir tudo em um só calendário ---
        const todosEventos = [...eventosRegistros, ...eventosManutencao];

        console.log("Eventos para o calendário:", todosEventos);
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
