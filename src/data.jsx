import { useEffect, useState } from "react";

export function useDashboardData() {
  const [initialEvents, setInitialEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const resRegistros = await fetch("http://localhost:8081/api/registro/listar");
        const registros = await resRegistros.json();

        // Cria eventos válidos para o calendário
        const eventos = registros
          .map(r => {
            if (!r.date || !r.hora_inicio || !r.hora_fim) return null;

            // Combina a data do registro com hora_inicio/hora_fim
            const start = new Date(`${r.date.split("T")[0]}T${r.hora_inicio}`);
            const end = new Date(`${r.date.split("T")[0]}T${r.hora_fim}`);

            if (isNaN(start) || isNaN(end)) return null;

            return {
              title: `${r.descricao} - Máquina ${r.id_maquina}`,
              start,
              end,
              className: r.tipo_parada?.toLowerCase() === "preventiva"
                ? "event-manutencao"
                : "event-parada",
            };
          })
          .filter(Boolean); // Remove nulls

        console.log("Eventos para o calendário:", eventos);
        setInitialEvents(eventos);

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
