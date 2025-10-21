import React, { useState, useEffect } from "react";
import { ListFilter } from "lucide-react";

function processUsers(users, filterType) {
  let processedUsers = [...users];

  switch (filterType) {
    case "ordemAlfabetica":
      processedUsers.sort((a, b) =>
        a.login.toUpperCase().localeCompare(b.login.toUpperCase())
      );
      return processedUsers;

    default:
      return users;
  }
}

const ColaboradorRegularList = () => {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}api/trabalhador/listar`, {
          method: "GET",
          headers: {
            "Authorization": "Basic " + btoa(`${import.meta.env.VITE_USERNAME_CREDENTIAL}:${import.meta.env.VITE_PASSWORD_CREDENTIAL}`),
          },
          mode: "cors",          
          credentials: "include", 
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const operadores = data.filter(
          (user) => user.tipo_perfil?.toLowerCase() === "operador"
        );
        setFilteredUsers(operadores);
      } catch (error) {
        console.error("Erro ao buscar colaboradores:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const handleFilter = () => {
    const result = processUsers(filteredUsers, "ordemAlfabetica");
    setFilteredUsers(result);
  };

  if (loading) return <p>Carregando colaboradores...</p>;

  return (
    <div
      className="card"
      style={{ width: "100%", maxWidth: "1200px", padding: "25px" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Colaboradores (Operadores)</h3>
        <button
          style={{
            color: "#6b7280",
            display: "flex",
            alignItems: "center",
            fontSize: "14px",
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: 0,
            margin: 0,
          }}
          onClick={handleFilter}
        >
          Filtrar e ordenar{" "}
          <ListFilter size={16} style={{ marginLeft: "5px" }} />
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 1fr 1fr",
          marginTop: "25px",
          borderBottom: "1px solid #eee",
          fontSize: "13px",
          fontWeight: "600",
          color: "#6b7280",
        }}
      >
        <span>Nome do colaborador</span>
        <span>Setor</span>
        <span style={{ textAlign: "right" }}>ID da Planta</span>
      </div>

      {filteredUsers.map((item, index) => (
        <div
          key={item.id || index}
          style={{
            display: "grid",
            gridTemplateColumns: "3fr 1fr 1fr",
            padding: "12px 0",
            borderBottom:
              index < filteredUsers.length - 1 ? "1px solid #f3f4f6" : "none",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", fontWeight: "500" }}
          >
            <img
              src={`https://placehold.co/28x28/e5e7eb/4b5563?text=${item.login.charAt(0).toUpperCase()}`}
              alt="avatar"
              style={{
                borderRadius: "50%",
                marginRight: "10px",
                width: "28px",
                height: "28px",
              }}
            />
            <span>{item.login}</span>
          </div>
          <span>{item.setor || "—"}</span>
          <span style={{ textAlign: "right", fontWeight: "600" }}>
            {item.id_planta}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ColaboradorRegularList;
