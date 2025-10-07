import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { barRegularData } from "../../data";

const RegularBarStats = () => {
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
          <Bar dataKey="value" fill="#f97316" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RegularBarStats;
