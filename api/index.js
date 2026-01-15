const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

/* ===================== CONFIGURAÇÕES E MIDDLEWARES ===================== */
// Aumentar o limite do body para 50mb para suportar imagens em Base64
app.use(express.json({ limit: '50mb' }));
app.use(cors());

/* ===================== BANCO DE DADOS (NEON POSTGRESQL) ===================== */
const connectionString = process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.error('ERRO CRÍTICO: A variável de ambiente NEON_DATABASE_URL não está definida.');
  console.error('Por favor, crie um arquivo .env com a string de conexão.');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// Inicialização da Tabela no Banco de Dados
async function initDb() {
  try {
    // Cria a tabela se não existir
    // Armazenamos o payload (JSON completo) para flexibilidade
    await pool.query(`
      CREATE TABLE IF NOT EXISTS device_data (
        id SERIAL PRIMARY KEY,
        resource VARCHAR(50) NOT NULL,
        payload JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `);
    console.log('Conexão com Banco de Dados estabelecida e tabela verificada.');
  } catch (error) {
    console.error('Erro ao conectar ou inicializar o banco de dados:', error);
    process.exit(1);
  }
}

/* ===================== VALIDAÇÃO DE DADOS ===================== */
/**
 * Valida o payload recebido (JSON) conforme as regras especificadas para cada recurso.
 */
function isValidPayload(resource, payload) {
  if (!payload || typeof payload !== 'object') return false;

  switch (resource) {
    case 'camera':
      // Esperado: { "fotoBase64": "...", "cameraFoto": "frontal"|"traseira", "dataHoraFoto": "..." }
      return (
        typeof payload.fotoBase64 === 'string' &&
        ['frontal', 'traseira'].includes(payload.cameraFoto) &&
        payload.dataHoraFoto !== undefined
      );

    case 'gps':
      // Esperado: { "latitude": "...", "longitude": "...", "dataHoraLocalizacao": "..." }
      return (
        payload.latitude !== undefined &&
        payload.longitude !== undefined &&
        payload.dataHoraLocalizacao !== undefined
      );

    case 'rede':
      // Esperado: { "ipRede": "...", "tipoRede": "wi-fi"|"rede móvel", "dataHoraRede": "..." }
      return (
        payload.ipRede !== undefined &&
        ['wi-fi', 'rede móvel'].includes(payload.tipoRede) &&
        payload.dataHoraRede !== undefined
      );

    default:
      return false;
  }
}

/* ===================== ROTAS DA API ===================== */

// Rota de Health Check
app.get('/', (req, res) => {
  res.json({ 
    status: 'online', 
    message: 'API Mobile Device Running',
    endpoints: ['/camera', '/gps', '/rede'] 
  });
});

/**
 * Endpoint genérico para RECEBER dados (POST)
 * Aceita: /camera, /gps, /rede
 */
app.post('/:resource', async (req, res) => {
  const { resource } = req.params;
  const payload = req.body;

  // Verificação básica se o recurso é válido
  const validResources = ['camera', 'gps', 'rede'];
  if (!validResources.includes(resource)) {
    return res.status(404).json({ error: 'Recurso não encontrado. Use: camera, gps ou rede.' });
  }

  // Validação dos campos do JSON
  if (!isValidPayload(resource, payload)) {
    return res.status(400).json({ 
      error: 'Dados inválidos ou incompletos.',
      menssagem: `Verifique se o JSON corresponde ao formato exigido para '${resource}'.`
    });
  }

  try {
    // Inserção no banco de dados
    await pool.query(
      'INSERT INTO device_data (resource, payload) VALUES ($1, $2)',
      [resource, payload]
    );

    // Resposta de sucesso
    res.status(201).json({ message: 'Dados recebidos e salvos com sucesso.' });

  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao processar a requisição.' });
  }
});

/**
 * Endpoint para CONSULTAR dados (GET)
 * Retorna os dados no mesmo formato que foram enviados (o payload JSON).
 */
app.get('/:resource', async (req, res) => {
  const { resource } = req.params;

  const validResources = ['camera', 'gps', 'rede'];
  if (!validResources.includes(resource)) {
    return res.status(404).json({ error: 'Recurso não encontrado.' });
  }

  try {
    // Busca os últimos 50 registros (limite para evitar sobrecarga)
    const result = await pool.query(
      'SELECT payload FROM device_data WHERE resource = $1 ORDER BY created_at DESC LIMIT 50',
      [resource]
    );

    // Mapeia para retornar apenas a lista de objetos JSON salvos
    const data = result.rows.map(row => row.payload);
    
    res.json(data);

  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    res.status(500).json({ error: 'Erro ao recuperar dados.' });
  }
});

/* ===================== INICIALIZAÇÃO ===================== */
const PORT = process.env.PORT || 3000;

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 API rodando na porta ${PORT}`);
    console.log(`   - http://localhost:${PORT}/camera`);
    console.log(`   - http://localhost:${PORT}/gps`);
    console.log(`   - http://localhost:${PORT}/rede`);
  });
});
