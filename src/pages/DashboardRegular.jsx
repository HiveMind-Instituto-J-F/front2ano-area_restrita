import React from "react";
import CardParada from "../components/cards/Regular/ParadasRegistradas";
import ColaboradorRegularList from "../components/cards/Regular/ColaboradorRegular";
import CardComparacao from "../components/cards/Regular/Comparacao";
import RegularBarStats from "../components/charts/RegularBarStats";

const DashboardRegular = () => {
  return (
    <div className="dashboardRegular">
      <CardParada />
      <RegularBarStats />
      <ColaboradorRegularList />
      <CardComparacao />
    </div>
  );
};

export default DashboardRegular;
