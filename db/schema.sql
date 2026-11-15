CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  expira_em TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '8 hours',
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(120) NOT NULL,
  telefone VARCHAR(30) NOT NULL,
  email VARCHAR(255) NOT NULL,
  cep VARCHAR(9) NOT NULL,
  logradouro VARCHAR(180) NOT NULL DEFAULT '',
  bairro VARCHAR(120) NOT NULL DEFAULT '',
  cidade VARCHAR(120) NOT NULL DEFAULT '',
  estado CHAR(2) NOT NULL DEFAULT '',
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE clientes ADD COLUMN IF NOT EXISTS logradouro VARCHAR(180) NOT NULL DEFAULT '';
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS bairro VARCHAR(120) NOT NULL DEFAULT '';
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS cidade VARCHAR(120) NOT NULL DEFAULT '';
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS estado CHAR(2) NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS barbeiros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(120) NOT NULL,
  especialidade VARCHAR(120) NOT NULL,
  telefone VARCHAR(30) NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  descricao VARCHAR(120) NOT NULL,
  valor NUMERIC(10, 2) NOT NULL CHECK (valor >= 0),
  duracao INTEGER NOT NULL CHECK (duracao > 0),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
  barbeiro_id UUID NOT NULL REFERENCES barbeiros(id) ON DELETE RESTRICT,
  servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE RESTRICT,
  data DATE NOT NULL,
  hora TIME NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'agendado'
    CHECK (status IN ('agendado', 'confirmado', 'concluido', 'cancelado')),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT agendamento_unico_por_barbeiro
    UNIQUE (barbeiro_id, data, hora)
);

CREATE INDEX IF NOT EXISTS idx_agendamentos_data ON agendamentos(data);
CREATE INDEX IF NOT EXISTS idx_agendamentos_cliente ON agendamentos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_barbeiro ON agendamentos(barbeiro_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_token ON sessoes(token);
