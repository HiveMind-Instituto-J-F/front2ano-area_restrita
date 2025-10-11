import React from "react";
import ReactSpeedometer from "react-d3-speedometer";
import { useDashboardData } from "../../../data";

const COLORS = {
  danger: "#FF5F6D",
  caution: "#FFC371",
  good: "#007bff",
  excellent: "#28a745"
};

const LegendItem = ({ color, label }) => (
  <div style={{ display: "flex", alignItems: "center", fontSize: "0.85em" }}>
    <span
      style={{
        width: "10px",
        height: "10px",
        backgroundColor: color,
        marginRight: "5px",
        borderRadius: "50%"
      }}
    ></span>
    <span>{label}</span>
  </div>
);

const GaugeManutencaoD3 = () => {
  const { pieData, loading } = useDashboardData();

  if (loading) return <p>Carregando medidor...</p>;

  const manutencoes = pieData.find(d => d.name === "Manutenção")?.value ?? 0;
  const paradas = pieData.find(d => d.name === "Parada")?.value ?? 0;
  const total = manutencoes + paradas;
  const valorAtual = total > 0 ? Math.round((manutencoes / total) * 100) : 0;

  return (
    <div className="card" style={{ width: "100%", maxWidth: "440px", padding: "30px", marginLeft: "40px" }}>
      <h3 style={{ textAlign: "center", marginBottom: "15px", fontSize: "1.1em" }}>
        Manutenções vs. Paradas
      </h3>

      <div style={{ width: "100%", height: "180px", marginLeft: "75px" }}>
        <ReactSpeedometer
          width={280}
          height={180}
          maxValue={100}
          minValue={0}
          value={valorAtual}
          customSegmentStops={[0, 30, 50, 75, 100]}
          segmentColors={[
            COLORS.danger,
            COLORS.caution,
            COLORS.good,
            COLORS.excellent
          ]}
          ringWidth={35}
          needleColor="navy"
          currentValueText={`${valorAtual}%`}
          valueTextFontSize="20px"
          labelFontSize="10px"
        />
      </div>

      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        marginTop: "15px",
        flexWrap: "wrap"
      }}>
        <LegendItem color={COLORS.danger} label="0-30: Perigo" />
        <LegendItem color={COLORS.caution} label="30-50: Cuidado" />
        <LegendItem color={COLORS.good} label="50-75: Bom" />
        <LegendItem color={COLORS.excellent} label="75-100: Ótimo" />
      </div>
    </div>
  );
};

export default GaugeManutencaoD3;
