
# M7 NEG - Sistema de Gestão

Sistema completo de gestão financeira, parceiros, contratos e CRM.

## Funcionalidades

- Gestão completa de parceiros (clientes e fornecedores)
- Controle financeiro (contas a receber e a pagar)
- CRM para atendimento a clientes
- Relatórios gerenciais
- Sistema de usuários com níveis de permissão
- Dashboard com informações estratégicas

## Requisitos

- Node.js 14+
- PostgreSQL 13+

## Instalação

### Configuração do Banco de Dados

1. Crie um banco de dados PostgreSQL
2. Execute o script SQL em `database/schema.sql` para criar as tabelas

### Backend

1. Entre na pasta do backend:
   ```sh
   cd backend
   ```

2. Instale as dependências:
   ```sh
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```sh
   cp .env.example .env
   ```
   Edite o arquivo `.env` com suas configurações

4. Inicie o servidor:
   ```sh
   npm start
   ```

### Frontend

1. Entre na pasta do frontend:
   ```sh
   cd frontend
   ```

2. Instale as dependências:
   ```sh
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```sh
   cp .env.example .env
   ```
   Edite o arquivo `.env` com suas configurações

4. Inicie o servidor de desenvolvimento:
   ```sh
   npm start
   ```

## Uso

- Backend: http://localhost:4000
- Frontend: http://localhost:3000

### Usuário Padrão

- Email: admin@exemplo.com
- Senha: senha123

## Licença

Este projeto está licenciado sob a licença MIT.
