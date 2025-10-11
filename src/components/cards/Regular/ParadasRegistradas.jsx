import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useDashboardData } from "../../../dataRegular";

const CardParada = () => {
  const { annualComparison, loading, paradasAnoAtual } = useDashboardData();

  if (loading) return <p>Carregando dados...</p>;

  // Valor do aumento
  const aumentoStr = annualComparison?.aumento ?? "N/A";

  let aumentoNumero;
  let valorExibido;

  if (aumentoStr === "N/A") {
    aumentoNumero = 0; 
    valorExibido = "0.0%";
  } else {
    aumentoNumero = parseFloat(aumentoStr.replace("%", ""));
    valorExibido = `${Math.abs(aumentoNumero).toFixed(1)}%`;
  }

  // Se ambos os anos não tiverem paradas
  if ((annualComparison?.paradasAnoAtual ?? 0) === 0 && (annualComparison?.paradasAnoAnterior ?? 0) === 0) {
    aumentoNumero = 0;
    valorExibido = "0.0%";
  }

  const isPositivo = aumentoNumero >= 0; 
  const color = isPositivo ? "#dc2626" : "#16a34a";
  const Icon = isPositivo ? ChevronDown : ChevronUp; 

  return (
    <div className="card highlight">
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: "500px", paddingBottom: "5px" }}>
        <p style={{ margin: 0, fontSize: "15px", fontWeight: "700" }}>Total de paradas registradas</p>
        <span style={{ display: "flex", alignItems: "center", fontWeight: "600", color }}>
          <Icon size={16} style={{ marginRight: "3px" }} />
          {valorExibido}
        </span>
      </div>

      <div style={{ textAlign: "left", marginTop: "5px" }}>
        <h2 style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#1f2937" }}>
          {paradasAnoAtual ?? 0} {/* Mostra o total de paradas do ano atual */}
        </h2>
        <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>Este ano</p>
      </div>
    </div>
  );
};

export default CardParada;
