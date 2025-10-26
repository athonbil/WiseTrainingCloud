# WiseTraining - Plataforma de Treinamentos Empresariais

Sistema completo de gerenciamento de treinamentos empresariais construído com arquitetura de **microfrontends**, **microservices** e **serverless functions**.

##  Equipe

- Andrey Ribeiro de Carvalho
- Athon Ian Schimin Bilbao
- Matheus Machado Pereira
- Victor Hideyuki Tanaka
- Yan Ferreira David

##  Arquitetura do Sistema

O WiseTraining foi desenvolvido seguindo os princípios de arquitetura distribuída e desacoplada:

```
┌─────────────────┐
│   Microfrontend │  (React + Vite)
│   (Frontend)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│      BFF        │  (Node.js + Express)
│  (Backend for   │
│    Frontend)    │
└────┬──────┬─────┘
     │      │
     │      └──────────────┐
     ▼                     ▼
┌──────────────┐    ┌──────────────┐
│ Microservice │    │ Microservice │
│   Courses    │    │  Companies   │
│              │    │  & Employees │
└──────┬───────┘    └──────┬───────┘
       │                   │
       └───────┬───────────┘
               ▼
      ┌─────────────────┐
      │ Supabase DB     │
      │ (PostgreSQL)    │
      └─────────────────┘

┌──────────────────────────┐
│  Serverless Functions    │
│  (Supabase Edge)         │
│  - create-course-trigger │
│  - persist-course        │
└──────────────────────────┘
```

##  Componentes da Arquitetura

###  Microfrontend (Frontend)

**Tecnologia:** React 18 + Vite

**Descrição:** Interface web responsiva que permite empresas gerenciar cursos, funcionários e grupos de treinamento.

**Funcionalidades:**
- Login e cadastro de empresas
- Dashboard com estatísticas
- Gerenciamento de cursos
- Gerenciamento de grupos e funcionários
- Matrícula de grupos em cursos

**Repositório:** [Link para o repositório do frontend]

**Execução Local:**
```bash
cd frontend
npm install
npm run dev
```

**Dockerfile:** `frontend/Dockerfile`

---

###  BFF - Backend for Frontend

**Tecnologia:** Node.js + Express

**Descrição:** Camada intermediária que agrega dados de múltiplos microservices e serverless functions, otimizando a comunicação com o frontend.

**Responsabilidades:**
- Agregar dados de empresas e cursos
- Proxy para operações CRUD
- Chamar serverless functions para criação de cursos
- Simplificar chamadas do frontend

**Endpoints Principais:**
- `GET /api/empresas/:id/detalhes` - Dados agregados da empresa
- `POST /api/cursos` - Criar curso (via serverless function)
- `GET /api/cursos` - Listar cursos
- `POST /api/enrollments` - Criar matrícula

**Repositório:** [Link para o repositório do BFF]

**Docker Hub:** [Link para imagem Docker do BFF]

**Execução Local:**
```bash
cd bff
npm install
npm start
```

**Dockerfile:** `bff/Dockerfile`

---

###  Microservice - Courses (Cursos)

**Tecnologia:** Node.js + Express + Supabase

**Banco de Dados:** PostgreSQL (Supabase)

**Descrição:** Microserviço responsável pelo domínio de cursos e matrículas.

**Responsabilidades:**
- CRUD de cursos
- Gerenciamento de matrículas (enrollments)
- Consultas por empresa, status, etc.

**Endpoints:**
- `GET /courses` - Listar cursos
- `GET /courses/:id` - Detalhes do curso
- `PUT /courses/:id` - Atualizar curso
- `DELETE /courses/:id` - Deletar curso
- `POST /enrollments` - Criar matrícula
- `GET /enrollments` - Listar matrículas

**Repositório:** [Link para o repositório do microservice-courses]

**Docker Hub:** [Link para imagem Docker do microservice-courses]

**Execução Local:**
```bash
cd microservice-courses
npm install
npm start
```

**Dockerfile:** `microservice-courses/Dockerfile`

---

###  Microservice - Companies & Employees (Empresas e Funcionários)

**Tecnologia:** Node.js + Express + Supabase

**Banco de Dados:** PostgreSQL (Supabase)

**Descrição:** Microserviço responsável pelo domínio de empresas, funcionários e grupos.

**Responsabilidades:**
- CRUD de empresas
- CRUD de funcionários
- CRUD de grupos
- Gerenciamento de membros de grupos

**Endpoints:**
- `GET /companies` - Listar empresas
- `POST /companies` - Criar empresa
- `GET /companies/:id` - Detalhes da empresa
- `PUT /companies/:id` - Atualizar empresa
- `DELETE /companies/:id` - Deletar empresa
- `GET /employees` - Listar funcionários
- `POST /employees` - Criar funcionário
- `GET /groups` - Listar grupos
- `POST /groups` - Criar grupo
- `POST /groups/:id/members` - Adicionar membro ao grupo

**Repositório:** [Link para o repositório do microservice-companies]

**Docker Hub:** [Link para imagem Docker do microservice-companies]

**Execução Local:**
```bash
cd microservice-companies
npm install
npm start
```

**Dockerfile:** `microservice-companies/Dockerfile`

---

###  Serverless Functions (Edge Functions)

**Tecnologia:** Supabase Edge Functions (Deno)

**Descrição:** Funções serverless para processamento event-driven de operações críticas.

#### Function 1: create-course-trigger (HTTP Trigger)

**Tipo:** HTTP Trigger

**Descrição:** Recebe requisições POST do BFF para criar cursos. Implementa padrão event-driven ao chamar a function de persistência.

**Fluxo:**
1. Recebe dados do curso
2. Valida campos obrigatórios
3. Chama a function `persist-course`
4. Retorna resposta ao BFF

**URL:** `https://[SUPABASE_URL]/functions/v1/create-course-trigger`

#### Function 2: persist-course (Event Processor)

**Tipo:** Event Processor

**Descrição:** Persiste os dados do curso no banco de dados e cria registro de ownership automaticamente.

**Fluxo:**
1. Recebe dados do curso
2. Insere curso na tabela `courses`
3. Cria registro em `course_ownership`
4. Retorna curso criado

**URL:** `https://[SUPABASE_URL]/functions/v1/persist-course`

**Deploy:**
As functions já estão deployadas no Supabase. Para re-deploy, use:
```bash
# Functions são deployadas via MCP tools do Supabase
# Código está em: supabase/functions/[function-name]/
```

---

## 🗄️ Banco de Dados

**Tecnologia:** PostgreSQL (Supabase)

**Schema:**

### Tabelas:

1. **companies** - Empresas cadastradas
   - id, name, email, password_hash, created_at, updated_at

2. **employees** - Funcionários das empresas
   - id, company_id, name, email, created_at

3. **groups** - Grupos de funcionários
   - id, company_id, name, description, created_at

4. **group_members** - Membros dos grupos
   - id, group_id, employee_id, added_at

5. **courses** - Cursos disponíveis
   - id, owner_company_id, title, description, duration_hours, is_public, price, created_at, updated_at

6. **course_ownership** - Cursos que empresas possuem acesso
   - id, course_id, company_id, purchased_at

7. **enrollments** - Matrículas de grupos em cursos
   - id, course_id, group_id, enrolled_at, status

**Segurança:** Row Level Security (RLS) habilitado em todas as tabelas com políticas restritivas.

---

##  Executando o Sistema Completo

### Pré-requisitos:
- Node.js 20+
- Docker (opcional)
- Conta Supabase

### Variáveis de Ambiente:

Criar arquivos `.env` em cada serviço seguindo os `.env.example`:

**BFF:**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
MICROSERVICE_COURSES_URL=http://localhost:3001
MICROSERVICE_COMPANIES_URL=http://localhost:3002
PORT=3000
```

**Microservices:**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3001  # ou 3002 para companies
```

**Frontend:**
```env
VITE_BFF_URL=http://localhost:3000/api
```

### Execução Local:

```bash
# Terminal 1 - Microservice Courses
cd microservice-courses
npm install
npm start

# Terminal 2 - Microservice Companies
cd microservice-companies
npm install
npm start

# Terminal 3 - BFF
cd bff
npm install
npm start

# Terminal 4 - Frontend
cd frontend
npm install
npm run dev
```

Acesse: `http://localhost:5173`

---

##  Deploy com Docker

### Construir Imagens:

```bash
# BFF
cd bff
docker build -t wisetraining-bff .

# Microservice Courses
cd microservice-courses
docker build -t wisetraining-microservice-courses .

# Microservice Companies
cd microservice-companies
docker build -t wisetraining-microservice-companies .

# Frontend
cd frontend
docker build -t wisetraining-frontend .
```

### Executar Containers:

```bash
# Microservice Courses
docker run -p 3001:3001 --env-file microservice-courses/.env wisetraining-microservice-courses

# Microservice Companies
docker run -p 3002:3002 --env-file microservice-companies/.env wisetraining-microservice-companies

# BFF
docker run -p 3000:3000 --env-file bff/.env wisetraining-bff

# Frontend
docker run -p 80:80 wisetraining-frontend
```

---

##  Fluxo de Criação de Curso (Event-Driven)

```
┌──────────┐    POST     ┌─────────┐   Aggregate   ┌────────────────────┐
│ Frontend ├────────────►│   BFF   ├──────────────►│ create-course-     │
└──────────┘             └─────────┘                │ trigger (Function) │
                                                    └────────┬───────────┘
                                                             │
                                                             │ Event
                                                             ▼
                                                    ┌────────────────────┐
                                                    │ persist-course     │
                                                    │ (Function)         │
                                                    └────────┬───────────┘
                                                             │
                                                             ▼
                                                    ┌────────────────────┐
                                                    │  Supabase DB       │
                                                    │  (PostgreSQL)      │
                                                    └────────────────────┘
```

1. Frontend envia dados do curso para o BFF
2. BFF chama serverless function `create-course-trigger`
3. Function valida e dispara evento para `persist-course`
4. Function `persist-course` insere no banco de dados
5. Resposta retorna ao frontend

---

## 🔗 Links dos Repositórios e Docker Hub

### Repositórios:
- **Repositório Principal:** [Link do GitHub]
- **Frontend:** [Link do repositório do frontend]
- **BFF:** [Link do repositório do BFF]
- **Microservice Courses:** [Link do repositório courses]
- **Microservice Companies:** [Link do repositório companies]

### Docker Hub:
- **BFF:** [Link da imagem Docker do BFF]
- **Microservice Courses:** [Link da imagem Docker courses]
- **Microservice Companies:** [Link da imagem Docker companies]
- **Frontend:** [Link da imagem Docker frontend]

---

## Características Técnicas

### Princípios de Arquitetura:
-  Separação de responsabilidades (SoC)
-  Microservices independentes
-  Event-driven architecture
-  BFF para otimização de APIs
-  Containerização com Docker
-  Database per service pattern (logicamente separado)

### Segurança:
-  Row Level Security (RLS) no banco
-  Password hashing com bcrypt
-  Validação de dados em todas camadas
-  CORS configurado

### Observabilidade:
-  Health checks em todos serviços
-  Logs estruturados
-  Error handling centralizado

---

##  Tecnologias Utilizadas

- **Frontend:** React 18, Vite, React Router
- **BFF:** Node.js, Express, CORS
- **Microservices:** Node.js, Express, Supabase Client
- **Serverless:** Supabase Edge Functions (Deno)
- **Banco de Dados:** PostgreSQL (Supabase)
- **Containerização:** Docker
- **Autenticação:** Bcrypt

---

##  Documentação Adicional

### API Endpoints Completos:

Consulte a documentação de cada componente nos respectivos diretórios para detalhes completos dos endpoints.

### Diagrama de Entidades:

```
companies (1) ──── (N) employees
    │                      │
    │                      │
    │                  (N) │
    │                      │
    └── (N) groups ────────┘
           │
           │ (N)
           │
    enrollments (N) ──── (1) courses (N) ──── (1) companies
```

---

##  Contribuindo

Este projeto foi desenvolvido como trabalho acadêmico para demonstrar arquitetura de microservices, microfrontends e serverless functions.

---

## 📄 Licença

MIT License
