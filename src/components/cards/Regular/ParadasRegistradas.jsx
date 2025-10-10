import React from "react";
import { ChevronUp } from "lucide-react";

const CardParada = ({ annualComparison }) => (
  <div className="card highlight">
    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: "500px", paddingBottom: "5px" }}>
      <p style={{ margin: 0, fontSize: "15px", fontWeight: "700" }}>Total de paradas registradas</p>
      {annualComparison && (
        <span className="success" style={{ display: "flex", alignItems: "center", fontWeight: "600" }}>
          <ChevronUp size={16} style={{ marginRight: "3px" }} /> {annualComparison.aumento}
        </span>
      )}
    </div>
    <div style={{ textAlign: "left", marginTop: "5px" }}>
      <h2 style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#1f2937" }}>
        {annualComparison?.paradasAnoAtual ?? 0}
      </h2>
      <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>Este ano</p>
    </div>
  </div>
);


export default CardParada;
