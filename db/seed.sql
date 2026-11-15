INSERT INTO usuarios (nome, email, senha_hash)
SELECT 'André Silva', 'admin@barberflow.com', crypt('123456', gen_salt('bf'))
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'admin@barberflow.com');

INSERT INTO clientes (nome, telefone, email, cep)
SELECT dados.nome, dados.telefone, dados.email, dados.cep
FROM (VALUES
  ('Marcos Costa', '(11) 98877-1234', 'marcos@barberflow.demo', '01001-000'),
  ('Rafael Lima', '(11) 97766-4321', 'rafael@barberflow.demo', '01002-000'),
  ('Felipe Santos', '(11) 96655-9876', 'felipe@barberflow.demo', '01003-000'),
  ('João Mendes', '(11) 95544-1111', 'joao@barberflow.demo', '01004-000'),
  ('Camila Rocha', '(11) 94433-2200', 'camila@barberflow.demo', '01005-000'),
  ('Ana Souza', '(11) 93322-1199', 'ana@barberflow.demo', '01006-000'),
  ('Bruno Martins', '(11) 92211-2288', 'bruno@barberflow.demo', '01007-000'),
  ('Juliana Alves', '(11) 91100-3377', 'juliana@barberflow.demo', '01008-000')
) AS dados(nome, telefone, email, cep)
WHERE NOT EXISTS (SELECT 1 FROM clientes existente WHERE existente.email = dados.email);

INSERT INTO barbeiros (nome, especialidade, telefone)
SELECT dados.nome, dados.especialidade, dados.telefone
FROM (VALUES
  ('Lucas Souza', 'Especialista em barba', '(11) 93322-1100'),
  ('Pedro Oliveira', 'Cortes modernos', '(11) 92211-3344'),
  ('João Alves', 'Corte tradicional', '(11) 91100-5566')
) AS dados(nome, especialidade, telefone)
WHERE NOT EXISTS (SELECT 1 FROM barbeiros existente WHERE existente.nome = dados.nome);

INSERT INTO servicos (descricao, valor, duracao)
SELECT dados.descricao, dados.valor, dados.duracao
FROM (VALUES
  ('Corte Masculino', 45.00, 45),
  ('Barba', 25.00, 30),
  ('Corte + Barba', 65.00, 60),
  ('Sobrancelha', 15.00, 15),
  ('Pigmentação', 50.00, 45)
) AS dados(descricao, valor, duracao)
WHERE NOT EXISTS (SELECT 1 FROM servicos existente WHERE existente.descricao = dados.descricao);

INSERT INTO agendamentos (cliente_id, barbeiro_id, servico_id, data, hora, status)
SELECT cliente.id, barbeiro.id, servico.id, dados.data, dados.hora, dados.status
FROM (VALUES
  ('Marcos Costa', 'Lucas Souza', 'Corte + Barba', '2026-09-01'::date, '09:00'::time, 'concluido'),
  ('Rafael Lima', 'Pedro Oliveira', 'Corte Masculino', '2026-09-03'::date, '10:30'::time, 'concluido'),
  ('Camila Rocha', 'João Alves', 'Barba', '2026-09-08'::date, '13:00'::time, 'concluido'),
  ('Ana Souza', 'Lucas Souza', 'Corte Masculino', '2026-09-12'::date, '18:00'::time, 'concluido'),
  ('Bruno Martins', 'Pedro Oliveira', 'Pigmentação', '2026-09-15'::date, '19:00'::time, 'concluido'),
  ('Juliana Alves', 'João Alves', 'Sobrancelha', '2026-09-20'::date, '15:30'::time, 'concluido'),
  ('Felipe Santos', 'João Alves', 'Corte Masculino', '2026-11-10'::date, '13:00'::time, 'confirmado'),
  ('João Mendes', 'Lucas Souza', 'Barba', '2026-11-12'::date, '15:30'::time, 'confirmado'),
  ('Marcos Costa', 'Pedro Oliveira', 'Corte + Barba', '2026-11-14'::date, '09:00'::time, 'agendado'),
  ('Rafael Lima', 'Lucas Souza', 'Corte Masculino', '2026-11-18'::date, '18:00'::time, 'agendado'),
  ('Camila Rocha', 'João Alves', 'Corte + Barba', '2026-11-20'::date, '10:00'::time, 'agendado'),
  ('Ana Souza', 'Pedro Oliveira', 'Barba', '2026-11-25'::date, '19:00'::time, 'agendado')
) AS dados(cliente_nome, barbeiro_nome, servico_descricao, data, hora, status)
JOIN clientes cliente ON cliente.nome = dados.cliente_nome
JOIN barbeiros barbeiro ON barbeiro.nome = dados.barbeiro_nome
JOIN servicos servico ON servico.descricao = dados.servico_descricao
WHERE NOT EXISTS (
  SELECT 1 FROM agendamentos existente
  WHERE existente.barbeiro_id = barbeiro.id
    AND existente.data = dados.data
    AND existente.hora = dados.hora
);
