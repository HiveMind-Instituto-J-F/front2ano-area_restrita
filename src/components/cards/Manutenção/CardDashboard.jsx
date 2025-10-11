import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useDashboardData } from "../../../data";

const CardDashboard = () => {
  const { loading, annualComparison, pieData } = useDashboardData();

  if (loading) return <p>Carregando dados do dashboard...</p>;

  const manutencoes = pieData.find(d => d.name === "Manutenção")?.value ?? 0;
  const paradas = pieData.find(d => d.name === "Parada")?.value ?? 0;
  const aumento = parseFloat(annualComparison?.aumento?.replace("%", "") ?? 0);

  // 🔹 Define classes e ícones com base no aumento
  const isAumentoPositivo = aumento >= 0;

  // Estilos dinâmicos
  const trendColor = isAumentoPositivo ? "#16a34a" : "#dc2626"; // verde/vermelho
  const TrendIcon = isAumentoPositivo ? ChevronUp : ChevronDown;

  return (
    <div className="cardContainer">

      {/* CARD: Manutenções */}
      <div className="card highlight">
        <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "5px" }}>
          <p style={{ margin: 0, fontSize: "15px", fontWeight: "700" }}>Total de manutenções registradas</p>

          <span
            style={{
              display: "flex",
              alignItems: "center",
              fontWeight: "600",
              color: trendColor, // muda cor
            }}
          >
            <TrendIcon size={16} style={{ marginRight: "3px" }} />
            {Math.abs(aumento).toFixed(1)}%
          </span>
        </div>

        <div style={{ textAlign: "left", marginTop: "5px" }}>
          <h2 style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#1f2937" }}>
            {manutencoes}
          </h2>
          <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>Este ano</p>
        </div>
      </div>

      {/* CARD: Paradas */}
      <div className="card highlight">
        <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "5px" }}>
          <p style={{ margin: 0, fontSize: "15px", fontWeight: "700" }}>Problemas com as máquinas</p>

          <span
            style={{
              display: "flex",
              alignItems: "center",
              fontWeight: "600",
              color: !isAumentoPositivo ? "#16a34a" : "#dc2626", // inverso
            }}
          >
            <TrendIcon
              size={16}
              style={{
                marginRight: "3px",
                transform: !isAumentoPositivo ? "rotate(180deg)" : "none",
              }}
            />
            {Math.abs(aumento).toFixed(1)}%
          </span>
        </div>

        <div style={{ textAlign: "left", marginTop: "5px" }}>
          <h2 style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#1f2937" }}>
            {paradas}
          </h2>
          <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>Este ano</p>
        </div>
      </div>

    </div>
  );
};

export default CardDashboard;
