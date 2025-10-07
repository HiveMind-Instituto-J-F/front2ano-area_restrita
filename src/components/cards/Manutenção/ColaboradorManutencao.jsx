import React, { useState } from "react";
import { ListFilter } from "lucide-react";
import { collaboratorMaintenceData } from "../../../data";

function processUsers(users, filterType) {
  let processedUsers = [...users];

  switch (filterType) {
    case "gmail":
      const gmailRegex = /@gmail\.com$/i;
      return processedUsers.filter((user) => gmailRegex.test(user.email));

    case "numericId":
      const numericIdRegex = /^\d+$/;
      return processedUsers.filter((user) => numericIdRegex.test(user.id));

    case "ordemAlfabetica":
      // Implementação correta da ordenação alfabética
      processedUsers.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      return processedUsers;

    default:
      return users;
  }
}

const ColaboradorManutencaoList = () => {
  // 1. Inicializa o estado com os dados originais
  const [filteredUsers, setFilteredUsers] = useState(collaboratorMaintenceData);

  // 2. Cria o manipulador para aplicar a ordenação
  const handleFilter = () => {
    const result = processUsers(collaboratorMaintenceData, "ordemAlfabetica");
    setFilteredUsers(result);
  };

  return (
    <div className="card" style={{ width: "100%", maxWidth: "1200px", padding: "25px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Últimas manutenções registradas</h3>
        <button
          style={{ color: "#6b7280", display: "flex", alignItems: "center", fontSize: "14px", cursor: "pointer", background: "none", border: "none", padding: 0, margin: 0 }}
          // 3. Usa o novo manipulador
          onClick={handleFilter}
        >
          Filtrar e ordenar <ListFilter size={16} style={{ marginLeft: "5px" }} />
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr", marginTop: "25px", borderBottom: "1px solid #eee", fontSize: "13px", fontWeight: "600", color: "#6b7280" }}>
        <span>Nome do colaborador</span>
        <span>Setor</span>
        <span style={{ textAlign: "right" }}>Maq consertada</span>
      </div>

      {/* 4. Mapeia sobre o estado atual (filteredUsers) */}
      {filteredUsers.map((item, index) => (
        <div 
          key={index} 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "3fr 1fr 1fr", 
            padding: "12px 0", 
            // Usa filteredUsers.length para a verificação de borda
            borderBottom: index < filteredUsers.length - 1 ? "1px solid #f3f4f6" : "none" 
          }}>
          <div style={{ display: "flex", alignItems: "center", fontWeight: "500" }}>
            <img
              src={`https://placehold.co/28x28/e5e7eb/4b5563?text=${item.name.charAt(0)}`}
              alt="avatar"
              style={{ borderRadius: "50%", marginRight: "10px", width: "28px", height: "28px" }}
            />
            <span>{item.name}</span>
          </div>
          <span>{item.sector}</span>
          <span style={{ textAlign: "right", fontWeight: "600" }}>{item.fixed_machine}</span>
        </div>
      ))}
    </div>
  );
};

export default ColaboradorManutencaoList;