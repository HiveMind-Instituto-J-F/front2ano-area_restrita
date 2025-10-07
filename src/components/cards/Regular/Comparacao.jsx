import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { pieData, COLORS } from "../../../data";

const CardComparacao = () => (
  <div className="card" style={{ width: "100%", maxWidth: "430px", padding: "25px", marginLeft: "40px" }}>
    <h3>Paradas registradas em relação à manutenção</h3>
    <div style={{ position: "relative", height: "250px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            innerRadius={50}
            startAngle={90}
            endAngle={450}
          >
            {pieData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Legend /> {}
        </PieChart>
      </ResponsiveContainer>

      {/* texto central */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center"
      }}>
      </div>
    </div>
  </div>
);

export default CardComparacao;
