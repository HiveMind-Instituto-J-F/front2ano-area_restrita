import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { useDashboardData } from "../../dataManutencista";

const ManutencaoBarStats = () => {
  const { barRegularData, loading } = useDashboardData();

  if (loading) return <p>Carregando gráfico...</p>;

  return (
    <div className="card big">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Estatísticas das paradas</h3>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={barRegularData}>
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ManutencaoBarStats;
