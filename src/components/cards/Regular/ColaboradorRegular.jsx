import React, { useState, useEffect } from "react";
import { ListFilter } from "lucide-react";

function processUsers(users, filterType) {
  let processedUsers = [...users];

  switch (filterType) {
    case "ordemAlfabetica":
      processedUsers.sort((a, b) => {
        const loginA = String(a.desLogin || "").toUpperCase();
        const loginB = String(b.desLogin || "").toUpperCase();
        return loginA.localeCompare(loginB);
      });
      return processedUsers;

    default:
      return users;
  }
}

const ColaboradorRegularList = () => {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        
        // Validar se data é um array
        if (!Array.isArray(data)) {
          throw new Error("Resposta da API não é um array");
        }

        console.log("Dados brutos da API:", data);

        // Filtrar operadores com validação segura
        const operadores = data
          .filter(user => {
            // Verificar se user existe e tem a propriedade des_tipo_perfil
            if (!user || typeof user !== 'object') return false;
            
            const tipoPerfil = user.des_tipo_perfil;
            return tipoPerfil && String(tipoPerfil).toLowerCase() === "operador";
          })
          .map(user => ({
            // Usar os nomes corretos das propriedades da API
            id: user.id_trabalhador || Math.random().toString(36).substr(2, 9),
            desLogin: String(user.desLogin || "").trim() || "Nome não informado",
            setor: String(user.des_setor || "").trim() || "—",
            id_planta: user.id_planta || "—",
            des_tipo_perfil: user.des_tipo_perfil || "",
            des_imagem: user.des_imagem || null
          }));

        console.log("Operadores processados:", operadores);
        setFilteredUsers(operadores);
        
      } catch (error) {
        console.error("Erro ao buscar colaboradores:", error);
        setError(error.message);
        setFilteredUsers([]); // Garantir array vazio em caso de erro
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

  // Função segura para obter a primeira letra do nome
  const getInitial = (desLogin) => {
    const safeLogin = String(desLogin || "").trim();
    return safeLogin.charAt(0).toUpperCase() || "U";
  };

  // Função segura para gerar avatar
  const getAvatarUrl = (desLogin) => {
    const initial = getInitial(desLogin);
    return `https://placehold.co/28x28/e5e7eb/4b5563?text=${initial}`;
  };

  if (loading) return <p>Carregando colaboradores...</p>;

  if (error) return <p>Erro ao carregar colaboradores: {error}</p>;

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
              src={getAvatarUrl(item.desLogin)}
              alt="avatar"
              style={{
                borderRadius: "50%",
                marginRight: "10px",
                width: "28px",
                height: "28px",
              }}
            />
            <span>{item.desLogin}</span>
          </div>
          <span>{item.setor || "—"}</span>
          <span style={{ textAlign: "right", fontWeight: "600" }}>
            {item.id_planta}
          </span>
        </div>
      ))}

      {filteredUsers.length === 0 && !loading && (
        <div style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>
          Nenhum operador encontrado
        </div>
      )}
    </div>
  );
};

export default ColaboradorRegularList;