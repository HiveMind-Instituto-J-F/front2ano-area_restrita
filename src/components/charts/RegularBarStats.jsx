import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { useDashboardData } from "../../dataRegular";

const RegularBarStats = () => {
  const { barRegularData, loading } = useDashboardData();

  if (loading) return <p>Carregando dados...</p>;

  return (
    <div className="card big">
      <h3>Estatísticas das paradas</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={barRegularData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#f97316" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RegularBarStats;
