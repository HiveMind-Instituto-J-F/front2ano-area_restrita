import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const CardDashboard = () => {
  return (
    <div className="cardContainer">
      
      <div className="card highlight">
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", paddingBottom: "5px" }}>
          <p style={{ margin: 0, fontSize: "15px", fontWeight: "700" }}>Total de manutenções registradas</p>
          <span className="success" style={{ display: "flex", alignItems: "center", fontWeight: "600" }}>
            <ChevronUp size={16} style={{ marginRight: "3px" }} /> 22.5%
          </span>
        </div>
        <div style={{ textAlign: "left", marginTop: "5px" }}>
          <h2 style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#1f2937" }}>12</h2>
          <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>Este mês</p>
        </div>
      </div>

      <div className="card highlight">
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", paddingBottom: "5px" }}>
          <p style={{ margin: 0, fontSize: "15px", fontWeight: "700" }}>Problemas com as máquinas</p>
          <span className="failure" style={{ display: "flex", alignItems: "center", fontWeight: "600" }}>
            <ChevronDown size={16} style={{ marginRight: "3px" }} /> 12.0%
          </span>
        </div>
        <div style={{ textAlign: "left", marginTop: "5px" }}>
          <h2 style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#1f2937" }}>77</h2>
          <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>Este ano</p>
        </div>
      </div>

    </div>
  );
};

export default CardDashboard;
