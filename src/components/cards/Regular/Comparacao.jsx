import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { useDashboardData } from "../../../data";

const CardComparacao = () => {
  const { pieData, loading } = useDashboardData();

  if (loading) {
    return <div>Carregando...</div>;
  }

  // Verifica se há mais paradas que manutenções
  const paradas = pieData.find(p => p.name === "Parada")?.value ?? 0;
  const manutencoes = pieData.find(p => p.name === "Manutenção")?.value ?? 0;
  const maisParadasQueManutencoes = paradas > manutencoes;

  return (
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
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        {maisParadasQueManutencoes && (
          <div style={{
            position: "absolute",
            bottom: "10px",
            width: "100%",
            textAlign: "center",
            color: "#dc2626",
            fontWeight: "600"
          }}>
            Atenção: Mais paradas que manutenções!
          </div>
        )}
      </div>
    </div>
  );
};

export default CardComparacao;
