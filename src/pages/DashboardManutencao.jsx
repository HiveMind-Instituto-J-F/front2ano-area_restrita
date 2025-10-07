import React from "react";
import CardDashboard from "../components/cards/Manutenção/CardDashboard";
import ManutencaoBarStats from "../components/charts/ManutencaoBarStats";
import ColaboradorManutencaoList from "../components/cards/Manutenção/ColaboradorManutencao";
import GaugeManutencaoD3 from "../components/cards/Manutenção/Perigometro";

const DashboardManutencao = () => {
  return (
    <div className="dashboardManutencao">
      <CardDashboard />
      <ManutencaoBarStats />
      <ColaboradorManutencaoList />
      <GaugeManutencaoD3 />
    </div>
  );
};

export default DashboardManutencao;
