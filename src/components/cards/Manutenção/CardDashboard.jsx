import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useDashboardData } from "../../../hooks/useDashboardData";

const CardDashboard = () => {
  const { loading, annualComparison, pieData } = useDashboardData();

  if (loading) return <p>Carregando dados do dashboard...</p>;

  const manutencoes = pieData.find(d => d.name === "Manutenção")?.value ?? 0;
  const paradas = pieData.find(d => d.name === "Parada")?.value ?? 0;
  const aumento = annualComparison?.aumento ?? "0%";

  const aumentoNumero = parseFloat(aumento);
  const isAumentoPositivo = aumentoNumero >= 0;

  return (
    <div className="cardContainer">
      {/* Card de Manutenções */}
      <div className="card highlight">
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", paddingBottom: "5px" }}>
          <p style={{ margin: 0, fontSize: "15px", fontWeight: "700" }}>Total de manutenções registradas</p>
          <span
            className={isAumentoPositivo ? "success" : "failure"}
            style={{ display: "flex", alignItems: "center", fontWeight: "600" }}
          >
            {isAumentoPositivo ? (
              <ChevronUp size={16} style={{ marginRight: "3px" }} />
            ) : (
              <ChevronDown size={16} style={{ marginRight: "3px" }} />
            )}
            {aumento}
          </span>
        </div>
        <div style={{ textAlign: "left", marginTop: "5px" }}>
          <h2 style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#1f2937" }}>
            {manutencoes}
          </h2>
          <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>Este ano</p>
        </div>
      </div>

      {/* Card de Paradas */}
      <div className="card highlight">
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", paddingBottom: "5px" }}>
          <p style={{ margin: 0, fontSize: "15px", fontWeight: "700" }}>Problemas com as máquinas</p>
          <span className="failure" style={{ display: "flex", alignItems: "center", fontWeight: "600" }}>
            <ChevronDown size={16} style={{ marginRight: "3px" }} /> {aumento}
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
