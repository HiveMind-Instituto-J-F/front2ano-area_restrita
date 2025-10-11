import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const CardParada = ({ annualComparison }) => {
  if (!annualComparison) return <p>Carregando dados...</p>;

  const aumentoStr = annualComparison.aumento ?? "0%";
  const aumentoNumero = parseFloat(aumentoStr.replace("%", ""));

  const isPositivo = aumentoNumero >= 0; // Se aumento positivo = melhora
  const color = isPositivo ? "#dc2626" : "#16a34a"; // vermelho para piora das paradas, verde para melhora
  const Icon = isPositivo ? ChevronDown : ChevronUp; // inverte o ícone

  return (
    <div className="card highlight">
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: "500px", paddingBottom: "5px" }}>
        <p style={{ margin: 0, fontSize: "15px", fontWeight: "700" }}>Total de paradas registradas</p>
        <span style={{ display: "flex", alignItems: "center", fontWeight: "600", color }}>
          <Icon size={16} style={{ marginRight: "3px" }} />
          {Math.abs(aumentoNumero).toFixed(1)}%
        </span>
      </div>

      <div style={{ textAlign: "left", marginTop: "5px" }}>
        <h2 style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#1f2937" }}>
          {annualComparison.paradasAnoAtual ?? 0}
        </h2>
        <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>Este ano</p>
      </div>
    </div>
  );
};

export default CardParada;
