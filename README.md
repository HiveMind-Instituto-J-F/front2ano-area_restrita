📌 Frontend - Área Restrita

Este repositório contém o frontend da área restrita, desenvolvido em React com Vite, visando performance, modularidade e uma melhor experiência de desenvolvimento.

🚀 Tecnologias Utilizadas

React
 – Biblioteca para construção de interfaces

Vite
 – Bundler rápido e simples

ESLint
 – Padronização e qualidade do código

React Router
 – Gerenciamento de rotas (caso esteja sendo usado)

[Axios ou Fetch] – Requisições HTTP para integração com o backend

📂 Estrutura do Projeto
area-restrita-frontend/
│── public/          # Arquivos estáticos
│── src/
│   ├── assets/      # Imagens, ícones e estilos globais
│   ├── components/  # Componentes reutilizáveis
│   ├── pages/       # Páginas principais (Login, Dashboard, etc.)
│   ├── services/    # Configuração de APIs e chamadas HTTP
│   ├── hooks/       # Hooks customizados
│   ├── App.jsx      # Configuração principal do app
│   └── main.jsx     # Ponto de entrada do React
│── .eslintrc.js     # Configurações do ESLint
│── vite.config.js   # Configuração do Vite
│── package.json     # Dependências e scripts

⚙️ Como rodar o projeto
Pré-requisitos

Node.js (>= 18)

npm ou yarn

Instalação e execução
# Clonar repositório
git clone https://github.com/SEU-USUARIO/area-restrita-frontend.git

# Acessar pasta
cd area-restrita-frontend

# Instalar dependências
npm install

# Rodar em ambiente de desenvolvimento
npm run dev


O projeto ficará disponível em: http://localhost:5173/

🛠️ Scripts disponíveis

npm run dev → inicia o servidor de desenvolvimento

npm run build → gera a versão de produção

npm run preview → visualiza o build localmente

npm run lint → executa o ESLint para checagem de código

🔒 Área Restrita

O frontend foi construído para gerenciar a área restrita do sistema, contendo:

Login e autenticação de usuários

Controle de acesso por nível/permissão

Dashboard com informações protegidas

Integração com o backend via API

📌 Próximos Passos

 Implementar testes automatizados (Jest/React Testing Library)

 Configurar autenticação JWT com refresh token

 Criar documentação de rotas do frontend
